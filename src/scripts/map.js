import { CONFIG } from './config.js'

export function initMap() {
  setNaviLinks()

  const { timestamp, key } = CONFIG.kakaomap
  if (!timestamp || !key) return

  // 지도 섹션이 뷰포트에 들어올 때 로드
  const mapSection = document.getElementById('map')
  if (!mapSection) return

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect()
      loadRoughmap(timestamp, key)
    }
  }, { threshold: 0.1 })

  observer.observe(mapSection)
}

function loadRoughmap(timestamp, key) {
  const container = document.getElementById('map-container')
  if (!container) return

  // 지도 노드 삽입
  const mapNode = document.createElement('div')
  mapNode.id = `daumRoughmapContainer${timestamp}`
  mapNode.className = 'root_daum_roughmap root_daum_roughmap_landing'
  container.appendChild(mapNode)

  // roughmapLoader 스크립트 삽입
  const loaderScript = document.createElement('script')
  loaderScript.className = 'daum_roughmap_loader_script'
  loaderScript.src = 'https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js'
  loaderScript.onload = () => {
    new daum.roughmap.Lander({ timestamp, key }).render()
  }
  container.appendChild(loaderScript)
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
