# Agent Context Save 프로세스

## 개요
이 문서는 `agent_context_save` 스킬이 어떻게 동작하는지, 왜 필요한지, 어떻게 구현하는지를 설명합니다.

## 목적

### 왜 Context를 저장하는가?

#### 1. 세션 연속성
- Claude Code는 context window가 제한적
- 긴 작업 후 이전 내용이 압축되거나 손실될 수 있음
- Context 저장으로 다음 세션에서 이전 작업 내용 참고 가능

#### 2. 지식 축적
- 반복되는 패턴과 해결 방법을 문서화
- 같은 문제를 다시 해결할 때 시간 절약
- 팀 전체의 지식 공유

#### 3. 투명성
- 에이전트가 왜 그렇게 결정했는지 명확히 기록
- 사용자가 작업 과정을 이해하고 신뢰할 수 있음

#### 4. 디버깅
- 문제 발생 시 이전 작업 내용 참고
- 어떤 파일을 어떻게 수정했는지 추적

## 작업 흐름

### 1단계: 현재 대화 분석

**수행 작업:**
현재 대화 내역에서 중요한 정보를 추출합니다.

**추출 정보:**
1. **사용자 요청**
   - 초기 요청 내용
   - 추가 요청 및 수정사항
   - 사용자 피드백

2. **도구 사용 이력**
   - Read: 어떤 파일을 읽었는가?
   - Write/Edit: 어떤 파일을 작성/수정했는가?
   - Bash: 어떤 명령을 실행했는가?
   - Grep/Glob: 무엇을 검색했는가?
   - Task: 어떤 서브 에이전트를 실행했는가?

3. **의사결정 과정**
   - 어떤 선택지가 있었는가?
   - 왜 특정 방법을 선택했는가?
   - 무엇을 참고했는가?

### 2단계: 파일 작업 이력 정리

**목적:** 어떤 파일을 어떻게 변경했는지 명확히 기록

**정리 형식:**

#### 읽은 파일
```markdown
### 읽은 파일: [파일 경로]
- **읽은 이유:** [왜 이 파일을 읽었는가]
- **주요 내용:** [어떤 정보를 얻었는가]
- **활용 방법:** [얻은 정보를 어떻게 사용했는가]
```

**예시:**
```markdown
### 읽은 파일: .claude/docs/new_project_description.md
- **읽은 이유:** 프로젝트 요구사항 파악
- **주요 내용:**
  - 5가지 정렬 알고리즘 필요 (44-48번 줄)
  - Step 데이터 구조 (49-52번 줄)
  - API 엔드포인트 명세 (54-57번 줄)
- **활용 방법:**
  - algorithms.py 구현 시 알고리즘 목록 참조
  - models.py 작성 시 Step 구조 참조
  - main.py 작성 시 API 엔드포인트 참조
```

#### 작성/수정한 파일
```markdown
### 파일: [파일 경로]
- **작업 유형:** 생성 | 수정 | 삭제
- **변경 이유:** [왜 이 파일을 변경했는가]
- **변경 내용:**
  ```
  [주요 코드 또는 diff]
  ```
- **참고 문서:** [어떤 문서를 참고했는가]
- **설계 결정:** [왜 이렇게 작성했는가]
```

**예시:**
```markdown
### 파일: backend/algorithms.py
- **작업 유형:** 생성
- **변경 이유:** 5가지 정렬 알고리즘의 단계별 실행 기록 필요
- **변경 내용:**
  ```python
  def bubble_sort(arr: List[int]) -> List[Dict]:
      steps = []
      data = arr.copy()
      # 인접 요소 비교 및 교환
      for i in range(n):
          for j in range(0, n - i - 1):
              steps.append({"type": "compare", "indices": [j, j+1]})
              if data[j] > data[j + 1]:
                  steps.append({"type": "swap", "indices": [j, j+1]})
                  data[j], data[j+1] = data[j+1], data[j]
      return steps
  ```
- **참고 문서:**
  - new_project_description.md:44 (Bubble Sort 명세)
  - CLAUDE.md:114 (단계 수집 원칙)
- **설계 결정:**
  - `arr.copy()` 사용: 원본 배열 보존 (다른 알고리즘과 공정 비교)
  - 매 비교/교환마다 단계 기록: 프론트엔드 시각화용
  - `return steps`: 정렬된 배열이 아닌 단계 리스트 반환 (서버 주도 UI)
```

### 3단계: 의사결정 기록

**목적:** 왜 그렇게 구현했는지 근거 명시

**기록 형식:**

```markdown
## 의사결정 기록

### 의사결정 1: [결정 내용]

**상황:**
[어떤 상황에서 결정이 필요했는가]

**선택한 방법:**
[실제로 선택한 방법]

**고려한 대안:**
1. **[대안 1]**
   - 장점: [장점 나열]
   - 단점: [단점 나열]
2. **[대안 2]**
   - 장점: [장점 나열]
   - 단점: [단점 나열]

**선택 이유:**
1. [이유 1]
2. [이유 2]
3. [이유 3]

**참고 자료:**
- [문서 이름]:[줄 번호] - [내용]
- [또 다른 문서] - [내용]

**결과:**
[선택의 결과 및 효과]
```

**예시:**
```markdown
## 의사결정 기록

### 의사결정 1: 배열 생성 방법 선택

**상황:**
API에서 정렬할 무작위 배열을 생성해야 하는데, random.randint와 random.sample 중 선택 필요

**선택한 방법:**
```python
initial_data = random.sample(range(1, request.size * 2), request.size)
```

**고려한 대안:**
1. **random.randint 사용**
   - 장점: 코드가 간단함
   - 단점: 중복 값 가능, 정렬 검증 어려움
2. **random.sample 사용**
   - 장점: 중복 없음, 정렬 결과 검증 용이
   - 단점: range 크기 지정 필요

**선택 이유:**
1. 중복 없는 값으로 정렬 결과 검증이 명확
2. 시각화 시 각 값의 구분이 명확
3. 디버깅 시 정렬이 올바르게 됐는지 확인 용이

**참고 자료:**
- Python 공식 문서 - random.sample은 중복 없이 샘플링
- 베스트 프랙티스 - 테스트 데이터는 검증 가능해야 함

**결과:**
정렬 알고리즘이 올바르게 동작하는지 쉽게 확인 가능
```

### 4단계: 에러 및 해결 과정 기록

**목적:** 발생한 문제와 해결 방법을 기록하여 같은 문제 재발 방지

**기록 형식:**

```markdown
## 에러 및 해결 과정

### 에러 1: [에러 제목]

**에러 메시지:**
```
[실제 에러 메시지]
```

**발생 상황:**
[어떤 작업 중 발생했는가]

**발생 위치:**
- 파일: [파일명]
- 함수/컴포넌트: [함수명]
- 라인: [줄 번호]

**원인 분석:**
1. [원인 1]
2. [원인 2]

**시도한 해결 방법:**
1. **[방법 1]**
   - 시도 내용: [무엇을 시도했는가]
   - 결과: 실패 - [왜 실패했는가]
2. **[방법 2]**
   - 시도 내용: [무엇을 시도했는가]
   - 결과: 부분 성공 - [어느 정도 해결되었는가]

**최종 해결 방법:**
```코드 또는 설명
[실제로 문제를 해결한 코드/방법]
```

**해결 원리:**
[왜 이 방법으로 해결되었는가]

**예방 방법:**
[같은 문제를 예방하려면]

**배운 점:**
[이 에러에서 배운 교훈]
```

**예시:**
```markdown
## 에러 및 해결 과정

### 에러 1: CORS Policy Violation

**에러 메시지:**
```
Access to fetch at 'http://localhost:8000/api/race' from origin
'http://localhost:5173' has been blocked by CORS policy
```

**발생 상황:**
프론트엔드에서 백엔드 API를 호출할 때 브라우저에서 차단됨

**발생 위치:**
- 파일: frontend/src/components/RaceTrack.jsx
- 함수: handleStartRace
- 라인: fetch('/api/race', ...)

**원인 분석:**
1. 프론트엔드(포트 5173)와 백엔드(포트 8000)가 다른 출처(origin)
2. 브라우저의 Same-Origin Policy가 cross-origin 요청 차단
3. 백엔드에서 CORS 헤더를 설정하지 않음

**시도한 해결 방법:**
1. **프론트엔드에서 프록시 설정**
   - 시도 내용: vite.config.js에 proxy 설정 추가
   - 결과: 실패 - 여전히 직접 요청 시 CORS 에러

2. **fetch 옵션에 mode: 'no-cors' 추가**
   - 시도 내용: fetch('/api/race', { mode: 'no-cors', ... })
   - 결과: 부분 성공 - 요청은 되지만 응답을 읽을 수 없음

**최종 해결 방법:**
```python
# backend/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**해결 원리:**
- 백엔드에서 CORS 헤더를 명시적으로 설정
- Access-Control-Allow-Origin 헤더로 프론트엔드 출처 허용
- 브라우저가 preflight 요청(OPTIONS)을 통과시킴

**예방 방법:**
- 백엔드 프로젝트 시작 시 CORS 설정을 기본으로 추가
- 개발 환경과 프로덕션 환경의 출처를 환경 변수로 관리

**배운 점:**
- Cross-origin 요청 시 백엔드에서 CORS 설정 필수
- 'no-cors' 모드는 해결책이 아님 (응답을 읽을 수 없음)
- 프록시는 개발 환경에서만 동작 (프로덕션에서는 CORS 필요)
```

### 5단계: 작업 흐름도 작성

**목적:** 작업의 순서와 흐름을 시각적으로 표현

**작성 형식:**

```markdown
## 작업 흐름

### 전체 흐름
```
1. [첫 번째 단계]
   ↓
2. [두 번째 단계]
   ├─ 2.1 [세부 단계]
   └─ 2.2 [세부 단계]
   ↓
3. [세 번째 단계]
   ↓
4. [최종 단계]
```

### 도구 사용 흐름
```
Read (요구사항 파악)
   ↓
Glob (파일 탐색)
   ↓
Read (기존 코드 확인)
   ↓
Write (새 파일 작성)
   ↓
Edit (기존 파일 수정)
   ↓
Bash (테스트 실행)
   ↓
Read (결과 확인)
```

### 의존성 흐름
```
models.py (데이터 모델)
   ↓
algorithms.py (알고리즘 로직) ← models.py 참조
   ↓
main.py (API 엔드포인트) ← models.py, algorithms.py 참조
```
```

### 6단계: Context 파일 생성

**최종 파일 구조:**

```markdown
# [Agent Name] Context Save - [날짜]

## 메타데이터
- **저장 일시:** YYYY-MM-DD HH:MM:SS
- **에이전트 유형:** main | explore | plan | bash
- **작업 상태:** 완료 | 진행중 | 중단
- **작업 시간:** [소요 시간]

## 작업 개요
### 사용자 요청
[초기 요청 및 추가 요청]

### 작업 목표
[달성하려는 목표]

### 작업 결과
[실제 달성한 결과]

## 작업 흐름
[1~5단계에서 정리한 내용]

## 도구 사용 통계
- Read: [횟수]회
- Write: [횟수]회
- Edit: [횟수]회
- Bash: [횟수]회
- Grep: [횟수]회
- Glob: [횟수]회
- Task: [횟수]회

## 파일 작업 이력
### 읽은 파일 ([총 개수]개)
[목록]

### 작성한 파일 ([총 개수]개)
[목록 및 상세 내용]

### 수정한 파일 ([총 개수]개)
[목록 및 상세 내용]

## 의사결정 기록
[모든 주요 결정]

## 에러 및 해결
[발생한 모든 에러]

## 작성된 코드
### [파일명 1]
```언어
[주요 코드]
```
**설명:** [코드 설명]

### [파일명 2]
```언어
[주요 코드]
```
**설명:** [코드 설명]

## 참고한 문서
1. [문서 1] - [참고 내용]
2. [문서 2] - [참고 내용]

## 다음 작업 힌트
### 미완료 작업
- [ ] [작업 1]
- [ ] [작업 2]

### 추가 고려사항
- [고려사항 1]
- [고려사항 2]

### 알려진 제약사항
- [제약사항 1]
- [제약사항 2]

### 개선 가능한 부분
- [개선점 1]
- [개선점 2]

## 배운 점
### 기술적 학습
- [학습 1]
- [학습 2]

### 프로세스 개선
- [개선 아이디어 1]
- [개선 아이디어 2]

## 메모
[추가 메모나 특이사항]
```

## 사용 예시

### 예시 1: 메인 에이전트 백엔드 구현 기록

**상황:**
사용자가 "백엔드를 구현해주세요"라고 요청하고, 메인 에이전트가 models.py, algorithms.py, main.py를 작성 완료

**명령:**
```
/agent_context_save main
```

**생성된 파일:** `.claude/docs/process_main_context_save.md`

**(파일 내용은 위의 SKILL.md 예시 참고)**

### 예시 2: Explore 에이전트 코드베이스 탐색 기록

**상황:**
메인 에이전트가 Task 도구로 Explore 에이전트를 실행하여 코드베이스 구조 파악

**명령:**
```
/agent_context_save explore
```

**생성된 파일:** `.claude/docs/process_explore_context_save.md`

**내용:**
```markdown
# Explore Agent Context Save - 2024-02-10

## 메타데이터
- **에이전트 유형:** explore
- **작업 상태:** 완료
- **작업 시간:** 약 3분

## 작업 개요
### 사용자 요청
"프로젝트 구조를 파악하고 주요 파일들을 찾아주세요"

### 작업 목표
- 프로젝트의 디렉토리 구조 이해
- 주요 설정 파일 위치 파악
- 기존 코드 패턴 분석

### 작업 결과
- 프로젝트가 backend/와 frontend/로 분리되어 있음 확인
- 설정 파일 위치 모두 파악
- 코딩 스타일과 패턴 분석 완료

## 작업 흐름
1. 루트 디렉토리 구조 확인 (Glob **)
   ↓
2. 설정 파일 찾기 (Glob **/*.json, **/*.config.js)
   ↓
3. 문서 파일 확인 (Glob **/*.md)
   ↓
4. 소스 코드 구조 파악 (Glob **/*.py, **/*.jsx)
   ↓
5. 주요 파일 내용 읽기 (Read)
   ↓
6. 구조 분석 및 요약

## 도구 사용 통계
- Glob: 8회
- Read: 5회
- Grep: 3회

## 발견한 주요 파일
### 설정 파일
1. `.claude/docs/new_project_description.md` - 프로젝트 명세
2. `CLAUDE.md` - 프로젝트 가이드
3. `backend/requirements.txt` - Python 의존성
4. `frontend/package.json` - npm 의존성
5. `frontend/vite.config.js` - Vite 설정
6. `frontend/tailwind.config.js` - TailwindCSS 설정

### 소스 파일
1. `backend/main.py` - FastAPI 진입점
2. `backend/algorithms.py` - 정렬 알고리즘
3. `backend/models.py` - Pydantic 모델
4. `frontend/src/App.jsx` - React 메인 컴포넌트
5. `frontend/src/components/RaceTrack.jsx` - 경주 컨테이너
6. `frontend/src/components/SortChart.jsx` - 차트 컴포넌트

## 프로젝트 구조 분석
### 아키텍처 패턴
- **백엔드:** FastAPI + Pydantic (REST API)
- **프론트엔드:** React + Vite + TailwindCSS (SPA)
- **설계 철학:** 서버 주도 UI (프론트엔드는 로직 없음)

### 디렉토리 구조
```
algo-race-5/
├── .claude/
│   ├── docs/          # 프로젝트 문서
│   └── skills/        # 재사용 가능한 스킬들
├── backend/           # FastAPI 백엔드
└── frontend/          # React 프론트엔드
```

### 코딩 스타일
- **Python:** Type hints 사용, Pydantic으로 검증
- **JavaScript:** 함수형 컴포넌트, Hooks 사용
- **CSS:** TailwindCSS 유틸리티 클래스

## 참고한 문서
1. `.claude/docs/new_project_description.md` - 전체 프로젝트 명세
2. `CLAUDE.md` - 개발 가이드라인
3. `backend/main.py` - API 구조
4. `frontend/src/App.jsx` - 컴포넌트 구조

## 다음 작업 힌트
### 구현 순서 권장
1. backend/ 먼저 구현 (API 준비)
2. frontend/ 구현 (API 연동)
3. 통합 테스트

### 주의사항
- 프론트엔드에 정렬 로직 넣지 말 것
- CORS 설정 필수
- 애니메이션 타이밍 실험 필요
```

## 활용 시나리오

### 시나리오 1: 긴 작업 후 요약
```
사용자: "전체 프로젝트를 구축해주세요"
에이전트: [1시간 동안 작업...]
에이전트: [작업 완료]
사용자: "/agent_context_save main"
→ 1시간 동안의 모든 작업 내용이 체계적으로 정리됨
→ 다음 세션에서 이 파일을 읽고 이어서 작업 가능
```

### 시나리오 2: 에러 디버깅
```
사용자: "API 호출이 안 돼요"
에이전트: [디버깅 시도...]
에이전트: [해결 완료]
사용자: "/agent_context_save main"
→ 에러 발생 상황, 원인, 해결 방법이 모두 기록됨
→ 같은 에러 재발 시 빠르게 해결 가능
```

### 시나리오 3: 팀 협업
```
개발자 A: "백엔드 구현 완료"
개발자 A: "/agent_context_save main"
→ context 파일 생성

개발자 B: [context 파일 읽음]
개발자 B: "프론트엔드를 구현해주세요"
→ 백엔드 구조를 이해하고 프론트엔드 작업
```

### 시나리오 4: 학습 자료
```
학생: "정렬 알고리즘을 어떻게 구현했는지 알려주세요"
→ process_main_context_save.md를 읽음
→ 각 알고리즘의 구현 과정, 의사결정 이유, 참고 자료 등 학습
```

## 구현 가이드라인

### Context 저장 시 주의사항

1. **너무 장황하지 않게**
   - 중요한 내용만 간결하게
   - 코드 전체가 아닌 핵심 부분만

2. **구조화된 형식 유지**
   - 일관된 헤더 구조
   - 명확한 섹션 구분

3. **검색 가능하게**
   - 키워드 명확히
   - 파일명, 함수명 정확히 기록

4. **시간 정보 포함**
   - 언제 작성되었는지
   - 어떤 버전인지

5. **참조 명확히**
   - 문서 이름과 줄 번호
   - 외부 링크는 전체 URL

## 확장 가능성

### 추가 가능한 기능

1. **자동 태그 생성**
   - #backend, #frontend, #bugfix 등
   - 검색 및 필터링 용이

2. **통계 분석**
   - 가장 많이 수정한 파일
   - 평균 작업 시간
   - 자주 발생하는 에러

3. **시각화**
   - 파일 변경 히트맵
   - 작업 흐름 다이어그램
   - 의존성 그래프

4. **자동 링크**
   - 관련 context 파일끼리 연결
   - 같은 파일을 수정한 작업끼리 그룹화

## 참고 자료
- 이 문서 자체가 `agent_context_save` 스킬의 프로세스 문서
- 실제 사용 예시는 `.claude/docs/process_main_context_save.md` (생성 후)
- 다른 프로세스 문서들: `process_setup.md`, `process_backend.md`, `process_frontend.md`
