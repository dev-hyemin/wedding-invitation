import { CONFIG } from './config.js'
import { showToast } from './toast.js'
import { burstParticles } from './particles.js'

const PAGE_SIZE       = 3   // 섹션에 표시할 개수
const MODAL_PAGE_SIZE = 10  // 모달에서 더보기 단위

let supabase     = null
let deleteTarget = null

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

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
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

// ── 섹션 미리보기 로드 (최신 3개) ──
async function loadPreview() {
  const list     = document.getElementById('guestbook-list')
  const empty    = document.getElementById('guestbook-empty')
  const viewAll  = document.getElementById('guestbook-view-all')

  const sb = await getSupabase()
  if (!sb) {
    if (empty) empty.textContent = 'Supabase를 설정하면 방명록을 사용할 수 있습니다.'
    return
  }

  const { data: rows, error } = await sb
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1)

  if (error) { showToast('방명록을 불러오지 못했습니다.'); return }

  list.querySelectorAll('.guestbook-item').forEach(el => el.remove())

  if (!rows.length) {
    if (empty) empty.hidden = false
    if (viewAll) viewAll.hidden = true
    return
  }

  if (empty) empty.hidden = true
  rows.forEach(row => list.appendChild(renderItem(row)))

  // 전체 개수 확인 후 전체보기 버튼 표시
  const { count } = await sb.from('guestbook').select('*', { count: 'exact', head: true })
  if (viewAll) viewAll.hidden = (count ?? 0) <= PAGE_SIZE
}

// ── 모달 전체 목록 로드 ──
let modalOffset = 0
let modalHasMore = true

async function loadModalEntries(reset = false) {
  const list    = document.getElementById('guestbook-modal-list')
  const loadBtn = document.getElementById('guestbook-modal-load-more')
  const sb = await getSupabase()
  if (!sb || !list) return

  if (reset) {
    modalOffset = 0
    modalHasMore = true
    list.innerHTML = ''
  }

  const { data: rows, error } = await sb
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false })
    .range(modalOffset, modalOffset + MODAL_PAGE_SIZE - 1)

  if (error) { showToast('방명록을 불러오지 못했습니다.'); return }

  rows.forEach(row => list.appendChild(renderItem(row)))
  modalOffset += rows.length
  modalHasMore = rows.length === MODAL_PAGE_SIZE
  if (loadBtn) loadBtn.hidden = !modalHasMore
}

// ── 전체보기 모달 ──
function openGuestbookModal() {
  const modal = document.getElementById('guestbook-modal')
  if (!modal) return
  modal.classList.add('modal--open')
  modal.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
  loadModalEntries(true)
}

function closeGuestbookModal() {
  const modal = document.getElementById('guestbook-modal')
  if (!modal) return
  modal.classList.remove('modal--open')
  modal.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
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

  // 섹션 진입 시 미리보기 로드
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect()
      loadPreview()
    }
  }, { threshold: 0.1 })
  observer.observe(section)

  // 전체보기 버튼
  document.getElementById('guestbook-view-all')
    ?.addEventListener('click', openGuestbookModal)

  // 전체보기 모달 닫기
  document.getElementById('guestbook-modal-close')
    ?.addEventListener('click', closeGuestbookModal)
  document.getElementById('guestbook-modal-backdrop')
    ?.addEventListener('click', closeGuestbookModal)

  // 모달 내 더보기
  document.getElementById('guestbook-modal-load-more')
    ?.addEventListener('click', () => loadModalEntries(false))

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
      const { error } = await sb.from('guestbook').insert({ name, message, password_hash: passwordHash })
      if (error) throw error

      form.reset()
      showToast('방명록이 등록되었습니다.')
      await loadPreview()
    } catch {
      showToast('등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      submitBtn.disabled = false
    }
  })

  // 삭제 모달
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
      const { error } = await sb.from('guestbook').delete().eq('id', deleteTarget.id)
      if (error) throw error

      // 섹션 및 모달 양쪽에서 항목 제거
      document.querySelectorAll(`.guestbook-item[data-id="${deleteTarget.id}"]`).forEach(el => el.remove())
      showToast('삭제되었습니다.')
      closeDeleteModal()
      await loadPreview()
    } catch {
      showToast('삭제에 실패했습니다.')
    }
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeGuestbookModal()
      closeDeleteModal()
    }
  })
}
