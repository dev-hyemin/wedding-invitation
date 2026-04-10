import { theme } from './theme.js'

// 버튼 파티클 효과 (MIT © 2022 Evan Jin https://codepen.io/rudtjd2548/pen/yLveGmO)
// 색상은 variables.css에서 관리
const BURST_COLORS = theme.particles
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export function burstParticles(btn, total = 30) {
  for (let i = 0; i < total; i++) {
    const el = document.createElement('div')
    el.className = 'burst-particle'
    el.style.setProperty('--x', rand(-160, 160) + 'px')
    el.style.setProperty('--y', rand(-80, -200) + 'px')
    el.style.setProperty('--r', rand(-360 * 3, 360 * 3) + 'deg')
    el.style.setProperty('--c', BURST_COLORS[rand(0, BURST_COLORS.length - 1)])
    el.style.setProperty('--size', rand(8, 14) + 'px')
    el.style.setProperty('--d', rand(900, 1400) + 'ms')
    btn.appendChild(el)
    setTimeout(() => el.remove(), 1500)
  }
}
