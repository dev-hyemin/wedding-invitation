import AOS from 'aos'
import { theme } from './theme.js'

// ── 타이프라이터 (히어로 인트로) ──────────────────────────────
export function initTypewriter() {
  const typed  = document.querySelector('.intro-typed')
  const cursor = document.querySelector('.intro-cursor')
  if (!typed || !cursor) return

  const lines   = ['We are', 'Getting', 'Married']
  const charMs  = 110   // 글자당 속도
  const pauseMs = 320   // 줄 사이 쉬는 시간

  let lineIdx = 0
  let charIdx = 0

  function typeNext() {
    if (lineIdx >= lines.length) {
      // 타이핑 완료 → 커서 제거
      setTimeout(() => cursor.classList.add('intro-cursor--hidden'), 500)
      return
    }

    const line = lines[lineIdx]
    if (charIdx < line.length) {
      typed.innerHTML += line[charIdx]
      charIdx++
      setTimeout(typeNext, charMs)
    } else {
      // 줄 끝 → 다음 줄로
      lineIdx++
      charIdx = 0
      if (lineIdx < lines.length) {
        typed.innerHTML += '<br>'
        setTimeout(typeNext, pauseMs)
      } else {
        setTimeout(() => cursor.classList.add('intro-cursor--hidden'), 500)
      }
    }
  }

  typeNext()
}

export function initAnimations() {
  AOS.init({
    duration: 700,
    easing:   'ease-out-cubic',
    once:     true,
    offset:   60,
  })
}

// 하트 낙하 파티클 (색상은 variables.css --particle-* 에서 관리)
export function initPetals(count = 10) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'petal'
    el.innerHTML = `
      <div class="petal__inner">
        <div class="petal__left"></div>
        <div class="petal__right"></div>
      </div>`

    const color     = theme.particles[i % theme.particles.length]
    const size      = 5 + Math.random() * 4
    const duration  = 9000 + Math.random() * 7000
    const delay     = -(Math.random() * 10000)
    const slotWidth = 100 / count
    const left      = slotWidth * i + Math.random() * slotWidth
    const swayAnim  = i % 2 === 0 ? 'heartSwayL' : 'heartSwayR'

    el.style.cssText = `
      left: ${left}%;
      --heart-size: ${size}px;
      --heart-color: ${color};
      --sway-anim: ${swayAnim};
      animation-duration: ${duration}ms;
      animation-delay: ${delay}ms;
    `
    document.body.appendChild(el)
  }
}
