const toastEl = document.getElementById('toast')
let timer = null

export function showToast(message, duration = 2500) {
  if (!toastEl) return

  toastEl.textContent = message
  toastEl.classList.add('toast--visible')

  clearTimeout(timer)
  timer = setTimeout(() => {
    toastEl.classList.remove('toast--visible')
  }, duration)
}
