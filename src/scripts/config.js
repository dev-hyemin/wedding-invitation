/**
 * 청첩장 설정 파일
 * 이 파일의 값만 수정하면 청첩장 내용이 모두 변경됩니다.
 */
export const CONFIG = {
  groom: {
    name: '김덕림',
    englishName: 'Kim Deok-rim',
    father: '김대중',
    mother: '강지행',
    phone: '010-1234-5678',
  },

  bride: {
    name: '이진주',
    englishName: 'Lee Jin-joo',
    father: '이광호',
    mother: '한지은',
    phone: '010-9876-5432',
  },

  wedding: {
    // 반드시 ISO 형식으로 기입하세요
    datetime: '2026-06-20T12:30:00',
    dateDisplay: '2026년 6월 20일 토요일 오후 12시 30분',
    // D-Day 배너에 표시되는 날짜 (날짜만)
    dateShort: '2026년 6월 20일',
    venue: '구리교회',
    hall: '3층 대강당',
    address: '경기 구리시 경춘로276번길 11-9',
    // 지도 좌표 (구글 지도에서 확인)
    lat: 37.6027134,
    lng: 127.1463076,
  },

  accounts: {
    groom: [
      { bank: '국민은행',  role: '신랑',   name: '김덕림', number: '640401-04-362945' },
      { bank: '농협은행',  role: '아버지', name: '김대중', number: '717120-56-008617' },
      { bank: '농협은행',  role: '어머니', name: '강지행', number: '721082-52-125076' },
    ],
    bride: [
      { bank: '카카오뱅크', role: '신부',   name: '이진주', number: '3333-07-9175153' },
      { bank: '우리은행',  role: '아버지', name: '이광호', number: '1002-156-133983' },
      { bank: '국민은행',  role: '어머니', name: '한지은', number: '058102-04-227527' },
    ],
  },

  // 히어로 배경 이미지 (Supabase Storage)
  // storageBucket: 버킷 이름, storagePath: 버킷 내 파일 경로
  // Supabase 미설정 시 fallback 경로의 로컬 이미지가 사용됩니다.
  hero: {
    storageBucket: 'gallery',
    storagePath:   'hero/hero.jpeg',
    fallback:      '/src/assets/images/hero-bg.jpg',
  },

  countdown: {
    storageBucket: 'gallery',
    storagePath:   'hero/countdown.jpeg',
    fallback:      '/src/assets/images/countdown-bg.jpg',
  },

  // Supabase Storage 사용 시 bucket 이름을 설정하면 됩니다.
  // Supabase 미설정 시 fallback 배열의 로컬 이미지가 사용됩니다.
  gallery: {
    // Supabase Storage 버킷 이름
    storageBucket: 'gallery',
    // 버킷 내 폴더 경로 (루트라면 빈 문자열)
    storageFolder: '',
    // Supabase 미설정 시 표시할 로컬 이미지 (fallback)
    fallback: [
      { src: '/src/assets/images/gallery/gallery-01.jpg', alt: '커플 사진 1' },
      { src: '/src/assets/images/gallery/gallery-02.jpg', alt: '커플 사진 2' },
      { src: '/src/assets/images/gallery/gallery-03.jpg', alt: '커플 사진 3' },
    ],
  },

  // Formspree 엔드포인트 (https://formspree.io 에서 발급)
  rsvp: {
    formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || '',
  },

  // Supabase 설정 (https://supabase.com 에서 발급)
  supabase: {
    url:     import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // 카카오맵 지도 퍼가기 (map.kakao.com → 장소 검색 → 지도 퍼가기)
  kakaomap: {
    timestamp: '1775918608921',
    key:       '2a4a94ngyaaq',
  },

  // 교통 안내 텍스트
  transport: {
    bus:     '롯데백화점 하차\n일반버스: 1-4, 10-5, 165, 166-1, 167-1, 23, 30, 65, 65-1, 9, 93, 95, 97번\n직행버스: 1115-6, 1330-2, 1330-4, 8409, 8005번',
    subway:  '지하철 8호선, 경의중앙선\n구리역 하차 → 롯데백화점 출구 → 길 건너편 (총 2분 소요)',
    car:     '미정',
  },
}
