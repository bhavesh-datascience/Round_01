"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useGame } from "./game-context"
import { NeonQuestion } from "./neon-question"

const DOOR_OPEN_MS = 400
const RAYS_HOLD_MS = 500

type DoorProps = {
  room: number
  indexInRoom: number
  doorGlobalIndex: number
  colorHex?: string
}

export default function Door({ room, indexInRoom, doorGlobalIndex, colorHex }: DoorProps) {
  const { questions, isDoorAnswered, answerDoor } = useGame()
  const q = questions[doorGlobalIndex]
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [opening, setOpening] = useState(false)
  const [showRays, setShowRays] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const answered = isDoorAnswered(doorGlobalIndex)

  const [result, setResult] = useState<null | "correct" | "wrong">(null)

  const particles = useMemo(() => {
    const N = 25
    return Array.from({ length: N }, () => {
      const dist = 80 + Math.random() * 120
      const angle = (Math.random() * Math.PI) / 2.5 - Math.PI / 5
      const tx = Math.cos(angle) * dist
      const ty = Math.sin(angle) * dist * 0.7
      const size = 4 + Math.random() * 8
      const dur = 700 + Math.random() * 700
      const delay = Math.random() * 150
      const rot = (Math.random() - 0.5) * 180
      const colorVar = Math.random() > 0.5 ? "var(--color-primary)" : "var(--color-secondary)"
      return { tx, ty, size, dur, delay, rot, colorVar }
    })
  }, [burstKey])

  const doorColors = [
    "#1e293b", // Dark slate for door 1
    "#0f172a", // Darker slate for door 2
    "#334155", // Medium slate for door 3
    "#475569", // Light slate for door 4
    "#1e293b", // Dark slate for door 5
  ]
  const initialColor = doorColors[indexInRoom] || "#1e293b"

  const handleSubmit = () => {
    if (selected == null) return
    const correctIdx =
      (q as any)?.answerIndex ??
      (q as any)?.correctIndex ??
      (typeof (q as any)?.answer === "number" ? (q as any).answer : undefined)

    const isCorrect = typeof correctIdx === "number" ? selected === correctIdx : undefined
    if (isCorrect === true) setResult("correct")
    else if (isCorrect === false) setResult("wrong")

    answerDoor({ room, door: indexInRoom + 1, doorGlobalIndex, selectedIndex: selected })
    setOpen(false)
  }

  const handleOpenDoor = () => {
    console.log("[v0] Door click - q:", !!q, "answered:", answered, "opening:", opening)
    if (!q || answered || opening) {
      console.log("[v0] Door opening blocked - missing question or already answered/opening")
      return
    }

    console.log("[v0] Starting enhanced door opening animation")
    setOpening(true)
    setShowRays(true)
    setShowParticles(true)
    setBurstKey((k) => k + 1)

    setTimeout(() => {
      console.log("[v0] Opening dialog")
      setOpen(true)
    }, 200)

    setTimeout(() => {
      setOpening(false)
    }, DOOR_OPEN_MS)

    setTimeout(() => {
      setShowRays(false)
    }, DOOR_OPEN_MS + RAYS_HOLD_MS)

    setTimeout(() => setShowParticles(false), DOOR_OPEN_MS + RAYS_HOLD_MS + 1000)
  }

  const onDialogChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setSelected(null)
    }
  }

  return (
    <div
      className="relative mx-3 my-2" // Increased margins to prevent overlapping
      style={
        {
          ["--color-primary" as any]: result ? (result === "correct" ? "#00ff88" : "#ff0066") : "#00d4ff",
          ["--color-secondary" as any]: result ? (result === "correct" ? "#00cc66" : "#cc0044") : "#0099cc",
        } as React.CSSProperties
      }
      data-result={result ?? undefined}
    >
      <Dialog open={open} onOpenChange={onDialogChange}>
        <button
          disabled={!q}
          onClick={handleOpenDoor}
          className={[
            "group relative rounded-lg overflow-visible ff-glass-dark backdrop-blur ff-door-hoverable",
            "transition-all duration-500 ease-out will-change-transform hover:scale-105", // Increased duration for smoother animation
            "hover:shadow-[0_0_40px_rgba(0,212,255,0.6)] hover:ring-2 hover:ring-cyan-400/50",
            answered
              ? "opacity-70 cursor-not-allowed"
              : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--color-primary)_70%,white_30%)]",
          ].join(" ")}
          aria-label={`Door ${indexInRoom + 1}${answered ? " (answered)" : ""}`}
          aria-disabled={answered ? "true" : undefined}
          style={{ perspective: "1400px", border: "none" }}
        >
          <div className="relative h-40 w-24 sm:h-44 sm:w-28" aria-hidden>
            {" "}
            {/* Further reduced door size to prevent overlapping */} {/* Reduced door size to prevent overlapping */}
            <div className={["ff-door-bg", open || opening ? "ff-door-bg-open" : ""].join(" ")} />
            <div
              className="ff-rays"
              style={{
                opacity: showRays || opening ? 1 : 0,
                animation: showRays || opening ? "ff-rays-burst 800ms ease-out both" : "none",
                background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)`,
              }}
            />
            <div
              className="ff-floor-glow"
              style={{
                animation: showRays || opening ? "ff-floor-pulse 700ms ease-out both" : "none",
              }}
            />
            {(showParticles || opening) && (
              <div key={burstKey} className="ff-particles">
                {particles.map((p, i) => (
                  <span
                    key={i}
                    className="ff-particle"
                    style={
                      {
                        "--tx": `${Math.round(p.tx)}px`,
                        "--ty": `${Math.round(p.ty)}px`,
                        "--size": `${p.size}px`,
                        "--dur": `${Math.round(p.dur)}ms`,
                        "--delay": `${Math.round(p.delay)}ms`,
                        "--rot": `${Math.round(p.rot)}deg`,
                        "--part-color": p.colorVar,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}
            {/* Left door half */}
            <div
              className={[
                "absolute inset-0 origin-right rounded-l-lg ff-glass shadow-2xl ff-door-leaf",
                "transition-all ease-in-out will-change-transform", // Changed to ease-in-out for smoother animation
                answered
                  ? "ff-door-answered"
                  : "group-hover:brightness-110 group-hover:shadow-[0_0_30px_var(--color-primary)]",
              ].join(" ")}
              style={{
                width: "50%",
                transform: open || opening ? "translateX(-100%)" : "translateX(0%)",
                transformStyle: "preserve-3d",
                transitionDuration: `${DOOR_OPEN_MS * 1.2}ms`, // Increased duration for smoother slide
                border: "none",
                background: "transparent",
                clipPath: "inset(0 0 0 0)",
              }}
            >
              <svg viewBox="0 0 100 320" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id={`doorFrameLeft-${doorGlobalIndex}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2a4a5a" />
                    <stop offset="30%" stopColor="#1a3a4a" />
                    <stop offset="70%" stopColor="#0a2a3a" />
                    <stop offset="100%" stopColor="#001a2a" />
                  </linearGradient>

                  <linearGradient id={`leftPanelGrad-${doorGlobalIndex}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1a4a5a" />
                    <stop offset="50%" stopColor="#0a3a4a" />
                    <stop offset="100%" stopColor="#002a3a" />
                  </linearGradient>

                  <pattern
                    id={`circuitPatternLeft-${doorGlobalIndex}`}
                    x="0"
                    y="0"
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="8" height="8" fill="transparent" />
                    <path d="M0,4 L8,4 M4,0 L4,8" stroke="#00ffff" strokeWidth="0.3" opacity="0.4" />
                    <circle cx="4" cy="4" r="0.5" fill="#00ffff" opacity="0.6" />
                  </pattern>
                </defs>

                <path
                  d="M5,10 L95,10 L95,50 L85,60 L85,260 L95,270 L95,310 L5,310 L5,270 L15,260 L15,60 L5,50 Z"
                  fill={`url(#doorFrameLeft-${doorGlobalIndex})`}
                  stroke="#00ffff"
                  strokeWidth="2"
                />

                <rect
                  x="2"
                  y="60"
                  width="6"
                  height="200"
                  rx="3"
                  fill={result === "correct" ? "#00ff88" : result === "wrong" ? "#ff0066" : "#ff8800"}
                  opacity="0.9"
                >
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                </rect>

                <rect
                  x="20"
                  y="25"
                  width="65"
                  height="270"
                  rx="4"
                  fill={`url(#leftPanelGrad-${doorGlobalIndex})`}
                  stroke="#00ffff"
                  strokeWidth="1"
                />

                <rect x="25" y="35" width="25" height="15" rx="2" fill="#001122" stroke="#00ffff" strokeWidth="0.5" />
                <rect x="27" y="37" width="21" height="11" fill="#003344" />
                <rect x="28" y="38" width="19" height="2" fill="#00ffff" opacity="0.8" />
                <rect x="28" y="41" width="15" height="2" fill="#00ffff" opacity="0.6" />
                <rect x="28" y="44" width="12" height="2" fill="#00ffff" opacity="0.4" />

                <rect x="55" y="35" width="25" height="15" rx="2" fill="#001122" stroke="#00ffff" strokeWidth="0.5" />
                <rect x="57" y="37" width="21" height="11" fill="#003344" />
                <rect x="58" y="38" width="19" height="2" fill="#00ffff" opacity="0.8" />
                <rect x="58" y="41" width="15" height="2" fill="#00ffff" opacity="0.6" />

                <circle cx="30" cy="65" r="3" fill="#001122" stroke="#00ffff" strokeWidth="0.5" />
                <circle cx="40" cy="65" r="3" fill="#001122" stroke="#00ffff" strokeWidth="0.5" />
                <circle cx="50" cy="65" r="3" fill="#001122" stroke="#00ffff" strokeWidth="0.5" />
                <circle cx="60" cy="65" r="3" fill="#001122" stroke="#00ffff" strokeWidth="0.5" />

                <rect x="25" y="80" width="55" height="35" rx="3" fill="#001122" stroke="#00ffff" strokeWidth="1" />
                <rect x="27" y="82" width="51" height="31" fill="#003344" />
                <rect x="29" y="84" width="47" height="2" fill="#00ffff" opacity="0.8" />
                <rect x="29" y="89" width="35" height="2" fill="#00ffff" opacity="0.6" />
                <rect x="29" y="94" width="42" height="2" fill="#00ffff" opacity="0.7" />
                <rect x="29" y="99" width="28" height="2" fill="#00ffff" opacity="0.5" />
                <rect x="29" y="104" width="38" height="2" fill="#00ffff" opacity="0.6" />

                <rect x="25" y="125" width="55" height="20" rx="2" fill="#001122" stroke="#00ffff" strokeWidth="0.5" />
                <rect x="27" y="127" width="51" height="16" fill={`url(#circuitPatternLeft-${doorGlobalIndex})`} />

                <path
                  d="M20,25 L30,25 L30,35"
                  stroke={"#ff8800"}
                  strokeWidth="3"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M20,295 L30,295 L30,285"
                  stroke={"#ff8800"}
                  strokeWidth="3"
                  fill="none"
                  opacity="0.8"
                />
              </svg>
            </div>
            {/* Right door half */}
            <div
              className={[
                "absolute inset-0 origin-left rounded-r-lg ff-glass shadow-2xl ff-door-leaf",
                "transition-all ease-in-out will-change-transform", // Changed to ease-in-out for smoother animation
                answered
                  ? "ff-door-answered"
                  : "group-hover:brightness-110 group-hover:shadow-[0_0_30px_var(--color-primary)]",
              ].join(" ")}
              style={{
                width: "50%",
                left: "50%",
                transform: open || opening ? "translateX(100%)" : "translateX(0%)",
                transformStyle: "preserve-3d",
                transitionDuration: `${DOOR_OPEN_MS * 1.2}ms`, // Increased duration for smoother slide
                border: "none",
                background: "transparent",
                clipPath: "inset(0 0 0 0)",
              }}
            >
              <svg viewBox="0 0 100 320" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id={`doorFrameRight-${doorGlobalIndex}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2a4a5a" />
                    <stop offset="30%" stopColor="#1a3a4a" />
                    <stop offset="70%" stopColor="#0a2a3a" />
                    <stop offset="100%" stopColor="#001a2a" />
                  </linearGradient>

                  <linearGradient id={`rightPanelGrad-${doorGlobalIndex}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1a4a5a" />
                    <stop offset="50%" stopColor="#0a3a4a" />
                    <stop offset="100%" stopColor="#002a3a" />
                  </linearGradient>

                  <radialGradient id={`portalGlowRight-${doorGlobalIndex}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#00cccc" stopOpacity="0.6" />
                    <stop offset="70%" stopColor="#009999" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#006666" stopOpacity="0.2" />
                  </radialGradient>
                </defs>

                <path
                  d="M5,10 L95,10 L95,50 L85,60 L85,260 L95,270 L95,310 L5,310 L5,270 L15,260 L15,60 L5,50 Z"
                  fill={`url(#doorFrameRight-${doorGlobalIndex})`}
                  stroke="#00ffff"
                  strokeWidth="2"
                />

                <rect
                  x="92"
                  y="60"
                  width="6"
                  height="200"
                  rx="3"
                  fill={result === "correct" ? "#00ff88" : result === "wrong" ? "#ff0066" : "#ff8800"}
                  opacity="0.9"
                >
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                </rect>

                <rect
                  x="15"
                  y="25"
                  width="70"
                  height="270"
                  rx="4"
                  fill={`url(#rightPanelGrad-${doorGlobalIndex})`}
                  stroke="#00ffff"
                  strokeWidth="1"
                />

                <path
                  d="M25,80 L55,80 L65,90 L65,120 L55,130 L25,130 L15,120 L15,90 Z"
                  fill={`url(#portalGlowRight-${doorGlobalIndex})`}
                  stroke="#00ffff"
                  strokeWidth="2"
                />

                <path
                  d="M25,95 L55,95 M40,80 L40,130 M30,85 L50,85 M30,125 L50,125"
                  stroke="#00ffff"
                  strokeWidth="1"
                  opacity="0.8"
                />
                <circle cx="40" cy="105" r="8" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
                <circle cx="40" cy="105" r="4" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.8" />
                <circle cx="40" cy="105" r="2" fill="#00ffff" opacity="0.9">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
                </circle>

                <rect x="20" y="140" width="60" height="8" rx="1" fill="#001122" stroke="#00ffff" strokeWidth="0.5" />
                <rect x="22" y="142" width="56" height="4" fill="#003344" />
                <rect x="23" y="143" width="20" height="2" fill="#00ffff" opacity="0.7" />
                <rect x="50" y="143" width="15" height="2" fill="#00ffff" opacity="0.5" />
                <rect x="70" y="143" width="6" height="2" fill="#00ffff" opacity="0.8" />

                <circle
                  cx="25"
                  cy="160"
                  r="2"
                  fill={"#00ffff"}
                  opacity="0.9"
                />
                <circle
                  cx="35"
                  cy="160"
                  r="2"
                  fill={"#00ffff"}
                  opacity="0.7"
                />
                <circle
                  cx="45"
                  cy="160"
                  r="2"
                  fill={"#00ffff"}
                  opacity="0.8"
                />
                <circle
                  cx="55"
                  cy="160"
                  r="2"
                  fill={"#00ffff"}
                  opacity="0.6"
                />
                <circle
                  cx="65"
                  cy="160"
                  r="2"
                  fill={"#00ffff"}
                  opacity="0.9"
                />

                <path
                  d="M75,25 L65,25 L65,35"
                  stroke={"#ff8800"}
                  strokeWidth="3"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M75,295 L65,295 L65,285"
                  stroke={"#ff8800"}
                  strokeWidth="3"
                  fill="none"
                  opacity="0.8"
                />
              </svg>
            </div>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-center">
              <span
                className={[
                  "inline-block rounded px-2 py-0.5 text-xs font-medium shadow transition-colors border",
                  result === "correct"
                    ? "bg-green-500/20 text-green-400 border-green-400/50"
                    : result === "wrong"
                      ? "bg-red-500/20 text-red-400 border-red-400/50"
                      : answered
                        ? "bg-slate-500/20 text-slate-400 border-slate-400/50"
                        : "bg-cyan-500/20 text-cyan-400 border-cyan-400/50",
                ].join(" ")}
              >
                Door {indexInRoom + 1}
              </span>
            </div>
            {answered && (
              <div
                className={[
                  "absolute top-2 right-2 rounded-full text-xs font-semibold px-2 py-0.5 shadow transition-colors border",
                  result === "correct"
                    ? "bg-green-500/20 text-green-400 border-green-400/50"
                    : result === "wrong"
                      ? "bg-red-500/20 text-red-400 border-red-400/50"
                      : "bg-slate-500/20 text-slate-400 border-slate-400/50",
                ].join(" ")}
              >
                Done
              </div>
            )}
          </div>
        </button>

        {!!q && (
          <DialogContent className="sm:max-w-2xl ff-glass-dark border border-cyan-500/45 shadow-[0_0_30px_rgba(0,212,255,0.35)] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <NeonQuestion
              question={q.prompt}
              options={q.options}
              selectedIndex={selected}
              onSelect={(i) => setSelected(i)}
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} className="ff-btn-primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={selected == null} className="ff-btn-primary">
                Submit Answer
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
