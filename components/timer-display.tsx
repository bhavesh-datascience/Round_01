"use client"

import { useGame } from "@/components/game-context"
import { Clock } from "lucide-react"

export default function TimerDisplay() {
  const { state, timeRemaining, formatTime } = useGame()
  
  if (state.gameStatus !== 'playing') return null

  const isLowTime = timeRemaining <= 300 // 5 minutes or less
  const isCriticalTime = timeRemaining <= 60 // 1 minute or less

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
      isCriticalTime 
        ? 'bg-red-500/20 border-red-400/30 text-red-300 animate-pulse' 
        : isLowTime 
        ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' 
        : 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300'
    }`}>
      <Clock className={`w-5 h-5 ${isCriticalTime ? 'text-red-400' : isLowTime ? 'text-yellow-400' : 'text-cyan-400'}`} />
      <span className={`font-mono text-lg font-bold ${
        isCriticalTime ? 'text-red-200' : isLowTime ? 'text-yellow-200' : 'text-cyan-200'
      }`}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  )
}
