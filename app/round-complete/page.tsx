"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import TechBg from "@/components/tech-bg"

export default function RoundCompletePage() {
  const { state } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (!state.teamName || !state.startTime) {
      router.replace("/login")
    }
  }, [router, state.teamName, state.startTime])

  const handleNewGame = () => {
    router.replace("/")
  }

  return (
    <main className="min-h-screen ff-room-ambient text-foreground relative overflow-hidden">
      <TechBg opacity={0.15} />

      {/* Enhanced video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none -z-20"
        style={{ filter: 'brightness(0.85) contrast(1.1) saturate(1)' }}
      >
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/700_F_1642857695_IGqHn4CofTWj0wlvpNMn1F9fOjAx3zbM_ST-0h3vtYmDYVpsiOFN49ZDpi1UHsrEYT.mp4"
          type="video/mp4"
        />
      </video>

      {/* Modern techy gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/05 via-white/02 to-white/05 backdrop-blur-[0.5px] -z-15" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/05 via-transparent to-white/05 backdrop-blur-[0.5px] -z-15" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/05 to-transparent backdrop-blur-[0.5px] -z-15" />

      {/* Advanced Techy Game HUD */}
      <div className="absolute inset-0 pointer-events-none -z-15">
        {/* Animated scanning lines */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
        <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent animate-pulse opacity-60" style={{ animationDelay: '2s' }} />
        <div className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse opacity-60" style={{ animationDelay: '3s' }} />

        {/* Corner terminals */}
        <div className="absolute top-6 left-6 w-16 h-16">
          <div className="w-full h-full border-l-2 border-t-2 border-cyan-400/80 rounded-tl-lg relative">
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-cyan-400/60 rounded-full animate-ping" />
            <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse" />
            <div className="absolute top-6 left-2 text-xs font-mono text-cyan-400/60">SYS</div>
          </div>
        </div>
        <div className="absolute top-6 right-6 w-16 h-16">
          <div className="w-full h-full border-r-2 border-t-2 border-purple-400/80 rounded-tr-lg relative">
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400/60 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400/40 rounded-full animate-pulse" />
            <div className="absolute top-6 right-2 text-xs font-mono text-purple-400/60">CPU</div>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 w-16 h-16">
          <div className="w-full h-full border-l-2 border-b-2 border-pink-400/80 rounded-bl-lg relative">
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400/60 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-pink-400/40 rounded-full animate-pulse" />
            <div className="absolute bottom-6 left-2 text-xs font-mono text-pink-400/60">MEM</div>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 w-16 h-16">
          <div className="w-full h-full border-r-2 border-b-2 border-blue-400/80 rounded-br-lg relative">
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400/60 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse" />
            <div className="absolute bottom-6 right-2 text-xs font-mono text-blue-400/60">NET</div>
          </div>
        </div>

        {/* Success message */}
        <div className="absolute top-20 left-8 w-48 h-6 overflow-hidden">
          <div className="text-xs font-mono text-green-400/60 animate-pulse whitespace-nowrap">
            {">>> ROUND ONE COMPLETED SUCCESSFULLY"}
          </div>
        </div>
        <div className="absolute top-32 right-8 w-40 h-6 overflow-hidden">
          <div className="text-xs font-mono text-cyan-400/60 animate-pulse whitespace-nowrap" style={{ animationDelay: '1s' }}>
            {">>> ALL CHALLENGES CONQUERED"}
          </div>
        </div>
        <div className="absolute bottom-32 left-8 w-44 h-6 overflow-hidden">
          <div className="text-xs font-mono text-purple-400/60 animate-pulse whitespace-nowrap" style={{ animationDelay: '2s' }}>
            {">>> ACCESSING RESULTS DATABASE..."}
          </div>
        </div>
        <div className="absolute bottom-20 right-8 w-36 h-6 overflow-hidden">
          <div className="text-xs font-mono text-pink-400/60 animate-pulse whitespace-nowrap" style={{ animationDelay: '3s' }}>
            {">>> MISSION ACCOMPLISHED"}
          </div>
        </div>

        {/* Matrix-style grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400/40 rotate-45 animate-bounce shadow-lg shadow-cyan-400/20" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-purple-400/30 rounded-full animate-pulse shadow-lg shadow-purple-400/20" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-pink-400/50 rotate-12 animate-ping shadow-lg shadow-pink-400/20" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400/35 rounded-lg animate-bounce shadow-lg shadow-blue-400/20" style={{ animationDelay: '3.5s' }} />

        {/* Success rings */}
        <div className="absolute top-1/3 left-1/3 w-20 h-20 border border-green-400/30 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border border-cyan-400/30 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '4s' }} />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              boxShadow: '0 0 6px rgba(6, 182, 212, 0.6)',
            }}
          />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
            }}
          />
        ))}
      </div>

      <Header />
      <section className="mx-auto max-w-4xl px-4 py-12 relative z-10 min-h-[calc(100vh-200px)] flex items-center">
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-green-400/30 animate-pulse">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  fill="currentColor"
                />
              </svg>
            </div>
            {/* Animated rings around success icon */}
            <div className="absolute inset-0 w-24 h-24 border-2 border-green-400/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-0 w-32 h-32 border border-cyan-400/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          </div>

          <Card className="w-full bg-card/40 backdrop-blur-md border-white/10 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                ROUND ONE COMPLETED
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Congratulations, {state.teamName}! You have successfully conquered all challenges.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
          {/* Removed detailed game results display as per user request */}
          <div className="space-y-4 text-center text-muted-foreground">
            <p>Your game results have been securely stored.</p>
            <p>Thank you for playing Fragment Forge!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button
                variant="outline"
                onClick={handleNewGame}
                className="border-white/20 bg-transparent hover:bg-white/10 text-white px-8 py-3 rounded-lg transition-all duration-300"
              >
                Start New Game
              </Button>
            </div>
          </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
