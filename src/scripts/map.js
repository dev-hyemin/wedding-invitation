import { CONFIG } from './config.js'

export function initMap() {
  initKakaoMap()
  setNaviLinks()
}

function initKakaoMap() {
  const { timestamp, key } = CONFIG.kakaomap
  const container = document.getElementById('map-container')
  if (!container) return

  const mapDiv = document.createElement('div')
  mapDiv.id = `daumRoughmapContainer${timestamp}`
  mapDiv.className = 'root_daum_roughmap root_daum_roughmap_landing'
  container.appendChild(mapDiv)

  const loaderScript = document.createElement('script')
  loaderScript.className = 'daum_roughmap_loader_script'
  loaderScript.src = 'https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js'
  loaderScript.onload = () => {
    new window.daum.roughmap.Lander({ timestamp, key }).render()
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

export function initTransportTabs() {
  const tabs     = document.querySelectorAll('.transport-tab')
  const contents = document.querySelectorAll('.transport-content')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('transport-tab--active'))
      contents.forEach(c => c.classList.remove('transport-content--active'))
      tab.classList.add('transport-tab--active')
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('transport-content--active')
    })
  })
}
