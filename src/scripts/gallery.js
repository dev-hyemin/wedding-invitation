import { CONFIG } from './config.js'

const PAGE_SIZE = 9

// ── 로컬 이미지 목록 가져오기 ──
function fetchImages() {
  return CONFIG.gallery.images.map((src, i) => ({ src, alt: `갤러리 ${i + 1}` }))
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

const SLIDE_GAP = '16px'

// ── 인접 이미지 엘리먼트 생성 헬퍼 ──
function makeAdjacentImg(src, side) {
  const img = document.createElement('img')
  img.src = src
  const tx = side === 'prev'
    ? `calc(-100% - ${SLIDE_GAP})`
    : `calc(100% + ${SLIDE_GAP})`
  img.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:contain;user-select:none;pointer-events:none;transform:translateX(${tx})`
  return img
}

// ── 라이트박스 ──
function initLightbox(images) {
  const lightbox = document.getElementById('lightbox')
  const track    = document.getElementById('lightbox-track')
  const imgEl    = document.getElementById('lightbox-img')
  const closeBtn = document.getElementById('lightbox-close')
  const counter  = document.getElementById('lightbox-counter')
  if (!lightbox || !imgEl || !track) return

  let current = 0
  let prevEl = null
  let nextEl = null

  function updateCounter() {
    if (counter) counter.textContent = `${current + 1} / ${images.length}`
  }

  function cleanAdjacent() {
    prevEl?.remove(); prevEl = null
    nextEl?.remove(); nextEl = null
  }

  // 키보드/클릭용 즉시 전환
  function slideTo(index, direction) {
    const next = (index + images.length) % images.length
    if (next === current) return

    const side   = direction === 'left' ? 'next' : 'prev'
    const outX   = direction === 'left'
      ? `calc(-100% - ${SLIDE_GAP})`
      : `calc(100% + ${SLIDE_GAP})`

    const incoming = makeAdjacentImg(images[next].src, side)
    incoming.style.transition = 'none'
    track.appendChild(incoming)

    requestAnimationFrame(() => requestAnimationFrame(() => {
      imgEl.style.transition    = 'transform 0.3s ease'
      imgEl.style.transform     = `translateX(${outX})`
      incoming.style.transition = 'transform 0.3s ease'
      incoming.style.transform  = 'translateX(0)'
    }))

    setTimeout(() => {
      current = next
      imgEl.src = images[current].src
      imgEl.alt = images[current].alt
      imgEl.style.transition = ''
      imgEl.style.transform  = ''
      incoming.remove()
      updateCounter()
    }, 320)
  }

  function show(index) {
    current = (index + images.length) % images.length
    imgEl.src = images[current].src
    imgEl.alt = images[current].alt
    imgEl.style.transition = ''
    imgEl.style.transform  = ''
    updateCounter()
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
    cleanAdjacent()
  }

  closeBtn?.addEventListener('click', close)

  // 이미지·닫기버튼 외 영역 클릭 시 닫기 (스와이프 후 제외)
  let wasDragged = false
  lightbox.addEventListener('click', e => {
    if (wasDragged) { wasDragged = false; return }
    if (!e.target.closest('#lightbox-img') && !e.target.closest('#lightbox-close')) close()
  })

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('lightbox--open')) return
    if (e.key === 'Escape')     close()
    if (e.key === 'ArrowLeft')  slideTo(current - 1, 'right')
    if (e.key === 'ArrowRight') slideTo(current + 1, 'left')
  })

  // ── 드래그 팔로우 스와이프 ──
  let startX = 0
  let currentX = 0
  let dragging = false

  track.addEventListener('touchstart', e => {
    startX = currentX = e.touches[0].clientX
    dragging = true

    // 프리로드된 이미지 → decode 대기 없이 즉시 DOM에 배치
    cleanAdjacent()
    const prevIdx = (current - 1 + images.length) % images.length
    const nextIdx = (current + 1) % images.length

    prevEl = makeAdjacentImg(images[prevIdx].src, 'prev')
    nextEl = makeAdjacentImg(images[nextIdx].src, 'next')
    track.appendChild(prevEl)
    track.appendChild(nextEl)

    imgEl.style.transition = 'none'
    prevEl.style.transition = 'none'
    nextEl.style.transition = 'none'
  }, { passive: true })

  track.addEventListener('touchmove', e => {
    if (!dragging || !prevEl || !nextEl) return
    e.preventDefault()
    currentX = e.touches[0].clientX
    const dx = currentX - startX

    imgEl.style.transform = `translateX(${dx}px)`
    prevEl.style.transform = `translateX(calc(-100% - ${SLIDE_GAP} + ${dx}px))`
    nextEl.style.transform = `translateX(calc(100% + ${SLIDE_GAP} + ${dx}px))`
  }, { passive: false })

  track.addEventListener('touchend', () => {
    if (!dragging || !prevEl || !nextEl) return
    dragging = false

    const dx = currentX - startX
    const threshold = 60
    const transition = 'transform 0.3s ease'

    imgEl.style.transition = transition
    prevEl.style.transition = transition
    nextEl.style.transition = transition

    if (dx < -threshold) {
      wasDragged = true
      const nextIdx = (current + 1) % images.length
      imgEl.style.transform = `translateX(calc(-100% - ${SLIDE_GAP}))`
      nextEl.style.transform = 'translateX(0)'
      setTimeout(() => {
        current = nextIdx
        imgEl.src = images[current].src
        imgEl.style.transition = ''; imgEl.style.transform = ''
        cleanAdjacent()
        updateCounter()
      }, 300)
    } else if (dx > threshold) {
      wasDragged = true
      const prevIdx = (current - 1 + images.length) % images.length
      imgEl.style.transform = `translateX(calc(100% + ${SLIDE_GAP}))`
      prevEl.style.transform = 'translateX(0)'
      setTimeout(() => {
        current = prevIdx
        imgEl.src = images[current].src
        imgEl.style.transition = ''; imgEl.style.transform = ''
        cleanAdjacent()
        updateCounter()
      }, 300)
    } else {
      // 제자리로 복귀
      imgEl.style.transform = 'translateX(0)'
      prevEl.style.transform = 'translateX(-100%)'
      nextEl.style.transform = 'translateX(100%)'
      setTimeout(() => cleanAdjacent(), 300)
    }
  }, { passive: true })

  return open
}

// ── 진입점 ──
export function initGallery() {
  const grid    = document.getElementById('gallery-grid')
  const moreBtn = document.getElementById('gallery-more-btn')
  if (!grid) return

  const images = fetchImages()

  // 전체 이미지 프리로드 (GC 방지용 배열 보관)
  const _preloadCache = images.map(({ src }) => { const i = new Image(); i.src = src; return i })

  const openLightbox  = initLightbox(images)
  const collapseBtn   = document.getElementById('gallery-collapse-btn')
  const extraWrap     = document.getElementById('gallery-extra-wrap')
  const extraGrid     = document.getElementById('gallery-extra-grid')
  let shownCount = 0
  let animating  = false

  const hasMore = images.length > PAGE_SIZE

  function updateButtons(expanded) {
    if (moreBtn)     moreBtn.style.display    = expanded ? 'none' : (hasMore ? '' : 'none')
    if (collapseBtn) collapseBtn.style.display = expanded ? '' : 'none'
  }

  function showMore() {
    if (animating || !extraWrap || !extraGrid) return
    animating = true

    extraGrid.innerHTML = ''
    renderItems(extraGrid, images, PAGE_SIZE, images.length, openLightbox)
    shownCount = images.length

    // 컨테이너 높이는 즉시 확장 (reflow 애니메이션 없음)
    extraWrap.style.maxHeight = 'none'

    // 각 아이템을 GPU 레이어(opacity+transform)로 스태거 페이드인
    const items = Array.from(extraGrid.querySelectorAll('.gallery-item'))
    items.forEach(item => {
      item.style.opacity   = '0'
      item.style.transform = 'translateY(10px)'
    })
    items.forEach((item, i) => {
      setTimeout(() => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
        item.style.opacity    = '1'
        item.style.transform  = 'translateY(0)'
        if (i === items.length - 1) setTimeout(() => { animating = false }, 320)
      }, i * 25)
    })

    updateButtons(true)
  }

  function collapse() {
    if (animating || !extraWrap || !extraGrid) return
    animating = true

    // 아이템 페이드아웃
    const items = Array.from(extraGrid.querySelectorAll('.gallery-item'))
    items.forEach(item => {
      item.style.transition = 'opacity 0.18s ease'
      item.style.opacity    = '0'
    })

    // 페이드 후 높이 접기
    setTimeout(() => {
      const currentH = extraWrap.scrollHeight
      extraWrap.style.transition = 'none'
      extraWrap.style.maxHeight  = currentH + 'px'

      requestAnimationFrame(() => requestAnimationFrame(() => {
        extraWrap.style.transition = 'max-height 0.35s ease'
        extraWrap.style.maxHeight  = '0'
      }))

      setTimeout(() => {
        extraGrid.innerHTML = ''
        extraWrap.style.transition = ''
        shownCount = PAGE_SIZE
        animating  = false
        updateButtons(false)
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 380)
    }, 200)
  }

  grid.innerHTML = ''
  renderItems(grid, images, 0, PAGE_SIZE, openLightbox)
  shownCount = Math.min(PAGE_SIZE, images.length)
  updateButtons(false)

  moreBtn?.addEventListener('click', showMore)
  collapseBtn?.addEventListener('click', collapse)
}
