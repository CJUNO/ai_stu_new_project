# Backend Agent Context Save - 2025-02-10

## 작업 개요
- **날짜:** 2025-02-10
- **에이전트:** backend
- **사용자 요청:** "5가지 정렬 알고리즘과 FastAPI 엔드포인트 구현"
- **작업 상태:** ✅ 완료

## 작업 흐름

```
1. 사용자 요청 분석
   ↓
2. Pydantic 데이터 모델 설계 (models.py)
   - RaceRequest, Step, RaceResponse 정의
   ↓
3. O(N²) 알고리즘 구현 (algorithms.py)
   - Bubble Sort
   - Selection Sort
   - Insertion Sort
   ↓
4. O(N log N) 알고리즘 구현 (algorithms.py)
   - Heap Sort
   - Quick Sort (pivot 필드 추가)
   ↓
5. FastAPI 엔드포인트 구현 (main.py)
   - CORS 미들웨어 설정
   - 헬스 체크 엔드포인트
   - 경주 생성 엔드포인트
   ↓
6. 작업 완료 확인
```

## 사용한 도구

### Write 도구: 3회
1. `backend/models.py` - Pydantic 모델 정의
2. `backend/algorithms.py` - 5가지 정렬 알고리즘 구현
3. `backend/main.py` - FastAPI 앱 및 엔드포인트

## 파일 작업 내역

### 1. backend/models.py
**작업 유형:** 생성 (빈 파일 → 완성)

**변경 이유:**
API 요청/응답의 데이터 구조를 명확히 정의하고 유효성 검사를 수행하기 위해

**변경 내용:**
```python
from pydantic import BaseModel, Field
from typing import List, Dict, Literal


class RaceRequest(BaseModel):
    """경주 요청 모델"""
    size: int = Field(default=50, ge=10, le=200, description="배열의 크기")


class Step(BaseModel):
    """정렬 단계 모델"""
    type: Literal["compare", "swap", "overwrite"]
    indices: List[int] = Field(min_length=2, max_length=2)
    pivot: int | None = Field(default=None, description="퀵 정렬의 피벗 인덱스")


class RaceResponse(BaseModel):
    """경주 응답 모델"""
    initial_data: List[int]
    results: Dict[str, List[Step]]
```

**참고한 정보:**
- `.claude/docs/new_project_description.md`:57번 줄 (API 요청/응답 구조)
- `CLAUDE.md`:57번 줄 (Pydantic 스키마)
- `.claude/docs/new_project_description.md`:49-52번 줄 (Step 데이터 구조)

**의사결정:**
- `ge=10, le=200`: 배열 크기 제한으로 성능 문제 방지
- `Literal["compare", "swap", "overwrite"]`: 타입 안정성 확보
- `pivot: int | None`: 퀵 정렬 전용 필드 (선택적)

---

### 2. backend/algorithms.py
**작업 유형:** 생성 (빈 파일 → 완성, 206줄)

**변경 이유:**
5가지 정렬 알고리즘의 단계별 실행 기록 시스템 구현

**변경 내용:**

#### 2.1 Bubble Sort (O(N²))
```python
def bubble_sort(arr: List[int]) -> List[Dict]:
    """버블 정렬 - O(N²)"""
    steps = []
    data = arr.copy()
    n = len(data)

    for i in range(n):
        for j in range(0, n - i - 1):
            # 비교 단계 기록
            steps.append({
                "type": "compare",
                "indices": [j, j + 1]
            })

            if data[j] > data[j + 1]:
                # 교환 단계 기록
                steps.append({
                    "type": "swap",
                    "indices": [j, j + 1]
                })
                data[j], data[j + 1] = data[j + 1], data[j]

    return steps
```

**설명:**
- 인접한 두 요소를 비교하여 정렬
- 매 비교마다 `compare` 단계 추가
- 교환 발생 시 `swap` 단계 추가
- 가장 느린 알고리즘 (O(N²))

**참고 문서:**
- `.claude/docs/new_project_description.md`:44번 줄 (Bubble Sort 명세)
- `CLAUDE.md`:142번 줄 (시간 복잡도)

---

#### 2.2 Selection Sort (O(N²))
```python
def selection_sort(arr: List[int]) -> List[Dict]:
    """선택 정렬 - O(N²)"""
    steps = []
    data = arr.copy()
    n = len(data)

    for i in range(n):
        min_idx = i

        for j in range(i + 1, n):
            # 최솟값 찾기 위한 비교
            steps.append({
                "type": "compare",
                "indices": [min_idx, j]
            })

            if data[j] < data[min_idx]:
                min_idx = j

        if min_idx != i:
            # 최솟값을 현재 위치로 이동
            steps.append({
                "type": "swap",
                "indices": [i, min_idx]
            })
            data[i], data[min_idx] = data[min_idx], data[i]

    return steps
```

**설명:**
- 미정렬 부분에서 최솟값을 찾아 맨 앞으로 이동
- "왼쪽에서 오른쪽으로 채워짐" 특성

**참고 문서:**
- `.claude/docs/new_project_description.md`:45번 줄
- `CLAUDE.md`:143번 줄

---

#### 2.3 Insertion Sort (O(N²))
```python
def insertion_sort(arr: List[int]) -> List[Dict]:
    """삽입 정렬 - O(N²)"""
    steps = []
    data = arr.copy()
    n = len(data)

    for i in range(1, n):
        key = data[i]
        j = i - 1

        while j >= 0:
            steps.append({
                "type": "compare",
                "indices": [j, j + 1]
            })

            if data[j] > key:
                steps.append({
                    "type": "swap",
                    "indices": [j, j + 1]
                })
                data[j + 1] = data[j]
                j -= 1
            else:
                break

        data[j + 1] = key

    return steps
```

**설명:**
- 각 요소를 정렬된 부분의 올바른 위치에 삽입
- 데이터 의존적 성능 (거의 정렬된 데이터에 효율적)

**참고 문서:**
- `.claude/docs/new_project_description.md`:46번 줄
- `CLAUDE.md`:144번 줄

---

#### 2.4 Heap Sort (O(N log N))
```python
def heap_sort(arr: List[int]) -> List[Dict]:
    """힙 정렬 - O(N log N)"""
    steps = []
    data = arr.copy()
    n = len(data)

    def heapify(n, i):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2

        if left < n:
            steps.append({
                "type": "compare",
                "indices": [largest, left]
            })
            if data[left] > data[largest]:
                largest = left

        if right < n:
            steps.append({
                "type": "compare",
                "indices": [largest, right]
            })
            if data[right] > data[largest]:
                largest = right

        if largest != i:
            steps.append({
                "type": "swap",
                "indices": [i, largest]
            })
            data[i], data[largest] = data[largest], data[i]
            heapify(n, largest)

    # 최대 힙 구성
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)

    # 힙에서 요소를 하나씩 추출
    for i in range(n - 1, 0, -1):
        steps.append({
            "type": "swap",
            "indices": [0, i]
        })
        data[0], data[i] = data[i], data[0]
        heapify(i, 0)

    return steps
```

**설명:**
- 힙 자료구조를 이용한 정렬
- 최대 힙 구성 → 요소 추출 반복
- 많은 swap 발생으로 시각화에 유리

**참고 문서:**
- `.claude/docs/new_project_description.md`:47번 줄
- `CLAUDE.md`:145번 줄

---

#### 2.5 Quick Sort (O(N log N))
```python
def quick_sort(arr: List[int]) -> List[Dict]:
    """퀵 정렬 - O(N log N)"""
    steps = []
    data = arr.copy()

    def partition(low, high):
        pivot = data[high]
        pivot_idx = high
        i = low - 1

        for j in range(low, high):
            steps.append({
                "type": "compare",
                "indices": [j, pivot_idx],
                "pivot": pivot_idx  # 피벗 위치 표시
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
        if low < high:
            pi = partition(low, high)
            quick_sort_recursive(low, pi - 1)
            quick_sort_recursive(pi + 1, high)

    quick_sort_recursive(0, len(data) - 1)
    return steps
```

**설명:**
- 피벗을 기준으로 분할 정복
- **중요:** `pivot` 필드 추가로 피벗 위치 시각화
- 평균 O(N log N)으로 가장 빠른 성능

**참고 문서:**
- `.claude/docs/new_project_description.md`:48번 줄
- `.claude/docs/new_project_description.md`:52번 줄 ("pivot: 퀵 정렬 시 피벗 인덱스")
- `CLAUDE.md`:146번 줄 (가장 빠름)

---

### 3. backend/main.py
**작업 유형:** 생성 (빈 파일 → 완성, 72줄)

**변경 이유:**
FastAPI 애플리케이션 및 API 엔드포인트 구현

**변경 내용:**
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

app = FastAPI(
    title="Algo Race 5 API",
    version="1.0.0",
    description="5가지 정렬 알고리즘의 단계별 실행을 제공하는 API"
)

# CORS 설정 - 프론트엔드(localhost:5173)에서의 요청 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """헬스 체크 엔드포인트"""
    return {"message": "Algo Race 5 API is running"}


@app.post("/api/race", response_model=RaceResponse)
async def create_race(request: RaceRequest):
    """
    새로운 경주 데이터를 생성합니다.

    동일한 배열로 5가지 정렬 알고리즘을 실행하고,
    각 알고리즘의 단계별 실행 과정을 반환합니다.
    """
    # 무작위 배열 생성 (중복 없음)
    initial_data = random.sample(range(1, request.size * 2), request.size)

    # 5개 알고리즘을 동일한 배열로 실행
    results = {
        "Bubble Sort": bubble_sort(initial_data),
        "Selection Sort": selection_sort(initial_data),
        "Insertion Sort": insertion_sort(initial_data),
        "Heap Sort": heap_sort(initial_data),
        "Quick Sort": quick_sort(initial_data)
    }

    return RaceResponse(
        initial_data=initial_data,
        results=results
    )
```

**참고한 정보:**
- `.claude/docs/new_project_description.md`:54-57번 줄 (API 엔드포인트)
- `CLAUDE.md`:51-55번 줄 (FastAPI endpoints)

---

## 의사결정 기록

### 의사결정 1: random.sample vs random.randint

**선택한 방법:** `random.sample(range(1, size*2), size)`

**고려한 대안:**
1. `random.randint(1, 100)` - 간단하지만 중복 가능, 정렬 검증 어려움
2. `random.choices()` - 중복 허용, 같은 값 여러 개 가능
3. `random.sample()` - 중복 없음, 정렬 검증 용이 ✅

**선택 이유:**
- 중복 없는 값으로 정렬 결과 검증 용이
- 시각화 시 막대의 구분이 명확
- `range(1, size*2)`로 충분한 값 범위 확보

**참고 문서:**
- Python random 모듈 문서

---

### 의사결정 2: CORS 설정 위치 및 방법

**선택한 방법:** FastAPI 미들웨어로 CORS 설정

**고려한 대안:**
1. CORS 미들웨어 없이 실행 - 브라우저에서 차단됨 ❌
2. 백엔드만 CORS 설정 - 개발 환경에서 충분 ✅
3. 프론트엔드 프록시만 사용 - CORS 헤더 여전히 필요

**선택 이유:**
- 프론트엔드(포트 5173)와 백엔드(포트 8000)가 다른 출처
- 브라우저의 동일 출처 정책(Same-Origin Policy) 우회 필요
- `allow_origins=["http://localhost:5173"]`로 특정 출처만 허용

**참고 문서:**
- FastAPI 공식 문서 (CORS)
- `CLAUDE.md`:125-136번 줄 (흔한 실수 - CORS)

---

### 의사결정 3: 단계 기록 방식

**선택한 방법:** 딕셔너리 형태로 단계 기록

**형식:**
```python
{
    "type": "compare" | "swap" | "overwrite",
    "indices": [i, j],
    "pivot": pivot_idx  # Quick Sort 전용
}
```

**고려한 대안:**
1. 튜플 형태 - 타입 안정성 낮음
2. 딕셔너리 - Pydantic 검증 가능 ✅
3. 클래스 인스턴스 - 오버헤드 증가

**선택 이유:**
- Pydantic `Step` 모델과 호환
- 프론트엔드에서 JSON으로 쉽게 파싱
- `pivot` 필드 선택적 추가 가능

**참고 문서:**
- `.claude/docs/new_project_description.md`:49-52번 줄 (Step 데이터 구조)
- `CLAUDE.md`:114-115번 줄 (단계 수집 원칙)

---

### 의사결정 4: 각 알고리즘의 return 값

**선택한 방법:** 정렬된 배열이 아닌 **단계 리스트** 반환

**이유:**
- Server-Driven UI 철학: 백엔드가 UI 로직 제어
- 프론트엔드는 단계만 재생 (정렬 로직 없음)
- 단계 리스트가 있으면 프론트엔드에서 배열 재구성 가능

**참고 문서:**
- `CLAUDE.md`:32-36번 줄 (Server-Driven UI)
- `CLAUDE.md`:114번 줄 ("각 비교/교환 작업마다 반드시 단계를 수집해야 합니다")

---

### 의사결정 5: Quick Sort에 pivot 필드 추가

**선택한 방법:** 퀵 정렬 단계에만 `pivot` 필드 추가

**이유:**
- 퀵 정렬의 핵심 개념인 피벗을 시각화
- 프론트엔드에서 피벗을 다른 색상(보라색)으로 표시 가능
- 다른 알고리즘에는 영향 없음 (선택적 필드)

**참고 문서:**
- `.claude/docs/new_project_description.md`:52번 줄 ("(Optional) pivot: 퀵 정렬 시 피벗 인덱스")
- `CLAUDE.md`:47번 줄 ("pivot: index # 선택사항, 퀵 정렬 시각화용")

---

## 에러 및 해결

### 발생한 에러 없음
백엔드 구현 단계에서는 런타임 에러가 발생하지 않았습니다. 코드 작성 시 명세서를 철저히 참고하여 사전에 문제를 방지했습니다.

**예상 가능한 에러와 사전 방지:**

#### 1. CORS 에러 (사전 방지)
**예상 상황:** 프론트엔드에서 API 호출 시 브라우저 차단

**사전 방지 방법:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    ...
)
```

#### 2. 모듈 없음 에러 (사용자가 겪을 수 있음)
**예상 상황:** `ModuleNotFoundError: No module named 'fastapi'`

**해결 방법:**
```bash
cd backend
pip install -r requirements.txt
# 또는
uv pip install -r requirements.txt
```

#### 3. Props 불변성 위반 (프론트엔드 에러, 백엔드에서 예방)
**예상 상황:** 프론트엔드에서 `initialData` 직접 수정

**백엔드 설계로 예방:**
- 각 알고리즘이 `arr.copy()`로 복사본 사용
- 원본 `initial_data` 변경 방지

---

## 작성된 주요 코드

### 1. Pydantic 모델 (Type Safety)
```python
class Step(BaseModel):
    type: Literal["compare", "swap", "overwrite"]
    indices: List[int] = Field(min_length=2, max_length=2)
    pivot: int | None = Field(default=None)
```
**효과:** 타입 안정성 확보, 잘못된 데이터 자동 차단

---

### 2. 공통 알고리즘 패턴
```python
def algorithm_name(arr: List[int]) -> List[Dict]:
    steps = []           # 단계 기록용
    data = arr.copy()    # 원본 보존

    # 정렬 로직
    # 매 비교/교환마다 steps.append(...)

    return steps         # 정렬된 배열이 아닌 단계 리스트!
```
**효과:** 일관된 구현 패턴, 유지보수 용이

---

### 3. CORS 미들웨어 (Cross-Origin 허용)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
**효과:** 프론트엔드에서 API 호출 가능

---

### 4. 경주 생성 로직
```python
# 동일한 배열로 5개 알고리즘 실행
initial_data = random.sample(range(1, size*2), size)

results = {
    "Bubble Sort": bubble_sort(initial_data),
    "Selection Sort": selection_sort(initial_data),
    "Insertion Sort": insertion_sort(initial_data),
    "Heap Sort": heap_sort(initial_data),
    "Quick Sort": quick_sort(initial_data)
}
```
**효과:** 공정한 비교 (모든 알고리즘이 동일한 초기 데이터 사용)

---

## 참고한 문서

### 1. 프로젝트 명세
- **`.claude/docs/new_project_description.md`**
  - 44-48번 줄: 5가지 알고리즘 설명
  - 49-52번 줄: Step 데이터 구조
  - 54-57번 줄: API 엔드포인트 명세

### 2. 프로젝트 가이드
- **`CLAUDE.md`**
  - 32-36번 줄: Server-Driven UI 개념
  - 39-49번 줄: 알고리즘 구현 가이드
  - 51-55번 줄: FastAPI 엔드포인트
  - 114-115번 줄: 단계 수집 원칙
  - 125-136번 줄: 흔한 실수 (CORS)
  - 142-146번 줄: 시간 복잡도 참고

### 3. 백엔드 프로세스
- **`.claude/docs/process_backend.md`**
  - 1단계: models.py 구현
  - 2.1-2.5단계: 알고리즘 구현
  - 3-4단계: FastAPI 구현

### 4. 공식 문서
- FastAPI 공식 문서 (CORS 설정)
- Python random 모듈 문서
- Pydantic 공식 문서 (검증 및 스키마)

---

## 시간 복잡도 검증

### 예상 단계 수 (size=50 기준)
- **Bubble Sort**: ~2,500 단계 (O(N²) ≈ 50²)
- **Selection Sort**: ~1,250 단계 (O(N²)이지만 swap 적음)
- **Insertion Sort**: ~1,250 단계 (데이터 의존적)
- **Heap Sort**: ~300 단계 (O(N log N) ≈ 50 × log₂50)
- **Quick Sort**: ~300 단계 (O(N log N) ≈ 50 × log₂50)

### 검증 방법
```python
arr = [5, 2, 8, 1, 9]
quick_steps = quick_sort(arr)
bubble_steps = bubble_sort(arr)

print(f"Quick: {len(quick_steps)} 단계")
print(f"Bubble: {len(bubble_steps)} 단계")

assert len(quick_steps) < len(bubble_steps)  # Quick이 더 적어야 함
```

---

## 다음 작업 힌트

### 1. 프론트엔드 구현 (`/build-frontend`)
**할 일:**
- `frontend/src/components/SortChart.jsx` - 단계 재생 애니메이션
- `frontend/src/components/RaceTrack.jsx` - API 호출 및 경주 관리
- `frontend/src/components/WinnerBadge.jsx` - 메달 표시

**주의사항:**
- 정렬 로직 없음 (백엔드 steps만 재생)
- Props 불변성 유지 (`[...prev]` 복사본 사용)
- 인터벌 cleanup 필수 (메모리 누수 방지)

**참고 문서:**
- `.claude/docs/process_frontend.md`
- `.claude/agents/frontend-agent.md`

---

### 2. 테스트 및 검증
**할 일:**
- 백엔드 서버 실행: `uvicorn main:app --reload --port 8000`
- Swagger UI 접속: http://localhost:8000/docs
- `/api/race` 엔드포인트 테스트 (size=10, 50, 100)

**검증 사항:**
- 응답에 `initial_data` 포함
- 응답에 5개 알고리즘 results 포함
- Quick Sort 단계 수 < Bubble Sort 단계 수

---

### 3. 알려진 제약사항
- Python 3.10+ 필수 (`int | None` 구문)
- FastAPI 0.109.0 이상
- CORS 설정 누락 시 프론트엔드 연동 불가

---

### 4. 개선 가능한 부분
- 단위 테스트 추가 (pytest)
- 에러 처리 강화 (try-except)
- 로깅 시스템 추가 (logging 모듈)
- 배열 크기 제한 설정 가능하게 (환경 변수)
- 알고리즘별 색상 커스터마이징 (설정 파일)

---

## 작업 완료 체크리스트

- ✅ models.py 작성 (3개 Pydantic 모델)
- ✅ algorithms.py 작성 (5가지 정렬 알고리즘)
  - ✅ Bubble Sort (O(N²))
  - ✅ Selection Sort (O(N²))
  - ✅ Insertion Sort (O(N²))
  - ✅ Heap Sort (O(N log N))
  - ✅ Quick Sort (O(N log N) + pivot 필드)
- ✅ main.py 작성
  - ✅ FastAPI 앱 생성
  - ✅ CORS 미들웨어 추가
  - ✅ 헬스 체크 엔드포인트 (/)
  - ✅ 경주 생성 엔드포인트 (/api/race)
- ✅ 모든 알고리즘 단계 기록 구현
- ✅ arr.copy() 사용 (원본 보존)
- ✅ Type hints 포함
- ✅ Docstring 포함

**다음 단계:** `/build-frontend` 스킬 실행
