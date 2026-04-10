import { CONFIG } from './config.js'

const target = new Date(CONFIG.wedding.datetime).getTime()

const els = {
  days:    document.getElementById('cd-days'),
  hours:   document.getElementById('cd-hours'),
  minutes: document.getElementById('cd-minutes'),
  seconds: document.getElementById('cd-seconds'),
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function tick() {
  const now  = Date.now()
  const diff = target - now

  if (diff <= 0) {
    // 결혼식 당일 이후
    const cd = document.querySelector('.countdown')
    if (cd) cd.innerHTML = '<p style="font-size:1rem;letter-spacing:.1em">우리 결혼했어요! 🎉</p>'
    return
  }

  const totalSeconds = Math.floor(diff / 1000)
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  if (els.days)    els.days.textContent    = pad(d)
  if (els.hours)   els.hours.textContent   = pad(h)
  if (els.minutes) els.minutes.textContent = pad(m)
  if (els.seconds) els.seconds.textContent = pad(s)
}

export function initCountdown() {
  tick()
  setInterval(tick, 1000)
}
