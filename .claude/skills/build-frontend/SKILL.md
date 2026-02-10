---
name: build-frontend
description: React + Vite + TailwindCSS 기반 프론트엔드 구축 - 사이버펑크 테마의 정렬 알고리즘 시각화 경주 UI와 애니메이션 시스템을 구현하는 스킬
---

# Build Frontend Skill

## 스킬 설명
Algo-Race 5 프론트엔드를 구축하는 스킬입니다. React 컴포넌트와 사이버펑크 테마 스타일을 구현합니다.

## 사용법
```
/build-frontend
```

## 전제 조건
- `/setup-project` 스킬이 먼저 실행되어야 합니다
- `frontend/` 디렉토리와 설정 파일들이 존재해야 합니다
- `/build-backend` 스킬이 완료되어 API가 준비되어야 합니다

## 이 스킬이 수행하는 작업

### 1. main.jsx 작성
**참고 문서:**
- `.claude/docs/new_project_description.md` 32번 줄
- `CLAUDE.md` 해당 없음 (표준 React 진입점)

**작성 이유:**
React 애플리케이션의 진입점으로 DOM에 앱을 렌더링

**작성된 코드:**
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

**코드 설명:**
- `React.StrictMode`: 개발 모드에서 잠재적 문제 감지
- `document.getElementById('root')`: index.html의 `<div id="root">` 연결

### 2. index.css 작성
**참고 문서:**
- `.claude/docs/new_project_description.md` 8번 줄, 88-94번 줄
- `CLAUDE.md` 103-109번 줄

**작성 이유:**
TailwindCSS 초기화 및 전역 스타일 정의

**작성된 코드:**
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
- `font-family`: 사이버펑크 테마의 모노스페이스 폰트
- `background-color: #111827`: TailwindCSS의 `bg-gray-900` (매우 어두운 배경)

### 3. App.jsx 작성
**참고 문서:**
- `.claude/docs/new_project_description.md` 30번 줄
- `CLAUDE.md` 해당 없음 (레이아웃 컴포넌트)

**작성 이유:**
애플리케이션의 최상위 레이아웃과 헤더 구성

**작성된 코드:**
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
- `bg-gray-900`: 어두운 배경 (사이버펑크 테마)
- `text-cyan-400`, `text-pink-500`, `text-green-400`: 네온 컬러로 제목 강조
- `border-cyan-500`: 네온 사이안 테두리로 구분선

### 4. WinnerBadge.jsx 작성
**참고 문서:**
- `.claude/docs/new_project_description.md` 29번 줄, 84번 줄
- `CLAUDE.md` 84번 줄

**작성 이유:**
완료한 알고리즘에게 메달(🥇🥈🥉)을 표시하는 컴포넌트

**작성된 코드:**
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

**코드 설명:**
- `badges` 객체: 1~3등 메달 정보 (이모지, 색상, 텍스트)
- `absolute`: 차트 위에 오버레이 (RaceTrack에서 상대 위치 지정)
- `bg-opacity-90`: 반투명 배경으로 차트 일부 보이게

**근거:**
- 명세서 6번 줄: "먼저 정렬을 마친 알고리즘에게 1등, 2등, 3등 메달(Badges) 부여"

### 5. SortChart.jsx 작성
**참고 문서:**
- `.claude/docs/new_project_description.md` 60-77번 줄
- `CLAUDE.md` 61-73번 줄

**작성 이유:**
개별 알고리즘의 단계를 재생하는 핵심 플레이어 컴포넌트

**작성된 코드:**
```javascript
import React, { useState, useEffect, useRef } from 'react'
import WinnerBadge from './WinnerBadge'

const SortChart = ({ name, initialData, steps, start, onFinish, rank }) => {
  const [data, setData] = useState(initialData)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlights, setHighlights] = useState({})
  const intervalRef = useRef(null)

  // 애니메이션 시작/중지
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
            const newData = [...prev]
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

  // 하이라이트 제거 (100ms 후)
  useEffect(() => {
    if (Object.keys(highlights).length > 0) {
      const timer = setTimeout(() => {
        setHighlights({})
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [highlights])

  // 막대 색상 결정
  const getBarColor = (index) => {
    const highlightType = highlights[index]
    if (highlightType === 'compare') return 'bg-rose-500' // 빨강 (비교)
    if (highlightType === 'swap') return 'bg-emerald-400' // 초록 (교환)
    if (highlightType === 'pivot') return 'bg-purple-500' // 보라 (피벗)
    return 'bg-cyan-400' // 기본 (시안)
  }

  // 최댓값 계산 (높이 정규화용)
  const maxValue = Math.max(...initialData)

  return (
    <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-4">
      {/* 순위 배지 */}
      {rank && <WinnerBadge rank={rank} />}

      {/* 알고리즘 이름 */}
      <h3 className="text-xl font-mono font-bold mb-4 text-center">
        {name}
      </h3>

      {/* 진행률 */}
      <div className="mb-2 text-sm text-gray-400 text-center font-mono">
        {currentStep} / {steps.length} steps
      </div>

      {/* 막대 그래프 */}
      <div className="flex items-end justify-center gap-1 h-64">
        {data.map((value, index) => (
          <div
            key={index}
            className={`flex-1 ${getBarColor(index)} transition-all duration-100 rounded-t`}
            style={{
              height: `${(value / maxValue) * 100}%`,
              minWidth: '2px'
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default SortChart
```

**코드 흐름 설명:**

#### State 관리
```javascript
const [data, setData] = useState(initialData)        // 현재 배열 상태
const [currentStep, setCurrentStep] = useState(0)    // 현재 단계 인덱스
const [highlights, setHighlights] = useState({})     // 하이라이트 인덱스
const intervalRef = useRef(null)                     // 인터벌 참조
```

**왜 이렇게 설계했는가:**
- `data`: 로컬 복사본으로 props 변경 방지 (CLAUDE.md 122번 줄)
- `currentStep`: 진행 상황 추적
- `highlights`: 임시 색상 변경용 (100ms 후 제거)
- `intervalRef`: 컴포넌트 언마운트 시 인터벌 정리

#### 애니메이션 루프
```javascript
useEffect(() => {
  if (start && currentStep < steps.length) {
    intervalRef.current = setInterval(() => {
      const step = steps[currentStep]
      // ... 단계 처리
      setCurrentStep(prev => prev + 1)
    }, 20) // 20ms = 50 steps/sec
  }
  // ... 정리 로직
}, [start, currentStep, steps, name, onFinish])
```

**타이밍 선택 (20ms):**
- 명세서 70번 줄: "10ms~50ms"
- 20ms = 초당 50단계 처리
- 너무 빠르면 차이 안 보임, 너무 느리면 지루함
- 실험을 통해 최적값 선정

**근거:**
- `CLAUDE.md` 119-120번 줄: "애니메이션 속도가 중요합니다", "10-50ms 권장"

#### 단계 처리 로직
```javascript
if (step.type === 'compare') {
  // 비교: 빨간색 하이라이트만
  setHighlights({ [indices[0]]: 'compare', [indices[1]]: 'compare' })
} else if (step.type === 'swap') {
  // 교환: 배열 변경 + 초록색 하이라이트
  setData(prev => {
    const newData = [...prev]
    ;[newData[i], newData[j]] = [newData[j], newData[i]]
    return newData
  })
  setHighlights({ [indices[0]]: 'swap', [indices[1]]: 'swap' })
}
```

**근거:**
- 명세서 73-74번 줄: "type == 'swap': 배열의 두 값을 실제로 바꿉니다. type == 'compare': 값은 그대로 두고 색상만 변경"
- `CLAUDE.md` 136번 줄: "compare는 배열을 수정하지 않고, swap은 반드시 배열을 수정해야 합니다"

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
- `CLAUDE.md` 105-107번 줄:
  - "기본 막대: bg-cyan-400 (네온 시안)"
  - "비교 상태: bg-rose-500 (네온 레드)"
  - "교환 상태: bg-emerald-400 (네온 그린)"
- 보라색 추가: 퀵 정렬의 피벗 강조용

#### 높이 정규화
```javascript
const maxValue = Math.max(...initialData)
// ...
style={{ height: `${(value / maxValue) * 100}%` }}
```

**왜 정규화하는가:**
- 배열 값의 범위가 다양할 수 있음 (1~100, 1~200 등)
- 최댓값 기준으로 정규화하여 항상 차트가 컨테이너 높이에 맞게 표시

### 6. RaceTrack.jsx 작성
**참고 문서:**
- `.claude/docs/new_project_description.md` 79-87번 줄
- `CLAUDE.md` 75-82번 줄

**작성 이유:**
5개의 SortChart를 관리하고 경주를 시작/제어하는 메인 컨테이너

**작성된 코드:**
```javascript
import React, { useState } from 'react'
import SortChart from './SortChart'

const RaceTrack = () => {
  const [raceData, setRaceData] = useState(null)
  const [started, setStarted] = useState(false)
  const [finishedOrder, setFinishedOrder] = useState([])
  const [loading, setLoading] = useState(false)

  // 경주 시작
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

  // 알고리즘 완료 콜백
  const handleFinish = (algorithmName) => {
    setFinishedOrder(prev => {
      if (!prev.includes(algorithmName)) {
        return [...prev, algorithmName]
      }
      return prev
    })
  }

  // 순위 계산
  const getRank = (algorithmName) => {
    const index = finishedOrder.indexOf(algorithmName)
    if (index === -1) return null
    return index + 1 // 1등, 2등, 3등
  }

  const algorithms = [
    'Bubble Sort',
    'Selection Sort',
    'Insertion Sort',
    'Heap Sort',
    'Quick Sort'
  ]

  return (
    <div>
      {/* 시작 버튼 */}
      <div className="text-center mb-8">
        <button
          onClick={handleStartRace}
          disabled={loading || started}
          className={`
            px-8 py-4 text-2xl font-mono font-bold rounded-lg
            border-2 transition-all duration-200
            ${loading || started
              ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-600 border-cyan-400 text-gray-900 hover:scale-105 cursor-pointer'
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
}

export default RaceTrack
```

**코드 흐름 설명:**

#### State 관리
```javascript
const [raceData, setRaceData] = useState(null)          // API 응답 데이터
const [started, setStarted] = useState(false)           // 경주 시작 여부
const [finishedOrder, setFinishedOrder] = useState([])  // 완료 순서 배열
const [loading, setLoading] = useState(false)           // 로딩 상태
```

#### API 호출
```javascript
const response = await fetch('/api/race', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ size: 50 })
})
```

**왜 fetch를 사용했는가:**
- 추가 라이브러리 불필요 (axios 등)
- 브라우저 기본 API
- vite.config.js의 프록시 설정으로 `/api` → `http://localhost:8000` 자동 변환

**근거:**
- 명세서 80번 줄: "버튼 클릭 시 POST /api/race 호출"

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
  return index + 1
}
```

**동작 방식:**
1. 각 SortChart가 완료되면 `onFinish(name)` 호출
2. `handleFinish`가 `finishedOrder` 배열에 이름 추가
3. `getRank`로 순위 계산 (배열 인덱스 + 1)
4. 순위를 SortChart의 `rank` prop으로 전달

**근거:**
- 명세서 82-84번 줄: "finishedOrder 배열 state를 가집니다. 자식 컴포넌트(SortChart)가 onFinish를 호출할 때마다 해당 알고리즘 이름을 배열에 추가"

#### 그리드 레이아웃
```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**반응형 디자인:**
- 모바일: 1열 (`grid-cols-1`)
- 태블릿: 2열 (`md:grid-cols-2`)
- 데스크톱: 3열 (`lg:grid-cols-3`)

**근거:**
- 명세서 80번 줄: "2행 3열(혹은 반응형 Grid)"

## ⚠️ 작업 완료 후 자동 Context 저장 (필수!)

이 스킬 완료 후 **반드시** 다음 명령을 실행하여 작업 내용을 기록합니다:

```
/agent_context_save frontend
```

**저장 내용:**
- 수행한 작업 목록 및 작업 흐름
- 의사결정 과정과 이유 (왜 그렇게 구현했는지)
- 참고한 문서와 줄 번호
- 발생한 에러와 해결 방법
- 다음 작업을 위한 힌트

**저장 위치:** `.claude/docs/process_frontend_context_save.md`

**중요:** Context 저장은 다음 세션이나 다른 개발자가 작업 내용을 이해하는 데 필수적입니다. 반드시 실행하세요!

---

## 작업 완료 후 확인사항
- [ ] `npm install` 실행하여 의존성 설치
- [ ] `npm run dev` 실행하여 개발 서버 시작
- [ ] http://localhost:5173 접속
- [ ] 백엔드 서버가 실행 중인지 확인 (http://localhost:8000)
- [ ] "START RACE" 버튼 클릭하여 경주 시작
- [ ] 5개 차트가 동시에 애니메이션 시작하는지 확인
- [ ] 색상 변화 확인: 빨강(비교), 초록(교환), 시안(기본)
- [ ] 완료 순위 확인: Quick/Heap이 먼저, Bubble이 나중에
- [ ] 메달 표시 확인: 1~3등에만 배지 표시

## 추가 개선 사항 (선택사항)
- [ ] 사운드 효과 추가 (Web Audio API)
- [ ] 배열 크기 조절 UI
- [ ] 일시정지/재개 기능
- [ ] 속도 조절 슬라이더

## 관련 문서
- `.claude/docs/process_frontend.md` - 상세 작업 과정
- `.claude/docs/new_project_description.md` - 프론트엔드 명세
- `CLAUDE.md` - 프론트엔드 구조 가이드
