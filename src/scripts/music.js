export function initMusic() {
  const audio      = document.getElementById('bg-music')
  const btn        = document.getElementById('music-btn')
  const iconPlay   = btn?.querySelector('.music-btn__icon--play')
  const iconPause  = btn?.querySelector('.music-btn__icon--pause')

  if (!audio || !btn) return

  function setPlaying(playing) {
    iconPlay.style.display  = playing ? 'none' : ''
    iconPause.style.display = playing ? ''     : 'none'
  }

  // 첫 사용자 인터랙션 시 자동 재생
  function tryAutoplay() {
    audio.play().then(() => {
      setPlaying(true)
    }).catch(() => {
      // 브라우저가 자동 재생을 막은 경우 첫 터치/클릭 대기
      const onFirst = () => {
        audio.play().then(() => setPlaying(true)).catch(() => {})
        document.removeEventListener('click',     onFirst)
        document.removeEventListener('touchstart', onFirst)
      }
      document.addEventListener('click',      onFirst, { once: true })
      document.addEventListener('touchstart', onFirst, { once: true })
    })
  }

  tryAutoplay()

  btn.addEventListener('click', e => {
    e.stopPropagation()
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  })
}
