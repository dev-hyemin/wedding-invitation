import { CONFIG } from './config.js'
import { showToast } from './toast.js'
import confetti from 'canvas-confetti'

const STORAGE_KEY = 'rsvp_submitted'

export function initRsvp() {
  const form    = document.getElementById('rsvp-form')
  const success = document.getElementById('rsvp-success')
  const submit  = document.getElementById('rsvp-submit')

  if (!form) return

  // 커스텀 셀렉트 초기화
  form.querySelectorAll('.form-select').forEach(initCustomSelect)

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

function initCustomSelect(selectEl) {
  const options = Array.from(selectEl.options)

  // 래퍼 삽입
  const wrapper = document.createElement('div')
  wrapper.className = 'custom-select-wrapper'
  selectEl.parentNode.insertBefore(wrapper, selectEl)
  wrapper.appendChild(selectEl)
  selectEl.hidden = true

  // 트리거 (닫힌 상태 표시)
  const trigger = document.createElement('div')
  trigger.className = 'custom-select__trigger'
  trigger.setAttribute('role', 'button')
  trigger.setAttribute('tabindex', '0')
  trigger.innerHTML = `
    <span class="custom-select__value">${options[selectEl.selectedIndex]?.text ?? options[0].text}</span>
    <svg class="custom-select__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>`

  // 드롭다운 목록
  const dropdown = document.createElement('ul')
  dropdown.className = 'custom-select__dropdown'
  dropdown.setAttribute('role', 'listbox')

  options.forEach(opt => {
    const li = document.createElement('li')
    li.className = 'custom-select__option' + (opt.selected ? ' is-selected' : '')
    li.setAttribute('role', 'option')
    li.textContent = opt.text
    li.dataset.value = opt.value

    li.addEventListener('click', () => {
      selectEl.value = opt.value
      wrapper.querySelector('.custom-select__value').textContent = opt.text
      dropdown.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('is-selected'))
      li.classList.add('is-selected')
      wrapper.classList.remove('is-open')
    })
    dropdown.appendChild(li)
  })

  const box = document.createElement('div')
  box.className = 'custom-select'
  box.appendChild(trigger)
  box.appendChild(dropdown)
  wrapper.appendChild(box)

  // 열기 / 닫기
  trigger.addEventListener('click', e => {
    e.stopPropagation()
    wrapper.classList.toggle('is-open')
  })
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      wrapper.classList.toggle('is-open')
    }
  })
  document.addEventListener('click', () => wrapper.classList.remove('is-open'))
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
