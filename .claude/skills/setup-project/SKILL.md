---
name: setup-project
description: Algo-Race 5 프로젝트의 초기 디렉토리 구조와 기본 설정 파일들(requirements.txt, package.json, vite.config.js 등)을 생성하는 스킬
---

# Setup Project Skill

## 스킬 설명
Algo-Race 5 프로젝트의 초기 디렉토리 구조와 기본 설정 파일들을 생성하는 스킬입니다.

## 사용법
```
/setup-project
```

## 이 스킬이 수행하는 작업

### 1. 프로젝트 구조 생성
**참고 문서:** `.claude/docs/new_project_description.md`의 16-38번 줄 (폴더 구조)

**수행 내용:**
```
algo-race-5/
├── backend/
│   ├── main.py
│   ├── algorithms.py
│   ├── models.py
│   └── requirements.txt
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── RaceTrack.jsx
    │   │   ├── SortChart.jsx
    │   │   └── WinnerBadge.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

### 2. 백엔드 requirements.txt 생성
**이유:** FastAPI 기반 백엔드에 필요한 의존성 정의

**작성된 코드:**
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
python-multipart==0.0.6
```

**근거:**
- `.claude/docs/new_project_description.md` 22번 줄: "의존성 목록 (fastapi, uvicorn 등)"
- `CLAUDE.md` 19번 줄: "pip install -r requirements.txt"

### 3. 프론트엔드 package.json 생성
**이유:** React + Vite + TailwindCSS 기반 프론트엔드 설정

**작성된 코드:**
```json
{
  "name": "algo-race-5-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.12"
  }
}
```

**근거:**
- `.claude/docs/new_project_description.md` 12번 줄: "Frontend: React (Vite), TailwindCSS"
- `.claude/docs/new_project_description.md` 14번 줄: "server: npm으로 실행"

### 4. Vite 설정 파일 생성
**이유:** React 프로젝트 빌드 도구 설정

**작성된 코드:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

**근거:**
- `CLAUDE.md` 29번 줄: "개발 서버 (포트 5173)"
- `.claude/docs/new_project_description.md` 54번 줄: "POST /api/race" - API 프록시 필요

### 5. TailwindCSS 설정 파일 생성
**이유:** 사이버펑크 테마 구현을 위한 TailwindCSS 설정

**작성된 코드:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'neon-pink': '#ff00ff',
        'neon-green': '#00ff00',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
```

**근거:**
- `.claude/docs/new_project_description.md` 8번 줄: "Cyberpunk Theme: Dark Mode 기반의 네온 컬러(Neon Colors) 디자인"
- `CLAUDE.md` 104-108번 줄: 네온 컬러 정의 (cyan-400, rose-500, emerald-400)

### 6. index.html 생성
**이유:** React 앱의 진입점

**작성된 코드:**
```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Algo Race 5 - 정렬 알고리즘 경주</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 7. PostCSS 설정 파일 생성
**이유:** TailwindCSS 처리를 위한 PostCSS 설정

**작성된 코드:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## ⚠️ 작업 완료 후 자동 Context 저장 (필수!)

이 스킬 완료 후 **반드시** 다음 명령을 실행하여 작업 내용을 기록합니다:

```
/agent_context_save setup
```

**저장 내용:**
- 수행한 작업 목록 및 작업 흐름
- 의사결정 과정과 이유 (왜 그렇게 구현했는지)
- 참고한 문서와 줄 번호
- 발생한 에러와 해결 방법
- 다음 작업을 위한 힌트

**저장 위치:** `.claude/docs/process_setup_context_save.md`

**중요:** Context 저장은 다음 세션이나 다른 개발자가 작업 내용을 이해하는 데 필수적입니다. 반드시 실행하세요!

---

## 작업 완료 후 확인사항
- [ ] backend/ 디렉토리와 필수 파일들이 생성되었는지 확인
- [ ] frontend/ 디렉토리와 필수 파일들이 생성되었는지 확인
- [ ] `npm install` 실행 가능 여부 확인
- [ ] 프로젝트 구조가 `CLAUDE.md`와 일치하는지 확인

## 다음 단계
1. `/build-backend` - 백엔드 로직 구현
2. `/build-frontend` - 프론트엔드 컴포넌트 구현

## 관련 문서
- `.claude/docs/process_setup.md` - 상세 작업 과정
- `.claude/docs/new_project_description.md` - 프로젝트 명세
- `CLAUDE.md` - 프로젝트 가이드
