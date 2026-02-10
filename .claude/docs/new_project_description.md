# 프로젝트 목표
- Algo-Race 5는 5가지의 서로 다른 정렬 알고리즘(Sorting Algorithms)이 동일한 무작위 데이터셋을 정렬하는 과정을 실시간 경주(Race) 형태로 시각화하는 웹 애플리케이션입니다.사용자는 **FastAPI(Backend)**에서 계산된 정렬 단계(Step)를 기반으로 **React(Frontend)**에서 5개의 알고리즘이 동시에 달리는 모습을 지켜보며, **시간 복잡도($O(N^2)$ vs $O(N \log N)$)**의 차이를 시각적, 청각적으로 직관적이게 체험할 수 있습니다.

# Key Objectives (Vibe Points)
- Visual Impact: 알고리즘의 속도 차이를 물리적인 애니메이션 속도로 표현 (예: 퀵 정렬은 순식간에 끝나고, 버블 정렬은 느리게 진행).
- Gamification: 먼저 정렬을 마친 알고리즘에게 1등, 2등, 3등 메달(Badges) 부여.
- Server-Driven UI: 프론트엔드는 로직을 모릅니다. 오직 서버가 보내준 "행동 지령(Compare/Swap)"을 수행하는 재생기(Player) 역할만 수행합니다.
- Cyberpunk Theme: Dark Mode 기반의 네온 컬러(Neon Colors) 디자인.

# 기술 스택
- Backend: FastAPI (Python)
- Frontend: React (Vite), TailwindCSS
- Chart Library: 별도 라이브러리 없이 div 막대로 구현 (성능 최적화)
- server: npm으로 실행

# 폴더 구조
algo-race-5/
├── backend/
│   ├── main.py               # FastAPI 진입점 & API 엔드포인트
│   ├── algorithms.py         # 5개 정렬 알고리즘 구현체 (Step 생성 로직)
│   ├── models.py             # Pydantic 데이터 모델 (Request/Response)
│   └── requirements.txt      # 의존성 목록 (fastapi, uvicorn 등)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RaceTrack.jsx # 5개의 SortChart를 담는 메인 컨테이너
│   │   │   ├── SortChart.jsx # 개별 정렬 막대그래프 컴포넌트
│   │   │   └── WinnerBadge.jsx # 순위 표시 컴포넌트
│   │   ├── App.jsx           # 레이아웃 및 헤더
│   │   ├── index.css         # Tailwind directives & 전역 스타일
│   │   └── main.jsx          # React DOM Render
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── PROJECT.md                # 프로젝트 명세서 (This File)
└── README.md

# Backend Specification(FastAPI)
- Algorithms (algorithms.py)
    - 5가지 정렬 알고리즘을 구현하되, 정렬 과정의 **모든 단계(Step)**를 기록하여 리스트로 반환해야 합니다.
    - Selected Algorithms:
        - Bubble Sort: ($O(N^2)$) - 가장 느림, 인접 교환.
        - Selection Sort: ($O(N^2)$) - 앞에서부터 채워짐.
        - Insertion Sort: ($O(N^2)$) - 데이터에 따라 속도 편차 있음.
        - Heap Sort: ($O(N \log N)$) - 시각화가 용이함 (Swap 기반).
        - Quick Sort: ($O(N \log N)$) - 가장 빠름 (Pivot 기준 분할).
    - Step Data Structure (Dict):
        - type: 행동 유형 ("compare" | "swap" | "overwrite")
        - indices: 관련된 배열 인덱스 리스트 ([i, j])
        - (Optional) pivot: 퀵 정렬 시 피벗 인덱스 강조용
    - 4.2. API Endpoints (main.py)
        - POST /api/race 
            - Description: 새로운 경주 데이터를 생성합니다.
            - Request Body: { "size": 50  // 배열의 크기 (기본값: 50~100 장)}
            - Response Body: : {  "initial_data": [45, 12, 88, 2, ...], // 모든 알고리즘이 공유할 초기 난수 배열  "results": {    "Bubble Sort": [      {"type": "compare", "indices": [0, 1]},      {"type": "swap", "indices": [0, 1]},      ...    ],    "Quick Sort": [ ... ],    ... // 나머지 3개 알고리즘의 Steps  }}

# Frontend Specification (React)
- 5.1. SortChart.jsx (Core Logic)
    - 각 알고리즘의 "플레이어"입니다. 서버에서 받은 steps 배열을 순차적으로 실행합니다.
    - Props:
        - name: 알고리즘 이름 (String)
        - initialData: 초기 배열 (Array)
        - steps: 서버에서 받은 행동 지령 리스트 (Array)
        - start: 경주 시작 신호 (Boolean)
        - onFinish: 완료 시 부모에게 알리는 콜백 함수 (name) => void
    - Rendering Logic:
        - initialData를 로컬 state로 복사하여 관리합니다.
        - start가 true가 되면 setInterval (약 10ms~50ms)을 시작합니다.
        - Loop:
            - 현재 단계(steps[currentIndex])를 확인합니다.
            - type == 'swap': 배열의 두 값을 실제로 바꿉니다. (초록색 Highlight)
            - type == 'compare': 값은 그대로 두고 색상만 변경합니다. (빨간색 Highlight)
            - 마지막 단계에 도달하면 Loop를 멈추고 onFinish(name)를 호출합니다.
    - Visuals:
        - 막대 그래프의 높이 = 숫자의 크기 (height: ${value}%)
        - Tailwind 색상 클래스를 동적으로 할당 (bg-red-500, bg-green-500, bg-cyan-500).
- 5.2. RaceTrack.jsx (Container)
    - Layout: 2행 3열(혹은 반응형 Grid)로 5개의 SortChart를 배치합니다.
    - Ranking System:
        - finishedOrder 배열 state를 가집니다.
        - 자식 컴포넌트(SortChart)가 onFinish를 호출할 때마다 해당 알고리즘 이름을 배열에 추가합니다.
        - 순위에 따라 금/은/동 메달 아이콘을 차트 위에 오버레이합니다.
    - Control:
        - 중앙 상단에 "🏁 START RACE" 버튼 배치.
        - 버튼 클릭 시 POST /api/race 호출 -> 데이터 수신 -> 모든 차트에 start=true 전달.
- 5.3. Design & Vibe (Tailwind CSS)
    - Background: bg-gray-900 (아주 어두운 남색/회색)
    - Bars: bg-cyan-400 (기본), bg-rose-500 (비교), bg-emerald-400 (교환)
    - Font: font-mono (개발자 느낌 강조)
    - Sound (Optional):
        - Swap이 일어날 때 아주 짧은 'Tick' 소리 재생 (Web Audio API).
        - 1등이 결정되었을 때 'Fanfare' 효과음 재생.

# Implementation Steps (Guide for AI)
- Backend Logic First: backend/algorithms.py에 5개 정렬 알고리즘을 작성하고, 각 단계가 올바르게 기록되는지 단위 테스트(Unit Test)를 수행하세요
- API Development: backend/main.py를 작성하여 데이터가 JSON 형태로 올바르게 리턴되는지 Swagger UI(http://localhost:8000/docs)에서 확인하세요.
- Frontend Setup: Vite로 React 프로젝트를 생성하고 TailwindCSS를 초기화하세요.
- Component Build: SortChart 컴포넌트를 먼저 만들어 단일 알고리즘이 잘 돌아가는지 확인하세요. (애니메이션 딜레이 조절이 핵심입니다.)
- Integration: RaceTrack을 만들어 5개를 동시에 돌리고, 순위 시스템을 연동하세요.
- Polish: 색상, 배지, 반응형 레이아웃을 다듬어 "Vibe"를 완성하세요.