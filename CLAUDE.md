# 모바일 웨딩 청첩장 — CLAUDE.md

## 프로젝트 개요

Vite + Vanilla JS 기반 모바일 웨딩 청첩장. GitHub Actions로 GitHub Pages에 배포되며, 커스텀 도메인 `blooming-days.my` 사용.

## 기술 스택

- **빌드**: Vite 8, ES Modules
- **애니메이션**: AOS (Animate On Scroll)
- **스토리지**: Supabase Storage (히어로·카운트다운·갤러리 이미지)
- **DB**: Supabase (rsvp 테이블, guestbook 테이블)
- **배포**: GitHub Pages (`.github/workflows/deploy.yml`)
- **도메인**: `blooming-days.my` (CNAME)

## 환경 변수 (.env)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_FORMSPREE_ENDPOINT=   # 미사용 (Supabase로 대체됨)
```

GitHub Actions secrets에도 동일하게 등록 필요.

## 핵심 파일 구조

```
src/
  scripts/
    config.js       ← 단일 설정 소스 (이름·날짜·장소·계좌·교통 등 모두 여기서 관리)
    content.js      ← config.js 값을 DOM에 반영 (main.js에서 가장 먼저 호출)
    gallery.js      ← Supabase Storage 이미지 로드, 그리드, 라이트박스, 스와이프
    rsvp.js         ← 참석 여부 폼 → Supabase rsvp 테이블 INSERT/UPDATE
    guestbook.js    ← 방명록 → Supabase guestbook 테이블
    map.js          ← 카카오 roughmap, 교통 탭 (주차·버스·지하철)
    music.js        ← 배경 음악 자동재생 (첫 인터랙션 시 시작)
    particles.js    ← 버튼 클릭 시 ♥ 파티클 애니메이션
    animations.js   ← AOS 초기화
    hero.js         ← 히어로 배경 이미지 Supabase 로드
    countdown.js    ← D-Day 카운트다운 배너 이미지 로드
    account.js      ← 계좌번호 탭·복사
    calendar.js     ← 예식일 캘린더
  styles/
    variables.css   ← CSS 변수 (색상·폰트·간격 등)
    layout.css      ← 공통 버튼(.btn), 폼 스타일
    components/     ← 섹션별 CSS
  assets/
    audio/bgm.mp3   ← 배경 음악
    images/         ← fallback 이미지 (Supabase 미설정 시 사용)
```

## 설정 변경 방법

**모든 텍스트 콘텐츠는 `src/scripts/config.js` 한 곳에서만 수정.**

- 신랑·신부 정보: `groom`, `bride`
- 예식 정보: `wedding` (datetime은 반드시 ISO 형식)
- 계좌번호: `accounts.groom`, `accounts.bride`
- 교통 안내: `transport.bus`, `transport.subway`, `transport.car`
- 카카오맵: `kakaomap.timestamp`, `kakaomap.key`
- 갤러리: `gallery.storageBucket`, `gallery.storageFolder`

## Supabase 테이블

### rsvp
```sql
create table rsvp (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  side       text,           -- 'groom' | 'bride'
  attend     text not null,  -- 'yes' | 'no'
  headcount  integer,
  meal       text,           -- 'yes' | 'no'
  created_at timestamptz default now()
);
-- RLS 비활성화, anon에게 insert·update 권한만 부여
grant usage on schema public to anon;
grant insert, update on table rsvp to anon;
```

### guestbook
Supabase 연동 (구체적 스키마는 guestbook.js 참고)

## 주요 구현 패턴

### 갤러리 라이트박스 스와이프
- `touchstart`: 인접 이미지(prevEl·nextEl) 즉시 DOM에 추가
- `touchmove`: 세 이미지를 `translateX`로 함께 이동 (passive: false)
- `touchend`: threshold(60px) 초과 시 슬라이드 완성, 미만 시 복귀
- `wasDragged` 플래그로 스와이프 후 배경 클릭 오동작 방지
- `SLIDE_GAP = '16px'` 이미지 간 간격
- `_preloadCache` 배열로 전체 이미지 프리로드 (GC 방지)

### 배경 음악 자동재생
브라우저 autoplay 정책으로 인해 `audio.play()` 실패 시 첫 터치/클릭 이벤트에서 재생 시작.

### AOS 주의사항
인트로 애니메이션 동안 `overflow: hidden` 상태에서 AOS가 위치를 잘못 계산함.
`main.js`에서 2600ms 후 overflow 해제와 동시에 `AOS.refresh()` 호출.

### RSVP 수정 흐름
1. 최초 제출 → Supabase INSERT → `rsvp_id`(UUID)를 localStorage에 저장
2. "참석 여부 변경" 클릭 → 이전 답변을 localStorage에서 읽어 폼 사전 입력
3. 재제출 → `rsvp_id` 기준으로 Supabase UPDATE

## 배포

```bash
npm run build   # dist/ 생성
git push origin main  # GitHub Actions 자동 배포
```

`vite.config.js`의 `base: '/'` — 커스텀 도메인 사용 시 유지 필요.
저장소 서브패스 배포 시 `/wedding-invitation/` 등으로 변경.

## OG 태그

크롤러는 JS를 실행하지 않으므로 `index.html`에 하드코딩.
이미지는 Supabase Storage의 `gallery/hero/og.jpg`.
