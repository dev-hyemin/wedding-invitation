import { CONFIG } from './config.js'

export async function initHero() {
  const heroImg   = document.querySelector('.hero__bg-img')
  const bannerImg = document.getElementById('dday-banner-img')

  if (heroImg   && CONFIG.hero.fallback)      heroImg.src   = CONFIG.hero.fallback
  if (bannerImg && CONFIG.countdown.fallback) bannerImg.src = CONFIG.countdown.fallback

  const { url, anonKey } = CONFIG.supabase
  if (!url || !anonKey) return

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, anonKey)

    const hero = CONFIG.hero
    const { data: heroData } = supabase.storage.from(hero.storageBucket).getPublicUrl(hero.storagePath)
    if (heroData?.publicUrl && heroImg) heroImg.src = heroData.publicUrl

    const countdown = CONFIG.countdown
    const { data: countdownData } = supabase.storage.from(countdown.storageBucket).getPublicUrl(countdown.storagePath)
    if (countdownData?.publicUrl && bannerImg) bannerImg.src = countdownData.publicUrl
  } catch (err) {
    console.warn('[Hero] Supabase Storage 로드 실패, fallback 사용:', err.message)
  }
}
