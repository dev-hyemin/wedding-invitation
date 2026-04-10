# 모바일 웨딩 청첩장 프로젝트

## 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | wedding-invitation |
| GitHub | https://github.com/dev-hyemin/wedding-invitation |
| GitHub Pages | https://dev-hyemin.github.io/wedding-invitation/ |
| 시작일 | 2026-04-11 |

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 빌드 도구 | Vite 8 |
| 언어 | Vanilla JS (ES Modules) |
| 스타일 | CSS (커스텀 프로퍼티 기반 디자인 시스템) |
| 슬라이더 | Swiper 12 |
| 스크롤 애니메이션 | AOS (Animate On Scroll) |
| 방명록 DB | Firebase Firestore |
| RSVP 폼 전송 | Formspree |
| 지도 | 카카오맵 JavaScript SDK |
| 축하 효과 | canvas-confetti |
| 배포 | GitHub Actions → GitHub Pages |

---

## 프로젝트 구조

```
wedding/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 자동 배포
├── src/
│   ├── main.js                 # 진입점 (모든 모듈 오케스트레이션)
│   ├── scripts/
│   │   ├── config.js           # 청첩장 데이터 중앙 설정 (이름/날짜/계좌 등)
│   │   ├── countdown.js        # D-Day 카운트다운
│   │   ├── gallery.js          # Swiper 갤러리 + 라이트박스
│   │   ├── map.js              # 카카오맵 + 교통 안내 탭
│   │   ├── account.js          # 계좌번호 탭 + 클립보드 복사
│   │   ├── rsvp.js             # RSVP 폼 (Formspree 연동)
│   │   ├── guestbook.js        # 방명록 (Firebase Firestore 연동)
│   │   ├── animations.js       # AOS 초기화 + 꽃잎 파티클
│   │   └── toast.js            # 토스트 알림 유틸리티
│   └── styles/
│       ├── main.css            # 전체 CSS import 진입점
│       ├── variables.css       # 디자인 토큰 (색상/폰트/간격)
│       ├── reset.css           # 브라우저 기본 스타일 초기화
│       ├── layout.css          # 공통 레이아웃, 버튼, 폼, 토스트
│       ├── animations.css      # 글로벌 키프레임 정의
│       └── components/
│           ├── hero.css
│           ├── invitation.css
│           ├── gallery.css
│           ├── ceremony.css
│           ├── map.css
│           ├── account.css
│           ├── rsvp.css
│           └── guestbook.css
├── index.html                  # 단일 페이지 (8개 섹션)
├── package.json
├── vite.config.js
├── .env.example                # 환경 변수 템플릿
└── .gitignore
```

---

## 섹션 구성

| # | 섹션 | 주요 기능 |
|---|---|---|
| 1 | 히어로 | 배경 이미지, 신랑신부 이름, D-Day 카운트다운, 꽃잎 파티클 |
| 2 | 초대 인사말 | 청첩장 본문, 양가 부모님 정보 |
| 3 | 갤러리 | Swiper 슬라이더, 라이트박스 |
| 4 | 예식 안내 | 일시/장소 카드, 카카오/네이버 길찾기 버튼 |
| 5 | 지도 | 카카오맵, 자가용/대중교통/주차 안내 탭 |
| 6 | 마음 전하기 | 신랑·신부측 계좌번호, 클립보드 복사 |
| 7 | RSVP | 참석 여부 폼, Formspree 전송, confetti 효과 |
| 8 | 방명록 | Firebase 실시간 CRUD, 비밀번호 삭제, 페이지네이션 |

---

## 환경 변수 설정

`.env.example`을 복사해 `.env` 파일 생성 후 값 입력:

```bash
cp .env.example .env
```

| 변수명 | 설명 | 발급처 |
|---|---|---|
| `VITE_KAKAO_MAP_KEY` | 카카오맵 JavaScript 키 | [developers.kakao.com](https://developers.kakao.com) |
| `VITE_FIREBASE_API_KEY` | Firebase 프로젝트 API 키 | [console.firebase.google.com](https://console.firebase.google.com) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth 도메인 | 동일 |
| `VITE_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID | 동일 |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage 버킷 | 동일 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase 메시징 ID | 동일 |
| `VITE_FIREBASE_APP_ID` | Firebase 앱 ID | 동일 |
| `VITE_FORMSPREE_ENDPOINT` | Formspree 폼 엔드포인트 | [formspree.io](https://formspree.io) |

GitHub Actions 배포 시에는 **Settings → Secrets and variables → Actions** 에 동일한 키 등록.

---

## 로컬 개발 환경 실행

> Node.js 20 이상 필요. nvm 사용 시 아래 참고.

```bash
# Node 버전 전환 (nvm 사용 시)
source ~/.nvm/nvm.sh
nvm use 20

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 후 GitHub Pages에 배포합니다.

**GitHub Pages 초기 설정 (최초 1회)**
1. 저장소 → **Settings** → **Pages**
2. Source: **GitHub Actions** 선택

---

## 콘텐츠 수정 방법

`src/scripts/config.js` 파일 하나만 수정하면 청첩장 전체 내용이 변경됩니다.

```js
// 신랑신부 정보, 예식 일시/장소, 계좌번호, 갤러리 이미지 등
export const CONFIG = { ... }
```

---

## 폰트 커스텀 방법

폰트 관련 파일은 두 곳입니다.

| 파일 | 역할 |
|---|---|
| `src/styles/reset.css` | `@font-face` 선언 (커스텀 폰트 로드) |
| `src/styles/variables.css` | 폰트 변수 정의 (실제 적용) |
| `index.html` | Google Fonts 링크 |

---

### 1. Google Fonts로 변경

**① `index.html`** — 기존 링크를 원하는 폰트로 교체

```html
<!-- 예: Playfair Display + Nanum Myeongjo -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Nanum+Myeongjo:wght@400;700&display=swap"
/>
```
> [fonts.google.com](https://fonts.google.com) 에서 폰트 선택 → **Get embed code** → `<link>` 태그 복사

**② `src/styles/variables.css`** — 변수에 폰트명 적용

```css
--font-serif: 'Nanum Myeongjo', serif;   /* 한글 제목/강조 */
--font-sans:  'Nanum Myeongjo', serif;   /* 한글 본문 */
--font-en:    'Playfair Display', serif; /* 영문 포인트 */
```

---

### 2. 커스텀 폰트 파일(@font-face)로 변경

현재 방식입니다. CDN URL 또는 로컬 파일 경로를 사용할 수 있습니다.

**`src/styles/reset.css`** 상단의 `@font-face` 수정:

```css
/* CDN URL 사용 */
@font-face {
  font-family: '폰트이름';
  src: url('https://cdn.example.com/font.woff2') format('woff2');
  font-weight: normal;
  font-display: swap;
}

/* 로컬 파일 사용 (src/assets/fonts/ 폴더에 파일 추가 후) */
@font-face {
  font-family: '폰트이름';
  src: url('/src/assets/fonts/font.woff2') format('woff2');
  font-weight: normal;
  font-display: swap;
}
```

**`src/styles/variables.css`** — 변수에 폰트명 적용:

```css
--font-en: '폰트이름', cursive;
```

> **무료 한국어 웹폰트 추천 사이트**
> - [눈누 (noonnu.cc)](https://noonnu.cc) — `@font-face` 코드 바로 복사 가능
> - [구름 폰트 (goomfonts.com)](https://www.goomfonts.com)
> - [Google Fonts 한국어](https://fonts.google.com/?subset=korean)

---

### 3. 폰트가 적용되는 위치

| 변수 | 적용 위치 |
|---|---|
| `--font-serif` | 히어로 이름, 초대 인사말, 모달 제목 등 강조 텍스트 |
| `--font-sans` | 본문, 버튼, 폼, 카드 등 일반 텍스트 |
| `--font-en` | `We are getting married`, 섹션 타이틀 영문(`Gallery`, `Ceremony` 등) |

---

## 트러블슈팅

### npm run dev 실행 시 에러

**증상:** `You are using Node.js 16.x. Vite requires Node.js 20.19+`

**원인:** Node.js 버전이 낮음 (Vite 8은 Node 20+ 필요)

**해결:**
```bash
source ~/.nvm/nvm.sh
nvm install 20   # 최초 1회만
nvm use 20
npm run dev
```

### Firebase 관련 에러

**증상:** `Failed to resolve import "firebase/app"`

**원인:** Firebase SDK 미설치

**해결:**
```bash
npm install firebase
```
