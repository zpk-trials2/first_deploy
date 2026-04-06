"use client"

import { useEffect, useRef, useState } from 'react'

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
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

    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const characters = katakana + latin

    // Reduce column density by 50% on mobile
    const fontSize = isMobile ? 18 : 16
    const columnMultiplier = isMobile ? 2 : 1
    const columns = Math.floor(canvas.width / (fontSize * columnMultiplier))
    const drops: number[] = Array(columns).fill(1)

    // Slower frame rate on mobile
    const frameInterval = isMobile ? 50 : 33

    const draw = () => {
      // Trail fade - updated color
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length))
        const x = i * fontSize * columnMultiplier
        const y = drops[i] * fontSize

        // Warmer green color
        const alpha = 0.3 + Math.random() * 0.7
        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`
        ctx.fillText(text, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, frameInterval)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isMobile])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: 'black' }}
    />
  )
}
