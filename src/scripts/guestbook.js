import { CONFIG } from './config.js'
import { showToast } from './toast.js'
import { burstParticles } from './particles.js'

const PAGE_SIZE       = 3
const MODAL_PAGE_SIZE = 10

let firestoreDb  = null
let deleteTarget = null
let lastVisible  = null
let modalHasMore = true

async function getDb() {
  if (firestoreDb) return firestoreDb
  const { apiKey, authDomain, projectId } = CONFIG.firebase
  if (!apiKey || !projectId) return null

  const { initializeApp, getApps } = await import('firebase/app')
  const { getFirestore }           = await import('firebase/firestore')

  if (!getApps().length) initializeApp({ apiKey, authDomain, projectId })
  firestoreDb = getFirestore()
  return firestoreDb
}

async function hashPassword(password) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

function formatDate(ts) {
  const date = ts?.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderItem(id, data) {
  const el = document.createElement('div')
  el.className = 'guestbook-item'
  el.dataset.id = id
  el.innerHTML = `
    <div class="guestbook-item__header">
      <span class="guestbook-item__name">${escapeHtml(data.name)}</span>
      <div class="guestbook-item__meta">
        <span class="guestbook-item__date">${formatDate(data.created_at)}</span>
        <button class="guestbook-item__delete btn--text" data-id="${id}" aria-label="삭제">삭제</button>
      </div>
    </div>
    <p class="guestbook-item__message">${escapeHtml(data.message)}</p>
  `
  el.querySelector('.guestbook-item__delete')
    .addEventListener('click', () => openDeleteModal(id, data.password_hash))
  return el
}

async function loadPreview() {
  const list    = document.getElementById('guestbook-list')
  const empty   = document.getElementById('guestbook-empty')
  const viewAll = document.getElementById('guestbook-view-all')

  const db = await getDb()
  if (!db) {
    if (empty) {
      empty.textContent = 'Firebase를 설정하면 방명록을 사용할 수 있습니다.'
      empty.hidden = false
    }
    return
  }

  const { collection, query, orderBy, limit, getDocs, getCountFromServer } =
    await import('firebase/firestore')

  const q        = query(collection(db, 'guestbook'), orderBy('created_at', 'desc'), limit(PAGE_SIZE))
  const snapshot = await getDocs(q)

  list.querySelectorAll('.guestbook-item').forEach(el => el.remove())

  if (snapshot.empty) {
    if (empty)   empty.hidden = false
    if (viewAll) viewAll.hidden = true
    return
  }

  if (empty) empty.hidden = true
  snapshot.forEach(doc => list.appendChild(renderItem(doc.id, doc.data())))

  const countSnap = await getCountFromServer(collection(db, 'guestbook'))
  const total     = countSnap.data().count
  if (viewAll) viewAll.hidden = total <= PAGE_SIZE
}

async function loadModalEntries(reset = false) {
  const list    = document.getElementById('guestbook-modal-list')
  const loadBtn = document.getElementById('guestbook-modal-load-more')
  const db      = await getDb()
  if (!db || !list) return

  if (reset) {
    lastVisible  = null
    modalHasMore = true
    list.innerHTML = ''
  }

  const { collection, query, orderBy, limit, startAfter, getDocs } =
    await import('firebase/firestore')

  const col = collection(db, 'guestbook')
  const q   = lastVisible
    ? query(col, orderBy('created_at', 'desc'), startAfter(lastVisible), limit(MODAL_PAGE_SIZE))
    : query(col, orderBy('created_at', 'desc'), limit(MODAL_PAGE_SIZE))

  const snapshot = await getDocs(q)
  snapshot.forEach(doc => list.appendChild(renderItem(doc.id, doc.data())))
  if (!snapshot.empty) lastVisible = snapshot.docs[snapshot.docs.length - 1]

  modalHasMore = snapshot.size === MODAL_PAGE_SIZE
  if (loadBtn) loadBtn.hidden = !modalHasMore
}

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

export function initGuestbook() {
  const section = document.getElementById('guestbook')
  if (!section) return

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect()
      loadPreview()
    }
  }, { threshold: 0.1 })
  observer.observe(section)

  document.getElementById('guestbook-view-all')
    ?.addEventListener('click', openGuestbookModal)

  document.getElementById('guestbook-modal-close')
    ?.addEventListener('click', closeGuestbookModal)
  document.getElementById('guestbook-modal-backdrop')
    ?.addEventListener('click', closeGuestbookModal)

  document.getElementById('guestbook-modal-load-more')
    ?.addEventListener('click', () => loadModalEntries(false))

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
      const db = await getDb()
      if (!db) { showToast('Firebase 설정이 필요합니다.'); return }

      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const passwordHash = await hashPassword(password)
      await addDoc(collection(db, 'guestbook'), {
        name,
        message,
        password_hash: passwordHash,
        created_at: serverTimestamp(),
      })

      form.reset()
      showToast('방명록이 등록되었습니다.')
      await loadPreview()
    } catch {
      showToast('등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      submitBtn.disabled = false
    }
  })

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
      const db = await getDb()
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'guestbook', deleteTarget.id))

      document.querySelectorAll(`.guestbook-item[data-id="${deleteTarget.id}"]`)
        .forEach(el => el.remove())
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
