import Swiper from 'swiper'
import { Pagination } from 'swiper/modules'
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
      .list(folder)

    if (error || !files?.length) return null

    // 폴더·숨김 파일 제외 후 파일명 앞 숫자 기준 정렬 (1, 2, 10... 순)
    const imageFiles = files
      .filter(f => f.id && !f.name.startsWith('.'))
      .sort((a, b) => {
        const numA = parseInt(a.name.replace(/^[^\d]+/, ''), 10)
        const numB = parseInt(b.name.replace(/^[^\d]+/, ''), 10)
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB
        return a.name.localeCompare(b.name)
      })

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
  return new Swiper('.gallery-swiper', {
    modules: [Pagination],
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 0,
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
  initSwiper(wrapper)
}
