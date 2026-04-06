"use client"

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const zodiacTraits = [
  { 
    symbol: "⚡", 
    name: "Wit", 
    quote: "Sharp enough to cut through anything. She'll have you laughing mid-argument." 
  },
  { 
    symbol: "💬", 
    name: "Communication", 
    quote: "Her words land differently. They stay with you." 
  },
  { 
    symbol: "🔥", 
    name: "Passion", 
    quote: "When she cares about something, the whole room feels it." 
  },
  { 
    symbol: "🛡️", 
    name: "Loyalty", 
    quote: "She shows up. Every single time. Even when it's hard." 
  },
  { 
    symbol: "🎭", 
    name: "Adaptability", 
    quote: "Chaos? She thrives. Change? She leads." 
  },
  { 
    symbol: "💡", 
    name: "Insight", 
    quote: "Sees through things most people don't even notice." 
  },
]

function FlipCard({ trait, index }: { trait: typeof zodiacTraits[0]; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      className="relative h-28 cursor-pointer"
      style={{ perspective: '1000px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
          style={{
            backfaceVisibility: 'hidden',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <span className="text-2xl mb-1">{trait.symbol}</span>
          <span className="text-sm font-medium" style={{ color: '#00d4ff' }}>{trait.name}</span>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 flex items-center justify-center p-3 rounded-xl text-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, rgba(25, 15, 30, 0.95), rgba(40, 20, 35, 0.95))',
            border: '1px solid rgba(191, 90, 242, 0.3)',
          }}
        >
          <p 
            className="text-xs italic leading-relaxed"
            style={{ 
              fontFamily: 'var(--font-cormorant), serif',
              color: '#f5f0e6'
            }}
          >
            {trait.quote}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function EnergyBar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval)
            return 100
          }
          return p + 2
        })
      }, 40)
      return () => clearInterval(interval)
    }, 500)
    return () => clearTimeout(timer)
  }, [isInView])

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs" style={{ color: '#64748b' }}>ENERGY OUTPUT RATING:</span>
        <span 
          className="font-mono text-sm"
          style={{ 
            color: '#ffd60a',
            textShadow: '0 0 10px rgba(255, 214, 10, 0.4)'
          }}
        >
          LEGENDARY ✦
        </span>
      </div>
      
      <div className="h-3 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ 
            background: 'linear-gradient(90deg, #ffd60a, #ff9f0a)',
            boxShadow: '0 0 15px rgba(255, 214, 10, 0.5)',
            width: `${progress}%`,
          }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <p className="font-mono text-xs mt-3 text-center" style={{ color: '#64748b' }}>
        {'//'} Warning: Prolonged exposure may cause inspiration, uncontrollable laughter, and an inability to imagine life without her.
      </p>
    </div>
  )
}

export function ZodiacProfile() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 sm:py-20 px-4 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, #0f0a1e 0%, #020408 60%)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.h2
          className="font-mono text-base sm:text-lg md:text-xl mb-10 flex items-center justify-center gap-2"
          style={{ 
            color: '#ffd60a',
            textShadow: '0 0 20px rgba(255, 214, 10, 0.4)'
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          {'SUBJECT_PROFILE.stellar'}
          <span className="animate-pulse">▋</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10">
          {/* Left Column - Birthday Declaration */}
          <motion.div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(24px)',
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Date */}
            <h3 
              className="text-5xl sm:text-6xl lg:text-7xl italic mb-2"
              style={{ 
                fontFamily: 'var(--font-cormorant), serif',
                color: '#ffd60a',
                textShadow: '0 0 20px #ffd60a, 0 0 60px rgba(255, 214, 10, 0.3)'
              }}
            >
              June 10
            </h3>

            {/* Zodiac */}
            <p 
              className="text-2xl sm:text-3xl mb-4"
              style={{ 
                color: '#00d4ff',
                textShadow: '0 0 15px rgba(0, 212, 255, 0.4)'
              }}
            >
              ♊ Gemini
            </p>

            {/* Divider */}
            <div className="h-px w-24 mb-4" style={{ background: 'rgba(255, 214, 10, 0.4)' }} />

            {/* Tags */}
            <p 
              className="font-mono text-xs tracking-widest mb-4"
              style={{ color: '#64748b' }}
            >
              Mercury-ruled · Air Sign · Dual-natured Genius
            </p>

            {/* Divider */}
            <div className="h-px w-24 mb-4" style={{ background: 'rgba(255, 214, 10, 0.4)' }} />

            {/* Description */}
            <p 
              className="text-base italic leading-relaxed mb-6"
              style={{ 
                fontFamily: 'var(--font-cormorant), serif',
                color: '#f5f0e6'
              }}
            >
              Born on a day the universe decided to try something extraordinary.
              June 10th children carry the sky in their minds —
              quick, curious, and impossible to forget.
            </p>

            {/* Stat Chips */}
            <div className="flex flex-wrap gap-2">
              {['♊ Air Sign', '☿ Mercury', '✦ Mutable'].map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1.5 rounded-full text-xs font-mono transition-colors duration-200 hover:border-cyan-500/50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Flip Cards */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {zodiacTraits.map((trait, index) => (
              <FlipCard key={trait.name} trait={trait} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Energy Bar */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <EnergyBar />
        </motion.div>
      </div>
    </section>
  )
}
