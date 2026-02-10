# Algo-Race 5 구현 플랜

## Context

사용자가 5가지 정렬 알고리즘의 성능 차이를 시각적으로 비교하는 웹 애플리케이션을 만들고자 합니다. 이 프로젝트는 **서버 주도 UI (Server-Driven UI)** 철학을 따르며, 백엔드(FastAPI)가 정렬의 모든 단계를 계산하고, 프론트엔드(React)는 이를 받아서 애니메이션으로 재생하기만 합니다.

**현재 상태**: 프로젝트 디렉토리 구조와 코드 파일이 아직 생성되지 않았습니다. `.claude/docs/plan_ready.md`에 상세한 개발 계획이 작성되어 있으며, 이를 기반으로 구현을 진행합니다.

**목표**: 사용자가 웹 브라우저에서 "START RACE" 버튼을 클릭하면, 5개의 정렬 알고리즘(Bubble, Selection, Insertion, Heap, Quick Sort)이 동일한 데이터를 정렬하는 과정을 실시간 애니메이션으로 볼 수 있어야 합니다. 시간 복잡도 O(N²) vs O(N log N)의 차이를 명확히 경험할 수 있어야 합니다.

---

## Implementation Approach

### 개발 우선순위
plan_ready.md의 Phase별로 순차적으로 구현합니다:

1. **Phase 0**: 프로젝트 초기 설정 (디렉토리, 설정 파일)
2. **Phase 1**: 백엔드 구현 (데이터 모델 → 알고리즘 → API)
3. **Phase 2**: 프론트엔드 구현 (기본 구조 → 컴포넌트 → API 연동)
4. **Phase 3**: 통합 테스트 및 최적화

### 핵심 원칙

**백엔드 (FastAPI):**
- 각 알고리즘은 `steps` 리스트를 반환 (정렬된 배열이 아님!)
- 매 비교/교환마다 단계 기록: `{"type": "compare"|"swap", "indices": [i, j]}`
- 모든 알고리즘이 동일한 `initial_data`로 실행 (공정한 비교)
- CORS 설정 필수 (프론트엔드 포트 5173 허용)

**프론트엔드 (React):**
- 정렬 로직 없음 - 백엔드에서 받은 steps만 재생
- Props 불변성 유지 (`initialData` 복사본 사용)
- 인터벌 cleanup 필수 (메모리 누수 방지)
- 애니메이션 타이밍: 20ms (초당 50단계)

---

## Step-by-Step Plan

### Phase 0: 프로젝트 초기 설정 (15-20분)

#### Step 1: 백엔드 디렉토리 및 설정
1. `backend/` 디렉토리 생성
2. `backend/requirements.txt` 작성:
   ```
   fastapi==0.109.0
   uvicorn[standard]==0.27.0
   pydantic==2.5.3
   python-multipart==0.0.6
   ```
3. 빈 파일 생성: `backend/main.py`, `backend/algorithms.py`, `backend/models.py`

#### Step 2: 프론트엔드 디렉토리 및 설정
1. `frontend/` 디렉토리 생성
2. `frontend/package.json` 작성 (React 18.2.0, Vite 5.0.12, TailwindCSS 3.4.1)
3. `frontend/vite.config.js` 작성 (포트 5173, API 프록시 설정)
4. `frontend/tailwind.config.js` 작성 (네온 컬러: cyan, pink, green)
5. `frontend/postcss.config.js` 작성
6. `frontend/index.html` 작성
7. `frontend/src/index.css` 작성 (TailwindCSS 디렉티브)
8. 빈 파일 생성: `frontend/src/main.jsx`, `frontend/src/App.jsx`
9. `frontend/src/components/` 디렉토리 생성

#### Step 3: Git 설정
1. `.gitignore` 작성 (Python, Node, IDE 파일 제외)

**검증**: `pip install -r backend/requirements.txt` 및 `npm install` 성공

---

### Phase 1: 백엔드 구현 (100-135분)

#### Step 4: 데이터 모델 구현 (10-15분)
**파일**: `backend/models.py`

구현할 Pydantic 모델:
1. `RaceRequest`: 배열 크기 요청 (size: int, default=50, range=10~200)
2. `Step`: 단계 정보 (type: Literal["compare", "swap", "overwrite"], indices: List[int], pivot: Optional[int])
3. `RaceResponse`: 응답 (initial_data: List[int], results: Dict[str, List[Step]])

**참고**: `CLAUDE.md` 42-57번 줄, `.claude/docs/process_backend.md` 1단계

#### Step 5: O(N²) 알고리즘 구현 (30-40분)
**파일**: `backend/algorithms.py`

구현할 함수:
1. `bubble_sort(arr: List[int]) -> List[Dict]`
   - 인접 요소 비교 및 교환
   - 매 비교마다 `{"type": "compare", "indices": [j, j+1]}` 추가
   - 교환 시 `{"type": "swap", "indices": [j, j+1]}` 추가

2. `selection_sort(arr: List[int]) -> List[Dict]`
   - 최솟값 찾아서 앞으로 이동
   - 왼쪽에서 오른쪽으로 채워짐

3. `insertion_sort(arr: List[int]) -> List[Dict]`
   - 정렬된 부분에 삽입
   - 데이터 의존적 성능

**중요**:
- `arr.copy()` 사용 (원본 보존)
- `return steps` (정렬된 배열이 아님!)
- Type hints 포함

**참고**: `CLAUDE.md` 39-49번 줄, `.claude/docs/process_backend.md` 2.1-2.3

#### Step 6: O(N log N) 알고리즘 구현 (40-50분)
**파일**: `backend/algorithms.py` (계속)

구현할 함수:
1. `heap_sort(arr: List[int]) -> List[Dict]`
   - 힙 자료구조 사용
   - heapify 헬퍼 함수 필요
   - 많은 swap 발생

2. `quick_sort(arr: List[int]) -> List[Dict]`
   - 분할 정복
   - **중요**: `pivot` 필드 추가 (시각화용)
   - partition 및 재귀 함수 필요

**검증**:
```python
arr = [5, 2, 8, 1, 9]
quick_steps = quick_sort(arr)
bubble_steps = bubble_sort(arr)
assert len(quick_steps) < len(bubble_steps)  # Quick이 더 적어야 함
```

**참고**: `CLAUDE.md` 39-49번 줄, `.claude/docs/process_backend.md` 2.4-2.5

#### Step 7: FastAPI 엔드포인트 구현 (20-30분)
**파일**: `backend/main.py`

구현 내용:
1. FastAPI 앱 생성: `app = FastAPI(title="Algo Race 5 API")`
2. **CORS 설정** (필수!):
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"]
   )
   ```
3. 헬스 체크: `@app.get("/")` → `{"message": "Algo Race 5 API is running"}`
4. 경주 엔드포인트: `@app.post("/api/race", response_model=RaceResponse)`
   - `initial_data = random.sample(range(1, size*2), size)` (중복 없음)
   - 5개 알고리즘 모두 동일한 initial_data로 실행
   - results 딕셔너리 생성 (알고리즘 이름 → steps)

**검증**:
```bash
cd backend
uvicorn main:app --reload --port 8000
# http://localhost:8000/docs 접속하여 Swagger UI 확인
# POST /api/race (size=10) 테스트
```

**참고**: `CLAUDE.md` 51-56번 줄, `.claude/docs/process_backend.md` 3-4단계

---

### Phase 2: 프론트엔드 구현 (125-170분)

#### Step 8: 기본 구조 구현 (15-20분)

**파일 1**: `frontend/src/main.jsx`
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

**파일 2**: `frontend/src/index.css`
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

**파일 3**: `frontend/src/App.jsx`
- 헤더: "ALGO RACE 5" (멀티 컬러 네온: cyan/pink/green)
- 메인 컨텐츠: `<RaceTrack />` 컴포넌트

**검증**: `npm run dev` → http://localhost:5173 접속, 헤더 확인

**참고**: `.claude/docs/process_frontend.md` 1-2단계

#### Step 9: WinnerBadge 컴포넌트 (10분)

**파일**: `frontend/src/components/WinnerBadge.jsx`

구현 내용:
- Props: `rank` (1, 2, 3 또는 null)
- 1등: 🥇 (gold), 2등: 🥈 (silver), 3등: 🥉 (bronze)
- `absolute` 위치로 SortChart 위에 오버레이
- `bg-opacity-90`으로 반투명 배경

**참고**: `.claude/docs/process_frontend.md` 3단계

#### Step 10: SortChart 컴포넌트 (60-90분) ⚠️ **가장 중요!**

**파일**: `frontend/src/components/SortChart.jsx`

**Props**:
- `name`: 알고리즘 이름
- `initialData`: 시작 배열
- `steps`: 백엔드에서 받은 단계 배열
- `start`: Boolean (경주 시작 트리거)
- `onFinish`: 완료 콜백
- `rank`: 순위 (1-3 또는 null)

**State**:
```javascript
const [data, setData] = useState(initialData)        // 로컬 복사본!
const [currentStep, setCurrentStep] = useState(0)
const [highlights, setHighlights] = useState({})
const intervalRef = useRef(null)
```

**핵심 로직 - 애니메이션 루프**:
```javascript
useEffect(() => {
  if (start && currentStep < steps.length) {
    intervalRef.current = setInterval(() => {
      const step = steps[currentStep]

      if (step.type === 'compare') {
        // 빨간색 하이라이트만 (배열 수정 없음!)
        setHighlights({ [step.indices[0]]: 'compare', [step.indices[1]]: 'compare' })
      }
      else if (step.type === 'swap') {
        // 배열 수정 + 초록색 하이라이트
        setData(prev => {
          const newData = [...prev]  // 불변성 유지!
          const [i, j] = step.indices
          ;[newData[i], newData[j]] = [newData[j], newData[i]]
          return newData
        })
        setHighlights({ [step.indices[0]]: 'swap', [step.indices[1]]: 'swap' })
      }

      setCurrentStep(prev => prev + 1)
    }, 20)  // 20ms = 50 steps/sec
  }
  else if (currentStep >= steps.length) {
    clearInterval(intervalRef.current)
    onFinish(name)  // 완료 알림
  }

  // Cleanup (필수! 메모리 누수 방지)
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }
}, [start, currentStep, steps, name, onFinish])
```

**하이라이트 자동 제거** (100ms 후):
```javascript
useEffect(() => {
  if (Object.keys(highlights).length > 0) {
    const timer = setTimeout(() => setHighlights({}), 100)
    return () => clearTimeout(timer)
  }
}, [highlights])
```

**막대 색상 로직**:
- `compare` → `bg-rose-500` (빨강)
- `swap` → `bg-emerald-400` (초록)
- `pivot` → `bg-purple-500` (보라, 퀵 정렬용)
- 기본 → `bg-cyan-400` (시안)

**렌더링**:
- WinnerBadge (조건부)
- 알고리즘 이름
- 진행률 표시: `{currentStep} / {steps.length} steps`
- 막대 그래프: `flex items-end h-64`
  - 높이: `${(value / maxValue) * 100}%`
  - 동적 색상: `getBarColor(index)`

**참고**: `CLAUDE.md` 61-73번 줄, `.claude/docs/process_frontend.md` 4단계

#### Step 11: RaceTrack 컨테이너 (40-50분)

**파일**: `frontend/src/components/RaceTrack.jsx`

**State**:
```javascript
const [raceData, setRaceData] = useState(null)          // API 응답
const [started, setStarted] = useState(false)           // 경주 시작 여부
const [finishedOrder, setFinishedOrder] = useState([])  // 완료 순서
const [loading, setLoading] = useState(false)
```

**API 호출**:
```javascript
const handleStartRace = async () => {
  setLoading(true)
  try {
    const response = await fetch('/api/race', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ size: 50 })
    })
    const data = await response.json()
    setRaceData(data)
    setStarted(true)
  } catch (error) {
    alert('백엔드 서버를 확인하세요')
  } finally {
    setLoading(false)
  }
}
```

**순위 시스템**:
```javascript
const handleFinish = (algorithmName) => {
  setFinishedOrder(prev =>
    !prev.includes(algorithmName) ? [...prev, algorithmName] : prev
  )
}

const getRank = (algorithmName) => {
  const index = finishedOrder.indexOf(algorithmName)
  return index === -1 ? null : index + 1
}
```

**렌더링**:
1. START RACE 버튼 (네온 시안 배경, 호버 효과)
2. 완료 순위 표시 (상위 3개)
3. 반응형 그리드:
   ```javascript
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {algorithms.map(name => (
       <SortChart
         key={name}
         name={name}
         initialData={raceData.initial_data}
         steps={raceData.results[name]}
         start={started}
         onFinish={handleFinish}
         rank={getRank(name)}
       />
     ))}
   </div>
   ```

**참고**: `CLAUDE.md` 75-99번 줄, `.claude/docs/process_frontend.md` 5단계

---

### Phase 3: 통합 및 최적화 (135-195분)

#### Step 12: 통합 테스트 (60-90분)

**백엔드 테스트**:
```bash
cd backend
uvicorn main:app --reload --port 8000
# Swagger UI (http://localhost:8000/docs)에서:
# - POST /api/race (size=10, 50, 100) 테스트
# - 응답 시간 5초 이내 확인
# - Quick < Heap < Insertion ≤ Selection < Bubble 순서 확인
```

**프론트엔드 테스트**:
```bash
cd frontend
npm run dev
# http://localhost:5173 접속
```

**체크리스트**:
- [ ] START RACE 버튼 클릭
- [ ] 5개 차트 동시 렌더링
- [ ] 애니메이션 정상 동작 (색상 변화)
- [ ] Quick Sort가 먼저 완료
- [ ] Bubble Sort가 나중에 완료
- [ ] 메달 표시 (🥇🥈🥉)
- [ ] 브라우저 콘솔 에러 없음
- [ ] 메모리 누수 경고 없음

**흔한 버그와 해결**:
1. CORS 에러 → backend/main.py에서 allow_origins 확인
2. 차트 업데이트 안 됨 → SortChart에서 `[...prev]` 복사 확인
3. 메모리 누수 → useEffect cleanup 함수 확인
4. 애니메이션 속도 → setInterval 타이밍 조정 (10-50ms)

**참고**: `CLAUDE.md` 125-136번 줄, `.claude/agents/debug-agent.md`

#### Step 13: 스타일링 완성 (30-45분)

**사이버펑크 테마 강화**:
1. 헤더에 네온 그림자 효과:
   ```javascript
   className="drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
   ```
2. 버튼 호버 효과:
   ```javascript
   hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105
   ```
3. 차트 카드 호버:
   ```javascript
   hover:border-cyan-500 transition-all duration-300
   ```
4. 진행률 바 (선택사항):
   ```javascript
   <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
     <div className="bg-cyan-400 h-2 rounded-full"
          style={{ width: `${(currentStep / steps.length) * 100}%` }} />
   </div>
   ```

**참고**: `CLAUDE.md` 101-109번 줄

#### Step 14: 성능 최적화 (45-60분) - 선택사항

1. **React.memo 적용**:
   ```javascript
   const SortChart = React.memo(({ ... }) => { ... })
   const WinnerBadge = React.memo(({ rank }) => { ... })
   ```

2. **useCallback 적용**:
   ```javascript
   const handleFinish = useCallback((name) => { ... }, [])
   const getRank = useCallback((name) => { ... }, [finishedOrder])
   ```

3. **반응형 디자인 강화**:
   - 모바일: `grid-cols-1`
   - 태블릿: `sm:grid-cols-2`
   - 데스크톱: `lg:grid-cols-3`

4. **로딩/에러 상태 표시**:
   - 스피너 애니메이션
   - 에러 메시지 배너

---

## Critical Files

### 백엔드 파일
1. `backend/models.py` - Pydantic 데이터 모델 (3개 클래스)
2. `backend/algorithms.py` - 5개 정렬 알고리즘 (각 ~30줄)
3. `backend/main.py` - FastAPI 앱 및 엔드포인트 (~50줄)
4. `backend/requirements.txt` - Python 의존성 (4줄)

### 프론트엔드 파일
1. `frontend/src/components/SortChart.jsx` - 핵심 애니메이션 컴포넌트 (~130줄)
2. `frontend/src/components/RaceTrack.jsx` - 메인 컨테이너 (~120줄)
3. `frontend/src/components/WinnerBadge.jsx` - 메달 표시 (~30줄)
4. `frontend/src/App.jsx` - 레이아웃 (~30줄)
5. `frontend/src/main.jsx` - React 진입점 (~10줄)
6. `frontend/src/index.css` - 전역 스타일 (~15줄)
7. `frontend/package.json` - npm 설정
8. `frontend/vite.config.js` - Vite 설정 (프록시 포함)
9. `frontend/tailwind.config.js` - 네온 컬러 정의
10. `frontend/index.html` - HTML 진입점

### 설정 파일
1. `.gitignore` - Git 제외 파일

---

## Verification

### 백엔드 검증
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 1. 서버 실행 확인
# 2. http://localhost:8000 접속 → {"message": "Algo Race 5 API is running"}
# 3. http://localhost:8000/docs 접속 → Swagger UI
# 4. POST /api/race (size=10) 테스트
#    - 응답에 initial_data 있는지
#    - 응답에 5개 알고리즘 results 있는지
#    - Quick Sort 단계 수 < Bubble Sort 단계 수 확인
```

### 프론트엔드 검증
```bash
cd frontend
npm install
npm run dev

# 1. http://localhost:5173 접속
# 2. 헤더 "ALGO RACE 5" 표시 확인 (멀티 컬러)
# 3. START RACE 버튼 표시 확인
# 4. 백엔드 서버 실행 상태에서 버튼 클릭
# 5. 5개 차트가 동시에 나타나는지 확인
# 6. 막대 색상이 변하는지 확인 (빨강→초록→시안)
# 7. Quick Sort가 먼저 완료되는지 확인
# 8. Bubble Sort가 나중에 완료되는지 확인
# 9. 완료 순서에 메달 표시되는지 확인 (🥇🥈🥉)
# 10. 브라우저 콘솔(F12) 에러 확인
```

### 통합 검증
```bash
# 두 개의 터미널 필요:

# Terminal 1 (Backend):
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 (Frontend):
cd frontend
npm run dev

# 브라우저에서 전체 플로우 테스트:
# 1. START RACE 클릭
# 2. 5개 알고리즘이 동시에 경주 시작
# 3. Quick/Heap이 빠르게, Bubble이 느리게 진행
# 4. 완료 순위 및 메달 표시
# 5. 여러 번 반복 테스트 (연속 실행)
```

### 성공 기준
- ✅ 백엔드 API가 올바른 형식으로 응답
- ✅ 프론트엔드가 5개 차트를 동시에 애니메이션
- ✅ 시간 복잡도 차이가 시각적으로 명확 (Quick이 Bubble보다 10배 빠름)
- ✅ 메달 순위 시스템 정상 동작
- ✅ 브라우저 콘솔 에러 없음
- ✅ CORS 에러 없음
- ✅ 메모리 누수 경고 없음

---

## Reference Documents

### 필수 참고
- `CLAUDE.md` - 프로젝트 전체 가이드 (아키텍처, 주의사항, 시간 복잡도)
- `.claude/docs/plan_ready.md` - 상세 개발 계획 (이 플랜의 기반)
- `.claude/docs/new_project_description.md` - 프로젝트 명세

### 백엔드 참고
- `.claude/docs/process_backend.md` - 백엔드 구현 상세 프로세스
- `.claude/skills/build-backend/SKILL.md` - 백엔드 스킬 가이드
- `.claude/agents/backend-agent.md` - 백엔드 에이전트 가이드

### 프론트엔드 참고
- `.claude/docs/process_frontend.md` - 프론트엔드 구현 상세 프로세스
- `.claude/skills/build-frontend/SKILL.md` - 프론트엔드 스킬 가이드
- `.claude/agents/frontend-agent.md` - 프론트엔드 에이전트 가이드

### 기타
- `.claude/agents/debug-agent.md` - 디버깅 가이드 (흔한 에러 해결)
- `.claude/agents/setup-agent.md` - 초기 설정 가이드

---

## Estimated Timeline

- **Phase 0** (초기 설정): 15-20분
- **Phase 1** (백엔드): 100-135분
- **Phase 2** (프론트엔드): 125-170분
- **Phase 3** (통합 및 최적화): 135-195분

**총 예상 시간**: 6-10시간

---

## Notes

### 중요 체크포인트
1. ✅ **Step 7 완료 후**: Swagger UI에서 API 테스트 필수
2. ✅ **Step 10 완료 후**: SortChart만 따로 테스트 권장
3. ✅ **Step 11 완료 후**: 백엔드와 프론트엔드 통합 테스트
4. ✅ **Step 12 완료 후**: 모든 버그 수정 확인

### 흔한 실수 방지
- ❌ 프론트엔드에 정렬 로직 구현 금지
- ❌ Props 직접 수정 금지 (`initialData` 복사본 사용)
- ❌ 인터벌 cleanup 잊지 말기
- ❌ "compare"와 "swap" 타입 혼동 금지

### 개발 팁
- SortChart가 가장 복잡하므로 충분한 시간 할애
- 애니메이션 타이밍은 실험적으로 조정 (20ms 시작)
- CORS 에러 발생 시 backend/main.py의 allow_origins 확인
- 작은 배열(size=10)로 먼저 테스트 후 큰 배열로 확장
