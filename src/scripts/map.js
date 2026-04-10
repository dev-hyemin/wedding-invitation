import { CONFIG } from './config.js'

export function initMap() {
  setNaviLinks()

  const mapSection = document.getElementById('map')
  if (!mapSection) return

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect()
      renderGoogleMap()
    }
  }, { threshold: 0.1 })

  observer.observe(mapSection)
}

function renderGoogleMap() {
  const container = document.getElementById('map-container')
  if (!container) return

  const { lat, lng, address } = CONFIG.wedding

  const iframe = document.createElement('iframe')
  iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
  iframe.width = '100%'
  iframe.height = '100%'
  iframe.style.border = 'none'
  iframe.loading = 'lazy'
  iframe.allowFullscreen = true
  iframe.referrerPolicy = 'no-referrer-when-downgrade'
  iframe.title = address

  container.appendChild(iframe)
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

// 교통 안내 탭
export function initTransportTabs() {
  const tabs     = document.querySelectorAll('.transport-tab')
  const contents = document.querySelectorAll('.transport-content')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('transport-tab--active'))
      contents.forEach(c => c.classList.remove('transport-content--active'))

      tab.classList.add('transport-tab--active')
      const target = document.getElementById(`tab-${tab.dataset.tab}`)
      if (target) target.classList.add('transport-content--active')
    })
  })
}
