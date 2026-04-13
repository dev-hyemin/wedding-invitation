import { CONFIG } from './config.js'

/**
 * config.js의 값을 DOM에 반영합니다.
 * main.js에서 가장 먼저 호출되어야 합니다.
 */
export function initContent() {
  const { groom, bride, wedding, accounts, transport } = CONFIG

  // ── <title> & OG 메타 ──────────────────────────────────────
  document.title = `${groom.name} ♥ ${bride.name}`
  setMeta('og:title', `${groom.name} & ${bride.name}의 결혼식에 초대합니다`)
  setMeta('og:description', `${wedding.dateDisplay} · ${wedding.venue}`)

  // ── 히어로 ────────────────────────────────────────────────
  const heroNames = document.querySelectorAll('.hero__name')
  if (heroNames[0]) heroNames[0].textContent = groom.englishName.split(' ').slice(1).join(' ')
  if (heroNames[1]) heroNames[1].textContent = bride.englishName.split(' ').slice(1).join(' ')
  const heroDate = document.getElementById('hero-date')
  if (heroDate) {
    heroDate.innerHTML = wedding.dateDisplay.replace(/(오전|오후)/, '<br>$1')
    heroDate.setAttribute('datetime', wedding.datetime)
  }
  setText('#hero-venue', `${wedding.venue} ${wedding.hall}`)

  // ── 초대 인사말 (양가 정보) ───────────────────────────────
  setText('#groom-parents', `${groom.father} · ${groom.mother}`)
  setText('#groom-firstname', groom.name.slice(1))
  setText('#bride-parents', `${bride.father} · ${bride.mother}`)
  setText('#bride-firstname', bride.name.slice(1))

  // ── 예식 안내 ─────────────────────────────────────────────
  setText('#ceremony-datetime', wedding.dateDisplay)
  setText('#ceremony-venue', `${wedding.venue} ${wedding.hall}`)

  // ── D-Day 배너 ────────────────────────────────────────────
  setText('#dday-date', wedding.dateShort)

  // ── 오시는 길 ─────────────────────────────────────────────
  setText('#map-venue-name', wedding.venue)
  setText('#map-venue-hall', wedding.hall)
  setText('#map-venue-address', wedding.address)
  renderTransport(transport)

  // ── 마음 전하실 곳 (계좌번호) ─────────────────────────────
  renderAccounts(accounts)

  // ── 푸터 ──────────────────────────────────────────────────
  const year = new Date(wedding.datetime).getFullYear()
  setText('#footer-copy', `© ${year} ${groom.name} & ${bride.name}. All rights reserved.`)
}

// ── 헬퍼 ──────────────────────────────────────────────────────

function setText(selector, text) {
  const el = document.querySelector(selector)
  if (el) el.textContent = text
}

function setAttr(selector, attr, value) {
  const el = document.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

function setMeta(property, content) {
  const el = document.querySelector(`meta[property="${property}"]`)
  if (el) el.setAttribute('content', content)
}

function renderTransport(transport) {
  const render = (id, text) => {
    const el = document.getElementById(id)
    if (!el) return
    el.innerHTML = text.split('\n').map(line => {
      if (/^\p{Emoji}/u.test(line)) return `<p class="transport-section-title">${line}</p>`
      return `<p>${line}</p>`
    }).join('')
  }
  render('tab-car', transport.car)
  render('tab-public', transport.public)
  render('tab-parking', transport.parking)
}

function renderAccounts(accounts) {
  renderAccountList('account-groom', accounts.groom)
  renderAccountList('account-bride', accounts.bride)
}

function renderAccountList(id, list) {
  const container = document.getElementById(id)
  if (!container) return
  container.innerHTML = list.map(({ bank, name, number }) => `
    <div class="account-card">
      <div class="account-card__info">
        <span class="account-card__bank">${bank}</span>
        <span class="account-card__name">${name}</span>
        <span class="account-card__number">${number}</span>
      </div>
      <button class="btn btn--copy" data-account="${number}" aria-label="계좌번호 복사">
        복사
      </button>
    </div>
  `).join('')
}
