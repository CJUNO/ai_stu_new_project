# Frontend Agent Context Save - 2025-02-10

## 작업 개요
- **날짜:** 2025-02-10
- **에이전트:** frontend
- **사용자 요청:** "React + Vite + TailwindCSS 기반 프론트엔드 구현 (사이버펑크 테마, 애니메이션 시스템)"
- **작업 상태:** ✅ 완료

## 작업 흐름

```
1. 사용자 요청 분석
   ↓
2. React 진입점 작성 (main.jsx)
   ↓
3. 메인 레이아웃 작성 (App.jsx)
   - 사이버펑크 헤더
   - RaceTrack 컴포넌트 포함
   ↓
4. WinnerBadge 컴포넌트 작성
   - 메달 표시 로직
   ↓
5. SortChart 컴포넌트 작성 ⭐ 핵심
   - 애니메이션 루프
   - Props 불변성 유지
   - 인터벌 cleanup
   - 색상 시스템
   ↓
6. RaceTrack 컨테이너 작성
   - API 호출
   - 순위 시스템
   - 5개 차트 관리
   ↓
7. 작업 완료 확인
```

## 사용한 도구

### Write 도구: 5회
1. `frontend/src/main.jsx` - React 진입점
2. `frontend/src/App.jsx` - 메인 레이아웃
3. `frontend/src/components/WinnerBadge.jsx` - 메달 표시
4. `frontend/src/components/SortChart.jsx` - 핵심 애니메이션 컴포넌트
5. `frontend/src/components/RaceTrack.jsx` - 메인 컨테이너

## 파일 작업 내역

### 1. frontend/src/main.jsx
**작업 유형:** 생성 (빈 파일 → 완성, 10줄)

**변경 이유:**
React 애플리케이션의 진입점으로 DOM에 앱을 렌더링

**변경 내용:**
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

**참고한 정보:**
- `.claude/docs/new_project_description.md`:32번 줄 (src/main.jsx)
- React 18 공식 문서 (createRoot API)

**의사결정:**
- `React.StrictMode`: 개발 모드에서 잠재적 문제 감지 (메모리 누수, 부작용 등)
- `createRoot`: React 18의 새로운 렌더링 API (동시성 모드 지원)

---

### 2. frontend/src/App.jsx
**작업 유형:** 생성 (빈 파일 → 완성, 28줄)

**변경 이유:**
애플리케이션의 최상위 레이아웃과 사이버펑크 테마 헤더 구성

**변경 내용:**
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

**참고한 정보:**
- `.claude/docs/new_project_description.md`:30번 줄 (App.jsx 구조)
- `.claude/docs/new_project_description.md`:8번 줄 (Cyberpunk Theme)
- `CLAUDE.md`:104-108번 줄 (네온 컬러 정의)

**의사결정:**
- 멀티 컬러 헤더: cyan, pink, green으로 각 단어 강조
- `font-mono`: 사이버펑크 느낌의 모노스페이스 폰트
- `border-cyan-500`: 네온 시안 테두리로 섹션 구분

---

### 3. frontend/src/components/WinnerBadge.jsx
**작업 유형:** 생성 (빈 파일 → 완성, 24줄)

**변경 이유:**
완료한 알고리즘에게 메달(🥇🥈🥉)을 표시하는 컴포넌트

**변경 내용:**
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

**참고한 정보:**
- `.claude/docs/new_project_description.md`:29번 줄 (WinnerBadge 컴포넌트)
- `.claude/docs/new_project_description.md`:84번 줄 (메달 시스템)

**의사결정:**
- `absolute` 위치: SortChart 위에 오버레이
- `bg-opacity-90`: 반투명 배경으로 차트 일부 보이게
- `if (!badge) return null`: 순위 없으면 렌더링 안 함 (Early return)

---

### 4. frontend/src/components/SortChart.jsx
**작업 유형:** 생성 (빈 파일 → 완성, 109줄) ⭐ **가장 중요!**

**변경 이유:**
개별 알고리즘의 단계를 재생하는 핵심 애니메이션 컴포넌트

**변경 내용:**

#### State 관리
```javascript
const [data, setData] = useState(initialData)        // 로컬 복사본!
const [currentStep, setCurrentStep] = useState(0)
const [highlights, setHighlights] = useState({})
const intervalRef = useRef(null)
```

**설계 이유:**
- `data`: Props 불변성 유지 위해 로컬 복사본 사용
- `currentStep`: 현재 진행 중인 단계 인덱스
- `highlights`: 임시 색상 변경용 (100ms 후 제거)
- `intervalRef`: cleanup 시 인터벌 정리용

---

#### 애니메이션 루프 (핵심 로직)
```javascript
useEffect(() => {
  if (start && currentStep < steps.length) {
    intervalRef.current = setInterval(() => {
      const step = steps[currentStep]

      // 하이라이트 설정
      if (step.type === 'compare') {
        setHighlights({
          [step.indices[0]]: 'compare',
          [step.indices[1]]: 'compare',
          ...(step.pivot !== undefined && { [step.pivot]: 'pivot' })
        })
      } else if (step.type === 'swap') {
        // 배열 교환
        setData(prev => {
          const newData = [...prev]  // 불변성 유지!
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
    }, 20) // 20ms 간격 (50 steps/sec)
  } else if (currentStep >= steps.length && intervalRef.current) {
    // 완료
    clearInterval(intervalRef.current)
    onFinish(name)
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }
}, [start, currentStep, steps, name, onFinish])
```

**설계 결정:**

1. **20ms 타이밍 선택:**
   - 10ms: 너무 빠름, 차이 구분 어려움
   - 50ms: 너무 느림, 지루함
   - 20ms: 초당 50단계 처리, 적절한 시각화 ✅

2. **Props 불변성 유지:**
   - `const newData = [...prev]`: 복사본 생성
   - 원본 `initialData` 변경 방지
   - React 리렌더링 트리거 보장

3. **Cleanup 함수 필수:**
   - 컴포넌트 언마운트 시 인터벌 정리
   - 메모리 누수 방지
   - `clearInterval(intervalRef.current)` 호출

**참고 문서:**
- `.claude/docs/new_project_description.md`:60-77번 줄 (SortChart 명세)
- `CLAUDE.md`:61-73번 줄 (애니메이션 로직)
- `CLAUDE.md`:119-120번 줄 (애니메이션 속도)
- `CLAUDE.md`:122번 줄 (Props 불변성)

---

#### 하이라이트 자동 제거
```javascript
useEffect(() => {
  if (Object.keys(highlights).length > 0) {
    const timer = setTimeout(() => {
      setHighlights({})
    }, 100)
    return () => clearTimeout(timer)
  }
}, [highlights])
```

**설계 이유:**
- 100ms 후 하이라이트 제거로 깜빡임 효과
- 비교/교환이 명확히 보이게
- cleanup 함수로 타이머 정리

---

#### 막대 색상 로직
```javascript
const getBarColor = (index) => {
  const highlightType = highlights[index]
  if (highlightType === 'compare') return 'bg-rose-500'    // 빨강
  if (highlightType === 'swap') return 'bg-emerald-400'    // 초록
  if (highlightType === 'pivot') return 'bg-purple-500'    // 보라
  return 'bg-cyan-400'                                      // 시안
}
```

**색상 선택 근거:**
- `CLAUDE.md`:105-107번 줄:
  - 비교: `bg-rose-500` (네온 레드)
  - 교환: `bg-emerald-400` (네온 그린)
  - 기본: `bg-cyan-400` (네온 시안)
- 보라색 추가: 퀵 정렬 피벗 강조용

---

#### 높이 정규화
```javascript
const maxValue = Math.max(...initialData)
// ...
style={{ height: `${(value / maxValue) * 100}%` }}
```

**설계 이유:**
- 배열 값 범위가 다양할 수 있음 (1~100, 1~200 등)
- 최댓값 기준 정규화로 항상 컨테이너 높이에 맞게 표시

---

### 5. frontend/src/components/RaceTrack.jsx
**작업 유형:** 생성 (빈 파일 → 완성, 121줄)

**변경 이유:**
5개의 SortChart를 관리하고 경주를 시작/제어하는 메인 컨테이너

**변경 내용:**

#### State 관리
```javascript
const [raceData, setRaceData] = useState(null)          // API 응답
const [started, setStarted] = useState(false)           // 경주 시작 여부
const [finishedOrder, setFinishedOrder] = useState([])  // 완료 순서
const [loading, setLoading] = useState(false)           // 로딩 상태
```

---

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

    if (!response.ok) {
      throw new Error('API 호출 실패')
    }

    const data = await response.json()
    setRaceData(data)
    setStarted(true)
  } catch (error) {
    console.error('경주 시작 실패:', error)
    alert('경주를 시작할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.')
  } finally {
    setLoading(false)
  }
}
```

**설계 결정:**
- `fetch` 사용: 추가 라이브러리 불필요, 브라우저 기본 API
- `/api/race`: vite.config.js 프록시 설정으로 자동 변환
- 에러 처리: try-catch로 사용자 친화적 메시지

**참고 문서:**
- `.claude/docs/new_project_description.md`:80번 줄 (API 호출)
- `CLAUDE.md`:75-82번 줄 (RaceTrack 구조)

---

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
  return index + 1 // 1등, 2등, 3등
}
```

**동작 방식:**
1. SortChart가 완료되면 `onFinish(name)` 호출
2. `handleFinish`가 `finishedOrder` 배열에 이름 추가
3. `getRank`로 순위 계산 (배열 인덱스 + 1)
4. 순위를 SortChart의 `rank` prop으로 전달

**참고 문서:**
- `.claude/docs/new_project_description.md`:82-84번 줄 (순위 시스템)

---

#### 반응형 그리드
```javascript
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
```

**반응형 디자인:**
- 모바일: 1열 (`grid-cols-1`)
- 태블릿: 2열 (`md:grid-cols-2`)
- 데스크톱: 3열 (`lg:grid-cols-3`)

**참고 문서:**
- `.claude/docs/new_project_description.md`:80번 줄 (2행 3열 반응형 Grid)

---

## 의사결정 기록

### 의사결정 1: React 18 vs React 17

**선택한 방법:** React 18.2.0

**고려한 대안:**
1. React 17 - 구버전, Concurrent Mode 없음
2. React 18 - 동시성 기능, createRoot API ✅
3. React 19 (베타) - 불안정

**선택 이유:**
- `createRoot` API로 동시성 렌더링 지원
- 안정적인 최신 버전
- 명세서에서 React 18 명시

**참고 문서:**
- `.claude/docs/new_project_description.md`:12번 줄 (React 명시)

---

### 의사결정 2: fetch vs axios

**선택한 방법:** `fetch` (브라우저 기본 API)

**고려한 대안:**
1. axios - 편리한 기능 많지만 번들 크기 증가
2. fetch - 브라우저 기본 API, 추가 설치 불필요 ✅
3. SWR/React Query - 복잡한 캐싱 불필요

**선택 이유:**
- 단순한 POST 요청만 필요
- 추가 라이브러리 불필요
- 번들 크기 최소화

---

### 의사결정 3: 애니메이션 타이밍 (20ms)

**선택한 방법:** `setInterval(..., 20)`

**고려한 대안:**
1. 10ms - 너무 빠름, 차이 안 보임
2. 20ms - 초당 50단계, 적절한 시각화 ✅
3. 50ms - 너무 느림, 지루함

**선택 이유:**
- 명세서 권장 범위 (10-50ms)
- 초당 50단계 처리로 시각적 균형
- Quick과 Bubble의 차이가 명확히 보임

**참고 문서:**
- `.claude/docs/new_project_description.md`:70번 줄 (10ms~50ms)
- `CLAUDE.md`:119-120번 줄 (애니메이션 속도)

---

### 의사결정 4: Props 불변성 유지 방법

**선택한 방법:** `[...prev]` 스프레드 연산자로 복사

**고려한 대안:**
1. Props 직접 수정 - React 불변성 위반 ❌
2. `slice()` - 복사 가능하지만 가독성 낮음
3. `[...prev]` - 스프레드 연산자, 가독성 좋음 ✅

**선택 이유:**
- React 불변성 원칙 준수
- 리렌더링 트리거 보장
- 코드 가독성 높음

**참고 문서:**
- `CLAUDE.md`:122번 줄 ("Props 불변성 유지가 중요합니다")
- `.claude/docs/new_project_description.md`:73번 줄 ("배열 복사본 수정")

---

### 의사결정 5: Cleanup 함수 위치

**선택한 방법:** `useEffect` 리턴에 cleanup 함수 배치

**이유:**
- 컴포넌트 언마운트 시 자동 실행
- 메모리 누수 방지
- React 표준 패턴

**참고 문서:**
- `CLAUDE.md`:123번 줄 ("useEffect cleanup 함수는 필수입니다")
- `.claude/agents/debug-agent.md`:202-228번 줄 (메모리 누수 에러)

---

## 에러 및 해결

### 예상 에러 1: Props 수정으로 인한 차트 미업데이트 (사전 방지)

**예상 상황:**
```javascript
// ❌ 잘못된 코드
initialData[i] = initialData[j]  // Props 직접 수정!
```

**사전 방지 방법:**
```javascript
// ✅ 올바른 코드
setData(prev => {
  const newData = [...prev]  // 복사본 생성
  [newData[i], newData[j]] = [newData[j], newData[i]]
  return newData
})
```

**참고 문서:**
- `CLAUDE.md`:122번 줄
- `.claude/agents/debug-agent.md`:177-199번 줄

---

### 예상 에러 2: 메모리 누수 경고 (사전 방지)

**예상 상황:**
```
Warning: Can't perform a React state update on an unmounted component
```

**사전 방지 방법:**
```javascript
useEffect(() => {
  const interval = setInterval(...)

  // Cleanup 함수 추가!
  return () => {
    if (interval) {
      clearInterval(interval)
    }
  }
}, [])
```

**참고 문서:**
- `CLAUDE.md`:123번 줄
- `.claude/agents/debug-agent.md`:202-228번 줄

---

### 예상 에러 3: API 연동 실패 (에러 처리 구현)

**예상 상황:** 백엔드 서버가 실행 중이지 않음

**해결 방법:**
```javascript
try {
  const response = await fetch('/api/race', ...)
  if (!response.ok) throw new Error('API 호출 실패')
  // ...
} catch (error) {
  console.error('경주 시작 실패:', error)
  alert('백엔드 서버가 실행 중인지 확인하세요.')
}
```

**효과:** 사용자 친화적 에러 메시지

---

## 작성된 주요 코드

### 1. 애니메이션 루프 (핵심 로직)
```javascript
useEffect(() => {
  if (start && currentStep < steps.length) {
    intervalRef.current = setInterval(() => {
      const step = steps[currentStep]

      if (step.type === 'compare') {
        setHighlights({ ... })
      } else if (step.type === 'swap') {
        setData(prev => {
          const newData = [...prev]
          [newData[i], newData[j]] = [newData[j], newData[i]]
          return newData
        })
      }

      setCurrentStep(prev => prev + 1)
    }, 20)
  }

  return () => clearInterval(intervalRef.current)
}, [start, currentStep, steps, name, onFinish])
```
**설명:** 20ms마다 단계 실행, 불변성 유지, cleanup 포함

---

### 2. 순위 시스템
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
**설명:** 완료 순서 추적, 순위 계산

---

### 3. 색상 시스템
```javascript
const getBarColor = (index) => {
  const highlightType = highlights[index]
  if (highlightType === 'compare') return 'bg-rose-500'    // 빨강
  if (highlightType === 'swap') return 'bg-emerald-400'    // 초록
  if (highlightType === 'pivot') return 'bg-purple-500'    // 보라
  return 'bg-cyan-400'                                      // 시안
}
```
**설명:** 단계 타입에 따른 동적 색상

---

## 참고한 문서

### 1. 프로젝트 명세
- **`.claude/docs/new_project_description.md`**
  - 8번 줄: Cyberpunk Theme
  - 12번 줄: React + Vite + TailwindCSS
  - 29번 줄: WinnerBadge
  - 30번 줄: App.jsx
  - 60-77번 줄: SortChart 명세
  - 79-87번 줄: RaceTrack 명세

### 2. 프로젝트 가이드
- **`CLAUDE.md`**
  - 61-73번 줄: 애니메이션 로직
  - 75-99번 줄: RaceTrack 구조
  - 104-108번 줄: 네온 컬러 정의
  - 119-120번 줄: 애니메이션 속도
  - 122번 줄: Props 불변성
  - 123번 줄: cleanup 필수
  - 136번 줄: compare vs swap

### 3. 프론트엔드 프로세스
- **`.claude/docs/process_frontend.md`**
  - 1-2단계: 기본 구조
  - 3단계: WinnerBadge
  - 4단계: SortChart
  - 5단계: RaceTrack

### 4. 디버그 가이드
- **`.claude/agents/debug-agent.md`**
  - 177-199번 줄: Props 수정 에러
  - 202-228번 줄: 메모리 누수 경고

### 5. 공식 문서
- React 18 공식 문서 (createRoot, useEffect)
- TailwindCSS 문서 (반응형 그리드)
- MDN Web Docs (Fetch API)

---

## 컴포넌트 의존성 다이어그램

```
App.jsx
  └─ RaceTrack.jsx
       ├─ SortChart.jsx (× 5개)
       │    └─ WinnerBadge.jsx
       └─ API: /api/race
```

**데이터 흐름:**
1. RaceTrack → API 호출 → raceData 획득
2. raceData → 5개 SortChart에 props 전달
3. SortChart → 애니메이션 완료 → onFinish 호출
4. RaceTrack → finishedOrder 업데이트 → 순위 계산
5. 순위 → WinnerBadge 표시

---

## 다음 작업 힌트

### 1. 통합 테스트
**할 일:**
- 백엔드 서버 실행 (포트 8000)
- 프론트엔드 서버 실행 (포트 5173)
- 브라우저 테스트

**검증 사항:**
- START RACE 버튼 클릭
- 5개 차트 동시 렌더링
- 색상 변화 (빨강→초록→시안)
- Quick Sort가 먼저 완료
- Bubble Sort가 나중에 완료
- 메달 표시 (🥇🥈🥉)
- 브라우저 콘솔 에러 없음

---

### 2. 의존성 설치
```bash
cd frontend
npm install
npm run dev
```

**확인사항:**
- node_modules/ 생성
- http://localhost:5173 접속 가능
- 헤더 "ALGO RACE 5" 표시

---

### 3. 알려진 제약사항
- Node.js 18+ 권장
- 백엔드 서버 선행 실행 필요 (포트 8000)
- CORS 설정 의존 (백엔드에서 설정)

---

### 4. 개선 가능한 부분
- React.memo 적용 (성능 최적화)
- useCallback 적용 (리렌더링 최소화)
- 배열 크기 조절 UI 추가
- 일시정지/재개 기능
- 속도 조절 슬라이더
- 사운드 효과 (Web Audio API)
- 로딩 스피너 애니메이션
- 에러 바운더리 추가

---

## 작업 완료 체크리스트

- ✅ main.jsx 작성 (React 진입점)
- ✅ App.jsx 작성 (사이버펑크 헤더)
- ✅ WinnerBadge.jsx 작성 (메달 표시)
- ✅ SortChart.jsx 작성 (핵심 애니메이션)
  - ✅ 애니메이션 루프 (20ms)
  - ✅ Props 불변성 유지
  - ✅ 인터벌 cleanup
  - ✅ 색상 시스템 (4가지 색상)
  - ✅ 하이라이트 자동 제거
- ✅ RaceTrack.jsx 작성 (메인 컨테이너)
  - ✅ API 호출
  - ✅ 순위 시스템
  - ✅ 반응형 그리드
- ✅ 정렬 로직 없음 (백엔드 steps만 재생)
- ✅ 메모리 누수 방지 (cleanup 함수)

**다음 단계:** 통합 테스트 및 검증
