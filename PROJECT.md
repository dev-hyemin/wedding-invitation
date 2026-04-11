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
| 이미지 | Supabase Storage (히어로 + 갤러리) |
| 방명록 DB | Supabase Database (PostgreSQL) |
| RSVP 폼 전송 | Formspree |
| 지도 | 카카오맵 지도 퍼가기 (Roughmap) |
| 배포 | GitHub Actions → GitHub Pages |

---

## 프로젝트 구조

```
wedding/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages 자동 배포
├── src/
│   ├── main.js                     # 진입점 (모든 모듈 오케스트레이션)
│   ├── assets/
│   │   ├── audio/
│   │   │   └── bgm.mp3             # 배경 음악 파일 (직접 추가 필요)
│   │   └── images/
│   │       ├── hero-bg.jpg         # 히어로 배경 fallback 이미지
│   │       └── gallery/            # 갤러리 fallback 이미지
│   ├── scripts/
│   │   ├── config.js               # 청첩장 데이터 중앙 설정 (이름/날짜/계좌 등)
│   │   ├── theme.js                # CSS 변수 → JS 브릿지 (색상 단일 출처)
│   │   ├── particles.js            # 버튼 burst 파티클 유틸 (MIT © 2022 Evan Jin)
│   │   ├── animations.js           # AOS 초기화 + 하트 파티클
│   │   ├── hero.js                 # 히어로/배너 배경 이미지 (Supabase Storage)
│   │   ├── music.js                # 배경 음악 재생/정지
│   │   ├── calendar.js             # 캘린더 + 결혼식 날 하트 표시
│   │   ├── countdown.js            # D-n 카운트다운 (배너에 표시)
│   │   ├── gallery.js              # Swiper 갤러리 (Supabase Storage, 수동 스와이프)
│   │   ├── map.js                  # 카카오맵 roughmap + 교통 안내 탭
│   │   ├── account.js              # 계좌번호 탭 + 클립보드 복사
│   │   ├── rsvp.js                 # RSVP 폼 (Formspree 연동)
│   │   ├── guestbook.js            # 방명록 (Supabase DB CRUD)
│   │   └── toast.js                # 토스트 알림 유틸리티
│   └── styles/
│       ├── main.css                # 전체 CSS import 진입점
│       ├── variables.css           # 디자인 토큰 (색상/폰트/간격) — 단일 출처
│       ├── reset.css               # 브라우저 기본 스타일 초기화
│       ├── layout.css              # 공통 레이아웃, 버튼, 폼, 토스트, 음악 버튼
│       ├── animations.css          # 글로벌 키프레임 정의
│       └── components/
│           ├── hero.css
│           ├── invitation.css
│           ├── calendar.css
│           ├── dday.css            # D-Day 사진 배너
│           ├── gallery.css
│           ├── ceremony.css
│           ├── map.css
│           ├── account.css
│           ├── rsvp.css
│           └── guestbook.css
├── index.html                      # 단일 페이지
├── package.json
├── vite.config.js
├── .env.example                    # 환경 변수 템플릿
└── .gitignore
```

---

## 섹션 구성

| # | 섹션 | 주요 기능 |
|---|---|---|
| 1 | 히어로 | Our Wedding 인트로 애니메이션, 배경 이미지(Supabase), 신랑신부 이름, 하트 파티클 |
| 2 | 초대 인사말 | 뿌리/가지 문구, 마태복음 19:6 인용, 양가 부모님 정보 |
| 3 | 갤러리 | Swiper 슬라이더, 수동 스와이프, 무한 루프 (Supabase Storage) |
| 4 | 예식 안내 | 날짜·장소 텍스트 + 달력 통합 (카드 없음) |
| — | D-Day 배너 | 사진 위 Wedding Day / D-n / 날짜 표시 |
| 5 | 오시는 길 | 장소명·홀·주소, 카카오맵 roughmap, 길찾기 버튼, 교통 안내 탭 |
| 6 | 마음 전하실 곳 | 신랑·신부측 계좌번호, 클립보드 복사 |
| 7 | RSVP | 참석 여부 폼, Formspree 전송, burst 파티클 효과 |
| 8 | 방명록 | Supabase DB CRUD, 비밀번호 삭제, 10개씩 페이지네이션 |

---

## 환경 변수 설정

`.env.example`을 복사해 `.env` 파일 생성 후 값 입력:

```bash
cp .env.example .env
```

| 변수명 | 설명 | 발급처 |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | [supabase.com](https://supabase.com) → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public 키 | 동일 |
| `VITE_FORMSPREE_ENDPOINT` | Formspree 폼 엔드포인트 | [formspree.io](https://formspree.io) |

GitHub Actions 배포 시에는 **Settings → Secrets and variables → Actions** 에 동일한 키 등록.

---

## Supabase 초기 설정

### 방명록 테이블 생성
Supabase 대시보드 → **SQL Editor** 에서 실행:

```sql
create table guestbook (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  message      text not null,
  password_hash text not null,
  created_at   timestamptz default now()
);

alter table guestbook enable row level security;
create policy "read all"   on guestbook for select using (true);
create policy "insert all" on guestbook for insert with check (true);
create policy "delete own" on guestbook for delete using (true);
```

### Storage 버킷 생성

| 버킷명 | 용도 | 설정 |
|---|---|---|
| `hero` | 히어로 배경 이미지 + D-Day 배너 | Public |
| `gallery` | 갤러리 사진 | Public, SELECT 정책 필요 |

> 갤러리 버킷은 파일 목록 조회(`list()`)를 위해 Storage → Policies에서 SELECT 권한을 public으로 열어야 합니다.
> 히어로/배너 이미지는 동일한 파일(`hero-bg.jpg`)을 사용합니다.

---

## 배경 음악 설정

`src/assets/audio/bgm.mp3` 경로에 음악 파일을 넣으면 자동으로 적용됩니다.

- 우측 하단 고정 버튼으로 재생/정지 가능
- 자동재생은 브라우저 정책상 불가 → 사용자가 직접 재생

---

## 카카오맵 설정

카카오맵은 **지도 퍼가기(Roughmap)** 방식 사용 (API 키/도메인 등록 불필요).

### 값 발급
1. [map.kakao.com](https://map.kakao.com) → 웨딩홀 검색
2. 장소 클릭 → **지도 퍼가기** 클릭
3. 생성 코드에서 `timestamp`, `key` 값 복사

### 적용 위치
- `src/scripts/config.js` → `kakaomap.timestamp`, `kakaomap.key`
- `index.html` → roughmap 스크립트 블록의 `timestamp`, `key`

> 자세한 내용은 `/kakao-map` 스킬 참고

---

## 색상 커스텀 방법

모든 색상은 `src/styles/variables.css` 한 곳에서 관리됩니다.

| 변수 | 설명 |
|---|---|
| `--color-primary` | 메인 컬러 (버튼, 강조) |
| `--color-primary-dark` | 호버/포커스용 진한 메인 컬러 |
| `--color-secondary` | 버튼 배경 |
| `--color-accent` | 연한 포인트 색상 |
| `--color-bg` / `--color-bg-alt` | 섹션 배경 (현재 모두 흰색) |
| `--color-border` | 테두리 |
| `--color-focus-ring` | 포커스 링 (rgba) |
| `--particle-1` ~ `--particle-3` | 하트 파티클 색상 |

JS에서 색상이 필요한 경우 `src/scripts/theme.js`를 통해 CSS 변수를 읽어 사용합니다 (burst 파티클 등).

---

## 폰트 커스텀 방법

| 파일 | 역할 |
|---|---|
| `src/styles/reset.css` | `@font-face` 선언 (커스텀 폰트 로드) |
| `src/styles/variables.css` | 폰트 변수 정의 |
| `index.html` | Google Fonts `<link>` 태그 |

| 변수 | 적용 위치 |
|---|---|
| `--font-serif` | 초대 인사말 등 강조 텍스트 |
| `--font-sans` | 본문, 버튼, 폼 등 일반 텍스트 |
| `--font-en` | 섹션 타이틀 영문 등 |
| `--font-intro` | 히어로 "Our Wedding" 인트로 텍스트 전용 |

> 무료 한국어 폰트: [눈누(noonnu.cc)](https://noonnu.cc) · [Google Fonts 한국어](https://fonts.google.com/?subset=korean)

---

## 로컬 개발 환경 실행

> Node.js 20 이상 필요. nvm 사용 시 아래 참고.

```bash
# Node 버전 전환 (nvm 사용 시)
source ~/.nvm/nvm.sh
nvm use 20

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
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
export const CONFIG = {
  groom:   { name, englishName, father, mother, phone },
  bride:   { name, englishName, father, mother, phone },
  wedding: { datetime, dateDisplay, venue, hall, address, lat, lng },
  accounts: { groom: [...], bride: [...] },
  hero:     { storageBucket, storagePath, fallback },
  gallery:  { storageBucket, storageFolder, fallback },
  kakaomap: { timestamp, key },
  transport: { car, public, parking },
}
```

---

## 트러블슈팅

### npm run dev 실행 시 Node 버전 오류

**증상:** `You are using Node.js 16.x. Vite requires Node.js 20.19+`

**해결:**
```bash
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
npm run dev
```

### 갤러리 이미지가 안 불러와질 때

Supabase Storage → gallery 버킷 → Policies에서 `objects` 테이블의 SELECT 권한을 public으로 열어야 합니다. 히어로/배너 이미지는 `getPublicUrl()`을 사용하므로 별도 정책 불필요.
