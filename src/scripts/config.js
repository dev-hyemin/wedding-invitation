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
    datetime: '2026-05-16T14:00:00',
    dateDisplay: '2026년 5월 16일 토요일 오후 2시',
    venue: '그랜드볼룸 웨딩홀',
    hall: '3층 그랜드홀',
    address: '서울특별시 강남구 테헤란로 123',
    // 카카오맵 마커 좌표
    lat: 37.4981,
    lng: 127.0276,
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

  // Firebase Storage 사용 시 storagePath만 설정하면 됩니다.
  // Firebase 미설정 시 fallback 배열의 로컬 이미지가 사용됩니다.
  gallery: {
    // Firebase Storage 내 사진 폴더 경로
    storagePath: 'gallery',
    // Firebase 미설정 시 표시할 로컬 이미지 (fallback)
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

  // Firebase 설정 (https://firebase.google.com 에서 발급)
  firebase: {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId:             import.meta.env.VITE_FIREBASE_APP_ID || '',
  },

  // 카카오맵 API 키 (https://developers.kakao.com 에서 발급)
  kakaoMapKey: import.meta.env.VITE_KAKAO_MAP_KEY || '',

  // 교통 안내 텍스트
  transport: {
    car:     '강남대로에서 테헤란로 방면으로 직진, 우측 건물 지하주차장 이용',
    public:  '지하철 2호선 강남역 3번 출구에서 도보 5분\n버스: 146, 341, 3412번 강남역 정류장 하차',
    parking: '지하 1~3층 주차장 이용 가능 (2시간 무료)\n이후 30분당 2,000원',
  },
}
