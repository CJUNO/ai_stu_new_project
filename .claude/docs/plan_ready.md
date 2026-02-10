# Algo-Race 5 개발 계획

## 프로젝트 개요
5가지 정렬 알고리즘이 동일한 데이터를 정렬하는 과정을 실시간 경주 형태로 시각화하는 웹 애플리케이션

**핵심 철학:** 서버 주도 UI (Server-Driven UI)
- 백엔드: 모든 정렬 단계 계산 및 기록
- 프론트엔드: 단계를 받아서 재생만 (정렬 로직 없음)

---

# Phase 0: 프로젝트 초기 설정

## Feature 0-1: 프로젝트 구조 및 설정 파일 생성

### 목표
프로젝트 개발을 위한 디렉토리 구조와 모든 설정 파일 생성

### 우선순위
🔴 **최우선** (모든 개발의 기반)

### 작업 내용

#### 1. 백엔드 설정
- [x] `backend/` 디렉토리 생성
- [ ] `backend/requirements.txt` 작성
  ```txt
  fastapi==0.109.0
  uvicorn[standard]==0.27.0
  pydantic==2.5.3
  python-multipart==0.0.6
  ```
- [ ] `backend/main.py` 스켈레톤 생성
- [ ] `backend/algorithms.py` 스켈레톤 생성
- [ ] `backend/models.py` 스켈레톤 생성

#### 2. 프론트엔드 설정
- [x] `frontend/` 디렉토리 생성
- [ ] `frontend/package.json` 작성
  - React 18.2.0
  - Vite 5.0.12
  - TailwindCSS 3.4.1
- [ ] `frontend/vite.config.js` 작성
  - 포트: 5173
  - API 프록시: `/api` → `http://localhost:8000`
- [ ] `frontend/tailwind.config.js` 작성
  - 네온 컬러 정의 (cyan, pink, green)
  - 모노스페이스 폰트 설정
- [ ] `frontend/postcss.config.js` 작성
- [ ] `frontend/index.html` 작성
- [ ] `frontend/src/index.css` 작성 (TailwindCSS 디렉티브)
- [ ] `frontend/src/components/` 디렉토리 생성

#### 3. Git 설정
- [ ] `.gitignore` 작성
  ```
  # Python
  __pycache__/
  *.py[cod]
  venv/
  .env

  # Node
  node_modules/
  dist/

  # IDEs
  .vscode/
  .idea/
  ```

### 생성될 파일 목록
```
backend/
  ├── requirements.txt ✓
  ├── main.py (빈 파일)
  ├── algorithms.py (빈 파일)
  └── models.py (빈 파일)

frontend/
  ├── package.json ✓
  ├── vite.config.js ✓
  ├── tailwind.config.js ✓
  ├── postcss.config.js ✓
  ├── index.html ✓
  ├── src/
  │   ├── index.css ✓
  │   ├── main.jsx (빈 파일)
  │   ├── App.jsx (빈 파일)
  │   └── components/ (빈 디렉토리)
  └── public/

.gitignore ✓
```

### 의존성
없음 (첫 번째 작업)

### 검증 방법
```bash
# 백엔드 의존성 설치 테스트
cd backend
pip install -r requirements.txt

# 프론트엔드 의존성 설치 테스트
cd frontend
npm install
```

### 예상 소요 시간
⏱️ 15-20분

### 참고 문서
- `.claude/docs/process_setup.md`
- `.claude/skills/setup-project/SKILL.md`
- `.claude/agents/setup-agent.md`

### 완료 조건
- [ ] 모든 디렉토리 생성 완료
- [ ] 모든 설정 파일 작성 완료
- [ ] `pip install` 성공
- [ ] `npm install` 성공

---

# Phase 1: 백엔드 개발

## Feature 1-1: 백엔드 데이터 모델 (models.py)

### 목표
API 요청/응답 구조를 Pydantic으로 정의하고 검증

### 우선순위
🔴 **최우선** (모든 백엔드 코드의 기반)

### 작업 내용

#### 1. RaceRequest 모델
```python
class RaceRequest(BaseModel):
    """경주 요청 모델"""
    size: int = Field(default=50, ge=10, le=200, description="배열의 크기")
```

**설계 결정:**
- `default=50`: 명세서 기본값
- `ge=10`: 너무 작으면 시각화 의미 없음
- `le=200`: 너무 크면 브라우저 성능 저하

#### 2. Step 모델
```python
class Step(BaseModel):
    """정렬 단계 모델"""
    type: Literal["compare", "swap", "overwrite"]
    indices: List[int] = Field(min_length=2, max_length=2)
    pivot: int | None = Field(default=None, description="퀵 정렬의 피벗 인덱스")
```

**설계 결정:**
- `Literal`: type을 3가지로 제한 (타입 안정성)
- `min_length=2, max_length=2`: 항상 정확히 2개 인덱스
- `pivot: int | None`: 퀵 정렬 전용 (선택사항)

#### 3. RaceResponse 모델
```python
class RaceResponse(BaseModel):
    """경주 응답 모델"""
    initial_data: List[int]
    results: Dict[str, List[Step]]
```

**설계 결정:**
- `initial_data`: 모든 알고리즘이 동일한 데이터로 시작
- `results`: 알고리즘 이름(str) → 단계 리스트(List[Step])

### 수정/생성 파일
- `backend/models.py` (생성)

### 의존성
- Feature 0-1 완료 필요

### 검증 방법
```python
# Python 인터프리터에서 테스트
from models import RaceRequest, Step, RaceResponse

# 유효한 요청
request = RaceRequest(size=50)  # ✓ 성공

# 범위 초과
request = RaceRequest(size=300)  # ✗ ValidationError

# 유효한 단계
step = Step(type="compare", indices=[0, 1])  # ✓ 성공

# 잘못된 타입
step = Step(type="invalid", indices=[0, 1])  # ✗ ValidationError
```

### 예상 소요 시간
⏱️ 10-15분

### 참고 문서
- `CLAUDE.md` 42-57번 줄 (데이터 구조)
- `.claude/docs/process_backend.md` 1단계

### 완료 조건
- [ ] 3개 모델 모두 정의됨
- [ ] Type hints 명확함
- [ ] Validation 설정됨
- [ ] Docstring 포함됨
- [ ] import 테스트 성공

---

## Feature 1-2: O(N²) 정렬 알고리즘 구현

### 목표
버블, 선택, 삽입 정렬 알고리즘의 단계별 실행 기록 구현

### 우선순위
🔴 **최우선**

### 작업 내용

#### 공통 구현 패턴
```python
def algorithm_name(arr: List[int]) -> List[Dict]:
    """알고리즘 설명 - 시간 복잡도"""
    steps = []           # 단계 기록용
    data = arr.copy()    # 원본 보존 (중요!)

    # 정렬 로직
    # 매 비교/교환마다:
    #   steps.append({"type": "...", "indices": [...]})

    return steps         # 정렬된 배열이 아닌 단계 리스트!
```

#### 1. Bubble Sort (버블 정렬)
**시간 복잡도:** O(N²) - 가장 느림

**특징:**
- 인접한 두 요소를 반복적으로 비교
- 큰 값이 뒤로 "버블"처럼 이동
- 매 패스마다 가장 큰 값이 끝으로 이동

**구현 핵심:**
```python
def bubble_sort(arr: List[int]) -> List[Dict]:
    steps = []
    data = arr.copy()
    n = len(data)

    for i in range(n):
        for j in range(0, n - i - 1):
            # 비교 단계 기록 (필수!)
            steps.append({"type": "compare", "indices": [j, j+1]})

            if data[j] > data[j + 1]:
                # 교환 단계 기록 (필수!)
                steps.append({"type": "swap", "indices": [j, j+1]})
                data[j], data[j+1] = data[j+1], data[j]

    return steps
```

**예상 단계 수:** size=50 → ~2,500 단계

#### 2. Selection Sort (선택 정렬)
**시간 복잡도:** O(N²) - 중간

**특징:**
- 미정렬 부분에서 최솟값 찾기
- 최솟값을 현재 위치와 교환
- "왼쪽에서 오른쪽으로 채워짐"

**구현 핵심:**
```python
def selection_sort(arr: List[int]) -> List[Dict]:
    steps = []
    data = arr.copy()
    n = len(data)

    for i in range(n):
        min_idx = i

        for j in range(i + 1, n):
            # 최솟값 찾기 위한 비교
            steps.append({"type": "compare", "indices": [min_idx, j]})

            if data[j] < data[min_idx]:
                min_idx = j

        if min_idx != i:
            # 최솟값을 현재 위치로 이동
            steps.append({"type": "swap", "indices": [i, min_idx]})
            data[i], data[min_idx] = data[min_idx], data[i]

    return steps
```

**예상 단계 수:** size=50 → ~2,500 단계

#### 3. Insertion Sort (삽입 정렬)
**시간 복잡도:** O(N²) - 데이터 의존적

**특징:**
- 카드 게임에서 카드 정렬하는 방식
- 각 요소를 정렬된 부분의 올바른 위치에 삽입
- 거의 정렬된 데이터에 효율적

**구현 핵심:**
```python
def insertion_sort(arr: List[int]) -> List[Dict]:
    steps = []
    data = arr.copy()
    n = len(data)

    for i in range(1, n):
        key = data[i]
        j = i - 1

        while j >= 0:
            steps.append({"type": "compare", "indices": [j, j+1]})

            if data[j] > key:
                steps.append({"type": "swap", "indices": [j, j+1]})
                data[j + 1] = data[j]
                j -= 1
            else:
                break

        data[j + 1] = key

    return steps
```

**예상 단계 수:** size=50 → ~1,250 ~ 2,500 단계 (데이터에 따라 변동)

### 수정/생성 파일
- `backend/algorithms.py` (일부 작성)

### 의존성
- Feature 1-1 완료 필요

### 검증 방법
```python
# 단위 테스트
arr = [5, 2, 8, 1, 9]

bubble_steps = bubble_sort(arr)
selection_steps = selection_sort(arr)
insertion_steps = insertion_sort(arr)

# 1. 원본 배열 보존 확인
assert arr == [5, 2, 8, 1, 9]  # 변경되지 않아야 함

# 2. 단계 리스트 반환 확인
assert isinstance(bubble_steps, list)
assert all(isinstance(step, dict) for step in bubble_steps)

# 3. 모든 단계에 type과 indices 존재
for step in bubble_steps:
    assert "type" in step
    assert "indices" in step
    assert len(step["indices"]) == 2

# 4. 단계 수 확인 (Bubble이 가장 많아야 함)
print(f"Bubble: {len(bubble_steps)} 단계")
print(f"Selection: {len(selection_steps)} 단계")
print(f"Insertion: {len(insertion_steps)} 단계")
```

### 예상 소요 시간
⏱️ 30-40분 (3개 알고리즘)

### 참고 문서
- `CLAUDE.md` 39-49번 줄, 138-146번 줄
- `.claude/docs/process_backend.md` 2단계

### 완료 조건
- [ ] 3개 알고리즘 모두 구현
- [ ] 모든 비교/교환마다 단계 기록
- [ ] `arr.copy()` 사용 (원본 보존)
- [ ] `return steps` (배열 아님!)
- [ ] Type hints 포함
- [ ] Docstring 포함
- [ ] 단위 테스트 통과

---

## Feature 1-3: O(N log N) 정렬 알고리즘 구현

### 목표
힙 정렬, 퀵 정렬 알고리즘의 단계별 실행 기록 구현

### 우선순위
🟡 **중요** (Feature 1-2 다음)

### 작업 내용

#### 1. Heap Sort (힙 정렬)
**시간 복잡도:** O(N log N) - 빠름

**특징:**
- 힙 자료구조 사용 (최대 힙)
- 항상 O(N log N) 보장
- 많은 swap으로 시각적 효과 좋음

**구현 핵심:**
```python
def heap_sort(arr: List[int]) -> List[Dict]:
    steps = []
    data = arr.copy()
    n = len(data)

    def heapify(n, i):
        """힙 속성 유지"""
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2

        if left < n:
            steps.append({"type": "compare", "indices": [largest, left]})
            if data[left] > data[largest]:
                largest = left

        if right < n:
            steps.append({"type": "compare", "indices": [largest, right]})
            if data[right] > data[largest]:
                largest = right

        if largest != i:
            steps.append({"type": "swap", "indices": [i, largest]})
            data[i], data[largest] = data[largest], data[i]
            heapify(n, largest)  # 재귀

    # 1단계: 최대 힙 구성
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)

    # 2단계: 힙에서 요소를 하나씩 추출
    for i in range(n - 1, 0, -1):
        steps.append({"type": "swap", "indices": [0, i]})
        data[0], data[i] = data[i], data[0]
        heapify(i, 0)

    return steps
```

**예상 단계 수:** size=50 → ~400 단계

#### 2. Quick Sort (퀵 정렬)
**시간 복잡도:** O(N log N) - 가장 빠름 (평균)

**특징:**
- 분할 정복 (Divide and Conquer)
- 피벗 기준으로 작은 값/큰 값 분리
- `pivot` 필드 추가 (시각화용)

**구현 핵심:**
```python
def quick_sort(arr: List[int]) -> List[Dict]:
    steps = []
    data = arr.copy()

    def partition(low, high):
        """피벗 기준으로 분할"""
        pivot = data[high]
        pivot_idx = high
        i = low - 1

        for j in range(low, high):
            steps.append({
                "type": "compare",
                "indices": [j, pivot_idx],
                "pivot": pivot_idx  # 피벗 위치 시각화
            })

            if data[j] < pivot:
                i += 1
                if i != j:
                    steps.append({
                        "type": "swap",
                        "indices": [i, j],
                        "pivot": pivot_idx
                    })
                    data[i], data[j] = data[j], data[i]

        if i + 1 != high:
            steps.append({
                "type": "swap",
                "indices": [i + 1, high],
                "pivot": pivot_idx
            })
            data[i + 1], data[high] = data[high], data[i + 1]

        return i + 1

    def quick_sort_recursive(low, high):
        """재귀적 퀵 정렬"""
        if low < high:
            pi = partition(low, high)
            quick_sort_recursive(low, pi - 1)
            quick_sort_recursive(pi + 1, high)

    quick_sort_recursive(0, len(data) - 1)
    return steps
```

**예상 단계 수:** size=50 → ~300 단계 (가장 적음)

### 수정/생성 파일
- `backend/algorithms.py` (완성)

### 의존성
- Feature 1-2 완료 필요

### 검증 방법
```python
# 단위 테스트
arr = [5, 2, 8, 1, 9]

heap_steps = heap_sort(arr)
quick_steps = quick_sort(arr)

# 1. 단계 수 비교 (O(N log N)이 O(N²)보다 적어야 함)
bubble_steps = bubble_sort(arr)
assert len(heap_steps) < len(bubble_steps)
assert len(quick_steps) < len(bubble_steps)

# 2. Quick Sort의 pivot 필드 확인
has_pivot = any("pivot" in step for step in quick_steps)
assert has_pivot  # pivot 필드 존재해야 함

print(f"Heap: {len(heap_steps)} 단계")
print(f"Quick: {len(quick_steps)} 단계")
print(f"Bubble: {len(bubble_steps)} 단계")
# Quick < Heap < Bubble 순서 확인
```

### 예상 소요 시간
⏱️ 40-50분 (2개 알고리즘, 복잡도 높음)

### 참고 문서
- `CLAUDE.md` 39-49번 줄, 138-146번 줄
- `.claude/docs/process_backend.md` 2단계

### 완료 조건
- [ ] 2개 알고리즘 모두 구현
- [ ] Quick Sort에 pivot 필드 포함
- [ ] 단계 수가 O(N²) 알고리즘보다 적음
- [ ] Type hints 포함
- [ ] Docstring 포함
- [ ] 단위 테스트 통과

---

## Feature 1-4: FastAPI 엔드포인트 및 CORS 설정

### 목표
FastAPI 애플리케이션과 `/api/race` 엔드포인트 구현

### 우선순위
🟡 **중요** (Feature 1-3 다음)

### 작업 내용

#### 1. FastAPI 앱 생성
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from typing import Dict, List

from models import RaceRequest, RaceResponse, Step
from algorithms import (
    bubble_sort,
    selection_sort,
    insertion_sort,
    heap_sort,
    quick_sort
)

app = FastAPI(title="Algo Race 5 API", version="1.0.0")
```

#### 2. CORS 설정 (필수!)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 프론트엔드 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**왜 필요한가:**
- 프론트엔드: `http://localhost:5173`
- 백엔드: `http://localhost:8000`
- 다른 포트 = 다른 출처 → 브라우저가 차단
- CORS 미들웨어로 허용 필요

#### 3. 헬스 체크 엔드포인트
```python
@app.get("/")
async def root():
    """헬스 체크 엔드포인트"""
    return {"message": "Algo Race 5 API is running"}
```

#### 4. 경주 생성 엔드포인트
```python
@app.post("/api/race", response_model=RaceResponse)
async def create_race(request: RaceRequest):
    """
    새로운 경주 데이터를 생성합니다.

    - **size**: 배열의 크기 (10~200)
    """
    # 1. 무작위 배열 생성 (중복 없음)
    initial_data = random.sample(range(1, request.size * 2), request.size)

    # 2. 5개 알고리즘 실행 (동일한 배열로)
    results = {
        "Bubble Sort": bubble_sort(initial_data),
        "Selection Sort": selection_sort(initial_data),
        "Insertion Sort": insertion_sort(initial_data),
        "Heap Sort": heap_sort(initial_data),
        "Quick Sort": quick_sort(initial_data)
    }

    # 3. 응답 반환
    return RaceResponse(
        initial_data=initial_data,
        results=results
    )
```

**설계 결정:**
- `random.sample`: 중복 없음, 정렬 검증 용이
- 동일한 `initial_data`: 공정한 비교
- 알고리즘 이름: 프론트엔드에서 표시될 이름

### 수정/생성 파일
- `backend/main.py` (완성)

### 의존성
- Feature 1-1, 1-2, 1-3 모두 완료 필요

### 검증 방법

#### 서버 실행
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**예상 출력:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

#### Swagger UI 테스트
1. `http://localhost:8000/docs` 접속
2. `POST /api/race` 클릭
3. "Try it out" 클릭
4. Request body: `{"size": 10}`
5. "Execute" 클릭

**예상 응답:**
```json
{
  "initial_data": [15, 3, 21, 8, 12, 5, 18, 1, 9, 14],
  "results": {
    "Bubble Sort": [
      {"type": "compare", "indices": [0, 1]},
      {"type": "swap", "indices": [0, 1]},
      ...
    ],
    "Quick Sort": [
      {"type": "compare", "indices": [0, 9], "pivot": 9},
      ...
    ]
  }
}
```

#### 단계 수 검증
```python
# size=10 예상 단계 수
len(results["Bubble Sort"])  # ~90 (많음)
len(results["Quick Sort"])   # ~30 (적음)
# Quick < Heap < Insertion ≤ Selection < Bubble
```

### 예상 소요 시간
⏱️ 20-30분

### 참고 문서
- `CLAUDE.md` 51-56번 줄
- `.claude/docs/process_backend.md` 3-4단계
- `.claude/agents/backend-agent.md` 3-4단계

### 완료 조건
- [ ] FastAPI 앱 생성
- [ ] CORS 설정 완료
- [ ] `/api/race` 엔드포인트 구현
- [ ] 5개 알고리즘 import
- [ ] response_model 설정
- [ ] 서버 정상 실행
- [ ] Swagger UI 접속 가능
- [ ] `/api/race` 요청 성공 (200 OK)
- [ ] 응답에 5개 알고리즘 결과 포함
- [ ] 단계 수가 시간 복잡도와 일치

---

# Phase 2: 프론트엔드 개발

## Feature 2-1: 프론트엔드 기본 구조

### 목표
React 진입점, 레이아웃, 전역 스타일 설정

### 우선순위
🟡 **중요** (백엔드 완료 후)

### 작업 내용

#### 1. main.jsx - React 진입점
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### 2. index.css - 전역 스타일
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #111827; /* bg-gray-900 */
}

* {
  box-sizing: border-box;
}
```

**스타일 선택 근거:**
- `JetBrains Mono`: 개발자용 모노스페이스 폰트
- `#111827`: TailwindCSS gray-900 (사이버펑크 배경)

#### 3. App.jsx - 레이아웃 및 헤더
```javascript
import React from 'react'
import RaceTrack from './components/RaceTrack'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-cyan-500 py-6">
        <h1 className="text-4xl font-mono font-bold text-center">
          <span className="text-cyan-400">ALGO</span>
          <span className="text-pink-500"> RACE </span>
          <span className="text-green-400">5</span>
        </h1>
        <p className="text-center text-gray-400 mt-2 font-mono">
          정렬 알고리즘 시각화 경주 🏁
        </p>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <RaceTrack />
      </main>
    </div>
  )
}

export default App
```

**디자인 선택:**
- 멀티 컬러 네온: cyan + pink + green
- 근거: 명세서 8번 줄 "네온 컬러 디자인"

### 수정/생성 파일
- `frontend/src/main.jsx` (생성)
- `frontend/src/index.css` (생성)
- `frontend/src/App.jsx` (생성)

### 의존성
- Feature 0-1 완료 필요
- Feature 1-4 완료 권장 (백엔드 준비)

### 검증 방법
```bash
cd frontend
npm run dev
```

**예상 출력:**
```
VITE v5.0.12  ready in 500 ms
➜  Local:   http://localhost:5173/
```

**브라우저 확인:**
- 헤더: "ALGO RACE 5" (멀티 컬러)
- 배경: 어두운 회색
- 폰트: 모노스페이스

### 예상 소요 시간
⏱️ 15-20분

### 참고 문서
- `CLAUDE.md` 59-109번 줄
- `.claude/docs/process_frontend.md` 1-2단계

### 완료 조건
- [ ] main.jsx 작성
- [ ] index.css 작성 (TailwindCSS)
- [ ] App.jsx 작성 (헤더 포함)
- [ ] 개발 서버 정상 실행
- [ ] 브라우저에서 헤더 표시 확인
- [ ] 콘솔 에러 없음

---

## Feature 2-2: WinnerBadge 컴포넌트

### 목표
1~3등 메달을 표시하는 컴포넌트 구현

### 우선순위
🟢 **보통** (독립적, 나중에 통합)

### 작업 내용

#### 구현 코드
```javascript
import React from 'react'

const WinnerBadge = ({ rank }) => {
  const badges = {
    1: { emoji: '🥇', color: 'text-yellow-400', text: '1st' },
    2: { emoji: '🥈', color: 'text-gray-300', text: '2nd' },
    3: { emoji: '🥉', color: 'text-amber-600', text: '3rd' }
  }

  const badge = badges[rank]
  if (!badge) return null

  return (
    <div className="absolute top-2 right-2 flex items-center gap-2 bg-gray-800 bg-opacity-90 px-3 py-1 rounded-full border border-gray-600">
      <span className="text-2xl">{badge.emoji}</span>
      <span className={`text-lg font-bold ${badge.color}`}>
        {badge.text}
      </span>
    </div>
  )
}

export default WinnerBadge
```

**설계 결정:**
- `absolute`: SortChart 위에 오버레이
- `bg-opacity-90`: 반투명으로 차트 일부 보이게
- `rounded-full`: 원형 배지

### 수정/생성 파일
- `frontend/src/components/WinnerBadge.jsx` (생성)

### 의존성
- Feature 2-1 완료 필요

### 검증 방법
```javascript
// 임시 테스트 컴포넌트
function TestBadge() {
  return (
    <div className="relative h-64 bg-gray-800">
      <WinnerBadge rank={1} />
    </div>
  )
}
```

### 예상 소요 시간
⏱️ 10분

### 참고 문서
- `CLAUDE.md` 84번 줄
- `.claude/docs/process_frontend.md` 3단계

### 완료 조건
- [ ] WinnerBadge.jsx 작성
- [ ] 1~3등 메달 표시
- [ ] rank가 null이면 아무것도 표시 안 함
- [ ] 스타일 완료 (반투명 배경, 원형)

---

## Feature 2-3: SortChart 컴포넌트 (핵심!)

### 목표
개별 알고리즘의 단계를 재생하는 핵심 애니메이션 컴포넌트

### 우선순위
🔴 **최우선** (프론트엔드의 핵심)

### 작업 내용

#### State 설계
```javascript
const [data, setData] = useState(initialData)        // 현재 배열 (로컬 복사본)
const [currentStep, setCurrentStep] = useState(0)    // 현재 단계 인덱스
const [highlights, setHighlights] = useState({})     // 하이라이트 상태
const intervalRef = useRef(null)                     // 인터벌 참조
```

#### 애니메이션 루프 (핵심!)
```javascript
useEffect(() => {
  if (start && currentStep < steps.length) {
    intervalRef.current = setInterval(() => {
      const step = steps[currentStep]

      // 1. Compare 처리
      if (step.type === 'compare') {
        setHighlights({
          [step.indices[0]]: 'compare',
          [step.indices[1]]: 'compare',
          ...(step.pivot !== undefined && { [step.pivot]: 'pivot' })
        })
      }

      // 2. Swap 처리
      else if (step.type === 'swap') {
        setData(prev => {
          const newData = [...prev]  // 불변성!
          const [i, j] = step.indices
          ;[newData[i], newData[j]] = [newData[j], newData[i]]
          return newData
        })

        setHighlights({
          [step.indices[0]]: 'swap',
          [step.indices[1]]: 'swap',
          ...(step.pivot !== undefined && { [step.pivot]: 'pivot' })
        })
      }

      setCurrentStep(prev => prev + 1)
    }, 20)  // 20ms = 50 steps/sec
  } else if (currentStep >= steps.length && intervalRef.current) {
    // 완료
    clearInterval(intervalRef.current)
    onFinish(name)
  }

  // Cleanup (메모리 누수 방지!)
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }
}, [start, currentStep, steps, name, onFinish])
```

**중요 포인트:**
1. **타이밍 (20ms)**: 초당 50단계 처리
2. **Compare vs Swap**: Compare는 색상만, Swap은 배열 수정 + 색상
3. **불변성 유지**: `const newData = [...prev]`
4. **Cleanup**: `return () => clearInterval(...)`

#### 하이라이트 자동 제거
```javascript
useEffect(() => {
  if (Object.keys(highlights).length > 0) {
    const timer = setTimeout(() => {
      setHighlights({})
    }, 100)  // 100ms 후 제거
    return () => clearTimeout(timer)
  }
}, [highlights])
```

#### 막대 색상 결정
```javascript
const getBarColor = (index) => {
  const highlightType = highlights[index]
  if (highlightType === 'compare') return 'bg-rose-500'    // 빨강
  if (highlightType === 'swap') return 'bg-emerald-400'    // 초록
  if (highlightType === 'pivot') return 'bg-purple-500'    // 보라
  return 'bg-cyan-400'                                      // 시안 (기본)
}
```

#### JSX 렌더링
```javascript
return (
  <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-4">
    {rank && <WinnerBadge rank={rank} />}

    <h3 className="text-xl font-mono font-bold mb-4 text-center">
      {name}
    </h3>

    <div className="mb-2 text-sm text-gray-400 text-center font-mono">
      {currentStep} / {steps.length} steps
    </div>

    <div className="flex items-end justify-center gap-1 h-64">
      {data.map((value, index) => (
        <div
          key={index}
          className={`flex-1 ${getBarColor(index)} transition-all duration-100 rounded-t`}
          style={{
            height: `${(value / Math.max(...initialData)) * 100}%`,
            minWidth: '2px'
          }}
        />
      ))}
    </div>
  </div>
)
```

### 수정/생성 파일
- `frontend/src/components/SortChart.jsx` (생성)

### 의존성
- Feature 2-1 완료 필요
- Feature 2-2 완료 필요 (WinnerBadge import)

### 검증 방법
```javascript
// 임시 테스트 컴포넌트
function TestSortChart() {
  const testData = [5, 2, 8, 1, 9]
  const testSteps = [
    { type: "compare", indices: [0, 1] },
    { type: "swap", indices: [0, 1] },
    { type: "compare", indices: [1, 2] },
  ]

  return (
    <SortChart
      name="Test Sort"
      initialData={testData}
      steps={testSteps}
      start={true}
      onFinish={(name) => console.log(`${name} finished!`)}
      rank={null}
    />
  )
}
```

### 예상 소요 시간
⏱️ 60-90분 (가장 복잡한 컴포넌트)

### 참고 문서
- `CLAUDE.md` 61-73번 줄, 118-123번 줄
- `.claude/docs/process_frontend.md` 4단계

### 완료 조건
- [ ] State 설계 완료 (data, currentStep, highlights, intervalRef)
- [ ] 애니메이션 루프 구현
- [ ] Compare 처리 (색상만)
- [ ] Swap 처리 (배열 수정 + 색상)
- [ ] 불변성 유지 확인
- [ ] 하이라이트 자동 제거 (100ms)
- [ ] 막대 색상 로직 구현
- [ ] JSX 렌더링 완료
- [ ] Cleanup 함수 구현
- [ ] 브라우저 콘솔 에러 없음
- [ ] 메모리 누수 경고 없음

---

## Feature 2-4: RaceTrack 컨테이너 및 API 연동

### 목표
5개의 SortChart를 관리하고 백엔드 API와 연동

### 우선순위
🔴 **최우선** (Feature 2-3 다음)

### 작업 내용

#### State 설계
```javascript
const [raceData, setRaceData] = useState(null)          // API 응답
const [started, setStarted] = useState(false)           // 시작 여부
const [finishedOrder, setFinishedOrder] = useState([])  // 완료 순서
const [loading, setLoading] = useState(false)           // 로딩 상태
```

#### API 호출
```javascript
const handleStartRace = async () => {
  setLoading(true)
  setStarted(false)
  setFinishedOrder([])

  try {
    const response = await fetch('/api/race', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ size: 50 })
    })

    if (!response.ok) throw new Error('API 호출 실패')

    const data = await response.json()
    setRaceData(data)
    setStarted(true)
  } catch (error) {
    console.error('경주 시작 실패:', error)
    alert('경주를 시작할 수 없습니다. 백엔드 서버를 확인하세요.')
  } finally {
    setLoading(false)
  }
}
```

**설계 결정:**
- `fetch` 사용: 추가 라이브러리 불필요
- `/api/race`: vite.config.js 프록시로 자동 변환
- 에러 처리: 사용자 친화적 메시지

#### 순위 시스템
```javascript
const handleFinish = (algorithmName) => {
  setFinishedOrder(prev => {
    if (!prev.includes(algorithmName)) {
      return [...prev, algorithmName]
    }
    return prev
  })
}

const getRank = (algorithmName) => {
  const index = finishedOrder.indexOf(algorithmName)
  if (index === -1) return null
  return index + 1  // 1등, 2등, 3등
}
```

#### JSX 렌더링
```javascript
const algorithms = [
  'Bubble Sort',
  'Selection Sort',
  'Insertion Sort',
  'Heap Sort',
  'Quick Sort'
]

return (
  <div>
    {/* START RACE 버튼 */}
    <div className="text-center mb-8">
      <button
        onClick={handleStartRace}
        disabled={loading || started}
        className={`
          px-8 py-4 text-2xl font-mono font-bold rounded-lg
          border-2 transition-all duration-200
          ${loading || started
            ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-cyan-500 hover:bg-cyan-600 border-cyan-400 text-gray-900 hover:scale-105'
          }
        `}
      >
        {loading ? '로딩 중...' : started ? '경주 진행 중' : '🏁 START RACE'}
      </button>

      {/* 완료 순위 표시 */}
      {finishedOrder.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-mono text-gray-400 mb-2">완료 순서:</h3>
          <div className="flex justify-center gap-4">
            {finishedOrder.slice(0, 3).map((name, index) => (
              <div key={name} className="flex items-center gap-2">
                <span className="text-2xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <span className="font-mono text-white">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* 차트 그리드 */}
    {raceData && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms.map(algorithmName => (
          <SortChart
            key={algorithmName}
            name={algorithmName}
            initialData={raceData.initial_data}
            steps={raceData.results[algorithmName]}
            start={started}
            onFinish={handleFinish}
            rank={getRank(algorithmName)}
          />
        ))}
      </div>
    )}
  </div>
)
```

**반응형 그리드:**
- 모바일: 1열
- 태블릿: 2열
- 데스크톱: 3열

### 수정/생성 파일
- `frontend/src/components/RaceTrack.jsx` (생성)

### 의존성
- Feature 2-3 완료 필수
- Feature 1-4 완료 필수 (백엔드 API)

### 검증 방법

#### 백엔드 서버 실행 확인
```bash
# 별도 터미널
cd backend
uvicorn main:app --reload --port 8000
```

#### 프론트엔드 테스트
1. 브라우저: http://localhost:5173
2. "START RACE" 버튼 클릭
3. 체크리스트:
   - [ ] 5개 차트 렌더링
   - [ ] 모든 차트 동시 시작
   - [ ] 막대 색상 변화 (빨강 → 초록 → 시안)
   - [ ] Quick/Heap이 빠르게 진행
   - [ ] Bubble이 느리게 진행
   - [ ] 완료 순위 표시
   - [ ] 메달 표시 (🥇🥈🥉)

### 예상 소요 시간
⏱️ 40-50분

### 참고 문서
- `CLAUDE.md` 75-99번 줄
- `.claude/docs/process_frontend.md` 5단계

### 완료 조건
- [ ] State 설계 완료
- [ ] API 호출 구현
- [ ] 순위 시스템 구현
- [ ] START RACE 버튼 구현
- [ ] 반응형 그리드 구현
- [ ] 5개 차트 렌더링
- [ ] 백엔드 연동 성공
- [ ] 브라우저 콘솔 에러 없음
- [ ] CORS 에러 없음

---

# Phase 3: 통합 및 최적화

## Feature 3-1: 통합 테스트 및 버그 수정

### 목표
전체 시스템 통합 테스트 및 발견된 버그 수정

### 우선순위
🔴 **최우선** (모든 Feature 완료 후)

### 작업 내용

#### 테스트 시나리오

##### 1. 백엔드 단독 테스트
```bash
cd backend
uvicorn main:app --reload --port 8000

# Swagger UI: http://localhost:8000/docs
# POST /api/race 테스트 (size=10, 50, 100)
```

**체크리스트:**
- [ ] 서버 정상 시작
- [ ] Swagger UI 접속 가능
- [ ] size=10 테스트 성공
- [ ] size=50 테스트 성공
- [ ] size=100 테스트 성공
- [ ] 응답 시간 합리적 (< 5초)
- [ ] 5개 알고리즘 결과 모두 포함
- [ ] 단계 수 검증 (Quick < Heap < Insertion ≤ Selection < Bubble)

##### 2. 프론트엔드 단독 테스트
```bash
cd frontend
npm run dev

# 브라우저: http://localhost:5173
```

**체크리스트:**
- [ ] 헤더 정상 표시
- [ ] START RACE 버튼 표시
- [ ] 네온 컬러 정상 (cyan, pink, green)
- [ ] 폰트 모노스페이스
- [ ] 반응형 레이아웃 (모바일/태블릿/데스크톱)

##### 3. 통합 테스트
**체크리스트:**
- [ ] START RACE 버튼 클릭 시 API 호출
- [ ] 5개 차트 렌더링
- [ ] 모든 차트 동시 시작
- [ ] 애니메이션 정상 동작
- [ ] 색상 변화 (빨강/초록/시안/보라)
- [ ] Quick Sort가 먼저 완료
- [ ] Bubble Sort가 나중에 완료
- [ ] 메달 표시 (1~3등)
- [ ] 완료 순서 표시
- [ ] 브라우저 콘솔 에러 없음
- [ ] 메모리 누수 경고 없음
- [ ] 네트워크 에러 없음

##### 4. 엣지 케이스 테스트
- [ ] size=10 (최소)
- [ ] size=200 (최대)
- [ ] 연속 실행 (3회 이상)
- [ ] 진행 중 새로고침
- [ ] 백엔드 중단 후 재시작

#### 흔한 버그와 해결 방법

##### 버그 1: CORS 에러
**증상:** 브라우저 콘솔에 "CORS policy" 에러

**해결:**
```python
# backend/main.py 확인
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 주소 정확한지 확인
    ...
)
```

##### 버그 2: 차트가 업데이트 안 됨
**증상:** 막대가 움직이지 않음

**해결:**
```javascript
// SortChart.jsx 확인
setData(prev => {
  const newData = [...prev]  // 이 줄 있는지 확인!
  ...
})
```

##### 버그 3: 메모리 누수
**증상:** "Can't perform a React state update on an unmounted component"

**해결:**
```javascript
// SortChart.jsx 확인
useEffect(() => {
  ...
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)  // 이 줄 있는지 확인!
    }
  }
}, [...])
```

##### 버그 4: 애니메이션이 너무 빠르거나 느림
**해결:**
```javascript
// SortChart.jsx에서 타이밍 조정
setInterval(() => { ... }, 20)  // 10~50ms 범위에서 실험
```

### 수정/생성 파일
- 발견된 버그에 따라 다양

### 의존성
- Phase 1, 2의 모든 Feature 완료 필요

### 검증 방법
위의 모든 체크리스트 통과

### 예상 소요 시간
⏱️ 60-90분 (테스트 + 버그 수정)

### 참고 문서
- `CLAUDE.md` 125-136번 줄 (테스트 전략, 흔한 실수)
- `.claude/agents/debug-agent.md`

### 완료 조건
- [ ] 모든 테스트 시나리오 통과
- [ ] 발견된 모든 버그 수정
- [ ] 브라우저 콘솔 깨끗함
- [ ] 성능 합리적
- [ ] 사용자 경험 만족스러움

---

## Feature 3-2: 스타일링 완성 (사이버펑크 테마)

### 목표
사이버펑크 다크 모드 테마를 완성하고 디테일 추가

### 우선순위
🟢 **보통** (기능 완료 후)

### 작업 내용

#### 1. 색상 일관성 확인
- [ ] 배경: `bg-gray-900` (매우 어두운 색)
- [ ] 기본 막대: `bg-cyan-400` (네온 시안)
- [ ] 비교 상태: `bg-rose-500` (네온 레드)
- [ ] 교환 상태: `bg-emerald-400` (네온 그린)
- [ ] 피벗 상태: `bg-purple-500` (보라)
- [ ] 폰트: `font-mono` (모노스페이스)

#### 2. 헤더 강화
```javascript
// App.jsx 개선
<header className="bg-gray-800 border-b-2 border-cyan-500 py-8 shadow-lg shadow-cyan-500/50">
  <h1 className="text-5xl font-mono font-bold text-center animate-pulse">
    <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">ALGO</span>
    <span className="text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"> RACE </span>
    <span className="text-green-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">5</span>
  </h1>
  <p className="text-center text-gray-400 mt-3 text-lg font-mono">
    정렬 알고리즘 시각화 경주 🏁
  </p>
</header>
```

**추가 효과:**
- `shadow-lg shadow-cyan-500/50`: 네온 그림자
- `drop-shadow`: 글자 네온 효과
- `animate-pulse`: 미묘한 펄스 효과 (선택사항)

#### 3. 버튼 호버 효과 강화
```javascript
// RaceTrack.jsx 개선
className={`
  px-10 py-5 text-3xl font-mono font-bold rounded-xl
  border-3 transition-all duration-200
  ${loading || started
    ? 'bg-gray-700 border-gray-600 text-gray-400'
    : 'bg-cyan-500 hover:bg-cyan-400 border-cyan-300 text-gray-900 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105'
  }
`}
```

#### 4. 차트 카드 스타일 강화
```javascript
// SortChart.jsx 개선
<div className="relative bg-gray-800 border-2 border-gray-700 hover:border-cyan-500 rounded-xl p-6 shadow-xl transition-all duration-300">
```

#### 5. 진행률 바 추가 (선택사항)
```javascript
// SortChart.jsx에 추가
<div className="w-full bg-gray-700 rounded-full h-2 mb-4">
  <div
    className="bg-cyan-400 h-2 rounded-full transition-all duration-100"
    style={{ width: `${(currentStep / steps.length) * 100}%` }}
  />
</div>
```

### 수정/생성 파일
- `frontend/src/App.jsx` (개선)
- `frontend/src/components/RaceTrack.jsx` (개선)
- `frontend/src/components/SortChart.jsx` (개선)
- `frontend/src/index.css` (추가 스타일)

### 의존성
- Feature 3-1 완료 권장

### 검증 방법
- 시각적으로 확인
- 네온 효과가 뚜렷한지 확인
- 호버 효과가 부드러운지 확인

### 예상 소요 시간
⏱️ 30-45분

### 참고 문서
- `CLAUDE.md` 101-109번 줄
- 명세서 8번 줄, 88-91번 줄

### 완료 조건
- [ ] 모든 색상이 일관됨
- [ ] 네온 효과 적용
- [ ] 호버 효과 부드러움
- [ ] 사이버펑크 느낌 강함
- [ ] 시각적으로 만족스러움

---

## Feature 3-3: 성능 최적화 및 반응형 디자인

### 목표
성능 최적화 및 모바일/태블릿 반응형 지원

### 우선순위
🟢 **보통** (시간 여유 시)

### 작업 내용

#### 1. 성능 최적화

##### React.memo 적용
```javascript
// SortChart.jsx
const SortChart = React.memo(({ name, initialData, steps, start, onFinish, rank }) => {
  ...
})

// WinnerBadge.jsx
const WinnerBadge = React.memo(({ rank }) => {
  ...
})
```

##### 불필요한 리렌더링 방지
```javascript
// RaceTrack.jsx
const handleFinish = useCallback((algorithmName) => {
  ...
}, [])

const getRank = useCallback((algorithmName) => {
  ...
}, [finishedOrder])
```

#### 2. 반응형 디자인 강화

##### 모바일 최적화
```javascript
// RaceTrack.jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
```

##### 차트 높이 조정
```javascript
// SortChart.jsx
<div className="flex items-end justify-center gap-1 h-48 sm:h-56 lg:h-64">
```

##### 버튼 크기 조정
```javascript
// RaceTrack.jsx
<button className="px-6 py-3 sm:px-8 sm:py-4 text-xl sm:text-2xl lg:text-3xl ...">
```

#### 3. 로딩 상태 개선
```javascript
// RaceTrack.jsx에 스피너 추가
{loading && (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
  </div>
)}
```

#### 4. 에러 상태 표시
```javascript
// RaceTrack.jsx
const [error, setError] = useState(null)

// API 호출 catch 블록에서
catch (error) {
  setError(error.message)
}

// JSX에 추가
{error && (
  <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-4">
    <p className="text-red-400 font-mono">{error}</p>
  </div>
)}
```

### 수정/생성 파일
- `frontend/src/components/RaceTrack.jsx` (개선)
- `frontend/src/components/SortChart.jsx` (개선)
- `frontend/src/components/WinnerBadge.jsx` (개선)

### 의존성
- Feature 3-1 완료 필요

### 검증 방법
- Chrome DevTools Performance 탭
- React DevTools Profiler
- 모바일 화면 (375px)
- 태블릿 화면 (768px)
- 데스크톱 화면 (1920px)

### 예상 소요 시간
⏱️ 45-60분

### 참고 문서
- React 공식 문서 (최적화)
- TailwindCSS 반응형 가이드

### 완료 조건
- [ ] React.memo 적용
- [ ] useCallback 적용
- [ ] 반응형 그리드 완성
- [ ] 모바일에서 정상 작동
- [ ] 로딩 상태 표시
- [ ] 에러 상태 표시
- [ ] 성능 프로파일링 만족

---

# 개발 순서 요약

## 권장 개발 순서
```
Phase 0: 프로젝트 초기 설정
  └─ Feature 0-1 (15-20분)
       ↓
Phase 1: 백엔드 개발
  ├─ Feature 1-1: 데이터 모델 (10-15분)
  ├─ Feature 1-2: O(N²) 알고리즘 (30-40분)
  ├─ Feature 1-3: O(N log N) 알고리즘 (40-50분)
  └─ Feature 1-4: API 엔드포인트 (20-30분)
       ↓
Phase 2: 프론트엔드 개발
  ├─ Feature 2-1: 기본 구조 (15-20분)
  ├─ Feature 2-2: WinnerBadge (10분)
  ├─ Feature 2-3: SortChart (60-90분) ← 핵심!
  └─ Feature 2-4: RaceTrack (40-50분)
       ↓
Phase 3: 통합 및 최적화
  ├─ Feature 3-1: 통합 테스트 (60-90분)
  ├─ Feature 3-2: 스타일링 (30-45분)
  └─ Feature 3-3: 성능 최적화 (45-60분)
```

## 총 예상 소요 시간
⏱️ **최소**: 6-7시간 (핵심 기능만)
⏱️ **권장**: 8-10시간 (최적화 포함)

## 중요 체크포인트
1. ✅ Feature 1-4 완료 후: 백엔드 Swagger UI 테스트
2. ✅ Feature 2-3 완료 후: SortChart 단독 테스트
3. ✅ Feature 2-4 완료 후: 전체 통합 테스트
4. ✅ Feature 3-1 완료 후: 모든 버그 수정 확인

## 다음 단계
1. `/setup-project` 스킬로 Feature 0-1 실행
2. 또는 `/build-backend` 스킬로 Phase 1 전체 실행
3. 또는 `/build-frontend` 스킬로 Phase 2 전체 실행
4. 또는 수동으로 하나씩 구현

---

# 참고 문서 목록

## 필수 참고 문서
- `CLAUDE.md` - 프로젝트 전체 가이드
- `.claude/docs/new_project_description.md` - 프로젝트 명세

## 백엔드 참고 문서
- `.claude/docs/process_backend.md` - 백엔드 구현 프로세스
- `.claude/skills/build-backend/SKILL.md` - 백엔드 스킬
- `.claude/agents/backend-agent.md` - 백엔드 에이전트

## 프론트엔드 참고 문서
- `.claude/docs/process_frontend.md` - 프론트엔드 구현 프로세스
- `.claude/skills/build-frontend/SKILL.md` - 프론트엔드 스킬
- `.claude/agents/frontend-agent.md` - 프론트엔드 에이전트

## 기타 참고 문서
- `.claude/docs/process_setup.md` - 초기 설정 프로세스
- `.claude/agents/debug-agent.md` - 디버깅 가이드
- `.claude/agents/context-save-agent.md` - 작업 기록 가이드

---

**작성일:** 2024-02-10
**버전:** 1.0
**상태:** 개발 준비 완료 ✅
