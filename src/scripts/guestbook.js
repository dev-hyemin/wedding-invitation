import { CONFIG } from './config.js'
import { showToast } from './toast.js'
import { burstParticles } from './particles.js'

const PAGE_SIZE = 10

let supabase     = null
let offset       = 0
let hasMore      = true
let deleteTarget = null   // { id, passwordHash }

// ── Supabase 클라이언트 초기화 ──
async function getSupabase() {
  if (supabase) return supabase

  const { url, anonKey } = CONFIG.supabase
  if (!url || !anonKey) return null

  const { createClient } = await import('@supabase/supabase-js')
  supabase = createClient(url, anonKey)
  return supabase
}

// ── 해시 (비밀번호 단방향 변환) ──
async function hashPassword(password) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── 날짜 포맷 ──
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// ── 아이템 렌더 ──
function renderItem(row) {
  const li = document.createElement('div')
  li.className = 'guestbook-item'
  li.dataset.id = row.id

  li.innerHTML = `
    <div class="guestbook-item__header">
      <span class="guestbook-item__name">${escapeHtml(row.name)}</span>
      <div class="guestbook-item__meta">
        <span class="guestbook-item__date">${formatDate(row.created_at)}</span>
        <button class="guestbook-item__delete btn--text" data-id="${row.id}" aria-label="삭제">삭제</button>
      </div>
    </div>
    <p class="guestbook-item__message">${escapeHtml(row.message)}</p>
  `

  li.querySelector('.guestbook-item__delete')
    .addEventListener('click', () => openDeleteModal(row.id, row.password_hash))
  return li
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

// ── 목록 로드 ──
async function loadEntries(reset = false) {
  const list    = document.getElementById('guestbook-list')
  const empty   = document.getElementById('guestbook-empty')
  const loadBtn = document.getElementById('guestbook-load-more')

  const sb = await getSupabase()
  if (!sb) {
    if (empty) empty.textContent = 'Supabase를 설정하면 방명록을 사용할 수 있습니다.'
    return
  }

  if (reset) {
    offset = 0
    hasMore = true
    list.querySelectorAll('.guestbook-item').forEach(el => el.remove())
  }

  const { data: rows, error } = await sb
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (error) {
    showToast('방명록을 불러오지 못했습니다.')
    return
  }

  if (!rows.length && reset) {
    if (empty) empty.hidden = false
    if (loadBtn) loadBtn.hidden = true
    return
  }

  if (empty) empty.hidden = true

  rows.forEach(row => list.appendChild(renderItem(row)))

  offset += rows.length
  hasMore = rows.length === PAGE_SIZE
  if (loadBtn) loadBtn.hidden = !hasMore
}

// ── 삭제 모달 ──
function openDeleteModal(id, passwordHash) {
  deleteTarget = { id, passwordHash }

  const modal = document.getElementById('delete-modal')
  const input = document.getElementById('modal-password')
  if (modal) {
    modal.classList.add('modal--open')
    modal.setAttribute('aria-hidden', 'false')
    input?.focus()
  }
}

function closeDeleteModal() {
  const modal = document.getElementById('delete-modal')
  const input = document.getElementById('modal-password')
  if (modal) {
    modal.classList.remove('modal--open')
    modal.setAttribute('aria-hidden', 'true')
  }
  if (input) input.value = ''
  deleteTarget = null
}

// ── 초기화 ──
export function initGuestbook() {
  const section = document.getElementById('guestbook')
  if (!section) return

  // 섹션 진입 시 Supabase 동적 로드 + 목록 로드
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect()
      loadEntries(true)
    }
  }, { threshold: 0.1 })
  observer.observe(section)

  // 글쓰기 폼
  const form = document.getElementById('guestbook-form')
  form?.addEventListener('submit', async e => {
    e.preventDefault()

    const name     = document.getElementById('gb-name')?.value.trim()
    const password = document.getElementById('gb-password')?.value.trim()
    const message  = document.getElementById('gb-message')?.value.trim()

    if (!name || !password || !message) {
      showToast('모든 항목을 입력해주세요.')
      return
    }

    const submitBtn = form.querySelector('[type=submit]')
    submitBtn.disabled = true
    burstParticles(submitBtn)

    try {
      const sb = await getSupabase()
      if (!sb) { showToast('Supabase 설정이 필요합니다.'); return }

      const passwordHash = await hashPassword(password)
      const { error } = await sb.from('guestbook').insert({
        name,
        message,
        password_hash: passwordHash,
      })

      if (error) throw error

      form.reset()
      showToast('방명록이 등록되었습니다.')
      await loadEntries(true)
    } catch {
      showToast('등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      submitBtn.disabled = false
    }
  })

  // 더 보기
  document.getElementById('guestbook-load-more')
    ?.addEventListener('click', () => loadEntries(false))

  // 모달
  document.getElementById('modal-cancel')?.addEventListener('click', closeDeleteModal)
  document.getElementById('modal-backdrop')?.addEventListener('click', closeDeleteModal)

  document.getElementById('modal-confirm')?.addEventListener('click', async () => {
    const input    = document.getElementById('modal-password')
    const password = input?.value.trim()
    if (!password) { showToast('비밀번호를 입력해주세요.'); return }

    const inputHash = await hashPassword(password)
    if (inputHash !== deleteTarget?.passwordHash) {
      showToast('비밀번호가 올바르지 않습니다.')
      return
    }

    try {
      const sb = await getSupabase()
      const { error } = await sb
        .from('guestbook')
        .delete()
        .eq('id', deleteTarget.id)

      if (error) throw error

      document.querySelector(`.guestbook-item[data-id="${deleteTarget.id}"]`)?.remove()
      showToast('삭제되었습니다.')
      closeDeleteModal()
    } catch {
      showToast('삭제에 실패했습니다.')
    }
  })

  // ESC 닫기
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDeleteModal()
  })
}
