"use client"

import { useRouter } from "next/navigation"
import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StartPage() {
  const router = useRouter()
  const { gameName, tagline, state, startGame } = useGame()

  // Redirect if no team name is set
  if (!state.teamName) {
    router.push("/login")
    return null
  }

  const handleStartGame = async () => {
    await startGame() // Start the timer and create Firebase round1 data
    router.push("/game/1")
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/700_F_1642857695_IGqHn4CofTWj0wlvpNMn1F9fOjAx3zbM_ST-0h3vtYmDYVpsiOFN49ZDpi1UHsrEYT.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Multi-layer gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-blue-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_70%)]" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <section className="relative z-10 mx-auto max-w-[800px] px-4 py-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
        <Card className="relative mx-auto w-full max-h-[70vh] overflow-y-auto rounded-2xl backdrop-blur-xl bg-gradient-to-br from-black/40 via-gray-900/30 to-black/50 border border-cyan-500/20 shadow-[0_0_60px_rgba(6,182,212,0.3)] hover:shadow-[0_0_80px_rgba(6,182,212,0.4)] transition-all duration-500">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl" />

          <CardHeader className="text-center pb-4 relative">
            <Badge className="mx-auto mb-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/30 px-4 py-2 text-sm font-medium rounded-full backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-2 duration-700 delay-300">
              Welcome, TEAM {state.teamName}
            </Badge>

            <CardTitle className="text-4xl font-bold font-serif tracking-wide bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 animate-in fade-in-0 slide-in-from-top-4 duration-700 delay-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              {gameName}
            </CardTitle>

            <CardDescription className="text-lg font-medium text-cyan-200/90 mb-4 animate-in fade-in-0 slide-in-from-top-6 duration-700 delay-700">
              {tagline}
            </CardDescription>

            <div className="mx-auto text-center space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-900">
              <p className="text-base text-gray-200 leading-relaxed">
                Embark on an epic journey through 10 mysterious chambers, each containing 5 enigmatic doors.
              </p>
              <p className="text-sm text-gray-300">
                Choose wisely - some doors reward the clever, while others punish the careless.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pb-6">
            <div className="text-center animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-1300">
              <Button
                onClick={handleStartGame}
                className="h-12 px-8 text-base font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white rounded-lg shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" className="mr-2 relative z-10">
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </svg>
                <span className="relative z-10">Begin Your Quest</span>
              </Button>
            </div>

            <div className="rounded-lg border border-cyan-400/20 bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-1500">
              <h3 className="text-center font-bold text-cyan-300 mb-3 text-base">Quest Rules</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-gray-200">
                      Correct answers: <strong className="text-green-400">+5 points</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                    <span className="text-gray-200">
                      Wrong trap doors: <strong className="text-red-400">-5 points</strong>
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    <span className="text-gray-200">Complete chambers to unlock the next</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                    <span className="text-gray-200">Choose wisely - some doors are traps!</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
