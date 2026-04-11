import { CONFIG } from './config.js'

export async function initHero() {
  const { url, anonKey } = CONFIG.supabase
  if (!url || !anonKey) return

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, anonKey)

    // 히어로 배경 이미지
    const hero = CONFIG.hero
    const { data: heroData } = supabase.storage.from(hero.storageBucket).getPublicUrl(hero.storagePath)
    if (heroData?.publicUrl) {
      const heroImg = document.querySelector('.hero__bg-img')
      if (heroImg) heroImg.src = heroData.publicUrl
    }

    // D-Day 배너 이미지 (별도 파일)
    const countdown = CONFIG.countdown
    const { data: countdownData } = supabase.storage.from(countdown.storageBucket).getPublicUrl(countdown.storagePath)
    if (countdownData?.publicUrl) {
      const bannerImg = document.getElementById('dday-banner-img')
      if (bannerImg) bannerImg.src = countdownData.publicUrl
    }
  } catch (err) {
    console.warn('[Hero] Supabase Storage 로드 실패, fallback 사용:', err.message)
  }
}
