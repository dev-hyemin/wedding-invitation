import { showToast } from './toast.js'

export function initAccount() {
  // 신랑/신부 아코디언 토글
  document.querySelectorAll('.account-accordion__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('account-accordion__btn--open')
      const body = document.getElementById(`account-${btn.dataset.side}`)
      if (!body) return

      btn.classList.toggle('account-accordion__btn--open', !isOpen)

      if (!isOpen) {
        // 펼치기: scrollHeight까지 확장 후 auto로
        body.style.display = 'flex'
        body.classList.add('account-accordion__body--open')
        const h = body.scrollHeight
        body.style.height = '0'
        requestAnimationFrame(() => { body.style.height = h + 'px' })
        body.addEventListener('transitionend', () => { body.style.height = 'auto' }, { once: true })
      } else {
        // 접기: 현재 높이에서 0으로
        body.style.height = body.scrollHeight + 'px'
        requestAnimationFrame(() => { body.style.height = '0' })
        body.addEventListener('transitionend', () => {
          body.classList.remove('account-accordion__body--open')
          body.style.height = ''
          body.style.display = ''
        }, { once: true })
      }
    })
  })

  // 계좌번호 복사 (이벤트 위임: 카드가 동적으로 렌더링되므로)
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn--copy')
    if (!btn) return
    const number = btn.dataset.account
    copyToClipboard(number).then(() => {
      showToast('계좌번호가 복사되었습니다.')
      btn.classList.add('btn--copy--copied')
      clearTimeout(btn._copyTimer)
      btn._copyTimer = setTimeout(() => btn.classList.remove('btn--copy--copied'), 1500)
    }).catch(() => {
      showToast('복사에 실패했습니다. 직접 입력해주세요.')
    })
  })
}

async function copyToClipboard(text) {
  // 최신 API
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }

  // fallback (iOS 구형 Safari 등)
  const el = document.createElement('textarea')
  el.value = text
  el.style.cssText = 'position:fixed;top:-9999px;left:-9999px'
  document.body.appendChild(el)
  el.focus()
  el.select()
  try {
    const ok = document.execCommand('copy')
    if (!ok) throw new Error('execCommand failed')
  } finally {
    document.body.removeChild(el)
  }
}
