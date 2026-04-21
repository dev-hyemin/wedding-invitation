import { CONFIG } from './config.js'

export function initHero() {
  const heroImg = document.querySelector('.hero__bg-img')
  if (heroImg) heroImg.src = CONFIG.hero.src

  const bannerImg = document.getElementById('dday-banner-img')
  if (bannerImg) bannerImg.src = CONFIG.countdown.src
}
