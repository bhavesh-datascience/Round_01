"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useGame } from "./game-context"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

function formatDuration(ms: number) {
  const sec = Math.floor(ms / 1000)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export default function Header() {
  const { gameName, tagline, state, timeRemaining, formatTime } = useGame()
  const [now, setNow] = useState<number>(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const isLowTime = timeRemaining <= 300 // 5 minutes or less
  const isCriticalTime = timeRemaining <= 60 // 1 minute or less
  const showTimer = state.gameStatus === 'playing'

  return (
    <header className="w-full ff-glass-nav text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="group">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 rounded-md ff-glass ring-2 ring-primary/40 shadow-sm">
              <span className="absolute inset-0 rounded-md" aria-hidden />
              <span
                className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow"
                aria-hidden
              />
            </div>
            <div>
              <div className="font-semibold text-balance font-serif">{gameName}</div>
              <div className="text-xs text-muted-foreground">{tagline}</div>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <div className="text-sm">
            <div className="text-muted-foreground">Team</div>
            <div className="font-medium">{state.teamName || "-"}</div>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground">Score</div>
            <div className="font-medium">{state.score}</div>
          </div>
          {showTimer && (
            <div className={`text-sm flex items-center gap-2 px-3 py-1 rounded-lg border transition-all duration-300 ${
              isCriticalTime 
                ? 'bg-red-500/20 border-red-400/30 text-red-300 animate-pulse' 
                : isLowTime 
                ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' 
                : 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300'
            }`}>
              <Clock className={`w-4 h-4 ${isCriticalTime ? 'text-red-400' : isLowTime ? 'text-yellow-400' : 'text-cyan-400'}`} />
              <div>
                <div className="text-xs text-muted-foreground">Time</div>
                <div className={`font-mono font-bold ${
                  isCriticalTime ? 'text-red-200' : isLowTime ? 'text-yellow-200' : 'text-cyan-200'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
