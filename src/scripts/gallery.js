import Swiper from 'swiper'
import { Pagination, Autoplay } from 'swiper/modules'
import { CONFIG } from './config.js'

// ── Firebase Storage에서 이미지 URL 목록 가져오기 ──
async function fetchStorageImages() {
  const cfg = CONFIG.firebase
  if (!cfg.apiKey || !cfg.storageBucket) return null

  try {
    const { initializeApp, getApps } = await import('firebase/app')
    const { getStorage, ref, listAll, getDownloadURL } = await import('firebase/storage')

    const app = getApps().length ? getApps()[0] : initializeApp(cfg)
    const storage = getStorage(app)

    const folderRef = ref(storage, CONFIG.gallery.storagePath)
    const result = await listAll(folderRef)

    if (result.items.length === 0) return null

    // 파일명 기준 정렬 후 URL 일괄 요청
    const sorted = [...result.items].sort((a, b) => a.name.localeCompare(b.name))
    const urls = await Promise.all(sorted.map(item => getDownloadURL(item)))

    return urls.map((url, i) => ({ src: url, alt: `커플 사진 ${i + 1}` }))
  } catch (err) {
    console.warn('[Gallery] Firebase Storage 로드 실패, fallback 사용:', err.message)
    return null
  }
}

// ── 슬라이드 DOM 생성 ──
function buildSlides(wrapper, images) {
  wrapper.innerHTML = ''
  images.forEach(({ src, alt }) => {
    const slide = document.createElement('div')
    slide.className = 'swiper-slide'
    const img = document.createElement('img')
    img.src = src
    img.alt = alt
    img.loading = 'lazy'
    slide.appendChild(img)
    wrapper.appendChild(slide)
  })
}

// ── Swiper 초기화 ──
function initSwiper(wrapper) {
  const swiper = new Swiper('.gallery-swiper', {
    modules: [Pagination, Autoplay],
    loop: wrapper.children.length > 1,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1.1,
    spaceBetween: 12,
  })
  return swiper
}

// ── 라이트박스 ──
function initLightbox(swiper) {
  const lightbox = document.getElementById('lightbox')
  const lbImg    = document.getElementById('lightbox-img')
  const lbClose  = document.getElementById('lightbox-close')

  document.querySelectorAll('.gallery-swiper .swiper-slide img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src
      lbImg.alt = img.alt
      lightbox.classList.add('lightbox--open')
      lightbox.setAttribute('aria-hidden', 'false')
      document.body.style.overflow = 'hidden'
      swiper.autoplay.stop()
    })
  })

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open')
    lightbox.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    swiper.autoplay.start()
  }

  lbClose.addEventListener('click', closeLightbox)
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox()
  })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox()
  })
}

// ── 진입점 ──
export async function initGallery() {
  const wrapper = document.getElementById('gallery-wrapper')
  if (!wrapper) return

  // Firebase Storage에서 먼저 시도, 실패 시 fallback
  const storageImages = await fetchStorageImages()
  const images = storageImages ?? CONFIG.gallery.fallback

  buildSlides(wrapper, images)

  const swiper = initSwiper(wrapper)
  initLightbox(swiper)
}
