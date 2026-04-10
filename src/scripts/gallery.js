import Swiper from 'swiper'
import { Pagination, Autoplay } from 'swiper/modules'

export function initGallery() {
  const swiper = new Swiper('.gallery-swiper', {
    modules: [Pagination, Autoplay],
    loop: true,
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

  // 라이트박스
  const lightbox  = document.getElementById('lightbox')
  const lbImg     = document.getElementById('lightbox-img')
  const lbClose   = document.getElementById('lightbox-close')

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
