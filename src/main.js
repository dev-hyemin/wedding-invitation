import './styles/main.css'

// 브라우저 스크롤 복원 비활성화 — 페이지 열 때 항상 맨 위에서 시작
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

import { initContent }                from './scripts/content.js'
import AOS from 'aos'
import { initAnimations/*, initPetals*/ } from './scripts/animations.js'
import { initHero }                   from './scripts/hero.js'
import { initMusic }                  from './scripts/music.js'
import { initCalendar }               from './scripts/calendar.js'
import { initCountdown }              from './scripts/countdown.js'
import { initGallery }                from './scripts/gallery.js'
import { initMap, initTransportTabs } from './scripts/map.js'
import { initAccount }                from './scripts/account.js'
import { initRsvp }                   from './scripts/rsvp.js'
import { initGuestbook }              from './scripts/guestbook.js'


// config.js 값을 DOM에 반영 (가장 먼저 실행)
initContent()

// 히어로 배경 이미지 (Supabase Storage)
initHero()

// 배경 음악
initMusic()

// 스크롤 애니메이션 초기화
initAnimations()

// 히어로 꽃잎 파티클 (off: 아래 주석 해제 시 활성화)
// initPetals(15)

// 캘린더
initCalendar()

// D-Day 카운트다운
initCountdown()

// 갤러리 슬라이더 + 라이트박스 (Firebase Storage 비동기 로드)
initGallery()

// 카카오맵 + 교통 탭
initMap()
initTransportTabs()

// 계좌번호 탭 + 복사
initAccount()

// RSVP 폼
initRsvp()

// 방명록 (Firebase)
initGuestbook()
