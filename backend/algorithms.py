"""
정렬 알고리즘 구현 파일
5가지 정렬 알고리즘의 단계별 실행 기록을 담당합니다.
"""

from typing import List, Dict


def bubble_sort(arr: List[int]) -> List[Dict]:
    """
    버블 정렬 - O(N²)
    인접한 두 요소를 비교하여 정렬하는 가장 기본적인 알고리즘
    """
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


def selection_sort(arr: List[int]) -> List[Dict]:
    """
    선택 정렬 - O(N²)
    미정렬 부분에서 최솟값을 찾아 맨 앞으로 이동
    """
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


def insertion_sort(arr: List[int]) -> List[Dict]:
    """
    삽입 정렬 - O(N²)
    각 요소를 정렬된 부분의 올바른 위치에 삽입
    """
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


def heap_sort(arr: List[int]) -> List[Dict]:
    """
    힙 정렬 - O(N log N)
    힙 자료구조를 이용한 정렬 알고리즘
    """
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


def quick_sort(arr: List[int]) -> List[Dict]:
    """
    퀵 정렬 - O(N log N)
    피벗을 기준으로 분할 정복하는 가장 빠른 알고리즘
    """
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
