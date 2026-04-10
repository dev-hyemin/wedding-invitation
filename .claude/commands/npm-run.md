Run an npm script in this project with the correct Node.js version (20+).

## Usage
```
/npm-run <script>
```

**Examples:**
- `/npm-run dev` → 개발 서버 실행
- `/npm-run build` → 프로덕션 빌드
- `/npm-run preview` → 빌드 결과 미리보기

## What this does

This project requires **Node.js 20+** (Vite 8 requirement).
The system Node is v16, so nvm must be activated before running npm.

Run the following command:

```bash
source ~/.nvm/nvm.sh && nvm use 20 && npm run $ARGUMENTS
```

## Troubleshooting

| 증상 | 원인 | 해결 |
|---|---|---|
| `Vite requires Node.js 20.19+` | Node 버전 낮음 | `nvm use 20` 먼저 실행 |
| `Failed to resolve import "firebase/app"` | Firebase 미설치 | `npm install firebase` |
| `nvm: command not found` | nvm 미로드 | `source ~/.nvm/nvm.sh` 먼저 실행 |
