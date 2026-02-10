---
name: agent_context_save
description: 메인/서브 에이전트가 수행한 작업 내용과 이유를 기록하여 나중에 참고할 수 있도록 저장하는 스킬, 각각의 에이전트는  필요한 `.claude/docs/process_*` 파일을 참고해서 이전에 어떤 작업을 했는지 확인 필요
---

# Agent Context Save Skill

## 스킬 설명
메인 에이전트 또는 서브 에이전트(Task tool로 실행된 에이전트)가 수행한 작업의 전체 context를 기록하고 저장하는 스킬입니다. 이를 통해:
- 어떤 작업을 수행했는지
- 왜 그런 결정을 내렸는지
- 어떤 파일을 읽고 수정했는지
- 어떤 도구를 사용했는지
- 발생한 문제와 해결 방법

등을 체계적으로 문서화하여 다음 세션이나 다른 에이전트가 참고할 수 있도록 합니다.

## 사용법
```
/agent_context_save [agent_name]
```

**파라미터:**
- `agent_name`: 저장할 에이전트의 이름 (예: main, explore, plan, bash 등)
  - 생략 시 "main" 에이전트로 기록

**예시:**
```
/agent_context_save main
/agent_context_save explore
/agent_context_save plan
```

## 이 스킬이 수행하는 작업

### 1. 현재 작업 컨텍스트 분석
**목적:** 에이전트가 지금까지 수행한 모든 작업을 파악

**수집 정보:**
- 사용자 요청 내용
- 실행한 도구 목록 (Read, Write, Edit, Bash, Grep, Glob 등)
- 읽은 파일 목록과 각 파일의 중요 내용
- 작성/수정한 파일 목록과 변경 내용
- 실행한 명령어와 결과
- 발생한 에러와 해결 방법
- 의사결정 과정과 이유

### 2. 작업 흐름도 생성
**목적:** 작업의 순서와 의존성을 시각적으로 표현

**작성 내용:**
```
1. 사용자 요청 분석
   ↓
2. 관련 파일 탐색 (Glob/Grep)
   ↓
3. 파일 읽기 (Read)
   ↓
4. 코드 작성/수정 (Write/Edit)
   ↓
5. 테스트/검증 (Bash)
   ↓
6. 결과 확인
```

### 3. 의사결정 기록
**목적:** 왜 그렇게 구현했는지 근거 명시

**기록 형식:**
```markdown
### 의사결정: [결정 내용]

**선택한 방법:** [실제로 선택한 방법]

**고려한 대안:**
1. [대안 1] - [장점/단점]
2. [대안 2] - [장점/단점]

**선택 이유:**
- [이유 1]
- [이유 2]

**참고 문서:**
- [문서 이름] [줄 번호]
```

### 4. 파일 변경 이력
**목적:** 어떤 파일을 어떻게 변경했는지 추적

**기록 형식:**
```markdown
### 파일: [파일 경로]

**작업 유형:** 생성 | 수정 | 삭제

**변경 이유:**
[왜 이 파일을 변경했는지]

**변경 내용:**
```파일 내용 또는 diff
```

**참고한 정보:**
- [참고한 파일/문서]
```

### 5. 에러 및 해결 과정
**목적:** 발생한 문제와 해결 방법 기록

**기록 형식:**
```markdown
### 에러: [에러 메시지]

**발생 상황:**
[어떤 작업 중 발생했는지]

**원인 분석:**
[왜 에러가 발생했는지]

**시도한 해결 방법:**
1. [방법 1] - [결과]
2. [방법 2] - [결과]

**최종 해결 방법:**
[실제로 해결한 방법]

**배운 점:**
[이 에러에서 배운 교훈]
```

### 6. 다음 작업을 위한 메모
**목적:** 다음 세션이나 다른 에이전트를 위한 힌트

**기록 내용:**
- 아직 완료되지 않은 작업
- 추가로 고려해야 할 사항
- 알려진 제약사항
- 개선 가능한 부분

## 저장 위치

### Context 파일
```
.claude/docs/process_[agent_name]_context_save.md
```

**파일 구조:**
```markdown
# [Agent Name] Context Save - [날짜]

## 작업 개요
- **날짜:** YYYY-MM-DD HH:MM:SS
- **에이전트:** [main/explore/plan 등]
- **사용자 요청:** [요청 내용]
- **작업 상태:** 완료/진행중/중단

## 작업 흐름
[작업 순서와 흐름도]

## 사용한 도구
[도구별 사용 내역]

## 파일 작업 내역
[읽은 파일/작성한 파일]

## 의사결정 기록
[주요 결정과 이유]

## 에러 및 해결
[발생한 문제와 해결 방법]

## 작성된 코드/내용
[주요 코드와 설명]

## 참고한 문서
[참조한 모든 파일과 문서]

## 다음 작업 힌트
[후속 작업을 위한 메모]
```

## 작업 흐름 예시

### 예시 1: 백엔드 구현 작업 기록
```bash
/agent_context_save main
```

**생성되는 파일:** `.claude/docs/process_main_context_save.md`

**내용:**
```markdown
# Main Agent Context Save - 2024-02-10

## 작업 개요
- **에이전트:** main
- **사용자 요청:** "백엔드 API 엔드포인트를 구현해주세요"
- **작업 상태:** 완료

## 작업 흐름
1. 프로젝트 명세 확인 (.claude/docs/new_project_description.md)
   ↓
2. 기존 코드 구조 파악 (backend/ 디렉토리 탐색)
   ↓
3. models.py 작성 (Pydantic 스키마)
   ↓
4. algorithms.py 작성 (5가지 정렬 알고리즘)
   ↓
5. main.py 작성 (FastAPI 엔드포인트)
   ↓
6. 서버 실행 테스트

## 사용한 도구
- Read: 5회 (명세서, CLAUDE.md 등)
- Write: 3회 (models.py, algorithms.py, main.py)
- Bash: 2회 (서버 실행, API 테스트)

## 파일 작업 내역

### backend/models.py (생성)
**변경 이유:** API 요청/응답 구조 정의 필요
**참고 문서:**
- new_project_description.md:49-57 (Step 데이터 구조)
- CLAUDE.md:42-48 (Step 형식)

### backend/algorithms.py (생성)
**변경 이유:** 5가지 정렬 알고리즘 단계 생성 로직 구현
**참고 문서:**
- new_project_description.md:42-48 (알고리즘 명세)
- CLAUDE.md:114-115 (단계 수집 원칙)

### backend/main.py (생성)
**변경 이유:** FastAPI 엔드포인트 구현
**참고 문서:**
- new_project_description.md:54-57 (API 명세)
- CLAUDE.md:51-55 (엔드포인트 구조)

## 의사결정 기록

### 의사결정: random.sample vs random.randint 선택

**선택한 방법:** random.sample(range(1, size*2), size)

**고려한 대안:**
1. random.randint - 간단하지만 중복 가능
2. random.sample - 중복 없음, 정렬 검증 용이

**선택 이유:**
- 중복 없는 값으로 정렬 결과 검증 용이
- 시각화 시 값의 구분이 명확

### 의사결정: 애니메이션 타이밍 (20ms)

**선택한 방법:** setInterval(..., 20)

**고려한 대안:**
1. 10ms - 너무 빠름, 차이 안 보임
2. 50ms - 너무 느림, 지루함
3. 20ms - 적절한 속도

**선택 이유:**
- 명세서 권장 범위 (10-50ms)
- 초당 50단계 처리로 적절한 시각화

## 에러 및 해결

### 에러: CORS 정책 위반
**발생 상황:** 프론트엔드에서 API 호출 시 차단
**원인:** 서로 다른 포트 (5173 vs 8000)
**해결 방법:** FastAPI에 CORS 미들웨어 추가
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    ...
)
```

## 작성된 주요 코드

### Bubble Sort 구현
```python
def bubble_sort(arr: List[int]) -> List[Dict]:
    steps = []
    data = arr.copy()
    # ... (코드 생략)
    return steps
```
**설명:** 인접 요소 비교 및 교환, 모든 단계 기록

## 참고한 문서
- `.claude/docs/new_project_description.md` (전체)
- `CLAUDE.md` (백엔드 섹션)
- FastAPI 공식 문서 (CORS)

## 다음 작업 힌트
- 프론트엔드 구현 필요
- 단위 테스트 추가 권장
- 에러 처리 강화 고려
```

### 예시 2: Explore 에이전트 작업 기록
```bash
/agent_context_save explore
```

**생성되는 파일:** `.claude/docs/process_explore_context_save.md`

## 주요 사용 시나리오

### 1. 메인 에이전트 작업 기록
```
사용자: "백엔드를 구현해주세요"
에이전트: [백엔드 구현 완료]
사용자: "/agent_context_save main"
→ 백엔드 구현 과정 전체 기록 저장
```

### 2. 서브 에이전트 작업 기록
```
메인 에이전트: Task(subagent_type="explore", ...)
Explore 에이전트: [코드베이스 탐색 완료]
메인 에이전트: "/agent_context_save explore"
→ 탐색 과정과 발견한 내용 기록 저장
```

### 3. 긴 작업 세션 중간 저장
```
사용자: "복잡한 리팩토링을 해주세요"
에이전트: [1시간 동안 작업 중...]
사용자: "/agent_context_save main"
→ 현재까지 진행 상황 저장 (체크포인트)
```

## 작업 완료 후 확인사항
- [ ] `.claude/docs/process_[agent_name]_context_save.md` 파일 생성됨
- [ ] 작업 흐름이 명확히 기록됨
- [ ] 모든 파일 변경 내역이 포함됨
- [ ] 의사결정 과정이 근거와 함께 기록됨
- [ ] 에러 및 해결 방법이 상세히 기록됨
- [ ] 다음 작업을 위한 힌트가 포함됨

## 활용 방법

### 1. 작업 이력 추적
이전 세션에서 무엇을 했는지 빠르게 파악

### 2. 지식 축적
반복되는 문제와 해결 방법을 축적하여 재사용

### 3. 협업 지원
다른 에이전트나 사용자가 작업 컨텍스트를 이해

### 4. 디버깅
문제 발생 시 이전 작업 내용을 참고하여 원인 파악

### 5. 학습 자료
좋은 구현 패턴과 의사결정 과정을 학습

## 관련 문서
- `.claude/docs/process_[agent_name]_context_save.md` - 실제 저장되는 컨텍스트 파일
- `CLAUDE.md` - 프로젝트 전체 가이드
- 각 스킬의 `process_*.md` 파일들 - 구체적인 작업 프로세스
