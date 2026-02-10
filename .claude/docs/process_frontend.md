# 프론트엔드 구현 과정 (Process Frontend)

## 작업 개요
React + Vite + TailwindCSS 기반 프론트엔드를 구현하고, 백엔드에서 받은 정렬 단계를 시각화하는 애니메이션 시스템을 만듭니다.

## 전체 작업 흐름
```
1. React 진입점 설정 (main.jsx, index.css)
   ↓
2. 레이아웃 구성 (App.jsx)
   ↓
3. UI 컴포넌트 구현 (WinnerBadge.jsx)
   ↓
4. 핵심 플레이어 구현 (SortChart.jsx)
   ↓
5. 메인 컨테이너 구현 (RaceTrack.jsx)
   ↓
6. 테스트 및 검증
```

---

## 1단계: React 진입점 설정

### 1.1 main.jsx 작성

**참고 문서:**
- `.claude/docs/new_project_description.md` 32번 줄
- 표준 React 18 진입점 패턴

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
1. `ReactDOM.createRoot`: React 18의 새로운 root API 사용
2. `document.getElementById('root')`: index.html의 `<div id="root">` 연결
3. `React.StrictMode`: 개발 모드에서 잠재적 문제 감지

**React.StrictMode가 하는 일:**
- 안전하지 않은 생명주기 메서드 경고
- 예상치 못한 부작용 감지
- 더 이상 사용되지 않는 API 경고
- 프로덕션 빌드에서는 영향 없음

### 1.2 index.css 작성

**참고 문서:**
- `.claude/docs/new_project_description.md` 8번 줄 (사이버펑크 테마)
- `CLAUDE.md` 104번 줄 (배경 색상)

**작성 이유:**
TailwindCSS 디렉티브 포함 및 전역 스타일 정의

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

1. **폰트:**
   - `JetBrains Mono`: 개발자용 모노스페이스 폰트 (읽기 편함)
   - `Courier New`: 폴백 시스템 폰트
   - `monospace`: 최종 폴백
   - 근거: `CLAUDE.md` 108번 줄 "폰트: font-mono (개발자 느낌)"

2. **배경색:**
   - `#111827` = TailwindCSS의 `gray-900`
   - 매우 어두운 회색/남색 (사이버펑크 느낌)
   - 근거: `CLAUDE.md` 104번 줄 "배경: bg-gray-900 (매우 어두운 색)"

3. **폰트 스무딩:**
   - `-webkit-font-smoothing: antialiased`: 맥/iOS에서 폰트 부드럽게
   - `-moz-osx-font-smoothing: grayscale`: 파이어폭스에서 그레이스케일 렌더링

4. **박스 모델:**
   - `box-sizing: border-box`: 패딩과 테두리가 width/height에 포함
   - 레이아웃 계산 단순화

---

## 2단계: 레이아웃 구성 (App.jsx)

### 참고한 문서
- `.claude/docs/new_project_description.md` 30번 줄
- 명세서에는 자세한 레이아웃 요구사항 없음 (자유 구현)

### 설계 의사결정

#### 레이아웃 구조
```
App
├── header (헤더: 제목 + 설명)
└── main
    └── RaceTrack (메인 컨텐츠)
```

**왜 이렇게 구성했는가:**
- 헤더: 앱 정체성 명확히 (ALGO RACE 5)
- 메인: RaceTrack에 모든 경주 로직 위임 (관심사 분리)

### 작성된 코드

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

### 디자인 선택 근거

#### 헤더 스타일
```javascript
<header className="bg-gray-800 border-b border-cyan-500 py-6">
```

**색상 선택:**
- `bg-gray-800`: 본문(gray-900)보다 약간 밝은 회색 (구분)
- `border-cyan-500`: 네온 시안 테두리 (사이버펑크 강조)

#### 제목 네온 효과
```javascript
<span className="text-cyan-400">ALGO</span>
<span className="text-pink-500"> RACE </span>
<span className="text-green-400">5</span>
```

**멀티 컬러 네온:**
- 시안(cyan-400) + 핑크(pink-500) + 그린(green-400)
- 각 단어에 다른 네온 색상으로 사이버펑크 느낌 강조
- 근거: 명세서 8번 줄 "네온 컬러(Neon Colors) 디자인"

#### 반응형 컨테이너
```javascript
<main className="container mx-auto px-4 py-8">
```

- `container`: TailwindCSS 반응형 너비 (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- `mx-auto`: 수평 중앙 정렬
- `px-4`: 좌우 패딩 (모바일 여백)
- `py-8`: 상하 패딩 (헤더와 간격)

---

## 3단계: WinnerBadge 컴포넌트 구현

### 참고한 문서
- `.claude/docs/new_project_description.md` 29번 줄, 84번 줄
- `CLAUDE.md` 84번 줄

### 설계 의사결정

#### 컴포넌트 역할
- 1~3등 알고리즘에게 메달 표시
- SortChart 위에 오버레이 (absolute positioning)

#### Props 설계
```javascript
<WinnerBadge rank={1} />  // rank: 1, 2, 3 또는 null
```

### 작성된 코드

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

### 코드 설명

#### badges 객체
```javascript
const badges = {
  1: { emoji: '🥇', color: 'text-yellow-400', text: '1st' },
  2: { emoji: '🥈', color: 'text-gray-300', text: '2nd' },
  3: { emoji: '🥉', color: 'text-amber-600', text: '3rd' }
}
```

**데이터 구조 선택 이유:**
- 객체로 순위별 정보 매핑
- 확장 가능 (4등, 5등 추가 용이)
- 읽기 쉬운 구조

**색상 선택:**
- 1등: `text-yellow-400` (금색)
- 2등: `text-gray-300` (은색)
- 3등: `text-amber-600` (동색)

#### Conditional Rendering
```javascript
if (!badge) return null
```

**왜 null을 반환하는가:**
- rank가 4, 5 또는 null이면 아무것도 렌더링하지 않음
- 4~5등은 메달 없음 (명세서 요구사항)

#### 스타일링
```javascript
className="absolute top-2 right-2 ..."
```

- `absolute`: SortChart의 `relative` 컨테이너 기준 절대 위치
- `top-2 right-2`: 오른쪽 상단 배치
- `bg-opacity-90`: 반투명 배경 (차트 일부 보이게)
- `rounded-full`: 원형 배지
- `border border-gray-600`: 미묘한 테두리

---

## 4단계: SortChart 컴포넌트 구현 (핵심)

### 참고한 문서
- `.claude/docs/new_project_description.md` 60-77번 줄
- `CLAUDE.md` 61-73번 줄, 114-123번 줄

### 설계 의사결정

#### 컴포넌트 역할
> "각 알고리즘의 플레이어입니다. 서버에서 받은 steps 배열을 순차적으로 실행합니다."
> (명세서 61번 줄)

**핵심 개념: 서버 주도 UI**
- 프론트엔드는 정렬 로직을 모름
- 백엔드에서 받은 "행동 지령(Compare/Swap)"만 실행
- 근거: 명세서 7번 줄, `CLAUDE.md` 10-12번 줄

#### Props 설계
```javascript
<SortChart
  name="Bubble Sort"           // 알고리즘 이름
  initialData={[45, 12, ...]}  // 초기 배열
  steps={[...]}                // 단계 리스트
  start={true}                 // 시작 트리거
  onFinish={(name) => {...}}   // 완료 콜백
  rank={1}                     // 순위 (1~3 또는 null)
/>
```

### 작성된 코드 (상세 분석)

#### State 및 Ref 정의
```javascript
import React, { useState, useEffect, useRef } from 'react'
import WinnerBadge from './WinnerBadge'

const SortChart = ({ name, initialData, steps, start, onFinish, rank }) => {
  const [data, setData] = useState(initialData)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlights, setHighlights] = useState({})
  const intervalRef = useRef(null)
```

**State 설계 근거:**

1. **data: 현재 배열 상태**
   ```javascript
   const [data, setData] = useState(initialData)
   ```
   - `initialData`의 복사본 (props 직접 수정 금지)
   - 근거: `CLAUDE.md` 122번 줄 "SortChart의 로컬 state는 initialData의 복사본이어야 합니다"
   - 근거: `CLAUDE.md` 134번 줄 "props를 직접 수정하지 마세요"

2. **currentStep: 현재 단계 인덱스**
   ```javascript
   const [currentStep, setCurrentStep] = useState(0)
   ```
   - 어느 단계까지 실행했는지 추적
   - `steps[currentStep]`으로 현재 단계 접근

3. **highlights: 하이라이트 상태**
   ```javascript
   const [highlights, setHighlights] = useState({})
   ```
   - 객체 형태: `{ 0: 'compare', 1: 'swap', 3: 'pivot' }`
   - 인덱스를 키로, 하이라이트 타입을 값으로 저장
   - 100ms 후 자동 제거 (깜빡이는 효과)

4. **intervalRef: 인터벌 참조**
   ```javascript
   const intervalRef = useRef(null)
   ```
   - `setInterval` ID 저장
   - cleanup 함수에서 `clearInterval` 호출 시 사용
   - 근거: `CLAUDE.md` 135번 줄 "인터벌 정리를 잊지 마세요 - 메모리 누수"

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
    }, 20) // 20ms 간격
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

**코드 흐름 상세 분석:**

##### 1. 조건 확인
```javascript
if (start && currentStep < steps.length) {
```
- `start`: RaceTrack에서 true로 설정하면 시작
- `currentStep < steps.length`: 아직 실행할 단계가 남음

##### 2. 인터벌 시작
```javascript
intervalRef.current = setInterval(() => { ... }, 20)
```

**타이밍 선택 (20ms):**
- 명세서 70번 줄: "10ms~50ms"
- `CLAUDE.md` 120번 줄: "10-50ms 권장"
- 20ms = 초당 50단계 실행
- 너무 빠름: 차이 안 보임
- 너무 느림: 지루함
- **실험적 최적값:** 20-30ms

##### 3. Compare 처리
```javascript
if (step.type === 'compare') {
  setHighlights({
    [step.indices[0]]: 'compare',
    [step.indices[1]]: 'compare',
    ...(step.pivot !== undefined && { [step.pivot]: 'pivot' })
  })
}
```

**동작:**
- 배열 수정 없음 (읽기만)
- 빨간색 하이라이트만 설정

**근거:**
- 명세서 74번 줄: "type == 'compare': 값은 그대로 두고 색상만 변경"
- `CLAUDE.md` 136번 줄: "compare는 배열을 수정하지 않고"

**pivot 처리:**
- 퀵 정렬 단계에 `pivot` 필드 존재 시 보라색으로 강조
- Spread 연산자로 조건부 추가: `...(step.pivot !== undefined && { [step.pivot]: 'pivot' })`

##### 4. Swap 처리
```javascript
else if (step.type === 'swap') {
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
```

**동작:**
1. 배열 복사: `const newData = [...prev]`
2. 값 교환: 구조 분해를 이용한 swap
3. 새 배열 반환
4. 초록색 하이라이트 설정

**근거:**
- 명세서 73번 줄: "type == 'swap': 배열의 두 값을 실제로 바꿉니다."
- `CLAUDE.md` 136번 줄: "swap은 반드시 배열을 수정해야 합니다"

**불변성 유지:**
- `prev`를 직접 수정하지 않고 새 배열 생성
- React의 불변성 원칙 준수
- 리렌더링 최적화

##### 5. 단계 진행
```javascript
setCurrentStep(prev => prev + 1)
```
- 다음 단계로 이동
- 다음 인터벌에서 `steps[currentStep+1]` 실행

##### 6. 완료 처리
```javascript
else if (currentStep >= steps.length && intervalRef.current) {
  clearInterval(intervalRef.current)
  onFinish(name)
}
```

**동작:**
- 모든 단계 완료 시 인터벌 정리
- `onFinish(name)` 호출하여 RaceTrack에 완료 알림
- RaceTrack은 `finishedOrder` 배열에 추가

**근거:**
- 명세서 75번 줄: "마지막 단계에 도달하면 Loop를 멈추고 onFinish(name)를 호출"

##### 7. Cleanup 함수
```javascript
return () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current)
  }
}
```

**왜 필요한가:**
- 컴포넌트 언마운트 시 인터벌 정리
- 메모리 누수 방지
- 근거: `CLAUDE.md` 135번 줄 "인터벌 정리를 잊지 마세요"

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

**동작:**
- 하이라이트 설정 후 100ms 후 자동 제거
- 깜빡이는 효과 (flash effect)

**근거:**
- `CLAUDE.md` 123번 줄: "하이라이트 지속 시간은 짧지만 가시적이어야 합니다"
- 100ms: 인간의 눈에 충분히 보이면서도 짧은 시간

#### 막대 색상 결정
```javascript
const getBarColor = (index) => {
  const highlightType = highlights[index]
  if (highlightType === 'compare') return 'bg-rose-500'    // 빨강
  if (highlightType === 'swap') return 'bg-emerald-400'    // 초록
  if (highlightType === 'pivot') return 'bg-purple-500'    // 보라
  return 'bg-cyan-400'                                      // 시안
}
```

**색상 매핑:**
- `compare` → `bg-rose-500` (네온 레드)
- `swap` → `bg-emerald-400` (네온 그린)
- `pivot` → `bg-purple-500` (보라, 퀵 정렬 전용)
- 기본 → `bg-cyan-400` (네온 시안)

**근거:**
- `CLAUDE.md` 105-107번 줄: 색상 정의
- 명세서 90번 줄: "bg-cyan-400 (기본), bg-rose-500 (비교), bg-emerald-400 (교환)"

#### 높이 정규화
```javascript
const maxValue = Math.max(...initialData)

// 렌더링
style={{ height: `${(value / maxValue) * 100}%` }}
```

**왜 정규화하는가:**
- 배열 값의 범위가 다양 (1~100, 1~200 등)
- 최댓값 기준으로 비율 계산
- 항상 가장 큰 값이 차트 높이 100%
- 상대적 크기 비교 용이

#### JSX 렌더링
```javascript
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
```

**레이아웃 설명:**

1. **컨테이너:**
   - `relative`: WinnerBadge의 absolute 위치 기준
   - `bg-gray-800`: 어두운 배경 (본문 gray-900보다 밝음)
   - `border border-gray-700`: 미묘한 테두리

2. **진행률 표시:**
   - `{currentStep} / {steps.length} steps`
   - 사용자에게 진행 상황 피드백

3. **막대 그래프:**
   - `flex items-end`: 아래쪽 정렬 (막대가 아래에서 위로 자람)
   - `gap-1`: 막대 간 간격
   - `h-64`: 고정 높이 (256px)
   - `flex-1`: 각 막대가 동일한 너비
   - `transition-all duration-100`: 색상/높이 변화 애니메이션
   - `rounded-t`: 막대 상단만 둥글게

---

## 5단계: RaceTrack 컴포넌트 구현

### 참고한 문서
- `.claude/docs/new_project_description.md` 79-87번 줄
- `CLAUDE.md` 75-82번 줄

### 설계 의사결정

#### 컴포넌트 역할
- 5개의 SortChart 인스턴스 관리
- API 호출 및 데이터 분배
- 순위 시스템 구현
- "START RACE" 버튼 제공

### 작성된 코드 (상세 분석)

#### State 정의
```javascript
import React, { useState } from 'react'
import SortChart from './SortChart'

const RaceTrack = () => {
  const [raceData, setRaceData] = useState(null)
  const [started, setStarted] = useState(false)
  const [finishedOrder, setFinishedOrder] = useState([])
  const [loading, setLoading] = useState(false)
```

**State 설계 근거:**

1. **raceData: API 응답 저장**
   ```javascript
   const [raceData, setRaceData] = useState(null)
   ```
   - 구조: `{ initial_data: [...], results: { "Bubble Sort": [...], ... } }`
   - null: 데이터 없음 (초기 상태)

2. **started: 경주 시작 여부**
   ```javascript
   const [started, setStarted] = useState(false)
   ```
   - true: SortChart들이 애니메이션 시작
   - false: 대기 상태

3. **finishedOrder: 완료 순서 추적**
   ```javascript
   const [finishedOrder, setFinishedOrder] = useState([])
   ```
   - 예: `["Quick Sort", "Heap Sort", "Insertion Sort"]`
   - 첫 번째 = 1등, 두 번째 = 2등, ...
   - 근거: 명세서 82번 줄 "finishedOrder 배열 state"

4. **loading: 로딩 상태**
   ```javascript
   const [loading, setLoading] = useState(false)
   ```
   - API 호출 중 버튼 비활성화

#### API 호출 (경주 시작)
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

**코드 흐름:**

##### 1. 초기화
```javascript
setLoading(true)
setStarted(false)
setFinishedOrder([])
```
- 로딩 시작
- 이전 경주 상태 초기화

##### 2. API 호출
```javascript
const response = await fetch('/api/race', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ size: 50 })
})
```

**왜 fetch를 사용했는가:**
- 브라우저 기본 API (추가 설치 불필요)
- `async/await` 지원
- vite.config.js의 프록시 자동 적용:
  - `/api/race` → `http://localhost:8000/api/race`

**배열 크기 50:**
- 명세서 56번 줄: "기본값: 50~100"
- 50: 시각화에 적절한 크기

##### 3. 성공 처리
```javascript
const data = await response.json()
setRaceData(data)
setStarted(true)
```

**데이터 구조:**
```javascript
{
  initial_data: [15, 3, 21, ...],
  results: {
    "Bubble Sort": [{ type: "compare", indices: [0, 1] }, ...],
    "Selection Sort": [...],
    ...
  }
}
```

**started=true의 효과:**
- 모든 SortChart의 `start` prop이 true로 변경
- 동시에 애니메이션 시작

##### 4. 에러 처리
```javascript
catch (error) {
  console.error('경주 시작 실패:', error)
  alert('경주를 시작할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.')
}
```

**사용자 친화적 에러 메시지:**
- 개발자: 콘솔에 상세 에러
- 사용자: 알림창으로 간단한 안내

##### 5. Cleanup
```javascript
finally {
  setLoading(false)
}
```
- 성공/실패 무관하게 로딩 종료

#### 완료 콜백
```javascript
const handleFinish = (algorithmName) => {
  setFinishedOrder(prev => {
    if (!prev.includes(algorithmName)) {
      return [...prev, algorithmName]
    }
    return prev
  })
}
```

**동작:**
- SortChart가 완료되면 호출됨
- 중복 방지: `!prev.includes(algorithmName)`
- 순서 보존: 배열 끝에 추가

**호출 흐름:**
```
SortChart (완료) → onFinish("Quick Sort")
   ↓
RaceTrack.handleFinish("Quick Sort")
   ↓
finishedOrder = ["Quick Sort"]
   ↓
getRank("Quick Sort") = 1 (1등)
```

#### 순위 계산
```javascript
const getRank = (algorithmName) => {
  const index = finishedOrder.indexOf(algorithmName)
  if (index === -1) return null  // 아직 완료 안 됨
  return index + 1  // 1등, 2등, 3등
}
```

**예시:**
```javascript
finishedOrder = ["Quick Sort", "Heap Sort", "Insertion Sort"]

getRank("Quick Sort")      // 1 (1등) → 🥇
getRank("Heap Sort")       // 2 (2등) → 🥈
getRank("Insertion Sort")  // 3 (3등) → 🥉
getRank("Bubble Sort")     // null (진행 중) → 배지 없음
```

#### 알고리즘 목록
```javascript
const algorithms = [
  'Bubble Sort',
  'Selection Sort',
  'Insertion Sort',
  'Heap Sort',
  'Quick Sort'
]
```

**왜 하드코딩했는가:**
- 5개 알고리즘은 고정 (프로젝트 명세)
- 백엔드 응답의 `results` 키와 일치해야 함
- 순서는 렌더링 순서에만 영향 (경주에는 무관)

#### JSX 렌더링

##### 시작 버튼
```javascript
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
```

**동적 스타일:**
- 비활성화 (loading || started):
  - `bg-gray-700`: 어두운 회색
  - `cursor-not-allowed`: 클릭 불가 커서
- 활성화:
  - `bg-cyan-500`: 네온 시안 배경
  - `hover:bg-cyan-600`: 호버 시 더 어둡게
  - `hover:scale-105`: 호버 시 약간 확대 (UX 향상)

**버튼 텍스트:**
- `loading`: "로딩 중..."
- `started`: "경주 진행 중"
- 기본: "🏁 START RACE"

##### 완료 순위 표시
```javascript
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
```

**동작:**
- `finishedOrder.slice(0, 3)`: 상위 3개만 표시
- 실시간 업데이트: 알고리즘 완료될 때마다 추가

##### 차트 그리드
```javascript
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
```

**반응형 그리드:**
- 모바일 (`grid-cols-1`): 세로 1열
- 태블릿 (`md:grid-cols-2`): 2열
- 데스크톱 (`lg:grid-cols-3`): 3열
- 근거: 명세서 80번 줄 "2행 3열(혹은 반응형 Grid)"

**데이터 분배:**
- 모든 차트가 동일한 `initialData` 받음 (공정한 비교)
- 각 차트는 자신의 `steps` 배열만 실행
- `start` prop으로 동시 시작 동기화

---

## 6단계: 테스트 및 검증

### 6.1 의존성 설치
```bash
cd frontend
npm install
```

**예상 출력:**
```
added 250 packages in 15s
```

### 6.2 개발 서버 시작
```bash
npm run dev
```

**예상 출력:**
```
  VITE v5.0.12  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6.3 백엔드 서버 확인
**별도 터미널에서:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 6.4 시각적 테스트

#### 초기 화면
- [ ] 헤더: "ALGO RACE 5" (멀티 컬러 네온)
- [ ] START RACE 버튼: 네온 시안 배경
- [ ] 차트 없음 (아직 시작 안 함)

#### 버튼 클릭 후
- [ ] 버튼 비활성화: "경주 진행 중"
- [ ] 5개 차트 동시 렌더링
- [ ] 모든 차트의 초기 막대 높이 동일 (같은 initialData)

#### 애니메이션 진행
- [ ] 막대 색상 변화:
  - 빨강: 비교 중
  - 초록: 교환 중
  - 시안: 기본 상태
- [ ] Quick Sort / Heap Sort가 빠르게 진행
- [ ] Bubble Sort가 느리게 진행
- [ ] 진행률 표시: "0 / 2450 steps" → 실시간 증가

#### 완료 후
- [ ] 먼저 완료된 차트에 메달 표시 (🥇🥈🥉)
- [ ] 중앙 상단에 "완료 순서:" 표시
- [ ] 순위: Quick/Heap 먼저, Bubble 나중에

### 6.5 예상 순위

**크기 50 배열 기준:**
1. 🥇 Quick Sort (약 5초)
2. 🥈 Heap Sort (약 6초)
3. 🥉 Insertion Sort (약 12초)
4. Selection Sort (약 12초)
5. Bubble Sort (약 15초)

**실제 순위는 데이터에 따라 변동 가능**

### 6.6 브라우저 콘솔 확인

**정상 동작 시:**
- 에러 없음
- 경고 없음

**예상 로그:**
```
경주 시작 실패: TypeError: Failed to fetch
```
→ 백엔드 서버가 꺼져 있음 (포트 8000 확인)

### 6.7 네트워크 탭 확인

**POST /api/race 요청:**
- Status: 200 OK
- Response:
  ```json
  {
    "initial_data": [15, 3, 21, ...],
    "results": {
      "Bubble Sort": [...],
      ...
    }
  }
  ```

---

## 7단계: 최종 확인사항

### 파일 구조
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── RaceTrack.jsx     ✓ (약 120줄)
│   │   ├── SortChart.jsx     ✓ (약 130줄)
│   │   └── WinnerBadge.jsx   ✓ (약 30줄)
│   ├── App.jsx               ✓ (약 30줄)
│   ├── index.css             ✓ (약 15줄)
│   └── main.jsx              ✓ (약 10줄)
├── index.html                ✓
├── package.json              ✓
├── vite.config.js            ✓
├── tailwind.config.js        ✓
└── postcss.config.js         ✓
```

### 체크리스트
- [x] React 18 사용
- [x] TailwindCSS 설정 완료
- [x] 사이버펑크 네온 테마 적용
- [x] 서버 주도 UI 구현 (프론트엔드에 정렬 로직 없음)
- [x] 5개 차트 동시 애니메이션
- [x] 순위 시스템 (메달)
- [x] 반응형 그리드 레이아웃
- [x] 에러 처리 (백엔드 연결 실패)
- [x] 메모리 누수 방지 (인터벌 정리)
- [x] Props 불변성 유지

---

## 다음 단계

### 선택적 개선사항
1. **사운드 효과** (명세서 92-94번 줄)
   - Web Audio API 사용
   - Swap 시 "Tick" 소리
   - 1등 완료 시 "Fanfare" 소리

2. **배열 크기 조절 UI**
   ```javascript
   <input
     type="range"
     min="10"
     max="200"
     value={size}
     onChange={(e) => setSize(Number(e.target.value))}
   />
   ```

3. **일시정지/재개 기능**
   - `paused` state 추가
   - 버튼: "⏸️ PAUSE" / "▶️ RESUME"

4. **속도 조절**
   - `speed` state (10ms~100ms)
   - 슬라이더로 조절

---

## 참고한 모든 문서
- `.claude/docs/new_project_description.md` (프론트엔드 명세)
- `CLAUDE.md` (프로젝트 가이드)
- React 공식 문서 (Hooks, useEffect)
- TailwindCSS 공식 문서 (유틸리티 클래스)
- MDN Web Docs (Fetch API, setInterval)
