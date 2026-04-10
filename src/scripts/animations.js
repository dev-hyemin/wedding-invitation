import AOS from 'aos'

export function initAnimations() {
  AOS.init({
    duration: 700,
    easing:   'ease-out-cubic',
    once:     true,
    offset:   60,
  })
}

// 하트 낙하 파티클
export function initPetals(count = 10) {
  const colors = [
    'rgba(201,169,110,0.75)',  // 골드
    'rgba(255,255,255,0.85)',  // 화이트
    'rgba(232,213,196,0.80)', // 피치
    'rgba(201,169,110,0.45)', // 연한 골드
  ]

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'petal'
    el.innerHTML = `
      <div class="petal__inner">
        <div class="petal__left"></div>
        <div class="petal__right"></div>
      </div>`

    const size     = 6 + Math.random() * 7          // 6~13px
    const color    = colors[Math.floor(Math.random() * colors.length)]
    const duration = 4000 + Math.random() * 5000    // 4~9s
    const delay    = -(Math.random() * 8000)         // 즉시 시작 (음수 딜레이)
    const left     = Math.random() * 100

    el.style.cssText = `
      left: ${left}%;
      --heart-size: ${size}px;
      --heart-color: ${color};
      animation-duration: ${duration}ms;
      animation-delay: ${delay}ms;
    `

    document.body.appendChild(el)
  }
}
