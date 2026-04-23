# 모바일 웨딩 청첩장 — CLAUDE.md

## 개요
Vite 8 + Vanilla JS. GitHub Pages 배포, 커스텀 도메인 `blooming-days.my`.

## 환경 변수 (.env + GitHub Actions secrets)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## 파일 구조
```
public/images/          ← 히어로·카운트다운·갤러리·OG 이미지
src/scripts/config.js   ← 단일 설정 소스 (모든 텍스트·이미지 경로 여기서만 수정)
src/styles/variables.css ← CSS 변수 (색상·폰트)
src/assets/audio/bgm.mp3
```

## 설정 변경
- 인물·예식·계좌·교통: `config.js`
- 히어로 이미지: `config.js → hero.src`
- 갤러리 이미지 추가: `public/images/gallery/`에 파일 복사 후 `config.js → gallery.images` 배열에 추가
- 히어로 폰트 교체: `variables.css → --font-hero` (사용 가능: `PrettyMinkyung`, `LeftHandedPeopleAreBeautifulToo`, `Masitneun`)

## Supabase 테이블

### rsvp (RLS 비활성화)
```sql
create table rsvp (
  id uuid primary key default gen_random_uuid(),
  name text not null, side text,
  attend text not null, headcount integer, meal text,
  created_at timestamptz default now()
);
grant usage on schema public to anon;
grant insert, update on table rsvp to anon;
```

### guestbook
`guestbook.js` 참고

## 주의사항

**AOS**: 인트로 중 `overflow:hidden` 상태에서 위치 오계산 → `main.js`에서 2600ms 후 `AOS.refresh()` 호출.

**배경 음악**: 브라우저 autoplay 차단 시 첫 터치/클릭에서 재생 시작.

**RSVP**: 제출 시 Supabase INSERT + UUID를 localStorage 저장 → 재제출 시 UPDATE.

**갤러리**: 페이지 로드 시 전체 이미지 프리로드 → 더보기 클릭 시 네트워크 재요청 없음.

**방명록**: 섹션에 3개 미리보기, 전체보기 클릭 시 모달로 전체 표시.

**Supabase Free**: 7일 미활성 시 자동 일시정지 → 청첩장 발송 전 대시보드 접속 필요.

## 배포
```bash
git push origin main  # GitHub Actions 자동 빌드·배포
```

## OG 태그
크롤러는 JS 미실행 → `index.html`에 하드코딩. 이미지: `public/images/og.jpg`
