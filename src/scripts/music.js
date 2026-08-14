export function initMusic() {
  const audio     = document.getElementById('bg-music')
  const btn       = document.getElementById('music-btn')
  const iconPlay  = btn?.querySelector('.music-btn__icon--play')
  const iconPause = btn?.querySelector('.music-btn__icon--pause')

  if (!audio || !btn) return

  function setPlaying(playing) {
    iconPlay.style.display  = playing ? 'none' : ''
    iconPause.style.display = playing ? ''     : 'none'
  }

  function playAudio() {
    return audio.play().then(() => setPlaying(true)).catch(() => {})
  }

  function onFirstInteraction(e) {
    // 음악 버튼 탭은 버튼 핸들러에서 직접 처리
    if (btn.contains(e.target)) return
    audio.play()
      .then(() => {
        document.removeEventListener('click',    onFirstInteraction)
        document.removeEventListener('touchend', onFirstInteraction)
        setPlaying(true)
      })
      .catch(() => {})  // 실패 시 리스너 유지 → 다음 인터랙션에서 재시도
  }

  audio.play().then(() => {
    setPlaying(true)
  }).catch(() => {
    document.addEventListener('click',    onFirstInteraction)
    document.addEventListener('touchend', onFirstInteraction)
  })

  btn.addEventListener('click', e => {
    e.stopPropagation()
    document.removeEventListener('click',    onFirstInteraction)
    document.removeEventListener('touchend', onFirstInteraction)

    if (audio.paused) {
      playAudio()
    } else {
      audio.pause()
      setPlaying(false)
    }
  })
}
