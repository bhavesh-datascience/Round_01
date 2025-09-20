"use client"

import { useEffect, useRef } from "react"

export default function TechBg({ opacity = 0.8 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    // Plexus dots and lines data
    const points: { x: number; y: number; vx: number; vy: number }[] = []
    const maxDistance = 150
    const pointCount = 100

    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`
      ctx.lineWidth = 1

      // Draw points
      points.forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw lines between close points
      for (let i = 0; i < pointCount; i++) {
        for (let j = i + 1; j < pointCount; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()
          }
        }
      }

      // Update points position
      points.forEach(point => {
        point.x += point.vx
        point.y += point.vy

        if (point.x < 0 || point.x > width) point.vx = -point.vx
        if (point.y < 0 || point.y > height) point.vy = -point.vy
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    function handleResize() {
      if (canvas) {
        width = canvas.width = window.innerWidth
        height = canvas.height = window.innerHeight
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [opacity])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      aria-hidden="true"
    />
  )
}
