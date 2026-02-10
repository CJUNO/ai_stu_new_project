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

  // 포인트 색상 결정
  const getPointColor = (index) => {
    const highlightType = highlights[index]
    if (highlightType === 'compare') return '#ef4444' // 빨강 (비교)
    if (highlightType === 'swap') return '#34d399' // 초록 (교환)
    if (highlightType === 'pivot') return '#a855f7' // 보라 (피벗)
    return '#22d3ee' // 기본 (시안)
  }

  // 최댓값 계산 (높이 정규화용)
  const maxValue = Math.max(...initialData)
  const minValue = Math.min(...initialData)

  // SVG 좌표 계산
  const width = 600
  const height = 250
  const padding = 20

  const getX = (index) => {
    return padding + (index / (data.length - 1)) * (width - 2 * padding)
  }

  const getY = (value) => {
    return height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding)
  }

  // 라인 경로 생성
  const linePoints = data.map((value, index) => `${getX(index)},${getY(value)}`).join(' ')

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

      {/* 라인 차트 */}
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-64"
          style={{ maxWidth: '600px' }}
        >
          {/* 그리드 라인 (배경) */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (height - 2 * padding) / 4)}
              x2={width - padding}
              y2={padding + (i * (height - 2 * padding) / 4)}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          ))}

          {/* 메인 라인 */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            className="transition-all duration-100"
          />

          {/* 데이터 포인트 */}
          {data.map((value, index) => {
            const isHighlighted = highlights[index]
            return (
              <circle
                key={index}
                cx={getX(index)}
                cy={getY(value)}
                r={isHighlighted ? 6 : 4}
                fill={getPointColor(index)}
                className="transition-all duration-100"
                style={{
                  filter: isHighlighted ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                }}
              />
            )
          })}

          {/* 값 레이블 (하이라이트된 포인트만) */}
          {data.map((value, index) => {
            if (!highlights[index]) return null
            return (
              <text
                key={`label-${index}`}
                x={getX(index)}
                y={getY(value) - 12}
                textAnchor="middle"
                fill={getPointColor(index)}
                fontSize="12"
                fontWeight="bold"
                className="font-mono"
              >
                {value}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default SortChart
