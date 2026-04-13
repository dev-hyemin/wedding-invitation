/**
 * 청첩장 설정 파일
 * 이 파일의 값만 수정하면 청첩장 내용이 모두 변경됩니다.
 */
export const CONFIG = {
  groom: {
    name: '김민준',
    englishName: 'Kim Min-jun',
    father: '김부친',
    mother: '김모친',
    phone: '010-1234-5678',
  },

  bride: {
    name: '이서연',
    englishName: 'Lee Seo-yeon',
    father: '이부친',
    mother: '이모친',
    phone: '010-9876-5432',
  },

  wedding: {
    // 반드시 ISO 형식으로 기입하세요
    datetime: '2026-06-20T13:00:00',
    dateDisplay: '2026년 6월 20일 토요일 오후 2시',
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
      { bank: '국민은행', name: '김민준 (신랑)', number: '123-456-78901234' },
      { bank: '신한은행', name: '김부친 (신랑 부)', number: '110-234-567890' },
    ],
    bride: [
      { bank: '하나은행', name: '이서연 (신부)', number: '234-5678-90123' },
      { bank: '우리은행', name: '이부친 (신부 부)', number: '1002-345-678901' },
    ],
  },

  // 히어로 배경 이미지 (Supabase Storage)
  // storageBucket: 버킷 이름, storagePath: 버킷 내 파일 경로
  // Supabase 미설정 시 fallback 경로의 로컬 이미지가 사용됩니다.
  hero: {
    storageBucket: 'gallery',
    storagePath:   'hero/hero-bg.jpeg',
    fallback:      '/src/assets/images/hero-bg.jpg',
  },

  countdown: {
    storageBucket: 'gallery',
    storagePath:   'hero/countdown-bg.jpeg',
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
    car:     '강남대로에서 테헤란로 방면으로 직진, 우측 건물 지하주차장 이용',
    parking: '지하 1~3층 주차장 이용 가능 (2시간 무료)\n이후 30분당 2,000원',
  },
}
