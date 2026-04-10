import { CONFIG } from './config.js'
import { showToast } from './toast.js'
import confetti from 'canvas-confetti'

const STORAGE_KEY = 'rsvp_submitted'

export function initRsvp() {
  const form    = document.getElementById('rsvp-form')
  const success = document.getElementById('rsvp-success')
  const submit  = document.getElementById('rsvp-submit')

  if (!form) return

  // 이미 제출한 경우
  if (localStorage.getItem(STORAGE_KEY)) {
    form.hidden = true
    if (success) success.hidden = false
    return
  }

  form.addEventListener('submit', async e => {
    e.preventDefault()

    if (!validate(form)) return

    submit.classList.add('btn--loading')
    submit.disabled = true

    const data = new FormData(form)

    try {
      const endpoint = CONFIG.rsvp.formspreeEndpoint

      if (endpoint) {
        const res = await fetch(endpoint, {
          method:  'POST',
          headers: { Accept: 'application/json' },
          body:    data,
        })
        if (!res.ok) throw new Error('전송 실패')
      } else {
        // 개발용: 실제 전송 없이 성공 처리
        await new Promise(r => setTimeout(r, 800))
      }

      localStorage.setItem(STORAGE_KEY, '1')
      form.hidden = true
      if (success) success.hidden = false

      fireConfetti()
    } catch {
      showToast('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
      submit.classList.remove('btn--loading')
      submit.disabled = false
    }
  })
}

function validate(form) {
  const name   = form.querySelector('#rsvp-name')
  const attend = form.querySelector('input[name="attend"]:checked')

  if (!name?.value.trim()) {
    showToast('이름을 입력해주세요.')
    name?.focus()
    return false
  }
  if (!attend) {
    showToast('참석 여부를 선택해주세요.')
    return false
  }
  return true
}

function fireConfetti() {
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#C9A96E', '#E8D5C4', '#8B6F5E', '#fff'],
    })
    confetti({
      ...defaults,
      particleCount: 50,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#C9A96E', '#E8D5C4', '#8B6F5E', '#fff'],
    })
  }, 250)

  setTimeout(() => clearInterval(interval), 3000)
}
