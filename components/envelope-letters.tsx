"use client"

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

declare global {
  interface Window {
    confetti: (options?: {
      particleCount?: number
      spread?: number
      origin?: { x?: number; y?: number }
      colors?: string[]
    }) => void
  }
}

const letters = [
  {
    title: "A Note on Who You Are",
    color: "#00d4ff",
    content: `You are remarkable in ways you probably don't even realize. Your laugh — the real one — is absolutely contagious. The way you overthink everything but somehow still make bold choices? That's peak you. You're the kind of person who remembers the small things, who shows up when it matters, who makes people feel seen without even trying.

Your energy is rare. In a world of small talk and surface-level connections, you dive deep. You care fiercely. You feel everything intensely. And honestly? That's not a flaw — that's your superpower.

Never let anyone dull that spark.`,
  },
  {
    title: "What Our Friendship Means",
    color: "#bf5af2",
    content: `Finding you was like finding a missing puzzle piece I didn't know I was looking for. Our conversations flow like we've known each other for lifetimes. The way we can go from deep existential talks to absolute chaos in seconds — that's rare. That's us.

You've been there through the highs and the lows, the 3am rants and the random meme drops. You've seen my worst and still chose to stay. That means more than any words could capture.

This friendship isn't just important — it's essential. You're my person, and I don't take that lightly.`,
  },
  {
    title: "Everything I Wish For You",
    color: "#ff375f",
    content: `On this birthday, I wish you moments that take your breath away. Adventures that scare you just enough to feel alive. Connections that fill your soul. Rest when you need it and chaos when you crave it.

I hope this year brings you closer to your dreams — whatever they look like now. I hope you laugh until you can't breathe, love without fear, and finally see yourself the way I see you: absolutely incredible.

You deserve the world and then some. Happy birthday, Diksha. Here's to another year of being unapologetically, beautifully you.`,
  },
]

function CatPaw({ side }: { side: 'left' | 'right' }) {
  const isRight = side === 'right'
  
  return (
    <svg 
      width="60" 
      height="50" 
      viewBox="0 0 60 50"
      style={{
        transform: isRight ? 'rotate(15deg) scaleX(-1)' : 'rotate(-15deg)',
      }}
    >
      {/* Main pad */}
      <ellipse 
        cx="30" 
        cy="32" 
        rx="14" 
        ry="12" 
        fill="#f9a8d4" 
        stroke="#e879a0" 
        strokeWidth="1.5"
      />
      {/* Toes */}
      <circle cx="18" cy="18" r="6" fill="#f9a8d4" stroke="#e879a0" strokeWidth="1.5" />
      <circle cx="30" cy="12" r="6" fill="#f9a8d4" stroke="#e879a0" strokeWidth="1.5" />
      <circle cx="42" cy="18" r="6" fill="#f9a8d4" stroke="#e879a0" strokeWidth="1.5" />
      <circle cx="48" cy="28" r="5" fill="#f9a8d4" stroke="#e879a0" strokeWidth="1.5" />
    </svg>
  )
}

function EnvelopeCard({ 
  letter, 
  index 
}: { 
  letter: typeof letters[0]
  index: number 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const [isOpen, setIsOpen] = useState(false)
  const [showPaws, setShowPaws] = useState(false)
  const [flapOpen, setFlapOpen] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = async () => {
    if (isOpen) {
      setShowLetter(false)
      setTimeout(() => {
        setFlapOpen(false)
        setTimeout(() => setIsOpen(false), 400)
      }, 300)
      return
    }

    // Step 1: Show cat paws
    setShowPaws(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Step 2: Open envelope flap
    setFlapOpen(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Hide paws and show letter
    setShowPaws(false)
    setIsOpen(true)
    setShowLetter(true)

    // Fire confetti
    if (typeof window !== 'undefined' && window.confetti) {
      window.confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [letter.color, '#ffffff', '#ffd700'],
      })
    }
  }

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-[320px] mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      {/* Cat paws animation */}
      <AnimatePresence>
        {showPaws && (
          <>
            <motion.div
              className="absolute -bottom-[50px] left-5 z-20"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <CatPaw side="left" />
            </motion.div>
            <motion.div
              className="absolute -bottom-[50px] right-5 z-20"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
            >
              <CatPaw side="right" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Envelope card */}
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${letter.color}40`,
          backdropFilter: 'blur(24px)',
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          y: isHovered && !isOpen ? -6 : 0,
          boxShadow: isHovered && !isOpen 
            ? `0 0 30px ${letter.color}30`
            : '0 0 0px transparent',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Envelope SVG */}
        <div className="relative h-32 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 320 128" preserveAspectRatio="none">
            {/* Envelope body */}
            <rect x="0" y="0" width="320" height="128" fill={`${letter.color}10`} />
            
            {/* Flap */}
            <motion.polygon
              points="0,0 160,64 320,0"
              fill={`${letter.color}20`}
              stroke={letter.color}
              strokeWidth="1"
              style={{ transformOrigin: '160px 0px' }}
              animate={{ 
                rotateX: flapOpen ? -160 : 0,
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            />
          </svg>
          
          {/* Wax seal */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: letter.color,
              boxShadow: `0 0 20px ${letter.color}50`,
            }}
          >
            <span className="text-white font-serif text-xl">D</span>
          </div>
        </div>

        {/* Title */}
        <div className="p-4 text-center">
          <h3 
            className="text-lg sm:text-xl font-serif italic"
            style={{ color: letter.color }}
          >
            {letter.title}
          </h3>
          
          {/* Click to reveal badge - only on hover */}
          <AnimatePresence>
            {isHovered && !isOpen && (
              <motion.span
                className="inline-block mt-2 px-3 py-1 rounded-full text-xs"
                style={{ 
                  background: `${letter.color}20`,
                  color: letter.color,
                }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                Click to Reveal
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Letter content */}
        <AnimatePresence>
          {showLetter && (
            <motion.div
              className="px-4 pb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4 }}
            >
              <div 
                className="p-4 rounded-lg"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <p 
                  className="text-sm sm:text-base leading-relaxed whitespace-pre-line"
                  style={{ 
                    color: '#fef3c7',
                    fontFamily: 'var(--font-cormorant), serif',
                  }}
                >
                  {letter.content}
                </p>
                
                <p 
                  className="text-right mt-4 italic text-sm"
                  style={{ color: '#94a3b8' }}
                >
                  — [Your Name]
                </p>
              </div>
              
              <button
                className="w-full mt-4 py-2 text-sm rounded-lg transition-colors"
                style={{ 
                  background: `${letter.color}20`,
                  color: letter.color,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
              >
                Click to close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export function EnvelopeLetters() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [confettiFired, setConfettiFired] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (isInView && !confettiFired && typeof window !== 'undefined' && window.confetti) {
      setConfettiFired(true)
      const particleCount = isMobile ? 80 : 100

      window.confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d4ff', '#bf5af2', '#ff375f'],
      })
    }
  }, [isInView, confettiFired, isMobile])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-12 sm:py-16 md:py-20 px-5 sm:px-6 md:px-8 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 100%, #1a0608 0%, #08040a 70%)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heart Icon */}
        <motion.div
          className="flex justify-center mb-6 sm:mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Heart
            className="w-10 h-10 sm:w-12 sm:h-12 animate-heart-pulse"
            fill="#ff375f"
            style={{ 
              color: '#ff375f',
              filter: 'drop-shadow(0 0 20px rgba(255, 55, 95, 0.5))' 
            }}
          />
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl text-center mb-10 sm:mb-12 md:mb-16 text-balance"
          style={{ 
            color: '#ffffff',
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Letters just for you...
        </motion.h2>

        {/* 3 Envelope cards */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch">
          {letters.map((letter, index) => (
            <EnvelopeCard key={index} letter={letter} index={index} />
          ))}
        </div>

        {/* Final Signature */}
        <motion.div
          className="mt-14 sm:mt-16 md:mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 animate-gradient-x text-balance"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              textShadow: '0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(191, 90, 242, 0.2)'
            }}
          >
            Happy Birthday, Diksha Jangra
          </h2>
        </motion.div>
      </div>
    </section>
  )
}
