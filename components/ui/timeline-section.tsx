"use client"

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const timelineEvents = [
  { date: "Oct 18", title: "Day Zero", body: "Signal detected. A new frequency entered my world.", accent: "cyan" },
  { date: "Oct 18+", title: "First Real Conversation", body: "We talked like we'd known each other forever. Instant.", accent: "cyan" },
  { date: "Late Oct", title: "First Late Night", body: "3am. Still talking. Zero regrets. Zero sleep.", accent: "cyan" },
  { date: "Nov", title: "The First Rant", body: "You let me be a complete mess. I never forgot that kindness.", accent: "purple" },
  { date: "Dec", title: "Chaos Duo Unlocked", body: "When we're together, things just... happen. Gloriously.", accent: "cyan" },
  { date: "Early 2026", title: "Best Friend Status", body: "Officially, permanently, irreversibly unlocked.", accent: "purple" },
  { date: "2026", title: "The Fight", body: "We broke. But something about us refused to stay broken.", accent: "rose" },
  { date: "Mar 14, 2026", title: "The Silence", body: "The hardest quiet I've ever felt. Still felt you everywhere.", accent: "rose" },
  { date: "After", title: "The Realisation", body: "Some people you simply cannot unlove. No matter what.", accent: "rose" },
  { date: "Today", title: "This Moment", body: "I built this because words in a text weren't nearly enough.", accent: "gold" },
  { date: "Your Birthday", title: "Here We Are", body: "Celebrating the most irreplaceable person I've ever known.", accent: "gold" },
  { date: "Always", title: "No Expiry Date", body: "This friendship has no end date. I checked. It's permanent.", accent: "gold" },
]

const accentColors = {
  cyan: { border: 'rgba(0,212,255,0.3)', dot: '#00d4ff', glow: '0 0 20px rgba(0,212,255,0.2)', hoverBorder: 'rgba(0,212,255,0.6)' },
  purple: { border: 'rgba(191,90,242,0.3)', dot: '#bf5af2', glow: '0 0 20px rgba(191,90,242,0.2)', hoverBorder: 'rgba(191,90,242,0.6)' },
  rose: { border: 'rgba(255,55,95,0.4)', dot: '#ff375f', glow: '0 0 20px rgba(255,55,95,0.25)', hoverBorder: 'rgba(255,55,95,0.7)' },
  gold: { border: 'rgba(255,214,10,0.3)', dot: '#ffd60a', glow: '0 0 20px rgba(255,214,10,0.2)', hoverBorder: 'rgba(255,214,10,0.6)' },
}

function TimelineCard({ 
  event, 
  index, 
  isLeft 
}: { 
  event: typeof timelineEvents[0]
  index: number
  isLeft: boolean 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)

  const colors = accentColors[event.accent as keyof typeof accentColors]

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRipple({ x, y })
    setIsExpanded(!isExpanded)
    setTimeout(() => setRipple(null), 600)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row mb-6 md:mb-10`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Content card */}
      <div className={`w-full md:w-[42%] ${isLeft ? 'md:pr-6 pl-10 md:pl-0' : 'md:pl-6 pl-10'}`}>
        <motion.div 
          className="rounded-xl p-4 sm:p-5 cursor-pointer relative overflow-hidden"
          style={{
            background: isExpanded ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${isHovered || isExpanded ? colors.hoverBorder : colors.border}`,
            backdropFilter: 'blur(24px)',
            boxShadow: isHovered || isExpanded ? colors.glow : 'none',
            transition: 'all 0.3s ease',
          }}
          animate={{ 
            y: isHovered ? -6 : 0,
            scale: isExpanded ? 1.02 : 1,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          {/* Ripple effect */}
          <AnimatePresence>
            {ripple && (
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  background: `${colors.dot}40`,
                }}
                initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.6 }}
                animate={{ width: 300, height: 300, x: -150, y: -150, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>

          {/* Hexagon badge on hover */}
          {isHovered && (
            <motion.span
              className="absolute top-2 right-2 text-sm"
              style={{ color: colors.dot }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              ⬡
            </motion.span>
          )}

          <span className="text-xs font-mono mb-1 block" style={{ color: '#64748b' }}>{event.date}</span>
          <h3 
            className="text-base sm:text-lg font-semibold mb-2"
            style={{ color: colors.dot }}
          >
            {event.title}
          </h3>
          <p className="text-sm" style={{ color: '#94a3b8' }}>{event.body}</p>
        </motion.div>

        {/* Connector line to path (desktop only) */}
        <div 
          className="hidden md:block absolute top-1/2 w-4 h-px"
          style={{
            background: `${colors.dot}50`,
            left: isLeft ? 'calc(42% + 0.5rem)' : 'auto',
            right: !isLeft ? 'calc(42% + 0.5rem)' : 'auto',
          }}
        />
      </div>

      {/* Center area for the dot */}
      <div className="hidden md:flex w-[16%] justify-center relative">
        <div 
          className="w-4 h-4 rounded-full z-10 shrink-0"
          style={{ 
            backgroundColor: colors.dot,
            boxShadow: `0 0 15px ${colors.dot}, 0 0 30px ${colors.dot}50`,
          }}
        />
      </div>

      {/* Mobile dot */}
      <div 
        className="md:hidden absolute left-0 top-4 w-3 h-3 rounded-full z-10"
        style={{ 
          backgroundColor: colors.dot,
          boxShadow: `0 0 12px ${colors.dot}, 0 0 24px ${colors.dot}50`,
        }}
      />

      {/* Empty space for alternating layout */}
      <div className="hidden md:block w-[42%]" />
    </motion.div>
  )
}

export function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 px-4 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, #0f0a1e 0%, #020408 60%)',
      }}
    >
      {/* Desktop winding path SVG */}
      <svg 
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d="M 50 3 C 70 6, 72 14, 50 18 S 28 28, 50 34 S 72 44, 50 50 S 28 60, 50 66 S 72 76, 50 82 S 28 90, 50 97"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="0.15"
          strokeDasharray="0.8 0.6"
          opacity="0.4"
          filter="url(#pathGlow)"
        />
      </svg>

      {/* Mobile vertical line */}
      <div 
        className="md:hidden absolute left-[5px] top-32 bottom-20 w-[2px]"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 212, 255, 0.3), rgba(191, 90, 242, 0.3), rgba(255, 214, 10, 0.3), transparent)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h2
          className="font-mono text-base sm:text-lg md:text-xl mb-12 sm:mb-16 text-center flex items-center justify-center gap-2"
          style={{ color: '#00d4ff' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          {'// TIMELINE_OF_US.md'}
          <span className="animate-pulse">▋</span>
        </motion.h2>

        <div className="relative">
          {timelineEvents.map((event, index) => (
            <TimelineCard 
              key={index} 
              event={event} 
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
