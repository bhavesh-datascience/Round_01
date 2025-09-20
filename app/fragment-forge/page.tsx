"use client"

import { useRouter } from "next/navigation"
import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"

export default function FragmentForgePage() {
  const router = useRouter()
  const { state, finishGame } = useGame()

  useEffect(() => {
    // Redirect if game not completed
    if (!state.endTime || state.answers.length < 50) {
      router.push("/game/1")
      return
    }

    // Finish game and calculate fragment if not already done
    if (!state.hasFragment && !state.fragmentEarned) {
      finishGame()
    }
  }, [state, finishGame, router])

  if (!state.endTime) {
    return null
  }

  const startTime = new Date(state.startTime || Date.now())
  const endTime = new Date(state.endTime)
  const totalMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
  const correctAnswers = state.answers.filter((a) => a.correct).length
  const finalScore = state.score

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
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/50 to-blue-900/70" />
      </div>

      <section className="relative z-10 mx-auto max-w-4xl px-4 py-12">
        <Card className="relative mx-auto w-full rounded-3xl backdrop-blur-xl bg-gradient-to-br from-black/50 via-gray-900/40 to-black/60 border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.4)]">
          <CardHeader className="text-center pb-8">
            <Badge className="mx-auto mb-6 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border-purple-400/40 px-6 py-3 text-sm font-medium rounded-full backdrop-blur-sm">
              Quest Complete - {state.teamName}
            </Badge>

            <CardTitle className="text-6xl font-bold font-serif tracking-wide bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              Fragment Forge
            </CardTitle>

            <CardDescription className="text-xl font-medium text-purple-200/90 mb-6">
              Analyzing your performance to determine if you've earned a fragment...
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 pb-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-300 mb-2">{totalMinutes}</div>
                <div className="text-sm text-gray-300">Minutes</div>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 backdrop-blur-sm">
                <div className="text-3xl font-bold text-green-300 mb-2">{correctAnswers}/50</div>
                <div className="text-sm text-gray-300">Correct Answers</div>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-300 mb-2">{finalScore}</div>
                <div className="text-sm text-gray-300">Final Score</div>
              </div>
            </div>

            <div className="text-center">
              {state.fragmentEarned ? (
                <div className="space-y-4">
                  <div className="text-6xl animate-pulse">✨</div>
                  <h2 className="text-3xl font-bold text-green-400 mb-4">Fragment Earned!</h2>
                  <p className="text-lg text-gray-200">
                    Congratulations! Your performance has earned you a crucial fragment for the ultimate code.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl opacity-50">💔</div>
                  <h2 className="text-3xl font-bold text-red-400 mb-4">No Fragment</h2>
                  <p className="text-lg text-gray-200">
                    Your performance didn't meet the requirements for a fragment this time. Try again to improve your
                    score and timing!
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-sm p-6">
              <h3 className="text-center font-bold text-cyan-300 mb-4 text-lg">Fragment Requirements</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="text-gray-200">
                    <strong className="text-green-400">High Score:</strong> 40+ correct answers (200-250 points)
                  </div>
                  <div className="text-gray-200">
                    <strong className="text-yellow-400">Low Score:</strong> Less than 40 correct (150-200 points)
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-200">
                    <strong className="text-blue-400">10-15 min + High Score:</strong> Fragment ✨
                  </div>
                  <div className="text-gray-200">
                    <strong className="text-purple-400">20-25 min + High Score:</strong> Fragment ✨
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => router.push("/")}
                className="h-12 px-8 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-300"
              >
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
