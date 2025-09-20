"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Door from "@/components/door"
import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import TechBg from "@/components/tech-bg"
import GameOverModal from "@/components/game-over-modal"

const DOOR_COLORS = ["#00e5ff", "#39ff14", "#ff4dff", "#ff2b2b", "#ffa600"] as const

export default function RoomPage() {
  const params = useParams<{ room: string }>()
  const roomNum = Math.max(1, Math.min(10, Number(params.room || 1)))
  const { state, questions, finishGame, maxRoomUnlocked } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (!state.teamName || !state.startTime) {
      router.replace("/login")
    }
  }, [router, state.teamName, state.startTime])

  useEffect(() => {
    if (maxRoomUnlocked > 0 && roomNum > maxRoomUnlocked) {
      router.replace(`/game/${maxRoomUnlocked}`)
    }
  }, [maxRoomUnlocked, roomNum, router])

  const startIndex = (roomNum - 1) * 5
  const answeredCountInRoom = state.answeredDoorIds.filter((id) => id >= startIndex && id < startIndex + 5).length
  const allAnsweredInRoom = answeredCountInRoom === 5
  const allAnsweredOverall = state.answeredDoorIds.length === 50

  // Function to check if a room is completed
  const isRoomCompleted = (roomNumber: number) => {
    const roomStartIndex = (roomNumber - 1) * 5
    const roomDoors = state.answeredDoorIds.filter((id) => id >= roomStartIndex && id < roomStartIndex + 5)
    return roomDoors.length === 5
  }

  useEffect(() => {
    if (allAnsweredOverall) {
      finishGame('completed')
    }
  }, [allAnsweredOverall, finishGame])

  return (
    <main className="min-h-screen ff-room-ambient text-foreground relative overflow-hidden">
      {/* Removed or adjusted glassmorphism layer in TechBg to reduce blue tint */}
      <TechBg opacity={0.15} />

      {/* Enhanced video background with reduced blue tint */}
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

      {/* Modern techy gradient overlays - white transparent glassmorphism with reduced opacity and no backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/05 via-white/02 to-white/05 -z-15" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/05 via-transparent to-white/05 -z-15" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/05 to-transparent -z-15" />

      {/* Advanced Techy Game HUD */}
      <div className="absolute inset-0 pointer-events-none -z-15">
        {/* Animated scanning lines */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
        <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent animate-pulse opacity-60" style={{ animationDelay: '2s' }} />
        <div className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse opacity-60" style={{ animationDelay: '3s' }} />

        {/* Advanced corner terminals */}
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

        {/* Data streams */}
        <div className="absolute top-20 left-8 w-32 h-6 overflow-hidden">
          <div className="text-xs font-mono text-green-400/60 animate-pulse whitespace-nowrap">
            {">>> INITIALIZING NEURAL LINK..."}
          </div>
        </div>
        <div className="absolute top-32 right-8 w-40 h-6 overflow-hidden">
          <div className="text-xs font-mono text-cyan-400/60 animate-pulse whitespace-nowrap" style={{ animationDelay: '1s' }}>
            {">>> SCANNING ROOM {roomNum}..."}
          </div>
        </div>
        <div className="absolute bottom-32 left-8 w-36 h-6 overflow-hidden">
          <div className="text-xs font-mono text-purple-400/60 animate-pulse whitespace-nowrap" style={{ animationDelay: '2s' }}>
            {">>> LOADING CHALLENGES..."}
          </div>
        </div>
        <div className="absolute bottom-20 right-8 w-32 h-6 overflow-hidden">
          <div className="text-xs font-mono text-pink-400/60 animate-pulse whitespace-nowrap" style={{ animationDelay: '3s' }}>
            {">>> ACCESS GRANTED"}
          </div>
        </div>

        {/* Progress indicators */}
        <div className="absolute top-1/2 left-4 w-2 h-32 bg-gradient-to-t from-cyan-400/20 to-cyan-400/60 rounded-full">
          <div className="w-full bg-cyan-400/80 rounded-full animate-pulse" style={{ height: `${(answeredCountInRoom / 5) * 100}%` }} />
        </div>
        <div className="absolute top-1/2 right-4 w-2 h-32 bg-gradient-to-t from-purple-400/20 to-purple-400/60 rounded-full">
          <div className="w-full bg-purple-400/80 rounded-full animate-pulse" style={{ height: `${(state.answeredDoorIds.length / 50) * 100}%` }} />
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

        {/* Floating geometric shapes with enhanced effects */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400/40 rotate-45 animate-bounce shadow-lg shadow-cyan-400/20" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-purple-400/30 rounded-full animate-pulse shadow-lg shadow-purple-400/20" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-pink-400/50 rotate-12 animate-ping shadow-lg shadow-pink-400/20" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400/35 rounded-lg animate-bounce shadow-lg shadow-blue-400/20" style={{ animationDelay: '3.5s' }} />

        {/* Holographic rings */}
        <div className="absolute top-1/3 left-1/3 w-20 h-20 border border-cyan-400/30 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border border-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '4s' }} />
      </div>

      {/* Animated particles for extra techy feel */}
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

      <GameOverModal />
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8 relative z-10">
        <div className="grid gap-6 md:grid-cols-[160px_1fr]">
          <aside aria-label="Rooms" className="rounded-xl bg-card/40 p-3 backdrop-blur-sm ring-1 ring-white/10">
            <nav className="flex flex-col gap-2">
              {Array.from({ length: 10 }).map((_, i) => {
                const n = i + 1
                const isActive = n === roomNum
                const isUnlocked = n <= Math.max(1, maxRoomUnlocked)
                const isCompleted = isRoomCompleted(n)

                // Determine button styling based on room status
                let buttonClass = "w-full justify-start rounded-lg border-white/10 transition relative "
                let iconClass = "mr-2 inline-flex h-5 w-5 items-center justify-center rounded-sm "

                if (isCompleted) {
                  // Completed rooms - green background
                  buttonClass += "bg-green-500/20 hover:bg-green-500/30 border-green-400/30 text-green-300"
                  iconClass += "bg-green-500/20 ring-1 ring-green-400/50"
                } else if (isActive) {
                  // Current room - cyan/blue ring
                  buttonClass += "bg-black/20 hover:bg-black/30 ring-2 ring-[color-mix(in_oklab,var(--primary)_70%,white_30%)]"
                  iconClass += "bg-primary/15 ring-1 ring-primary/35"
                } else if (isUnlocked) {
                  // Unlocked but not completed - default styling
                  buttonClass += "bg-black/20 hover:bg-black/30"
                  iconClass += "bg-primary/15 ring-1 ring-primary/35"
                } else {
                  // Locked rooms - grayed out
                  buttonClass += "bg-gray-500/10 hover:bg-gray-500/10 opacity-50"
                  iconClass += "bg-gray-500/20 ring-1 ring-gray-500/30"
                }

                return (
                  <Link key={n} href={isUnlocked ? `/game/${n}` : "#"} aria-disabled={!isUnlocked}>
                    <Button
                      variant="outline"
                      className={buttonClass}
                      disabled={!isUnlocked}
                      tabIndex={isUnlocked ? 0 : -1}
                    >
                      <span className={iconClass}>
                        {isCompleted ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                              fill="currentColor"
                              className="text-green-400"
                            />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M12 3l2.5 2.5-2.5 2.5L9.5 5.5 12 3Zm0 7l4 4-4 4-4-4 4-4Z"
                              fill="currentColor"
                              className={isCompleted ? "text-green-400" : "text-primary"}
                            />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1 text-left">R{n}</span>
                      {isCompleted && (
                        <span className="ml-2 text-xs text-green-400 font-semibold">✓</span>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </aside>

          <div className="rounded-xl bg-card/30 p-6 backdrop-blur-md ring-1 ring-white/10 shadow-lg">
            <div className="mb-4">
              <h2 className="font-serif text-2xl font-semibold">Room {roomNum}</h2>
              <p className="text-muted-foreground">Choose a door to reveal its challenge.</p>
            </div>

            {/* Doors grid */}
            <div className="mt-6 grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-5 md:gap-3 lg:gap-4">
              {Array.from({ length: 5 }).map((_, i) => {
                const doorGlobalIndex = startIndex + i
                const colorHex = DOOR_COLORS[i % DOOR_COLORS.length]
                return (
                  <div
                    key={i}
                    className="flex justify-center items-center"
                    style={{ ["--color-primary" as any]: colorHex }}
                  >
                    <Door room={roomNum} indexInRoom={i} doorGlobalIndex={doorGlobalIndex} colorHex={colorHex} />
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex items-center gap-2">
              <Link href={roomNum > 1 ? `/game/${roomNum - 1}` : "#"}>
                <Button variant="outline" disabled={roomNum === 1} className="ff-nav-btn bg-transparent">
                  Previous Room
                </Button>
              </Link>
              <Link href={roomNum < 10 && (roomNum < maxRoomUnlocked || allAnsweredInRoom) ? `/game/${roomNum + 1}` : "#"}>
                <Button
                  variant="outline"
                  disabled={!(roomNum < 10 && (roomNum < maxRoomUnlocked || allAnsweredInRoom))}
                  className={`ff-nav-btn bg-transparent ${allAnsweredInRoom && roomNum >= maxRoomUnlocked ? 'bg-green-500/20 hover:bg-green-500/30 border-green-400/30 text-green-300' : ''}`}
                >
                  Next Room
                  {allAnsweredInRoom && roomNum >= maxRoomUnlocked && (
                    <span className="ml-2 text-xs text-green-400">✓</span>
                  )}
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              Answered in this room: {answeredCountInRoom} / 5 • Total answered: {state.answeredDoorIds.length} /{" "}
              {questions.length || 50}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
