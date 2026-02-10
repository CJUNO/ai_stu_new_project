"""
FastAPI 메인 애플리케이션
API 서버의 진입점입니다.
"""

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

    - **size**: 배열의 크기 (10~200, 기본값 50)

    Returns:
        - initial_data: 초기 배열
        - results: 각 알고리즘의 단계별 실행 기록
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
