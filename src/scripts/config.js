/**
 * 청첩장 설정 파일
 * 이 파일의 값만 수정하면 청첩장 내용이 모두 변경됩니다.
 */
export const CONFIG = {
  groom: {
    name: '임현섭',
    englishName: 'Lim Hyun-seop',
    father: '임경현',
    mother: '한미자',
    phone: '010-7919-6905',
  },

  bride: {
    name: '이수진',
    englishName: 'Lee Su-jin',
    father: '이황연',
    mother: '김혜경',
    phone: '010-9119-1318',
  },

  wedding: {
    // 반드시 ISO 형식으로 기입하세요
    datetime: '2026-10-24T13:00:00',
    dateDisplay: '2026년 10월 24일 토요일 오후 1시',
    // D-Day 배너에 표시되는 날짜 (날짜만)
    dateShort: '2026년 10월 24일',
    venue: '서울중랑교회',
    hall: '12층 대강당',
    address: '주소 입력 필요',
    // 지도 좌표 (구글 지도에서 확인)
    lat: 37.6027134,
    lng: 127.1463076,
  },

  accounts: {
    groom: [
      { bank: '국민은행', role: '신랑',   name: '임현섭', number: '793302-01-289362' },
      { bank: '신한은행', role: '아버지', name: '임경현', number: '110-050-563719' },
      { bank: '신한은행', role: '어머니', name: '임경현', number: '110-050-563719' },
    ],
    bride: [
      { bank: '우리은행', role: '신부',   name: '이수진', number: '1002-152-992836' },
      { bank: '신한은행', role: '아버지', name: '이황연', number: '110-413-446091' },
      { bank: '우리은행', role: '어머니', name: '김혜경', number: '071-442372-02-001' },
    ],
  },

  // 히어로 배경 이미지 경로 (public/ 기준)
  hero: {
    src: '/hero.jpeg',
  },

  countdown: {
    src: '/countdown.jpeg',
  },

  // 갤러리 이미지 목록 (public/images/gallery/ 에 파일 추가 후 여기에 등록)
  gallery: {
    images: [],
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
    car:     '교회 주차장이 협소하여 친인척 위주로 운영되오니 아래 공영주차장을 이용해 주세요.\n\n- [수택동 528번지] 공영주차장\n  북단: 제1공영노외주차장 / 남단: 제4·5공영노외주차장\n\n- [수택동 산 2-4] 검배근린공원공영주차장\n  ※ 검배근린공원공영주차장 이용 시 셔틀버스 운행',
  },
}
