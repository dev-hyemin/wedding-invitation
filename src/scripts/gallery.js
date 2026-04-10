import Swiper from 'swiper'
import { Pagination, Autoplay } from 'swiper/modules'
import { CONFIG } from './config.js'

// ── Supabase Storage에서 이미지 URL 목록 가져오기 ──
async function fetchStorageImages() {
  const { url, anonKey } = CONFIG.supabase
  if (!url || !anonKey) return null

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, anonKey)

    const { storageBucket, storageFolder } = CONFIG.gallery
    const folder = storageFolder || ''

    const { data: files, error } = await supabase.storage
      .from(storageBucket)
      .list(folder, { sortBy: { column: 'name', order: 'asc' } })

    if (error || !files?.length) return null

    // 폴더·숨김 파일 제외
    const imageFiles = files.filter(f => f.id && !f.name.startsWith('.'))

    return imageFiles.map((file, i) => {
      const path = folder ? `${folder}/${file.name}` : file.name
      const { data } = supabase.storage.from(storageBucket).getPublicUrl(path)
      return { src: data.publicUrl, alt: `커플 사진 ${i + 1}` }
    })
  } catch (err) {
    console.warn('[Gallery] Supabase Storage 로드 실패, fallback 사용:', err.message)
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

  // Supabase Storage에서 먼저 시도, 실패 시 fallback
  const storageImages = await fetchStorageImages()
  const images = storageImages ?? CONFIG.gallery.fallback

  buildSlides(wrapper, images)

  const swiper = initSwiper(wrapper)
  initLightbox(swiper)
}
