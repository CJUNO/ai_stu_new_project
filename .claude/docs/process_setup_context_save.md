# Setup Agent Context Save - 2025-02-10

## 작업 개요
- **날짜:** 2025-02-10
- **에이전트:** setup
- **사용자 요청:** "프로젝트 초기 설정 (디렉토리 구조 및 기본 설정 파일 생성)"
- **작업 상태:** ✅ 완료

## 작업 흐름

```
1. 사용자 요청 분석 (프로젝트 초기 설정)
   ↓
2. 백엔드 디렉토리 및 설정 파일 생성
   - requirements.txt (Python 의존성)
   - 빈 Python 파일들 (main.py, algorithms.py, models.py)
   ↓
3. 프론트엔드 디렉토리 및 설정 파일 생성
   - package.json (npm 설정)
   - vite.config.js (빌드 도구 설정)
   - tailwind.config.js (CSS 프레임워크 설정)
   - postcss.config.js (CSS 후처리 설정)
   - index.html (HTML 진입점)
   - src/index.css (전역 스타일)
   - 빈 React 파일들 (main.jsx, App.jsx, 컴포넌트들)
   ↓
4. Git 설정 파일 생성
   - .gitignore
   ↓
5. 작업 완료 확인
```

## 사용한 도구

### Write 도구: 15회
1. `backend/requirements.txt` - Python 의존성 정의
2. `backend/main.py` - 빈 파일 생성
3. `backend/algorithms.py` - 빈 파일 생성
4. `backend/models.py` - 빈 파일 생성
5. `frontend/package.json` - npm 패키지 설정
6. `frontend/vite.config.js` - Vite 설정
7. `frontend/tailwind.config.js` - TailwindCSS 설정
8. `frontend/postcss.config.js` - PostCSS 설정
9. `frontend/index.html` - HTML 진입점
10. `frontend/src/index.css` - 전역 CSS
11. `frontend/src/main.jsx` - 빈 파일 생성
12. `frontend/src/App.jsx` - 빈 파일 생성
13. `frontend/src/components/RaceTrack.jsx` - 빈 파일 생성
14. `frontend/src/components/SortChart.jsx` - 빈 파일 생성
15. `frontend/src/components/WinnerBadge.jsx` - 빈 파일 생성
16. `.gitignore` - Git 제외 파일

## 파일 작업 내역

### 1. backend/requirements.txt
**작업 유형:** 생성

**변경 이유:**
FastAPI 기반 백엔드에 필요한 Python 의존성을 정의하기 위해

**변경 내용:**
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
python-multipart==0.0.6
```

**참고한 정보:**
- `.claude/docs/new_project_description.md`:22번 줄 (의존성 목록)
- `CLAUDE.md`:19번 줄 (pip install 명령)

**의사결정:**
- FastAPI 0.109.0: 안정적인 최신 버전
- Uvicorn with standard: 성능 최적화를 위한 표준 의존성 포함
- Pydantic 2.5.3: 데이터 검증 및 스키마 정의

---

### 2. frontend/package.json
**작업 유형:** 생성

**변경 이유:**
React + Vite + TailwindCSS 기반 프론트엔드 환경 설정

**변경 내용:**
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

**참고한 정보:**
- `.claude/docs/new_project_description.md`:12번 줄 (프론트엔드 기술 스택)
- `.claude/docs/new_project_description.md`:14번 줄 (npm 실행 방식)

**의사결정:**
- React 18.2.0: 최신 안정 버전
- Vite 5.0.12: 빠른 개발 서버 및 빌드
- TailwindCSS 3.4.1: 유틸리티 CSS 프레임워크

---

### 3. frontend/vite.config.js
**작업 유형:** 생성

**변경 이유:**
Vite 빌드 도구 설정 및 API 프록시 설정

**변경 내용:**
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

**참고한 정보:**
- `CLAUDE.md`:29번 줄 (개발 서버 포트 5173)
- `.claude/docs/new_project_description.md`:54번 줄 (POST /api/race - API 프록시 필요)

**의사결정:**
- port: 5173 - 명세서에서 지정한 프론트엔드 포트
- proxy 설정 - `/api` 요청을 `http://localhost:8000`으로 전달하여 CORS 문제 회피

---

### 4. frontend/tailwind.config.js
**작업 유형:** 생성

**변경 이유:**
사이버펑크 테마 구현을 위한 네온 컬러 정의

**변경 내용:**
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

**참고한 정보:**
- `.claude/docs/new_project_description.md`:8번 줄 (Cyberpunk Theme, 네온 컬러)
- `CLAUDE.md`:104-108번 줄 (네온 컬러 정의 - cyan-400, rose-500, emerald-400)

**의사결정:**
- 네온 컬러 커스텀: cyan, pink, green 추가
- 모노스페이스 폰트: JetBrains Mono (사이버펑크 테마에 적합)

---

### 5. frontend/postcss.config.js
**작업 유형:** 생성

**변경 이유:**
TailwindCSS 처리를 위한 PostCSS 설정

**변경 내용:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**참고한 정보:**
- TailwindCSS 공식 문서 (PostCSS 설정 필수)

**의사결정:**
- 표준 TailwindCSS 설정 사용

---

### 6. frontend/index.html
**작업 유형:** 생성

**변경 이유:**
React 애플리케이션의 HTML 진입점

**변경 내용:**
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

**참고한 정보:**
- Vite + React 표준 템플릿

**의사결정:**
- `lang="ko"`: 한국어 프로젝트
- `<div id="root">`: React 마운트 포인트

---

### 7. frontend/src/index.css
**작업 유형:** 생성

**변경 이유:**
TailwindCSS 초기화 및 전역 스타일 정의

**변경 내용:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  background-color: #111827; /* bg-gray-900 */
}
```

**참고한 정보:**
- `.claude/docs/new_project_description.md`:88-94번 줄 (다크 모드 배경)
- `CLAUDE.md`:103-109번 줄 (사이버펑크 테마)

**의사결정:**
- `background-color: #111827`: TailwindCSS의 bg-gray-900 (매우 어두운 배경)
- `font-family`: 모노스페이스 폰트로 사이버펑크 느낌

---

### 8. .gitignore
**작업 유형:** 생성

**변경 이유:**
Git 버전 관리에서 제외할 파일 정의

**변경 내용:**
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
*.egg-info/
dist/
build/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
dist/
.cache/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Environment
.env
.env.local
.env.*.local

# Build
frontend/dist/
frontend/build/
```

**참고한 정보:**
- Python 표준 .gitignore
- Node.js 표준 .gitignore

**의사결정:**
- Python과 Node.js 모두 포함 (풀스택 프로젝트)
- IDE 파일 제외 (VSCode, IntelliJ 등)
- 환경 변수 파일 제외 (.env)

---

### 9-15. 빈 파일들
**작업 유형:** 생성

**변경 이유:**
디렉토리 구조를 미리 생성하여 다음 단계(백엔드/프론트엔드 구현)를 준비

**생성한 빈 파일:**
- `backend/main.py` - FastAPI 진입점
- `backend/algorithms.py` - 정렬 알고리즘 구현
- `backend/models.py` - Pydantic 모델
- `frontend/src/main.jsx` - React 진입점
- `frontend/src/App.jsx` - 메인 컴포넌트
- `frontend/src/components/RaceTrack.jsx` - 메인 컨테이너
- `frontend/src/components/SortChart.jsx` - 애니메이션 차트
- `frontend/src/components/WinnerBadge.jsx` - 메달 표시

**의사결정:**
- 빈 파일 생성으로 구조를 먼저 잡고 구현은 다음 단계에서 진행

---

## 의사결정 기록

### 의사결정 1: Python 버전 선택

**선택한 방법:** Python 3.10+

**고려한 대안:**
1. Python 3.8 - 구버전, 일부 기능 미지원
2. Python 3.10+ - 최신 타입 힌트 지원 (`int | None` 등)
3. Python 3.11+ - 최고 성능이지만 호환성 고려

**선택 이유:**
- `int | None` 구문 사용 (3.10+)
- 안정성과 호환성의 균형
- FastAPI 0.109.0과 잘 작동

**참고 문서:**
- Python 공식 문서 (타입 힌트)

---

### 의사결정 2: Vite vs Create React App

**선택한 방법:** Vite 5.0.12

**고려한 대안:**
1. Create React App - 전통적이지만 느림
2. Vite - 빠른 개발 서버, HMR
3. Next.js - SSR 불필요 (단순 SPA)

**선택 이유:**
- 훨씬 빠른 개발 서버 시작 시간
- Hot Module Replacement (HMR) 성능 우수
- 명세서 요구사항에 적합

**참고 문서:**
- `.claude/docs/new_project_description.md`:12번 줄 (Vite 명시)

---

### 의사결정 3: TailwindCSS vs 일반 CSS

**선택한 방법:** TailwindCSS 3.4.1

**고려한 대안:**
1. 일반 CSS - 세밀한 제어 가능하지만 생산성 낮음
2. Styled Components - CSS-in-JS, 번들 크기 증가
3. TailwindCSS - 유틸리티 클래스, 빠른 개발

**선택 이유:**
- 명세서에서 TailwindCSS 명시
- 사이버펑크 테마 구현에 적합
- 반응형 디자인 용이

**참고 문서:**
- `.claude/docs/new_project_description.md`:12번 줄 (TailwindCSS 명시)

---

### 의사결정 4: API 프록시 설정

**선택한 방법:** vite.config.js에 프록시 설정

**고려한 대안:**
1. 프록시 없이 직접 `http://localhost:8000` 호출 - CORS 에러 발생
2. 백엔드 CORS 설정만 - 보안 문제
3. Vite 프록시 + 백엔드 CORS - 이중 보호

**선택 이유:**
- 개발 환경에서 CORS 문제 회피
- 프론트엔드 코드에서 `/api`로 간단히 호출 가능
- 프로덕션 배포 시에도 유용

**참고 문서:**
- Vite 공식 문서 (프록시 설정)

---

## 에러 및 해결

### 발생한 에러 없음
이번 setup 작업에서는 설정 파일 생성만 수행했으므로 런타임 에러가 발생하지 않았습니다.

---

## 작성된 주요 설정

### 백엔드 의존성 (requirements.txt)
```txt
fastapi==0.109.0        # 웹 프레임워크
uvicorn[standard]==0.27.0  # ASGI 서버
pydantic==2.5.3         # 데이터 검증
python-multipart==0.0.6 # 파일 업로드 지원
```

### 프론트엔드 의존성 (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.12",
    "tailwindcss": "^3.4.1",
    "@vitejs/plugin-react": "^4.2.1"
  }
}
```

### Vite 프록시 설정
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true
    }
  }
}
```

### TailwindCSS 네온 컬러
```javascript
theme: {
  extend: {
    colors: {
      'neon-cyan': '#00ffff',
      'neon-pink': '#ff00ff',
      'neon-green': '#00ff00',
    }
  }
}
```

---

## 참고한 문서

1. **`.claude/docs/new_project_description.md`**
   - 8번 줄: Cyberpunk Theme
   - 12번 줄: 프론트엔드 기술 스택
   - 16-38번 줄: 폴더 구조
   - 22번 줄: 백엔드 의존성

2. **`CLAUDE.md`**
   - 19번 줄: pip install 명령
   - 29번 줄: 개발 서버 포트
   - 104-108번 줄: 네온 컬러 정의

3. **공식 문서**
   - FastAPI 문서 (설치 및 설정)
   - Vite 문서 (프록시 설정)
   - TailwindCSS 문서 (커스텀 컬러)

---

## 생성된 디렉토리 구조

```
algo-race-5/
├── backend/
│   ├── main.py               (빈 파일)
│   ├── algorithms.py         (빈 파일)
│   ├── models.py             (빈 파일)
│   └── requirements.txt      ✅ 완성
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RaceTrack.jsx      (빈 파일)
│   │   │   ├── SortChart.jsx      (빈 파일)
│   │   │   └── WinnerBadge.jsx    (빈 파일)
│   │   ├── App.jsx                 (빈 파일)
│   │   ├── main.jsx                (빈 파일)
│   │   └── index.css               ✅ 완성
│   ├── index.html                   ✅ 완성
│   ├── package.json                 ✅ 완성
│   ├── vite.config.js               ✅ 완성
│   ├── tailwind.config.js           ✅ 완성
│   └── postcss.config.js            ✅ 완성
│
└── .gitignore                        ✅ 완성
```

---

## 다음 작업 힌트

### 1. 백엔드 구현 (`/build-backend`)
**할 일:**
- `backend/models.py` - Pydantic 모델 정의
- `backend/algorithms.py` - 5가지 정렬 알고리즘 구현
- `backend/main.py` - FastAPI 엔드포인트 구현

**주의사항:**
- CORS 설정 필수 (allow_origins에 `http://localhost:5173` 추가)
- 단계 기록 의무 (매 비교/교환마다 `steps.append()`)
- `arr.copy()` 사용 (원본 보존)

**참고 문서:**
- `.claude/docs/process_backend.md`
- `.claude/agents/backend-agent.md`

---

### 2. 프론트엔드 구현 (`/build-frontend`)
**할 일:**
- `frontend/src/main.jsx` - React 진입점
- `frontend/src/App.jsx` - 레이아웃 및 헤더
- `frontend/src/components/SortChart.jsx` - 핵심 애니메이션 컴포넌트
- `frontend/src/components/RaceTrack.jsx` - 메인 컨테이너
- `frontend/src/components/WinnerBadge.jsx` - 메달 표시

**주의사항:**
- Props 불변성 유지 (`[...prev]` 복사본 사용)
- 인터벌 cleanup 필수 (메모리 누수 방지)
- 애니메이션 타이밍: 20ms (초당 50단계)

**참고 문서:**
- `.claude/docs/process_frontend.md`
- `.claude/agents/frontend-agent.md`

---

### 3. 의존성 설치
**백엔드:**
```bash
cd backend
uv venv
.venv\Scripts\activate
uv pip install -r requirements.txt
```

**프론트엔드:**
```bash
cd frontend
npm install
```

---

### 4. 알려진 제약사항
- Python 3.10+ 필수 (`int | None` 구문 사용)
- Node.js 18+ 권장
- 백엔드와 프론트엔드는 별도 터미널에서 실행해야 함

---

### 5. 개선 가능한 부분
- Docker Compose 설정 추가 (백엔드/프론트엔드 동시 실행)
- 환경 변수 관리 (.env 파일)
- 프로덕션 빌드 설정

---

## 작업 완료 체크리스트

- ✅ 백엔드 디렉토리 생성
- ✅ 프론트엔드 디렉토리 생성
- ✅ requirements.txt 작성
- ✅ package.json 작성
- ✅ vite.config.js 작성 (API 프록시 포함)
- ✅ tailwind.config.js 작성 (네온 컬러)
- ✅ postcss.config.js 작성
- ✅ index.html 작성
- ✅ index.css 작성 (TailwindCSS 디렉티브)
- ✅ .gitignore 작성
- ✅ 빈 파일 생성 (구조 준비)

**다음 단계:** `/build-backend` 스킬 실행
