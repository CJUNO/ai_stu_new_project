"""
Pydantic 데이터 모델 정의
API 요청/응답의 데이터 구조를 정의합니다.
"""

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
