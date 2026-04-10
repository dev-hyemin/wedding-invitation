import { CONFIG } from './config.js'

export function initMap() {
  // 길찾기 버튼 URL은 지도 로드와 무관하게 즉시 설정
  setNaviLinks()

  // 카카오맵 API 키가 없으면 스킵
  if (!CONFIG.kakaoMapKey) {
    const container = document.getElementById('kakao-map')
    if (container) container.innerHTML = '<p style="display:flex;align-items:center;justify-content:center;height:100%;color:#aaa;font-size:.875rem;">카카오맵 API 키를 .env에 설정하세요.</p>'
    return
  }

  // 지도 섹션이 뷰포트에 들어올 때 SDK 로드
  const mapSection = document.getElementById('map')
  if (!mapSection) return

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect()
      loadKakaoMap()
    }
  }, { threshold: 0.1 })

  observer.observe(mapSection)
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

function loadKakaoMap() {
  // 이미 로드된 경우 바로 렌더링
  if (window.kakao?.maps) {
    kakao.maps.load(renderMap)
    return
  }

  const script = document.createElement('script')
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${CONFIG.kakaoMapKey}&libraries=services&autoload=false`
  script.onload = () => kakao.maps.load(renderMap)
  document.head.appendChild(script)
}

function renderMap() {
  const container = document.getElementById('kakao-map')
  if (!container) return

  const { lat, lng, venue, address } = CONFIG.wedding

  const map = new kakao.maps.Map(container, {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3,
  })

  // 커스텀 오버레이 마커
  const markerContent = `
    <div style="
      background:#C9A96E;
      color:#fff;
      padding:6px 12px;
      border-radius:20px;
      font-size:12px;
      font-weight:500;
      white-space:nowrap;
      box-shadow:0 2px 8px rgba(0,0,0,.2);
      transform:translateY(-100%);
      position:relative;
    ">
      📍 ${venue}
      <div style="
        position:absolute;
        bottom:-6px;
        left:50%;
        transform:translateX(-50%);
        width:0;height:0;
        border-left:6px solid transparent;
        border-right:6px solid transparent;
        border-top:6px solid #C9A96E;
      "></div>
    </div>
  `

  new kakao.maps.CustomOverlay({
    map,
    position: new kakao.maps.LatLng(lat, lng),
    content: markerContent,
    yAnchor: 1,
  })

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
