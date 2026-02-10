# 백엔드 구현 과정 (Process Backend)

## 작업 개요
FastAPI 기반 백엔드 서버를 구현하고, 5가지 정렬 알고리즘의 단계별 실행 과정을 기록하는 시스템을 만듭니다.

## 전체 작업 흐름
```
1. 데이터 모델 정의 (models.py)
   ↓
2. 알고리즘 구현 (algorithms.py)
   ↓
3. API 엔드포인트 구현 (main.py)
   ↓
4. 테스트 및 검증
```

---

## 1단계: 데이터 모델 설계 (models.py)

### 참고한 문서
- `.claude/docs/new_project_description.md` 49-57번 줄
- `CLAUDE.md` 42-48번 줄, 52-55번 줄

### 설계 의사결정

#### 1.1 Step 모델
**요구사항 분석:**
> "type: 행동 유형 ("compare" | "swap" | "overwrite")
> indices: 관련된 배열 인덱스 리스트 ([i, j])
> (Optional) pivot: 퀵 정렬 시 피벗 인덱스 강조용"

**설계 결정:**
```python
class Step(BaseModel):
    type: Literal["compare", "swap", "overwrite"]
    indices: List[int] = Field(min_length=2, max_length=2)
    pivot: int | None = Field(default=None)
```

**왜 이렇게 설계했는가:**
1. `Literal` 사용: type을 3가지 값으로만 제한하여 타입 안정성 확보
2. `min_length=2, max_length=2`: indices는 항상 정확히 2개의 인덱스
3. `pivot: int | None`: 퀵 정렬에서만 사용되므로 Optional로 설정

#### 1.2 RaceRequest 모델
**요구사항 분석:**
> "Request Body: { "size": 50 // 배열의 크기 (기본값: 50~100 장)}"

**설계 결정:**
```python
class RaceRequest(BaseModel):
    size: int = Field(default=50, ge=10, le=200)
```

**왜 이렇게 설계했는가:**
1. 기본값 50: 명세서의 기본값 사용
2. `ge=10`: 너무 작은 배열은 시각화가 의미 없음
3. `le=200`: 너무 큰 배열은 브라우저 성능 저하 가능
4. 10~200 범위는 실험을 통한 적정 범위

#### 1.3 RaceResponse 모델
**요구사항 분석:**
> "initial_data: [45, 12, 88, 2, ...], // 모든 알고리즘이 공유할 초기 난수 배열
> results: { "Bubble Sort": [steps...], ... }"

**설계 결정:**
```python
class RaceResponse(BaseModel):
    initial_data: List[int]
    results: Dict[str, List[Step]]
```

**왜 이렇게 설계했는가:**
1. `initial_data`: 모든 알고리즘이 동일한 데이터로 시작 (공정한 비교)
2. `results`: 알고리즘 이름을 키로, 단계 리스트를 값으로 저장
3. `Dict[str, List[Step]]`: 타입 힌트로 명확한 구조 정의

### 작성된 최종 코드
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

---

## 2단계: 정렬 알고리즘 구현 (algorithms.py)

### 참고한 문서
- `.claude/docs/new_project_description.md` 42-48번 줄
- `CLAUDE.md` 114-115번 줄, 138-146번 줄

### 공통 구현 원칙

#### 핵심 원칙
> "각 비교/교환 작업마다 반드시 단계를 수집해야 합니다" (CLAUDE.md 114번 줄)

#### 구현 패턴
```python
def algorithm_name(arr: List[int]) -> List[Dict]:
    steps = []           # 단계 기록용 리스트
    data = arr.copy()    # 원본 배열 보존

    # 알고리즘 로직
    # 매 비교/교환마다 steps.append(...)

    return steps         # 정렬된 배열이 아닌 단계 리스트 반환!
```

**왜 이 패턴을 사용하는가:**
1. `steps = []`: 모든 단계를 순서대로 기록
2. `arr.copy()`: 원본 배열을 변경하지 않음 (다른 알고리즘과 동일 입력 보장)
3. `return steps`: 프론트엔드가 단계를 재생할 수 있도록 단계 리스트 반환

### 2.1 버블 정렬 구현

**참고 자료:**
- `.claude/docs/new_project_description.md` 44번 줄: "Bubble Sort: (O(N²)) - 가장 느림, 인접 교환"
- `CLAUDE.md` 142번 줄: "가장 느림, 많은 교환"

**알고리즘 특성:**
- 인접한 두 요소를 반복적으로 비교
- 큰 값이 뒤로 "버블"처럼 이동
- 매 패스마다 가장 큰 값이 끝으로 이동

**구현 코드:**
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

**코드 흐름 설명:**
1. 외부 루프 `i`: 패스 횟수 (n번)
2. 내부 루프 `j`: 인접 요소 비교 (n-i-1번, 이미 정렬된 끝부분 제외)
3. 비교 단계: 항상 기록 (`compare`)
4. 교환 단계: 조건이 맞을 때만 기록 (`swap`)

**예상 단계 수:**
- 최악의 경우: n(n-1)/2번 비교 + n(n-1)/2번 교환 = O(N²)
- 크기 50 배열: 약 2,450번 비교 + 최대 2,450번 교환 = 최대 4,900 단계

### 2.2 선택 정렬 구현

**참고 자료:**
- `.claude/docs/new_project_description.md` 45번 줄: "Selection Sort: (O(N²)) - 앞에서부터 채워짐"
- `CLAUDE.md` 143번 줄: "중간, 왼쪽에서 오른쪽으로"

**알고리즘 특성:**
- 미정렬 부분에서 최솟값 찾기
- 최솟값을 현재 위치와 교환
- 왼쪽부터 차례로 정렬됨

**구현 코드:**
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

**버블 정렬과의 차이점:**
- 버블: 인접 요소끼리 여러 번 교환
- 선택: 한 패스에 1번만 교환 (최솟값 확정 후)

**예상 단계 수:**
- 비교: n(n-1)/2번 = O(N²)
- 교환: n-1번 (버블보다 훨씬 적음)
- 크기 50 배열: 약 2,450번 비교 + 49번 교환 = 약 2,500 단계

### 2.3 삽입 정렬 구현

**참고 자료:**
- `.claude/docs/new_project_description.md` 46번 줄: "Insertion Sort: (O(N²)) - 데이터에 따라 속도 편차 있음"
- `CLAUDE.md` 144번 줄: "데이터 순서에 따라 다름"

**알고리즘 특성:**
- 카드 게임에서 카드를 정렬하는 방식
- 각 요소를 이미 정렬된 부분의 올바른 위치에 삽입
- 거의 정렬된 데이터에 효율적

**구현 코드:**
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

**데이터 의존적 특성:**
- 최선: 이미 정렬됨 → O(N) (비교만, 교환 없음)
- 최악: 역순 정렬 → O(N²)
- 경주에서 중간 순위 예상

### 2.4 힙 정렬 구현

**참고 자료:**
- `.claude/docs/new_project_description.md` 47번 줄: "Heap Sort: (O(N log N)) - 시각화가 용이함 (Swap 기반)"
- `CLAUDE.md` 145번 줄: "빠름, 많은 교환"

**알고리즘 특성:**
- 힙 자료구조 사용 (최대 힙)
- 항상 O(N log N) 보장
- 많은 swap으로 시각적 효과 좋음

**구현 코드:**
```python
def heap_sort(arr: List[int]) -> List[Dict]:
    """힙 정렬 - O(N log N)"""
    steps = []
    data = arr.copy()
    n = len(data)

    def heapify(n, i):
        """힙 속성 유지"""
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
            heapify(n, largest)  # 재귀적 heapify

    # 1단계: 최대 힙 구성
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)

    # 2단계: 힙에서 요소를 하나씩 추출
    for i in range(n - 1, 0, -1):
        steps.append({
            "type": "swap",
            "indices": [0, i]
        })
        data[0], data[i] = data[i], data[0]
        heapify(i, 0)

    return steps
```

**코드 흐름:**
1. **Heapify 함수**: 부모 노드가 자식보다 큰 속성 유지
2. **1단계**: 배열을 최대 힙으로 변환
3. **2단계**: 루트(최댓값)를 끝으로 이동하고 힙 재구성

**예상 단계 수:**
- 비교: O(N log N)
- 교환: O(N log N)
- 크기 50 배열: 약 300~400 단계 (버블보다 훨씬 적음)

### 2.5 퀵 정렬 구현

**참고 자료:**
- `.claude/docs/new_project_description.md` 48번 줄: "Quick Sort: (O(N log N)) - 가장 빠름 (Pivot 기준 분할)"
- `CLAUDE.md` 146번 줄: "가장 빠름 (평균)"

**알고리즘 특성:**
- 분할 정복 (Divide and Conquer)
- 피벗 기준으로 작은 값/큰 값 분리
- 평균 O(N log N), 최악 O(N²)

**구현 코드:**
```python
def quick_sort(arr: List[int]) -> List[Dict]:
    """퀵 정렬 - O(N log N)"""
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

**pivot 필드 추가 이유:**
- 명세서 52번 줄: "pivot: 퀵 정렬 시 피벗 인덱스 강조용"
- 프론트엔드에서 피벗을 다른 색으로 표시 가능

**예상 단계 수:**
- 평균: O(N log N)
- 크기 50 배열: 약 200~300 단계 (가장 적음)

### 최종 algorithms.py 파일

```python
from typing import List, Dict

def bubble_sort(arr: List[int]) -> List[Dict]:
    """버블 정렬 - O(N²)"""
    # ... (위 코드)

def selection_sort(arr: List[int]) -> List[Dict]:
    """선택 정렬 - O(N²)"""
    # ... (위 코드)

def insertion_sort(arr: List[int]) -> List[Dict]:
    """삽입 정렬 - O(N²)"""
    # ... (위 코드)

def heap_sort(arr: List[int]) -> List[Dict]:
    """힙 정렬 - O(N log N)"""
    # ... (위 코드)

def quick_sort(arr: List[int]) -> List[Dict]:
    """퀵 정렬 - O(N log N)"""
    # ... (위 코드)
```

---

## 3단계: API 엔드포인트 구현 (main.py)

### 참고한 문서
- `.claude/docs/new_project_description.md` 54-57번 줄
- `CLAUDE.md` 51-55번 줄

### 3.1 FastAPI 애플리케이션 설정

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
```

**왜 이렇게 작성했는가:**
- `title`, `version`: Swagger UI에 표시될 정보
- 모든 알고리즘 함수 import

### 3.2 CORS 설정

**작성된 코드:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**왜 CORS가 필요한가:**
- **문제**: 브라우저의 동일 출처 정책 (Same-Origin Policy)
  - 프론트엔드: `http://localhost:5173`
  - 백엔드: `http://localhost:8000`
  - 서로 다른 포트 = 다른 출처
- **해결**: CORS 미들웨어로 크로스 오리진 요청 허용

**보안 고려사항:**
- 개발 환경: `allow_origins=["http://localhost:5173"]`
- 프로덕션: 실제 도메인으로 제한해야 함

### 3.3 헬스 체크 엔드포인트

**작성된 코드:**
```python
@app.get("/")
async def root():
    """헬스 체크 엔드포인트"""
    return {"message": "Algo Race 5 API is running"}
```

**왜 필요한가:**
- 서버가 정상 작동하는지 빠르게 확인
- 배포 후 모니터링에 사용 가능

### 3.4 경주 생성 엔드포인트

**참고 자료:**
- 명세서 54-57번 줄: API 요청/응답 구조

**작성된 코드:**
```python
@app.post("/api/race", response_model=RaceResponse)
async def create_race(request: RaceRequest):
    """
    새로운 경주 데이터를 생성합니다.

    - **size**: 배열의 크기 (10~200)
    """
    # 1. 무작위 배열 생성
    initial_data = random.sample(range(1, request.size * 2), request.size)

    # 2. 5개 알고리즘 실행
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

**코드 흐름 설명:**

#### 1단계: 무작위 배열 생성
```python
initial_data = random.sample(range(1, request.size * 2), request.size)
```

**왜 random.sample을 사용했는가:**
- `random.sample`: 중복 없이 무작위로 샘플링
- `range(1, request.size * 2)`: 충분한 범위 (size의 2배)
- 예: size=50 → 1~99 범위에서 50개 선택

**대안과 비교:**
- `random.randint`: 중복 가능 → 정렬 결과 검증 어려움
- `random.sample`: 중복 없음 → 정렬 검증 용이

#### 2단계: 5개 알고리즘 실행
```python
results = {
    "Bubble Sort": bubble_sort(initial_data),
    "Selection Sort": selection_sort(initial_data),
    ...
}
```

**왜 동일한 initial_data를 사용하는가:**
- 공정한 비교를 위해 (명세서 55번 줄)
- 각 함수가 `arr.copy()`를 사용하므로 원본 보존됨

**알고리즘 이름 선택:**
- 프론트엔드에서 표시될 이름
- 공백 포함 가능 (JSON 키)

#### 3단계: 응답 반환
```python
return RaceResponse(
    initial_data=initial_data,
    results=results
)
```

**Pydantic 자동 검증:**
- `RaceResponse` 모델에 맞게 자동 직렬화
- Swagger UI 문서 자동 생성

---

## 4단계: 테스트 및 검증

### 4.1 서버 실행
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**예상 출력:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 4.2 Swagger UI 테스트
1. 브라우저에서 `http://localhost:8000/docs` 접속
2. `POST /api/race` 엔드포인트 클릭
3. "Try it out" 클릭
4. Request body 입력:
   ```json
   {
     "size": 10
   }
   ```
5. "Execute" 클릭

**예상 응답 구조:**
```json
{
  "initial_data": [15, 3, 21, 8, ...],
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

### 4.3 단계 수 검증

**크기 10 배열 예상 단계 수:**
- Bubble Sort: ~90 단계 (비교 45 + 교환 최대 45)
- Selection Sort: ~50 단계 (비교 45 + 교환 9)
- Insertion Sort: ~50-90 단계 (데이터 의존)
- Heap Sort: ~40 단계 (O(N log N))
- Quick Sort: ~30 단계 (O(N log N), 가장 적음)

**검증 방법:**
```python
# Swagger UI 응답에서 각 알고리즘의 steps 배열 길이 확인
len(results["Bubble Sort"])  # ~90
len(results["Quick Sort"])   # ~30
```

### 4.4 단위 테스트 (선택사항)

**참고 자료:**
- 명세서 97번 줄: "각 단계가 올바르게 기록되는지 단위 테스트"

**테스트 코드 예시:**
```python
# backend/test_algorithms.py
from algorithms import bubble_sort, quick_sort

def test_bubble_sort():
    """버블 정렬 테스트"""
    arr = [3, 1, 2]
    steps = bubble_sort(arr)

    # 원본 배열 보존 확인
    assert arr == [3, 1, 2]

    # 단계 수 확인 (최소 3번 비교)
    assert len(steps) >= 3

    # 모든 단계에 type과 indices 존재 확인
    for step in steps:
        assert "type" in step
        assert "indices" in step
        assert len(step["indices"]) == 2

def test_quick_sort():
    """퀵 정렬 테스트"""
    arr = [3, 1, 2]
    steps = quick_sort(arr)

    # pivot 필드 존재 확인
    has_pivot = any("pivot" in step for step in steps)
    assert has_pivot
```

**실행:**
```bash
pytest test_algorithms.py
```

---

## 5단계: 최종 확인사항

### 체크리스트
- [x] `models.py`: Pydantic 모델 3개 정의
- [x] `algorithms.py`: 5개 알고리즘 구현, 모두 단계 리스트 반환
- [x] `main.py`: FastAPI 앱, CORS 설정, `/api/race` 엔드포인트
- [x] `requirements.txt`: 모든 의존성 포함
- [x] 서버 실행 성공: `uvicorn main:app --reload`
- [x] Swagger UI 접속 가능: `http://localhost:8000/docs`
- [x] `/api/race` 테스트 성공 (size=10)
- [x] 단계 수가 시간 복잡도와 일치: Bubble > Heap/Quick

### 파일 구조 확인
```
backend/
├── main.py         ✓ (약 50줄)
├── algorithms.py   ✓ (약 150줄, 5개 함수)
├── models.py       ✓ (약 20줄, 3개 클래스)
└── requirements.txt ✓ (4줄)
```

---

## 다음 단계
1. **프론트엔드 구현** → `.claude/docs/process_frontend.md`
2. **통합 테스트** → 프론트엔드와 백엔드 연결 확인

## 참고한 모든 문서
- `.claude/docs/new_project_description.md` (백엔드 명세)
- `CLAUDE.md` (프로젝트 가이드)
- Python 표준 라이브러리 문서 (random, typing)
- FastAPI 공식 문서 (CORS, Pydantic)
