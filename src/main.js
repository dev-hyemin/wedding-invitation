import './styles/main.css'

import { initAnimations, initPetals } from './scripts/animations.js'
import { initHero }                   from './scripts/hero.js'
import { initMusic }                  from './scripts/music.js'
import { initCalendar }               from './scripts/calendar.js'
import { initCountdown }              from './scripts/countdown.js'
import { initGallery }                from './scripts/gallery.js'
import { initMap, initTransportTabs } from './scripts/map.js'
import { initAccount }                from './scripts/account.js'
import { initRsvp }                   from './scripts/rsvp.js'
import { initGuestbook }              from './scripts/guestbook.js'

// 히어로 배경 이미지 (Supabase Storage)
initHero()

// 배경 음악
initMusic()

// 스크롤 애니메이션 초기화
initAnimations()

// 히어로 꽃잎 파티클
initPetals(15)

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
