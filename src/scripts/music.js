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

  // 첫 사용자 인터랙션 시 자동 재생
  // touchend: iOS Safari에서 스크롤(touchstart)과 탭(touchend) 구분
  function onFirstInteraction() {
    document.removeEventListener('click',    onFirstInteraction)
    document.removeEventListener('touchend', onFirstInteraction)
    playAudio()
  }

  audio.play().then(() => {
    setPlaying(true)
  }).catch(() => {
    document.addEventListener('click',    onFirstInteraction)
    document.addEventListener('touchend', onFirstInteraction)
  })

  btn.addEventListener('click', e => {
    e.stopPropagation()
    // 버튼 클릭은 직접 처리 — document 리스너 해제
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
