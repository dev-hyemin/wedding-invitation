import AOS from 'aos'
import { theme } from './theme.js'


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
