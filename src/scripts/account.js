import { showToast } from './toast.js'

export function initAccount() {
  // 신랑/신부 탭 전환
  const tabs  = document.querySelectorAll('.account-tab')
  const lists = document.querySelectorAll('.account-list')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t  => t.classList.remove('account-tab--active'))
      lists.forEach(l => l.classList.remove('account-list--active'))

      tab.classList.add('account-tab--active')
      const target = document.getElementById(`account-${tab.dataset.side}`)
      if (target) target.classList.add('account-list--active')
    })
  })

  // 계좌번호 복사 (이벤트 위임: 카드가 동적으로 렌더링되므로)
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn--copy')
    if (!btn) return
    const number = btn.dataset.account
    copyToClipboard(number).then(() => {
      showToast('계좌번호가 복사되었습니다.')
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
