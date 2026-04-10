import { CONFIG } from './config.js'

export async function initHero() {
  const img = document.querySelector('.hero__bg-img')
  if (!img) return

  const { url, anonKey } = CONFIG.supabase
  if (!url || !anonKey) return

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, anonKey)

    const { storageBucket, storagePath } = CONFIG.hero
    const { data } = supabase.storage.from(storageBucket).getPublicUrl(storagePath)

    if (data?.publicUrl) {
      img.src = data.publicUrl
    }
  } catch (err) {
    console.warn('[Hero] Supabase Storage 로드 실패, fallback 사용:', err.message)
  }
}
