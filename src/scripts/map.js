import { CONFIG } from './config.js'

export function initMap() {
  setNaviLinks()
}

function setNaviLinks() {
  const { lat, lng, venue, address } = CONFIG.wedding

  const kakaoBtn = document.getElementById('btn-kakao-navi')
  const naverBtn = document.getElementById('btn-naver-navi')

  if (kakaoBtn) {
    kakaoBtn.href = `https://map.kakao.com/link/to/${encodeURIComponent(venue)},${lat},${lng}`
    kakaoBtn.target = '_blank'
    kakaoBtn.rel = 'noopener noreferrer'
  }
  if (naverBtn) {
    naverBtn.href = `https://map.naver.com/v5/directions/-/-/-/transit?destination=${lng},${lat},${encodeURIComponent(venue)},${encodeURIComponent(address)}`
    naverBtn.target = '_blank'
    naverBtn.rel = 'noopener noreferrer'
  }
}

export function initTransportTabs() {
  const tabs     = document.querySelectorAll('.transport-tab')
  const contents = document.querySelectorAll('.transport-content')

  // 가장 긴 탭 높이 측정 후 컨테이너 min-height 고정
  let maxHeight = 0
  contents.forEach(c => {
    const prev = c.style.display
    c.style.display = 'block'
    maxHeight = Math.max(maxHeight, c.scrollHeight)
    c.style.display = prev
  })
  if (maxHeight > 0) {
    contents.forEach(c => { c.style.minHeight = maxHeight + 'px' })
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('transport-tab--active'))
      contents.forEach(c => c.classList.remove('transport-content--active'))
      tab.classList.add('transport-tab--active')
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('transport-content--active')
    })
  })
}
