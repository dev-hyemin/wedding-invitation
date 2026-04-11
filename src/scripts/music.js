export function initMusic() {
  const audio   = document.getElementById('bg-music')
  const btn     = document.getElementById('music-btn')
  const iconPlay  = btn?.querySelector('.music-btn__icon--play')
  const iconPause = btn?.querySelector('.music-btn__icon--pause')

  if (!audio || !btn) return

  function setPlaying(playing) {
    iconPlay.style.display  = playing ? 'none'  : ''
    iconPause.style.display = playing ? ''      : 'none'
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play()
      setPlaying(true)
    } else {
      audio.pause()
      setPlaying(false)
    }
  })
}
