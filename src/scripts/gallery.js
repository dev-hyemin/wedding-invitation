import { CONFIG } from './config.js'

const PAGE_SIZE = 9

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

// ── 그리드 아이템 렌더링 ──
function renderItems(grid, images, from, to, onClickItem) {
  images.slice(from, to).forEach((img, localIdx) => {
    const globalIdx = from + localIdx
    const item = document.createElement('div')
    item.className = 'gallery-item'
    const el = document.createElement('img')
    el.src = img.src
    el.alt = img.alt
    el.addEventListener('click', () => onClickItem(globalIdx))
    item.appendChild(el)
    grid.appendChild(item)
  })
}

// ── 라이트박스 ──
function initLightbox(images) {
  const lightbox = document.getElementById('lightbox')
  const imgEl    = document.getElementById('lightbox-img')
  const closeBtn = document.getElementById('lightbox-close')
  const counter  = document.getElementById('lightbox-counter')
  if (!lightbox || !imgEl) return

  let current = 0
  let touchStartX = 0
  let isAnimating = false

  function slideTo(index, direction) {
    if (isAnimating) return
    const next = (index + images.length) % images.length
    if (next === current) return
    isAnimating = true

    const outX = direction === 'left' ? '-100%' : '100%'
    const inX  = direction === 'left' ? '100%'  : '-100%'

    const nextImg = new Image()
    nextImg.src = images[next].src
    nextImg.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transform:translateX(${inX});transition:transform 0.3s ease`
    lightbox.appendChild(nextImg)

    imgEl.style.transition = `transform 0.3s ease`
    imgEl.style.transform  = `translateX(${outX})`

    setTimeout(() => {
      imgEl.src = images[next].src
      imgEl.alt = images[next].alt
      imgEl.style.transition = ''
      imgEl.style.transform  = ''
      nextImg.remove()
      current = next
      if (counter) counter.textContent = `${current + 1} / ${images.length}`
      isAnimating = false
    }, 300)
  }

  function show(index, direction = 'left') {
    current = (index + images.length) % images.length
    imgEl.src = images[current].src
    imgEl.alt = images[current].alt
    if (counter) counter.textContent = `${current + 1} / ${images.length}`
  }

  function open(index) {
    show(index)
    lightbox.classList.add('lightbox--open')
    lightbox.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
  }

  function close() {
    lightbox.classList.remove('lightbox--open')
    lightbox.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }

  closeBtn?.addEventListener('click', close)

  // 터치 스와이프
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX
  }, { passive: true })
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(dx) < 40) return
    dx < 0
      ? slideTo(current + 1, 'left')
      : slideTo(current - 1, 'right')
  }, { passive: true })

  // 배경 클릭 닫기
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close()
  })

  // 키보드
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('lightbox--open')) return
    if (e.key === 'Escape')     close()
    if (e.key === 'ArrowLeft')  slideTo(current - 1, 'right')
    if (e.key === 'ArrowRight') slideTo(current + 1, 'left')
  })

  return open
}

// ── 진입점 ──
export async function initGallery() {
  const grid    = document.getElementById('gallery-grid')
  const moreBtn = document.getElementById('gallery-more-btn')
  if (!grid) return

  const storageImages = await fetchStorageImages()
  const images = storageImages ?? CONFIG.gallery.fallback

  // 전체 이미지 즉시 프리로드
  images.forEach(({ src }) => { new Image().src = src })

  const openLightbox = initLightbox(images)
  const collapseBtn  = document.getElementById('gallery-collapse-btn')
  let shownCount = 0

  const hasMore = images.length > PAGE_SIZE

  function updateButtons(expanded) {
    if (moreBtn)     moreBtn.style.display    = expanded ? 'none' : (hasMore ? '' : 'none')
    if (collapseBtn) collapseBtn.style.display = expanded ? '' : 'none'
  }

  function showMore() {
    renderItems(grid, images, shownCount, images.length, openLightbox)
    shownCount = images.length
    updateButtons(true)
  }

  function collapse() {
    grid.innerHTML = ''
    shownCount = 0
    renderItems(grid, images, 0, PAGE_SIZE, openLightbox)
    shownCount = PAGE_SIZE
    updateButtons(false)
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  grid.innerHTML = ''
  renderItems(grid, images, 0, PAGE_SIZE, openLightbox)
  shownCount = Math.min(PAGE_SIZE, images.length)
  updateButtons(false)

  moreBtn?.addEventListener('click', showMore)
  collapseBtn?.addEventListener('click', collapse)
}
