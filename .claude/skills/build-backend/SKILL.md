---
name: build-backend
description: FastAPI 기반 백엔드 구축 - 5가지 정렬 알고리즘(Bubble, Selection, Insertion, Heap, Quick)의 단계별 실행을 기록하고 API 엔드포인트를 구현하는 스킬
---

# Build Backend Skill

## 스킬 설명
Algo-Race 5 백엔드를 구축하는 스킬입니다. 5가지 정렬 알고리즘과 FastAPI 엔드포인트를 구현합니다.

## 사용법
```
/build-backend
```

## 전제 조건
- `/setup-project` 스킬이 먼저 실행되어야 합니다
- `backend/` 디렉토리가 존재해야 합니다

## 이 스킬이 수행하는 작업

### 1. models.py 작성
**참고 문서:**
- `.claude/docs/new_project_description.md` 57번 줄 (API 요청/응답 구조)
- `CLAUDE.md` 57번 줄 (Pydantic 스키마)

**작성 이유:**
API 요청/응답의 데이터 구조를 명확히 정의하고 유효성 검사를 수행하기 위해

**작성된 코드:**
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

**코드 설명:**
- `RaceRequest`: 배열 크기를 10~200 범위로 제한
- `Step`: 단계 타입을 "compare", "swap", "overwrite"로 제한
- `RaceResponse`: 초기 배열과 5개 알고리즘의 단계 리스트 포함

**근거:**
- `.claude/docs/new_project_description.md` 49-52번 줄: Step 데이터 구조 정의
- `CLAUDE.md` 42-48번 줄: Step 형식 명세

### 2. algorithms.py 작성

#### 2.1 버블 정렬 (Bubble Sort)
**참고 문서:**
- `.claude/docs/new_project_description.md` 44번 줄
- `CLAUDE.md` 142번 줄 (시간 복잡도 O(N²))

**작성 이유:**
가장 느린 O(N²) 알고리즘으로 경주에서 비교 대상 역할

**작성된 코드:**
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

**코드 설명:**
- 인접한 두 요소를 비교 (`compare`)
- 큰 값이 앞에 있으면 교환 (`swap`)
- 매 비교마다 단계를 `steps` 리스트에 추가

**왜 이렇게 작성했는가:**
- `CLAUDE.md` 114번 줄: "각 비교/교환 작업마다 반드시 단계를 수집해야 합니다"
- `.claude/docs/new_project_description.md` 97번 줄: "각 단계가 올바르게 기록되는지 단위 테스트"

#### 2.2 선택 정렬 (Selection Sort)
**참고 문서:**
- `.claude/docs/new_project_description.md` 45번 줄
- `CLAUDE.md` 143번 줄

**작성된 코드:**
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

**코드 설명:**
- 미정렬 부분에서 최솟값을 찾아 맨 앞으로 이동
- "왼쪽에서 오른쪽으로 채워지는" 특성 구현

#### 2.3 삽입 정렬 (Insertion Sort)
**참고 문서:**
- `.claude/docs/new_project_description.md` 46번 줄
- `CLAUDE.md` 144번 줄

**작성된 코드:**
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

**코드 설명:**
- 각 요소를 정렬된 부분의 올바른 위치에 삽입
- 데이터 순서에 따라 성능이 달라지는 특성 반영

#### 2.4 힙 정렬 (Heap Sort)
**참고 문서:**
- `.claude/docs/new_project_description.md` 47번 줄
- `CLAUDE.md` 145번 줄 (O(N log N))

**작성된 코드:**
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

**코드 설명:**
- 힙 자료구조를 이용한 정렬
- 많은 swap 발생으로 시각화에 유리

#### 2.5 퀵 정렬 (Quick Sort)
**참고 문서:**
- `.claude/docs/new_project_description.md` 48번 줄
- `CLAUDE.md` 146번 줄 (가장 빠름)

**작성된 코드:**
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
                "pivot": pivot_idx
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

**코드 설명:**
- 피벗을 기준으로 분할 정복
- `pivot` 필드를 포함하여 피벗 위치 시각화
- 평균 O(N log N)으로 가장 빠른 성능

**왜 pivot 필드를 추가했는가:**
- `.claude/docs/new_project_description.md` 52번 줄: "(Optional) pivot: 퀵 정렬 시 피벗 인덱스 강조용"
- `CLAUDE.md` 47번 줄: "pivot: index # 선택사항, 퀵 정렬 시각화용"

### 3. main.py 작성
**참고 문서:**
- `.claude/docs/new_project_description.md` 54-57번 줄 (API 엔드포인트)
- `CLAUDE.md` 51-55번 줄 (FastAPI endpoints)

**작성된 코드:**
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

# CORS 설정
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

    - **size**: 배열의 크기 (10~200)
    """
    # 무작위 배열 생성
    initial_data = random.sample(range(1, request.size * 2), request.size)

    # 5개 알고리즘 실행
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

**코드 설명:**
1. **CORS 설정**: 프론트엔드(localhost:5173)에서의 요청 허용
2. **헬스 체크**: `/` 엔드포인트로 서버 상태 확인
3. **경주 생성**: `/api/race` POST 요청 처리
   - 무작위 배열 생성 (중복 없음, `random.sample` 사용)
   - 5개 알고리즘 동일한 배열로 실행
   - 각 알고리즘의 단계 리스트 수집

**왜 random.sample을 사용했는가:**
- 중복 없는 랜덤 값 생성으로 정렬 결과 검증 용이
- 시각화 시 값의 구분이 명확

**왜 CORS를 설정했는가:**
- 프론트엔드(포트 5173)와 백엔드(포트 8000)가 다른 포트에서 실행
- 브라우저의 동일 출처 정책(Same-Origin Policy) 우회 필요

## ⚠️ 작업 완료 후 자동 Context 저장 (필수!)

이 스킬 완료 후 **반드시** 다음 명령을 실행하여 작업 내용을 기록합니다:

```
/agent_context_save backend
```

**저장 내용:**
- 수행한 작업 목록 및 작업 흐름
- 의사결정 과정과 이유 (왜 그렇게 구현했는지)
- 참고한 문서와 줄 번호
- 발생한 에러와 해결 방법
- 다음 작업을 위한 힌트

**저장 위치:** `.claude/docs/process_backend_context_save.md`

**중요:** Context 저장은 다음 세션이나 다른 개발자가 작업 내용을 이해하는 데 필수적입니다. 반드시 실행하세요!

---

## 작업 완료 후 확인사항
- [ ] `uvicorn main:app --reload` 실행 성공
- [ ] http://localhost:8000/docs 접속하여 Swagger UI 확인
- [ ] `/api/race` 엔드포인트 테스트 (size=10으로 테스트)
- [ ] 응답에 5개 알고리즘의 steps가 모두 포함되는지 확인
- [ ] 단계 수가 예상 복잡도와 일치하는지 확인 (Bubble > Heap/Quick)

## 다음 단계
- `/build-frontend` - 프론트엔드 컴포넌트 구현

## 관련 문서
- `.claude/docs/process_backend.md` - 상세 작업 과정
- `.claude/docs/new_project_description.md` - 백엔드 명세
- `CLAUDE.md` - 백엔드 구조 가이드
