# 카카오맵 연동 가이드

이 프로젝트에서 카카오맵을 연동할 때 겪은 시행착오와 최종 해결책입니다.

---

## 시행착오 요약

### ❌ 방법 1: Kakao Maps JavaScript SDK (환경변수 방식)

```js
// index.html 인라인 <script>에서 환경변수 사용 → 동작 안 함
const key = import.meta.env?.VITE_KAKAO_MAP_KEY || '';
```

**실패 원인:**
- `import.meta.env`는 Vite가 번들링하는 JS 파일에서만 치환됨
- index.html의 일반 `<script>` 태그(type="module" 아닌 것)에서는 치환되지 않아 키가 빈 문자열로 전달됨

**추가 시도:** SDK 로드를 map.js로 이전했으나, Kakao Developers에서 도메인 등록 문제 지속:
- `http://localhost` → 포트 포함 `http://localhost:5173` 으로 등록해야 함
- `https://dev-hyemin.github.io` 등록 후에도 지도 미출력

---

### ❌ 방법 2: roughmap 동적 로드 (JS에서 script 태그 삽입)

```js
const loaderScript = document.createElement('script')
loaderScript.src = 'https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js'
loaderScript.onload = () => {
  new daum.roughmap.Lander({ timestamp, key }).render()
}
document.head.appendChild(loaderScript)
```

**실패 원인:**
- `roughmapLoader.js`가 내부적으로 `document.write()`를 사용
- 비동기로 로드된 외부 스크립트에서 `document.write()` 호출 불가
- 에러: `Failed to execute 'write' on 'Document': It isn't possible to write into a document from an asynchronously-loaded external script`

---

## ✅ 최종 해결: roughmap 정적 삽입

**API 키 등록, 도메인 설정 없이 동작.**

### 1단계: 지도 퍼가기 코드 발급

1. [map.kakao.com](https://map.kakao.com) 접속
2. 원하는 장소 검색 후 클릭
3. **지도 퍼가기** 버튼 클릭
4. 생성된 코드에서 `timestamp`와 `key` 값 복사

### 2단계: index.html에 정적 삽입

```html
<div id="map-container" class="map__container">
  <div id="daumRoughmapContainer{timestamp}" class="root_daum_roughmap root_daum_roughmap_landing"></div>
  <script class="daum_roughmap_loader_script" src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js"></script>
  <script>new daum.roughmap.Lander({"timestamp":"{timestamp}","key":"{key}"}).render();</script>
</div>
```

> `roughmapLoader.js`는 반드시 HTML에 정적으로 삽입해야 함. JS에서 동적으로 `createElement('script')` 하면 `document.write()` 오류 발생.

### 3단계: 지도 아래 장소 정보 패널 숨김 (map.css)

roughmap은 기본적으로 지도 아래에 장소명/주소/전화번호 패널을 함께 렌더링함.

```css
.map__container {
  overflow: hidden;
}

/* roughmap 하단 장소 정보 패널 숨김 */
.root_daum_roughmap .wrap_place_info,
.root_daum_roughmap .link_roughmap,
.root_daum_roughmap .info_place { display: none !important; }

/* roughmap 지도 영역을 컨테이너 전체로 확장 */
.root_daum_roughmap,
.root_daum_roughmap .wrap_map,
.root_daum_roughmap .map_wrap { width: 100% !important; height: 100% !important; }
```

### 4단계: 웨딩홀 변경 시

`config.js`의 `kakaomap` 항목과 `index.html`의 roughmap 코드를 함께 교체:

```js
// config.js
kakaomap: {
  timestamp: '새로운_timestamp',
  key:       '새로운_key',
},
```

```html
<!-- index.html -->
<div id="daumRoughmapContainer{새로운_timestamp}" ...></div>
<script>new daum.roughmap.Lander({"timestamp":"{새로운_timestamp}","key":"{새로운_key}"}).render();</script>
```
