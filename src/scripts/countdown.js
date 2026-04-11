import { CONFIG } from './config.js'

const target = new Date(CONFIG.wedding.datetime).getTime()

export function initCountdown() {
  const el = document.getElementById('hero-dday')
  if (!el) return

  const diff = target - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (diff <= 0) {
    el.textContent = 'D-Day'
  } else {
    el.textContent = `D-${days}`
  }
}
