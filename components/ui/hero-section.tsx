"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { StarField } from './star-field'

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

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [clickStars, setClickStars] = useState<ClickStar[]>([])
  const [subtitleOverride, setSubtitleOverride] = useState<string | null>(null)
  const [typedBuffer, setTypedBuffer] = useState('')
  const typedTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const starIdRef = useRef(0)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Scroll-based parallax for blobs
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -30])
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, 20])
  const blob3Rotate = useTransform(scrollYProgress, [0, 1], [0, 15])

  // Magnetic follow effect
  const springConfig = { stiffness: 100, damping: 20 }
  const cardX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig)
  const cardY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), springConfig)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / rect.width)
    mouseY.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovering(false)
  }

  // Click spark burst
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    const colors = ['#00d4ff', '#bf5af2', '#ffffff', '#ffd700']
    const chars = ['✦', '★']

    const newStars: ClickStar[] = Array.from({ length: 12 }, () => {
      starIdRef.current += 1
      return {
        id: starIdRef.current,
        x: clickX,
        y: clickY,
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

  // Keyboard easter egg
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Escape') {
      setTypedBuffer('')
      return
    }

    const newBuffer = typedBuffer + e.key.toLowerCase()
    setTypedBuffer(newBuffer)

    // Clear timeout and set new one
    if (typedTimeoutRef.current) clearTimeout(typedTimeoutRef.current)
    typedTimeoutRef.current = setTimeout(() => setTypedBuffer(''), 2000)

    // Check for easter eggs
    if (newBuffer.includes('hi')) {
      setSubtitleOverride('Oh hi there!')
      setTimeout(() => setSubtitleOverride(null), 3000)
      setTypedBuffer('')
    } else if (newBuffer.includes('diksha')) {
      setSubtitleOverride("She's literally the best")
      setTimeout(() => setSubtitleOverride(null), 3000)
      setTypedBuffer('')
    } else if (newBuffer.includes('happy')) {
      setSubtitleOverride('HAPPY BIRTHDAY!!')
      setTimeout(() => setSubtitleOverride(null), 3000)
      setTypedBuffer('')
    }
  }, [typedBuffer])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (typedTimeoutRef.current) clearTimeout(typedTimeoutRef.current)
    }
  }, [handleKeyDown])

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at 80% 0%, #0f0a1e 0%, #020408 60%)',
      }}
    >
      {/* Animated gradient blobs with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-3xl animate-blob"
          style={{ 
            backgroundColor: 'rgba(0, 212, 255, 0.15)',
            y: blob1Y 
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-3xl animate-blob animation-delay-2000"
          style={{ 
            backgroundColor: 'rgba(191, 90, 242, 0.2)',
            y: blob2Y 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-3xl animate-blob animation-delay-4000"
          style={{ 
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            rotate: blob3Rotate 
          }}
        />
      </div>

      <StarField />

      <motion.div
        ref={cardRef}
        className="relative z-10 rounded-2xl p-6 sm:p-8 md:p-10 max-w-xl mx-4 w-[92vw] sm:w-auto"
        style={{
          x: isTouchDevice ? 0 : cardX,
          y: isTouchDevice ? 0 : cardY,
          rotateX: isTouchDevice ? 0 : rotateX,
          rotateY: isTouchDevice ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(24px)',
          boxShadow: isHovering 
            ? '0 0 30px rgba(0, 212, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
            : 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovering(true)}
        onClick={handleCardClick}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        whileTap={isTouchDevice ? { scale: 1.02 } : undefined}
      >
        {/* Click stars overlay */}
        <AnimatePresence>
          {clickStars.map(star => (
            <motion.span
              key={`hero-star-${star.id}`}
              className="absolute pointer-events-none"
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

        <motion.div
          className="text-center"
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 sm:mb-4"
            style={{ 
              color: '#00d4ff',
              textShadow: '0 0 10px #00d4ff, 0 0 40px rgba(0, 212, 255, 0.4), 0 0 80px rgba(0, 212, 255, 0.15)' 
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Happy Birthday
          </motion.h2>
          
          <motion.h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 ${isHovering ? 'animate-shimmer' : ''}`}
            style={{ 
              color: '#bf5af2',
              textShadow: '0 0 10px #bf5af2, 0 0 40px rgba(191, 90, 242, 0.4), 0 0 80px rgba(191, 90, 242, 0.15)',
              backgroundImage: isHovering 
                ? 'linear-gradient(90deg, #00d4ff, #ffffff, #bf5af2, #ffffff, #00d4ff)'
                : 'none',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: isHovering ? 'text' : 'unset',
              WebkitTextFillColor: isHovering ? 'transparent' : '#bf5af2',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Diksha Jangra
          </motion.h1>
          
          <motion.p
            className="text-base sm:text-lg mb-6 sm:mb-8 px-2"
            style={{ color: '#94a3b8' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {subtitleOverride || 'A digital connection in a world of billions.'}
          </motion.p>
          
          <motion.div
            className="h-px w-32 sm:w-48 mx-auto"
            style={{ background: 'linear-gradient(to right, #00d4ff, #bf5af2)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 animate-bounce" style={{ color: '#00d4ff' }} />
      </motion.div>
    </section>
  )
}
