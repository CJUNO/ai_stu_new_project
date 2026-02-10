# 🏁 Algo Race 5

5가지 정렬 알고리즘의 성능 차이를 **실시간 시각화**로 비교하는 웹 애플리케이션

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![FastAPI](https://img.shields.io/badge/fastapi-0.109.0-009688.svg)

## 📖 프로젝트 소개

**Algo Race 5**는 시간 복잡도 **O(N²) vs O(N log N)**의 차이를 명확하게 보여주는 교육용 프로젝트입니다.

### 핵심 개념: Server-Driven UI

- **백엔드(FastAPI)**: 정렬의 모든 단계를 계산
- **프론트엔드(React)**: 백엔드가 보낸 단계를 애니메이션으로 재생

프론트엔드에는 정렬 로직이 **전혀 없습니다**. 이는 로직 변경 시 백엔드만 수정하면 되는 장점이 있습니다.

---

## ✨ 주요 기능

- 🏆 **5가지 정렬 알고리즘 경주**
  - Bubble Sort (O(N²)) - 가장 느림
  - Selection Sort (O(N²))
  - Insertion Sort (O(N²))
  - Heap Sort (O(N log N))
  - Quick Sort (O(N log N)) - 가장 빠름

- 🎨 **사이버펑크 테마**
  - 다크 모드 기반 디자인
  - 네온 컬러 (Cyan, Pink, Green)
  - 실시간 색상 변화 애니메이션

- 🥇 **순위 시스템**
  - 먼저 완료한 알고리즘에게 메달 부여 (🥇🥈🥉)
  - 실시간 완료 순서 표시

- 📊 **단계별 시각화**
  - 빨강: 비교 중 (compare)
  - 초록: 교환 중 (swap)
  - 보라: 피벗 (Quick Sort 전용)
  - 시안: 기본 상태

---

## 🛠️ 기술 스택

### 백엔드
- **FastAPI** 0.109.0 - 고성능 Python 웹 프레임워크
- **Pydantic** 2.5.3 - 데이터 검증 및 스키마
- **Uvicorn** 0.27.0 - ASGI 서버

### 프론트엔드
- **React** 18.2.0 - UI 라이브러리
- **Vite** 5.0.12 - 빌드 도구
- **TailwindCSS** 3.4.1 - 유틸리티 CSS 프레임워크

---

## 🚀 빠른 시작

### 필수 요구사항
- Python 3.10+
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

#### 방법 1: uv 사용 (추천 ⚡ 10-100배 빠름)

**1. 백엔드 실행**
```bash
cd backend

# 가상환경 생성
uv venv

# 가상환경 활성화 (Windows)
.venv\Scripts\activate

# 가상환경 활성화 (Mac/Linux)
source .venv/bin/activate

# 의존성 설치
uv pip install -r requirements.txt

# 서버 실행
uvicorn main:app --reload --port 8000
```

**2. 프론트엔드 실행 (새 터미널)**
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

**3. 브라우저 접속**
- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

---

#### 방법 2: 일반 pip 사용

**1. 백엔드 실행**
```bash
cd backend

# 가상환경 생성 (선택사항)
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn main:app --reload --port 8000
```

**2-3단계는 동일**

---

## 📁 프로젝트 구조

```
algo-race-5/
├── backend/
│   ├── main.py              # FastAPI 앱 및 엔드포인트
│   ├── algorithms.py        # 5가지 정렬 알고리즘 구현
│   ├── models.py            # Pydantic 데이터 모델
│   └── requirements.txt     # Python 의존성
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RaceTrack.jsx      # 메인 컨테이너
│   │   │   ├── SortChart.jsx      # 애니메이션 차트
│   │   │   └── WinnerBadge.jsx    # 메달 표시
│   │   ├── App.jsx                 # 레이아웃
│   │   ├── main.jsx                # React 진입점
│   │   └── index.css               # 전역 스타일
│   ├── package.json
│   ├── vite.config.js              # Vite 설정 (API 프록시)
│   └── tailwind.config.js          # TailwindCSS 네온 컬러
│
└── README.md
```

---

## 🔌 API 엔드포인트

### `GET /`
헬스 체크 엔드포인트
```json
{
  "message": "Algo Race 5 API is running"
}
```

### `POST /api/race`
새로운 경주 데이터 생성

**Request Body:**
```json
{
  "size": 50  // 배열 크기 (10~200)
}
```

**Response:**
```json
{
  "initial_data": [15, 3, 21, 8, ...],
  "results": {
    "Bubble Sort": [
      {"type": "compare", "indices": [0, 1]},
      {"type": "swap", "indices": [0, 1]},
      ...
    ],
    "Quick Sort": [
      {"type": "compare", "indices": [0, 9], "pivot": 9},
      ...
    ],
    ...
  }
}
```

---

## 🎯 사용 방법

1. **START RACE 버튼 클릭**
   - 백엔드에 POST 요청을 보내 경주 데이터 생성

2. **5개 차트 동시 애니메이션**
   - 각 알고리즘이 동일한 배열을 정렬
   - 색상 변화로 비교/교환 과정 시각화

3. **순위 확인**
   - Quick Sort가 먼저 완료 (O(N log N))
   - Bubble Sort가 나중에 완료 (O(N²))
   - 완료 순서대로 메달 부여

---

## 🎨 색상 시스템

| 색상 | 의미 | 클래스 |
|------|------|--------|
| 🔴 빨강 | 비교 중 (compare) | `bg-rose-500` |
| 🟢 초록 | 교환 중 (swap) | `bg-emerald-400` |
| 🟣 보라 | 피벗 (Quick Sort) | `bg-purple-500` |
| 🔵 시안 | 기본 상태 | `bg-cyan-400` |

---

## ⏱️ 시간 복잡도 비교

| 알고리즘 | 최선 | 평균 | 최악 |
|---------|------|------|------|
| Bubble Sort | O(N²) | O(N²) | O(N²) |
| Selection Sort | O(N²) | O(N²) | O(N²) |
| Insertion Sort | O(N) | O(N²) | O(N²) |
| Heap Sort | O(N log N) | O(N log N) | O(N log N) |
| Quick Sort | O(N log N) | O(N log N) | O(N²)* |

*Quick Sort의 최악은 피벗 선택에 따라 발생하지만, 평균적으로 가장 빠름

---

## 🐛 문제 해결

### CORS 에러
```
Access to fetch at 'http://localhost:8000/api/race' has been blocked by CORS policy
```
**해결:** `backend/main.py`에서 CORS 설정 확인
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 프론트엔드 주소
    ...
)
```

### 차트가 업데이트 안 됨
**원인:** Props 직접 수정 (React 불변성 위반)
**해결:** `SortChart.jsx`에서 `[...prev]` 복사본 사용 확인

### 메모리 누수 경고
```
Warning: Can't perform a React state update on an unmounted component
```
**해결:** `useEffect` cleanup 함수 확인
```javascript
useEffect(() => {
  const interval = setInterval(...)
  return () => clearInterval(interval)  // cleanup 필수!
}, [])
```

---

## 📚 참고 문서

프로젝트 루트의 `.claude/` 디렉토리에 상세 문서가 있습니다:
- `CLAUDE.md` - 프로젝트 전체 가이드
- `.claude/docs/plan_ready.md` - 개발 계획
- `.claude/docs/process_backend.md` - 백엔드 구현 프로세스
- `.claude/docs/process_frontend.md` - 프론트엔드 구현 프로세스

---

## 🤝 기여

이 프로젝트는 교육용으로 제작되었습니다. 개선 사항이나 버그 리포트는 이슈로 등록해주세요!

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 🎓 학습 포인트

이 프로젝트를 통해 배울 수 있는 내용:
- ✅ Server-Driven UI 아키텍처
- ✅ FastAPI로 RESTful API 구축
- ✅ React Hooks (useState, useEffect, useRef)
- ✅ Props 불변성 및 메모리 관리
- ✅ 알고리즘 시간 복잡도 이해
- ✅ TailwindCSS로 반응형 디자인
- ✅ CORS 및 API 프록시 설정

---

**Made with ❤️ using FastAPI + React + TailwindCSS**

🏁 **즐거운 경주 되세요!**
