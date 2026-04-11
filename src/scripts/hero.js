import { CONFIG } from './config.js'

export async function initHero() {
  const { url, anonKey } = CONFIG.supabase
  if (!url || !anonKey) return

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, anonKey)

    const { storageBucket, storagePath } = CONFIG.hero
    const { data } = supabase.storage.from(storageBucket).getPublicUrl(storagePath)

    if (data?.publicUrl) {
      // 히어로 배경 + D-Day 배너 이미지 동시 적용
      const heroImg  = document.querySelector('.hero__bg-img')
      const bannerImg = document.getElementById('dday-banner-img')
      if (heroImg)   heroImg.src   = data.publicUrl
      if (bannerImg) bannerImg.src = data.publicUrl
    }
  } catch (err) {
    console.warn('[Hero] Supabase Storage 로드 실패, fallback 사용:', err.message)
  }
}
