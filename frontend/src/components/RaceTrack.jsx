import React, { useState } from 'react'
import SortChart from './SortChart'

const RaceTrack = () => {
  const [raceData, setRaceData] = useState(null)
  const [started, setStarted] = useState(false)
  const [finishedOrder, setFinishedOrder] = useState([])
  const [loading, setLoading] = useState(false)

  // 경주 시작
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

  // 알고리즘 완료 콜백
  const handleFinish = (algorithmName) => {
    setFinishedOrder(prev => {
      if (!prev.includes(algorithmName)) {
        return [...prev, algorithmName]
      }
      return prev
    })
  }

  // 순위 계산
  const getRank = (algorithmName) => {
    const index = finishedOrder.indexOf(algorithmName)
    if (index === -1) return null
    return index + 1 // 1등, 2등, 3등
  }

  const algorithms = [
    'Bubble Sort',
    'Selection Sort',
    'Insertion Sort',
    'Heap Sort',
    'Quick Sort'
  ]

  return (
    <div>
      {/* 시작 버튼 */}
      <div className="text-center mb-8">
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

        {/* 완료 순위 표시 */}
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
      </div>

      {/* 차트 그리드 */}
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
    </div>
  )
}

export default RaceTrack
