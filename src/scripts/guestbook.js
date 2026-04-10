import { CONFIG } from './config.js'
import { showToast } from './toast.js'

const PAGE_SIZE = 10

let db           = null
let lastDoc      = null
let deleteTarget = null   // { docId, passwordHash }
let pendingDeleteId = null

// ── Firebase 동적 import ──
async function getFirestore() {
  if (db) return db

  const cfg = CONFIG.firebase
  if (!cfg.apiKey || !cfg.projectId) return null

  const { initializeApp, getApps } = await import('firebase/app')
  const { getFirestore: _getFs, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit, startAfter, serverTimestamp } = await import('firebase/firestore')

  const app = getApps().length ? getApps()[0] : initializeApp(cfg)
  db = _getFs(app)

  // 모듈 레벨에 Firestore 함수 캐시
  window.__fs = { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit, startAfter, serverTimestamp }

  return db
}

// ── 해시 (비밀번호 단방향 변환) ──
async function hashPassword(password) {
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── 날짜 포맷 ──
function formatDate(timestamp) {
  const d = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ── 아이템 렌더 ──
function renderItem(docId, data) {
  const li = document.createElement('div')
  li.className = 'guestbook-item'
  li.dataset.id = docId

  li.innerHTML = `
    <div class="guestbook-item__header">
      <span class="guestbook-item__name">${escapeHtml(data.name)}</span>
      <div class="guestbook-item__meta">
        <span class="guestbook-item__date">${formatDate(data.createdAt)}</span>
        <button class="guestbook-item__delete btn--text" data-id="${docId}" aria-label="삭제">삭제</button>
      </div>
    </div>
    <p class="guestbook-item__message">${escapeHtml(data.message)}</p>
  `

  li.querySelector('.guestbook-item__delete').addEventListener('click', () => openDeleteModal(docId, data.passwordHash))
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

  const firestore = await getFirestore()
  if (!firestore) {
    // Firebase 미설정 시 데모 데이터
    if (empty) empty.textContent = 'Firebase를 설정하면 방명록을 사용할 수 있습니다.'
    return
  }

  if (reset) {
    lastDoc = null
    list.querySelectorAll('.guestbook-item').forEach(el => el.remove())
  }

  const { collection, getDocs, query, orderBy, limit, startAfter } = window.__fs
  let q = query(collection(firestore, 'guestbook'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE))
  if (lastDoc) q = query(collection(firestore, 'guestbook'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE), startAfter(lastDoc))

  const snap = await getDocs(q)

  if (snap.empty && reset) {
    if (empty) empty.hidden = false
    if (loadBtn) loadBtn.hidden = true
    return
  }

  if (empty) empty.hidden = true

  snap.forEach(docSnap => {
    list.appendChild(renderItem(docSnap.id, docSnap.data()))
  })

  lastDoc = snap.docs[snap.docs.length - 1]
  if (loadBtn) loadBtn.hidden = snap.docs.length < PAGE_SIZE
}

// ── 삭제 모달 ──
function openDeleteModal(docId, passwordHash) {
  pendingDeleteId = docId
  deleteTarget    = passwordHash

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
  pendingDeleteId = null
  deleteTarget    = null
}

// ── 초기화 ──
export function initGuestbook() {
  const section = document.getElementById('guestbook')
  if (!section) return

  // 섹션 진입 시 Firebase 동적 로드 + 목록 로드
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

    try {
      const firestore = await getFirestore()

      if (!firestore) {
        showToast('Firebase 설정이 필요합니다.')
        return
      }

      const { collection, addDoc, serverTimestamp } = window.__fs
      const passwordHash = await hashPassword(password)

      await addDoc(collection(firestore, 'guestbook'), {
        name,
        message,
        passwordHash,
        createdAt: serverTimestamp(),
      })

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
  document.getElementById('guestbook-load-more')?.addEventListener('click', () => loadEntries(false))

  // 모달
  document.getElementById('modal-cancel')?.addEventListener('click', closeDeleteModal)
  document.getElementById('modal-backdrop')?.addEventListener('click', closeDeleteModal)

  document.getElementById('modal-confirm')?.addEventListener('click', async () => {
    const input    = document.getElementById('modal-password')
    const password = input?.value.trim()
    if (!password) { showToast('비밀번호를 입력해주세요.'); return }

    const inputHash = await hashPassword(password)
    if (inputHash !== deleteTarget) {
      showToast('비밀번호가 올바르지 않습니다.')
      return
    }

    try {
      const firestore = await getFirestore()
      const { doc, deleteDoc } = window.__fs
      await deleteDoc(doc(firestore, 'guestbook', pendingDeleteId))

      document.querySelector(`.guestbook-item[data-id="${pendingDeleteId}"]`)?.remove()
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
