"use client"

import { useEffect, useMemo, useRef } from "react"

type NeonDoorProps = {
  isOpen?: boolean
  label?: string
  onOpenStart?: () => void
  onOpenComplete?: () => void
  disabled?: boolean
}

export function NeonDoor({
  isOpen = false,
  label = "Door",
  onOpenStart,
  onOpenComplete,
  disabled = false,
}: NeonDoorProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const openingRef = useRef(false)

  // Announce open complete after CSS transition ends
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const handle = (e: TransitionEvent) => {
      if (e.propertyName !== "transform") return
      if (isOpen && openingRef.current) {
        openingRef.current = false
        onOpenComplete?.()
      }
    }
    el.addEventListener("transitionend", handle as any)
    return () => el.removeEventListener("transitionend", handle as any)
  }, [isOpen, onOpenComplete])

  const handleClick = () => {
    if (disabled) return
    openingRef.current = true
    onOpenStart?.()
  }

  const doorSvg = useMemo(
    () => (
      <svg viewBox="0 0 180 280" className="w-full h-full">
        {/* Door frame */}
        <rect x="6" y="6" width="168" height="268" fill="none" className="ff-neon-stroke" rx="8" />
        {/* Door panel outline */}
        <rect x="22" y="22" width="136" height="244" fill="none" className="ff-neon-stroke" rx="6" />
        {/* Inner panels */}
        <rect x="40" y="36" width="100" height="88" fill="none" className="ff-panel-stroke" rx="4" />
        <rect x="40" y="156" width="100" height="88" fill="none" className="ff-panel-stroke" rx="4" />
        {/* Knob */}
        <circle cx="54" cy="140" r="4" fill="var(--ff-cyan)">
          <animate attributeName="r" values="3.5;4.5;3.5" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    [],
  )

  return (
    <div className="ff-door-wrap select-none">
      <div
        ref={stageRef}
        className="ff-door-stage"
        data-open={isOpen ? "true" : "false"}
        aria-hidden={disabled ? "true" : "false"}
      >
        {/* Light rays and floor glow appear only when opened */}
        <div className="ff-door-rays" />
        <div className="ff-floor-glow" />

        {/* Hinge-rotating vector door */}
        <div
          className="ff-door-hinge"
          role="button"
          aria-pressed={isOpen}
          aria-label={label}
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (disabled) return
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleClick()
            }
          }}
        >
          {doorSvg}
        </div>

        {/* Invisible hit target for bigger click area */}
        <button
          type="button"
          className="ff-door-hit"
          aria-label={`Open ${label}`}
          onClick={handleClick}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
