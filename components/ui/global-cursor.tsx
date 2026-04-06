"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, AnimatePresence } from 'framer-motion'

interface ClickStar {
  id: number
  x: number
  y: number
  char: string
  color: string
  size: number
  offsetX: number
  offsetY: number
}

interface TrailDot {
  x: number
  y: number
  id: number
}

export function GlobalCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [clickStars, setClickStars] = useState<ClickStar[]>([])
  const [trail, setTrail] = useState<TrailDot[]>([])
  const [isTouchDevice, setIsTouchDevice] = useState(true)
  const trailIdRef = useRef(0)
  const starIdRef = useRef(0)

  const springConfig = { stiffness: 200, damping: 20 }
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)

  useEffect(() => {
    // Check if touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(isTouch)
    
    if (isTouch) return

    // Hide default cursor
    document.body.style.cursor = 'none'

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      cursorX.set(e.clientX - 7)
      cursorY.set(e.clientY - 7)

      // Update trail
      trailIdRef.current++
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: trailIdRef.current }]
        return newTrail.slice(-10)
      })
    }

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.hasAttribute('data-interactive') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    const handleMouseDown = (e: MouseEvent) => {
      const colors = ['#00d4ff', '#bf5af2', '#ffffff', '#ffd700']
      const chars = ['✦', '★']

      const newStars: ClickStar[] = Array.from({ length: 4 }, (_, i) => {
        starIdRef.current += 1
        return {
          id: starIdRef.current,
          x: e.clientX,
          y: e.clientY,
          char: chars[Math.floor(Math.random() * chars.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 10 + Math.random() * 8,
          offsetX: (Math.random() - 0.5) * 80,
          offsetY: -60 - Math.random() * 40,
        }
      })

      setClickStars(prev => [...prev, ...newStars])

      setTimeout(() => {
        setClickStars(prev => prev.filter(star => !newStars.find(ns => ns.id === star.id)))
      }, 700)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseEnter)
    document.addEventListener('mouseout', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.body.style.cursor = 'auto'
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [cursorX, cursorY])

  if (isTouchDevice) return null

  return (
    <>
      {/* Trail dots */}
      <div className="fixed inset-0 pointer-events-none z-[9997]">
        {trail.map((dot, index) => (
          <div
            key={dot.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: dot.x - 2,
              top: dot.y - 2,
              backgroundColor: index % 2 === 0 ? '#00d4ff' : '#bf5af2',
              opacity: (index / trail.length) * 0.6,
            }}
          />
        ))}
      </div>

      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          width: isHovering ? 28 : 14,
          height: isHovering ? 28 : 14,
          border: `2px solid ${isHovering ? '#bf5af2' : '#00d4ff'}`,
          boxShadow: isHovering 
            ? '0 0 15px #bf5af2' 
            : '0 0 10px #00d4ff',
          backgroundColor: isHovering ? 'rgba(191, 90, 242, 0.1)' : 'transparent',
          marginLeft: isHovering ? -7 : 0,
          marginTop: isHovering ? -7 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Click stars overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9998]">
        <AnimatePresence>
          {clickStars.map(star => (
            <motion.span
              key={`cursor-star-${star.id}`}
              className="absolute"
              style={{
                left: star.x,
                top: star.y,
                color: star.color,
                fontSize: star.size,
              }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ 
                x: star.offsetX, 
                y: star.offsetY, 
                opacity: 0, 
                rotate: 360 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {star.char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
