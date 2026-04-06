"use client"

import { useEffect, useRef, useState } from 'react'

interface Bubble {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  driftOffset: number
  color: string
}

export function FloatingBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const bubblesRef = useRef<Bubble[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize bubbles
    const colors = ['rgba(0,212,255,', 'rgba(191,90,242,']
    bubblesRef.current = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      radius: 10 + Math.random() * 20,
      speed: 0.4 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.6,
      driftOffset: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)] + (0.2 + Math.random() * 0.3) + ')',
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubblesRef.current.forEach(bubble => {
        // Update position
        bubble.y -= bubble.speed
        bubble.x += Math.sin(Date.now() * 0.001 + bubble.driftOffset) * bubble.drift

        // Reset if off screen
        if (bubble.y + bubble.radius < 0) {
          bubble.y = canvas.height + bubble.radius
          bubble.x = Math.random() * canvas.width
        }

        // Draw bubble outline
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.strokeStyle = bubble.color
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Draw inner shine
        ctx.beginPath()
        ctx.arc(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.2,
          0,
          Math.PI * 2
        )
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMobile])

  if (!isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
