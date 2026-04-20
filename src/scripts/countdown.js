import { CONFIG } from './config.js'

// +09:00 명시로 KST 기준 파싱
const weddingDate = new Date(CONFIG.wedding.datetime + '+09:00')

export function initCountdown() {
  const el = document.getElementById('hero-dday')
  if (!el) return

  // 현재 KST 날짜 (자정 기준)
  const nowKST = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const todayUTC = Date.UTC(nowKST.getUTCFullYear(), nowKST.getUTCMonth(), nowKST.getUTCDate())

  // 예식 KST 날짜 (자정 기준)
  const weddingUTC = Date.UTC(weddingDate.getUTCFullYear(), weddingDate.getUTCMonth(), weddingDate.getUTCDate())

  const days = Math.round((weddingUTC - todayUTC) / (1000 * 60 * 60 * 24))

  if (days <= 0) {
    el.textContent = 'D-Day'
  } else {
    el.textContent = `D-${days}`
  }
}
