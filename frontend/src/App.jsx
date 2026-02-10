import React from 'react'
import RaceTrack from './components/RaceTrack'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-cyan-500 py-6">
        <h1 className="text-4xl font-mono font-bold text-center">
          <span className="text-cyan-400">ALGO</span>
          <span className="text-pink-500"> RACE </span>
          <span className="text-green-400">5</span>
        </h1>
        <p className="text-center text-gray-400 mt-2 font-mono">
          정렬 알고리즘 시각화 경주 🏁
        </p>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <RaceTrack />
      </main>
    </div>
  )
}

export default App
