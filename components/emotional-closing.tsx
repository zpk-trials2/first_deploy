"use client"

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const closingLines = [
  { text: "Some friendships are chosen.", style: "text-xl text-stone-400 italic" },
  { text: "Ours was written.", style: "text-3xl font-bold italic", color: "#ffd60a", glow: true },
  { type: "divider", color: "#ffd60a" },
  { text: "We've laughed until 3am made no sense.", style: "text-lg text-stone-300" },
  { text: "We've fought until silence felt like a wall.", style: "text-lg text-stone-300" },
  { text: "We've gone quiet in ways that hurt more than any word.", style: "text-lg text-stone-300 italic" },
  { type: "divider", color: "#ff375f" },
  { text: "And yet.", style: "text-5xl font-bold italic tracking-tight", color: "white", dramatic: true },
  { type: "divider", color: "#bf5af2" },
  { text: "Here I am.", style: "text-2xl italic text-stone-200" },
  { text: "Still Your UB.", style: "text-4xl font-bold italic", color: "#ff375f", glow: true },
  { type: "divider", color: "#ffd60a" },
  { text: "October 18th had a New Beginning.", style: "text-lg text-stone-300" },
  { text: "I didn't know a friendship could feel like having everything.", style: "text-xl italic text-stone-200" },
  { text: "Until you.", style: "text-3xl font-bold italic", color: "#00d4ff", glow: true },
  { type: "divider", color: "#ff375f" },
  { text: "March 14th broke something too.", style: "text-lg text-stone-400 italic" },
  { text: "Yeah our Last conversation", style: "text-lg text-stone-400 italic" },
  { text: "But broken things can be held together.", style: "text-lg text-stone-300" },
  { text: "And I've been holding on.", style: "text-2xl font-semibold italic", color: "#bf5af2", glow: true },
  { type: "divider", color: "#bf5af2" },
  { text: "Even in the silence,", style: "text-xl text-stone-400 italic" },
  { text: "Even in the distance,", style: "text-xl text-stone-400 italic" },
  { text: "Even in every version of this story where we don't speak —", style: "text-xl text-stone-300 italic" },
  { type: "spacer" },
  { text: "You are still my friend.", style: "text-4xl sm:text-5xl font-bold italic", color: "#ff375f", glow: true, heartbeat: true },
  { text: "You will always be my friend.", style: "text-4xl sm:text-5xl font-bold italic", color: "#ff375f", glow: true, heartbeat: true },
  { type: "divider", color: "#ffd60a", wide: true },
  { text: "This page exists because I don't know how to say it out loud.", style: "text-base text-stone-400 italic" },
  { text: "So I built it instead.", style: "text-2xl font-semibold italic text-stone-200" },
  { text: "Happy Birthday, Diksha.", style: "text-3xl font-bold italic", color: "white" },
  { text: "I'm glad you exist.", style: "text-xl italic text-stone-300" },
  { text: "I'm glad you're a part of me.", style: "text-2xl font-bold italic", color: "#ffd60a", glow: true },
]

function Divider({ color, wide }: { color: string; wide?: boolean }) {
  return (
    <svg className={`${wide ? 'w-24' : 'w-16'} h-1 mx-auto my-4`} viewBox="0 0 100 4">
      <line x1="0" y1="2" x2="100" y2="2" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

function FallingPetals({ isActive }: { isActive: boolean }) {
  const [petals, setPetals] = useState<Array<{
    id: number
    x: number
    delay: number
    duration: number
    color: string
  }>>([])

  useEffect(() => {
    if (!isActive) return
    const colors = ['#ffd60a', '#ff375f', 'rgba(191,90,242,0.6)']
    const newPetals = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 10,
      color: colors[i % colors.length],
    }))
    setPetals(newPetals)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute w-3 h-3"
          style={{
            left: `${petal.x}vw`,
            top: '-20px',
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, Math.sin(petal.id) * 30],
            rotate: [0, 360],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 20 20" fill={petal.color}>
            <path d="M10 0 C15 5, 15 10, 10 15 C5 10, 5 5, 10 0" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

function ClosingLine({ line, index }: { line: typeof closingLines[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [pulseCount, setPulseCount] = useState(0)

  useEffect(() => {
    if (!isInView || !('heartbeat' in line) || !line.heartbeat) return

    const interval = setInterval(() => {
      setPulseCount(p => {
        if (p >= 3) {
          clearInterval(interval)
          return p
        }
        return p + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isInView, line])

  if ('type' in line) {
    if (line.type === 'divider') {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.35 }}
        >
          <Divider color={line.color || '#ffd60a'} wide={'wide' in line && line.wide} />
        </motion.div>
      )
    }
    if (line.type === 'spacer') {
      return <div className="h-4" />
    }
    return null
  }

  const textStyle: React.CSSProperties = {}
  if ('color' in line && line.color) {
    textStyle.color = line.color
  }
  if ('glow' in line && line.glow && 'color' in line) {
    textStyle.textShadow = `0 0 15px ${line.color}, 0 0 40px ${line.color}80, 0 0 80px ${line.color}30`
  }

  return (
    <motion.div
      ref={ref}
      className={line.style}
      style={textStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        scale: ('heartbeat' in line && line.heartbeat && pulseCount < 3)
          ? [1, 1.02, 1]
          : ('dramatic' in line && line.dramatic ? [0.85, 1.03, 1] : 1)
      } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.35,
        scale: {
          duration: ('heartbeat' in line && line.heartbeat) ? 2 : 0.5,
          repeat: ('heartbeat' in line && line.heartbeat && pulseCount < 3) ? 3 : 0
        }
      }}
    >
      {line.text}
    </motion.div>
  )
}

function FinalSignature() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      className="text-3xl sm:text-4xl font-bold italic text-center"
      style={{
        fontFamily: 'var(--font-cormorant), serif',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <motion.span
        animate={{
          textShadow: [
            '0 0 20px #00d4ff, 0 0 40px rgba(0, 212, 255, 0.5)',
            '0 0 20px #bf5af2, 0 0 40px rgba(191, 90, 242, 0.5)',
            '0 0 20px #ff375f, 0 0 40px rgba(255, 55, 95, 0.5)',
            '0 0 20px #00d4ff, 0 0 40px rgba(0, 212, 255, 0.5)',
          ],
          color: ['#00d4ff', '#bf5af2', '#ff375f', '#00d4ff'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        Happy Birthday, Diksha Jangra ✦
      </motion.span>
    </motion.div>
  )
}

export function EmotionalClosing() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-6 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #1a0612 0%, #050208 80%)',
      }}
    >
      {/* Warm rose glow blob */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 55, 95, 0.08) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Falling petals */}
      <FallingPetals isActive={isInView} />

      <div className="max-w-2xl mx-auto relative z-20 text-center space-y-4" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        {closingLines.map((line, index) => (
          <ClosingLine key={index} line={line} index={index} />
        ))}

        {/* Final Spacer */}
        <div className="h-12" />

        {/* Final Signature */}
        <FinalSignature />

        {/* Closing line */}
        <motion.p
          className="text-sm font-mono mt-8"
          style={{ color: '#475569' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 12 }}
        >
          Built with sleepless nights, questionable decisions, and way too much love. — Zapking
        </motion.p>
      </div>
    </section>
  )
}
