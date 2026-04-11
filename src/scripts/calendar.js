import { CONFIG } from './config.js'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

// 손으로 그린 느낌의 하트 SVG (약간 비대칭 + 드로잉 애니메이션)
const HAND_DRAWN_HEART = `
  <svg class="cal__heart" viewBox="0 0 52 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      class="cal__heart-path"
      d="M26,43
         C 22,38 14,33 9,27
         C 4,21 3,14 5,10
         C 7,5 12,2 17,3
         C 20,3.5 23,5.5 26,9
         C 29,5.5 32,3 35.5,3
         C 40.5,2.5 46,6 47,11
         C 49,17 47,23 43,28
         C 38,34 30,38 26,43 Z"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`

function buildCalendar(year, month, weddingDay) {
  const firstDay  = new Date(year, month, 1).getDay()   // 0=일
  const lastDate  = new Date(year, month + 1, 0).getDate()

  // 요일 헤더
  const dayHeader = DAY_NAMES.map((d, i) => {
    const cls = i === 0 ? 'cal__day-name cal__day-name--sun'
              : i === 6 ? 'cal__day-name cal__day-name--sat'
              : 'cal__day-name'
    return `<span class="${cls}">${d}</span>`
  }).join('')

  // 빈 칸 채우기
  let cells = ''
  for (let i = 0; i < firstDay; i++) {
    cells += '<span class="cal__cell cal__cell--empty"></span>'
  }

  // 날짜 셀
  for (let d = 1; d <= lastDate; d++) {
    const col       = (firstDay + d - 1) % 7
    const isSun     = col === 0
    const isSat     = col === 6
    const isWedding = d === weddingDay

    let cls = 'cal__cell'
    if (isWedding) cls += ' cal__cell--wedding'
    if (isSun)     cls += ' cal__cell--sun'
    if (isSat)     cls += ' cal__cell--sat'

    cells += isWedding
      ? `<span class="${cls}" aria-label="${d}일 결혼식">
           <span class="cal__date">${d}</span>
           ${HAND_DRAWN_HEART}
         </span>`
      : `<span class="${cls}"><span class="cal__date">${d}</span></span>`
  }

  return `
    <div class="cal">
      <p class="cal__header">
        <span class="cal__month">${MONTH_NAMES[month]}</span>
      </p>
      <div class="cal__grid">
        ${dayHeader}
        ${cells}
      </div>
    </div>
  `
}

export function initCalendar() {
  const container = document.getElementById('hero-calendar')
  if (!container) return

  const date       = new Date(CONFIG.wedding.datetime)
  const year       = date.getFullYear()
  const month      = date.getMonth()
  const weddingDay = date.getDate()

  container.innerHTML = buildCalendar(year, month, weddingDay)

  // 결혼식 날 셀이 뷰포트에 들어오면 하트 드로잉 애니메이션 시작
  const heartPath = container.querySelector('.cal__heart-path')
  if (!heartPath) return

  const length = heartPath.getTotalLength?.() ?? 160
  heartPath.style.strokeDasharray  = length
  heartPath.style.strokeDashoffset = length

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      heartPath.classList.add('cal__heart-path--animate')
      observer.disconnect()
    }
  }, { threshold: 0.5 })

  observer.observe(container)
}
