# 프로젝트 초기 설정 과정 (Process Setup)

## 작업 개요
Algo-Race 5 프로젝트의 디렉토리 구조와 기본 설정 파일들을 생성하는 과정을 기록합니다.

## 1단계: 프로젝트 구조 분석

### 참고한 문서
- `.claude/docs/new_project_description.md` (16-38번 줄)

### 분석 내용
프로젝트는 크게 backend/와 frontend/ 두 개의 메인 디렉토리로 구성됩니다:
- **backend/**: FastAPI 기반 Python 서버
- **frontend/**: React + Vite 기반 웹 애플리케이션

### 의사결정
백엔드와 프론트엔드를 완전히 분리하여 각각 독립적으로 실행 가능하도록 구성합니다.

## 2단계: 백엔드 설정 파일 생성

### 2.1 requirements.txt 작성

**참고 문서:**
- `.claude/docs/new_project_description.md` 22번 줄

**작성 이유:**
FastAPI 애플리케이션 실행에 필요한 Python 패키지들을 정의하기 위해

**버전 선택 근거:**
- `fastapi==0.109.0`: 2024년 1월 안정 버전, Pydantic v2 완전 지원
- `uvicorn[standard]==0.27.0`: WebSocket 지원 포함, 성능 최적화된 최신 안정 버전
- `pydantic==2.5.3`: FastAPI 0.109와 호환되는 최신 버전
- `python-multipart==0.0.6`: 파일 업로드 처리용 (향후 확장 가능성 고려)

**작성된 코드:**
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
python-multipart==0.0.6
```

## 3단계: 프론트엔드 설정 파일 생성

### 3.1 package.json 작성

**참고 문서:**
- `.claude/docs/new_project_description.md` 12번 줄, 14번 줄
- `CLAUDE.md` 27-30번 줄

**작성 이유:**
npm 프로젝트 설정 및 의존성 관리

**의존성 선택 근거:**

**프로덕션 의존성 (dependencies):**
- `react ^18.2.0`: 안정적인 최신 React 버전
- `react-dom ^18.2.0`: React DOM 렌더링

**개발 의존성 (devDependencies):**
- `vite ^5.0.12`: 빠른 개발 서버 및 빌드 도구
- `@vitejs/plugin-react ^4.2.1`: React Fast Refresh 지원
- `tailwindcss ^3.4.1`: 유틸리티 우선 CSS 프레임워크
- `postcss ^8.4.33`: TailwindCSS 처리
- `autoprefixer ^10.4.17`: CSS 브라우저 호환성

**스크립트 설명:**
- `dev`: 개발 서버 시작 (포트 5173)
- `build`: 프로덕션 빌드 생성
- `preview`: 빌드 결과 미리보기

### 3.2 vite.config.js 작성

**참고 문서:**
- `CLAUDE.md` 29번 줄 (포트 5173)
- `.claude/docs/new_project_description.md` 54번 줄 (API 엔드포인트)

**작성 이유:**
- React 플러그인 설정
- 개발 서버 포트 명시적 지정
- 백엔드 API 프록시 설정

**프록시 설정 이유:**
CORS 문제 해결을 위해 `/api/*` 요청을 `http://localhost:8000`으로 프록시합니다.

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

### 3.3 tailwind.config.js 작성

**참고 문서:**
- `.claude/docs/new_project_description.md` 8번 줄 (사이버펑크 테마)
- `CLAUDE.md` 103-109번 줄 (색상 정의)

**작성 이유:**
사이버펑크 테마의 네온 컬러와 모노스페이스 폰트 정의

**커스텀 색상 선택:**
- `neon-cyan`: 주요 하이라이트 (#00ffff)
- `neon-pink`: 보조 액센트 (#ff00ff)
- `neon-green`: 성공/완료 표시 (#00ff00)

**폰트 선택:**
`JetBrains Mono` 우선, 폴백으로 `Courier New`, 최종 `monospace`

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

### 3.4 postcss.config.js 작성

**작성 이유:**
TailwindCSS 처리를 위한 PostCSS 플러그인 설정

**작성된 코드:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3.5 index.html 작성

**작성 이유:**
React 애플리케이션의 HTML 진입점

**주요 요소:**
- `lang="ko"`: 한국어 문서
- `<title>`: "Algo Race 5 - 정렬 알고리즘 경주"
- `<div id="root">`: React 렌더링 대상
- `<script type="module">`: ES 모듈로 main.jsx 로드

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

## 4단계: 디렉토리 구조 생성

### 생성할 디렉토리 목록

**백엔드:**
```
backend/
```

**프론트엔드:**
```
frontend/
frontend/public/
frontend/src/
frontend/src/components/
```

### 생성 명령어
```bash
mkdir -p backend
mkdir -p frontend/public
mkdir -p frontend/src/components
```

## 5단계: 빈 파일 생성 (스켈레톤)

### 백엔드 파일
- `backend/main.py` - FastAPI 애플리케이션 진입점
- `backend/algorithms.py` - 정렬 알고리즘 구현
- `backend/models.py` - Pydantic 모델 정의

### 프론트엔드 파일
- `frontend/src/main.jsx` - React 진입점
- `frontend/src/App.jsx` - 메인 컴포넌트
- `frontend/src/index.css` - 전역 스타일
- `frontend/src/components/RaceTrack.jsx` - 경주 트랙 컨테이너
- `frontend/src/components/SortChart.jsx` - 개별 정렬 차트
- `frontend/src/components/WinnerBadge.jsx` - 순위 배지

## 6단계: 검증

### 확인 사항
1. ✓ 모든 디렉토리가 생성되었는가?
2. ✓ 설정 파일들이 올바른 위치에 있는가?
3. ✓ package.json과 requirements.txt가 유효한가?
4. ✓ 프로젝트 구조가 명세와 일치하는가?

### 테스트 명령어
```bash
# 프론트엔드 의존성 설치 테스트
cd frontend
npm install

# 백엔드 의존성 설치 테스트
cd ../backend
pip install -r requirements.txt
```

## 작업 결과

### 생성된 파일 목록
```
.
├── backend/
│   ├── requirements.txt ✓
│   ├── main.py (빈 파일)
│   ├── algorithms.py (빈 파일)
│   └── models.py (빈 파일)
└── frontend/
    ├── package.json ✓
    ├── vite.config.js ✓
    ├── tailwind.config.js ✓
    ├── postcss.config.js ✓
    ├── index.html ✓
    ├── public/
    └── src/
        ├── main.jsx (빈 파일)
        ├── App.jsx (빈 파일)
        ├── index.css (빈 파일)
        └── components/
            ├── RaceTrack.jsx (빈 파일)
            ├── SortChart.jsx (빈 파일)
            └── WinnerBadge.jsx (빈 파일)
```

## 다음 작업
1. **백엔드 구현** → `.claude/docs/process_backend.md` 참고
2. **프론트엔드 구현** → `.claude/docs/process_frontend.md` 참고

## 참고한 모든 문서
- `.claude/docs/new_project_description.md`
- `CLAUDE.md`
