import React from 'react'

const WinnerBadge = ({ rank }) => {
  const badges = {
    1: { emoji: '🥇', color: 'text-yellow-400', text: '1st' },
    2: { emoji: '🥈', color: 'text-gray-300', text: '2nd' },
    3: { emoji: '🥉', color: 'text-amber-600', text: '3rd' }
  }

  const badge = badges[rank]
  if (!badge) return null

  return (
    <div className="absolute top-2 right-2 flex items-center gap-2 bg-gray-800 bg-opacity-90 px-3 py-1 rounded-full border border-gray-600">
      <span className="text-2xl">{badge.emoji}</span>
      <span className={`text-lg font-bold ${badge.color}`}>
        {badge.text}
      </span>
    </div>
  )
}

export default WinnerBadge
