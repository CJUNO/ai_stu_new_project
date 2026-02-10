import React, { useState, useEffect, useRef } from 'react'
import WinnerBadge from './WinnerBadge'

const SortChart = ({ name, initialData, steps, start, onFinish, rank }) => {
  const [data, setData] = useState(initialData)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlights, setHighlights] = useState({})
  const intervalRef = useRef(null)

  // 애니메이션 시작/중지
  useEffect(() => {
    if (start && currentStep < steps.length) {
      intervalRef.current = setInterval(() => {
        const step = steps[currentStep]

        // 하이라이트 설정
        if (step.type === 'compare') {
          setHighlights({
            [step.indices[0]]: 'compare',
            [step.indices[1]]: 'compare',
            ...(step.pivot !== undefined && { [step.pivot]: 'pivot' })
          })
        } else if (step.type === 'swap') {
          // 배열 교환
          setData(prev => {
            const newData = [...prev]
            const [i, j] = step.indices
            ;[newData[i], newData[j]] = [newData[j], newData[i]]
            return newData
          })

          setHighlights({
            [step.indices[0]]: 'swap',
            [step.indices[1]]: 'swap',
            ...(step.pivot !== undefined && { [step.pivot]: 'pivot' })
          })
        }

        setCurrentStep(prev => prev + 1)
      }, 20) // 20ms 간격 (50 steps/sec)
    } else if (currentStep >= steps.length && intervalRef.current) {
      // 완료
      clearInterval(intervalRef.current)
      onFinish(name)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [start, currentStep, steps, name, onFinish])

  // 하이라이트 제거 (100ms 후)
  useEffect(() => {
    if (Object.keys(highlights).length > 0) {
      const timer = setTimeout(() => {
        setHighlights({})
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [highlights])

  // 막대 색상 결정
  const getBarColor = (index) => {
    const highlightType = highlights[index]
    if (highlightType === 'compare') return 'bg-rose-500' // 빨강 (비교)
    if (highlightType === 'swap') return 'bg-emerald-400' // 초록 (교환)
    if (highlightType === 'pivot') return 'bg-purple-500' // 보라 (피벗)
    return 'bg-cyan-400' // 기본 (시안)
  }

  // 최댓값 계산 (높이 정규화용)
  const maxValue = Math.max(...initialData)

  return (
    <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-4">
      {/* 순위 배지 */}
      {rank && <WinnerBadge rank={rank} />}

      {/* 알고리즘 이름 */}
      <h3 className="text-xl font-mono font-bold mb-4 text-center">
        {name}
      </h3>

      {/* 진행률 */}
      <div className="mb-2 text-sm text-gray-400 text-center font-mono">
        {currentStep} / {steps.length} steps
      </div>

      {/* 막대 그래프 */}
      <div className="flex items-end justify-center gap-1 h-64">
        {data.map((value, index) => (
          <div
            key={index}
            className={`flex-1 ${getBarColor(index)} transition-all duration-100 rounded-t`}
            style={{
              height: `${(value / maxValue) * 100}%`,
              minWidth: '2px'
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default SortChart
