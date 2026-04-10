import AOS from 'aos'

export function initAnimations() {
  AOS.init({
    duration: 700,
    easing:   'ease-out-cubic',
    once:     true,
    offset:   60,
  })
}

// 꽃잎 낙하 (순수 CSS 파티클)
export function initPetals(count = 10) {
  const petals = ['🌸', '🌺', '🌼', '✿']

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.className  = 'petal'
    el.textContent = petals[Math.floor(Math.random() * petals.length)]

    const left     = Math.random() * 100
    const duration = 6 + Math.random() * 8
    const delay    = Math.random() * 10

    el.style.cssText = `
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      font-size: ${0.8 + Math.random() * 0.8}rem;
      opacity: 0;
    `

    document.body.appendChild(el)
  }
}
