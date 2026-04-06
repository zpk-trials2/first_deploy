"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts'

const traits = [
  { trait: 'Humor', value: 95 },
  { trait: 'Sarcasm', value: 88 },
  { trait: 'Empathy', value: 100 },
  { trait: 'Loyalty', value: 97 },
  { trait: 'Creativity', value: 84 },
  { trait: 'Intelligence', value: 96 },
  { trait: 'Vibe Check', value: 99 },
  { trait: 'Response Time', value: 38 },
]

const tooltips: Record<string, string> = {
  "Late Night Debates": "Still going at 4am, no resolution needed",
  "Meme Archiving": "The sacred collection grows daily",
  "Deep Convos at 2am": "When the real thoughts come out",
  "Roasting Each Other": "Love language: sarcasm",
  "Zero Judgment Zone": "The safest space in existence",
  "Same Weird Energy": "Certified chaotic duo",
  "Overthinking Together": "Two brains, infinite spirals",
  "Music That Hits Different": "The shared playlist has 400 songs",
  "Chaos Mode: ON": "God help whoever's nearby",
  "Unfiltered Opinions": "No sugarcoating, ever",
}

const row1 = ["Late Night Debates", "Overthinking Together", "Meme Archiving", "Zero Judgment Zone", "Chaos Mode: ON"]
const row2 = ["Music That Hits Different", "Deep Convos at 2am", "Same Weird Energy", "Unfiltered Opinions"]
const row3 = ["Roasting Each Other", "Late Night Debates", "Overthinking Together", "Meme Archiving", "Zero Judgment Zone"]
const row4 = ["Same Weird Energy", "Music That Hits Different", "Chaos Mode: ON", "Deep Convos at 2am"]

const compatibilityBars = [
  { label: "Humor Sync", value: 98, color: "#00d4ff" },
  { label: "Chaos Alignment", value: 100, color: "#bf5af2" },
  { label: "Vibe Matching", value: 97, color: "#00d4ff" },
  { label: "Overthink Level", value: 99, color: "#ffd60a" },
  { label: "Loyalty Protocol", value: 100, color: "#ff375f" },
]

const terminalLines = [
  "> scanning friendship parameters...",
  "> result: UNDEFINED (exceeds all known metrics)",
  "> conclusion: this bond cannot be quantified",
  "> status: PERMANENT ✦",
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <div 
      ref={ref} 
      className="text-3xl sm:text-4xl md:text-5xl font-bold text-center" 
      style={{ 
        color: '#00d4ff',
        textShadow: '0 0 10px #00d4ff, 0 0 40px rgba(0, 212, 255, 0.4), 0 0 80px rgba(0, 212, 255, 0.15)' 
      }}
    >
      {count.toLocaleString()}{suffix}
    </div>
  )
}

function InterestPill({ text }: { text: string }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltip = tooltips[text] || ''

  return (
    <div 
      className="relative shrink-0"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        className="inline-block px-3 sm:px-4 py-1 sm:py-2 mx-1.5 sm:mx-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-transform duration-200 hover:scale-110"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          color: '#94a3b8',
        }}
      >
        {text}
      </span>
      {showTooltip && tooltip && (
        <motion.div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap z-50"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            color: '#e2e8f0',
          }}
          initial={{ opacity: 0, scale: 0.85, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 5 }}
          transition={{ duration: 0.2 }}
        >
          {tooltip}
        </motion.div>
      )}
    </div>
  )
}

function MarqueeRow({ items, duration, reverse = false }: { items: string[]; duration: number; reverse?: boolean }) {
  const doubled = [...items, ...items]
  
  return (
    <div className="flex overflow-hidden">
      <div 
        className="flex"
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${duration}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <InterestPill key={i} text={item} />
        ))}
      </div>
    </div>
  )
}

type DashboardCardProps = {
  title: string
  children: React.ReactNode
  className?: string
  accentColor?: string
}

function DashboardCard({ title, children, className = '', accentColor = '#00d4ff' }: DashboardCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      className={`rounded-xl p-4 sm:p-6 ${className}`}
      style={{ 
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(24px)',
        borderWidth: 1, 
        borderStyle: 'solid', 
        borderColor: isHovered ? `${accentColor}40` : 'rgba(255, 255, 255, 0.07)',
        boxShadow: isHovered 
          ? `0 0 30px ${accentColor}14, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
          : 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="font-mono text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: '#00d4ff' }}>{title}</h3>
      {children}
    </motion.div>
  )
}

function CompatibilityCard() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)
  const [terminalText, setTerminalText] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)

  // Ring animation
  const outerCircumference = 2 * Math.PI * 60
  const innerCircumference = 2 * Math.PI * 42

  // Terminal typewriter effect
  useEffect(() => {
    if (!isInView) return
    
    const typewriterDelay = setTimeout(() => {
      if (currentLine < terminalLines.length) {
        if (currentChar < terminalLines[currentLine].length) {
          setTerminalText(prev => {
            const newText = [...prev]
            if (!newText[currentLine]) newText[currentLine] = ''
            newText[currentLine] = terminalLines[currentLine].substring(0, currentChar + 1)
            return newText
          })
          setCurrentChar(c => c + 1)
        } else {
          setCurrentLine(l => l + 1)
          setCurrentChar(0)
        }
      }
    }, currentLine === 0 && currentChar === 0 ? 1500 : 80)

    return () => clearTimeout(typewriterDelay)
  }, [isInView, currentLine, currentChar])

  return (
    <motion.div
      ref={ref}
      className="rounded-xl p-4 sm:p-6 md:col-span-2"
      style={{ 
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(24px)',
        borderWidth: 1, 
        borderStyle: 'solid', 
        borderColor: isHovered ? 'rgba(255, 214, 10, 0.4)' : 'rgba(255, 255, 255, 0.07)',
        boxShadow: isHovered ? '0 0 30px rgba(255, 214, 10, 0.14)' : 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="font-mono text-xs sm:text-sm mb-4" style={{ color: '#00d4ff' }}>COMPATIBILITY.exe</h3>
      
      {/* LAYER 1 - Dual Concentric Rings */}
      <div className="flex justify-center mb-6">
        <svg className="w-40 h-40" viewBox="0 0 140 140">
          <defs>
            <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Track circles */}
          <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="70" cy="70" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          
          {/* Outer ring - cyan */}
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={outerCircumference}
            strokeDashoffset={isInView ? 0 : outerCircumference}
            filter="url(#outerGlow)"
            style={{ 
              transition: 'stroke-dashoffset 2s ease-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '70px 70px'
            }}
          />
          
          {/* Inner ring - purple */}
          <circle
            cx="70"
            cy="70"
            r="42"
            fill="none"
            stroke="#bf5af2"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={innerCircumference}
            strokeDashoffset={isInView ? 0 : innerCircumference}
            filter="url(#innerGlow)"
            style={{ 
              transition: 'stroke-dashoffset 2s ease-out 0.4s',
              transform: 'rotate(-90deg)',
              transformOrigin: '70px 70px'
            }}
          />
          
          {/* Center text */}
          <text 
            x="70" 
            y="70" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="white" 
            fontSize="28" 
            fontWeight="bold"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
          >
            ∞%
          </text>
          <text 
            x="70" 
            y="90" 
            textAnchor="middle" 
            fill="#ff375f" 
            fontSize="9" 
            fontFamily="monospace"
          >
            OVERFLOW_ERROR
          </text>
        </svg>
      </div>

      {/* LAYER 2 - Compatibility Breakdown Bars */}
      <div className="space-y-3 mb-6">
        {compatibilityBars.map((bar, index) => (
          <motion.div 
            key={bar.label}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.15 }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">{bar.label}</span>
              <span className="text-xs font-mono" style={{ color: bar.color }}>{bar.value}%</span>
            </div>
            <div className="h-[5px] rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: bar.color }}
                initial={{ width: '0%' }}
                animate={isInView ? { width: `${bar.value}%` } : {}}
                transition={{ duration: 1, delay: 0.5 + index * 0.15 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* LAYER 3 - Terminal System Log */}
      <div 
        className="rounded-lg p-3 font-mono text-xs"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
      >
        {terminalText.map((line, i) => (
          <div key={i} style={{ color: i === terminalText.length - 1 ? '#ffd60a' : '#94a3b8' }}>
            {line}
            {i === terminalText.length - 1 && currentLine < terminalLines.length && (
              <span className="animate-pulse">▋</span>
            )}
          </div>
        ))}
        {terminalText.length === 0 && (
          <span className="text-gray-500 animate-pulse">▋</span>
        )}
      </div>
    </motion.div>
  )
}

function RadarChartWithEffects() {
  const chartRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(chartRef, { once: true })

  return (
    <div ref={chartRef} className="relative w-full" style={{ height: 280, minHeight: 280 }}>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={traits} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#bf5af2" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="rgba(0, 212, 255, 0.12)" />
          <PolarAngleAxis dataKey="trait" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
          <Radar
            name="Personality"
            dataKey="value"
            stroke="#00d4ff"
            fill="url(#radarGradient)"
            strokeWidth={2}
            animationDuration={2000}
            animationBegin={isInView ? 0 : 99999}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Sonar sweep overlay */}
      {isInView && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 280 280">
            <line
              x1="140"
              y1="140"
              x2="140"
              y2="30"
              stroke="rgba(0, 212, 255, 0.25)"
              strokeWidth="1"
              className="animate-sonar-sweep"
              style={{ transformOrigin: '140px 140px' }}
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export function PersonalityDashboard() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Calculate friendship days from Oct 18
  const startDate = new Date('2024-10-18')
  const today = new Date()
  const friendshipDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <section 
      ref={sectionRef} 
      className="relative py-12 sm:py-16 md:py-20 px-4 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 80% 0%, #0f0a1e 0%, #020408 60%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-mono text-base sm:text-lg md:text-xl mb-8 sm:mb-12 flex items-center gap-2"
          style={{ color: '#00d4ff' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          {'// RUNNING ANALYSIS.exe'}
          <span className="animate-pulse">▋</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr">
          {/* Radar Chart */}
          <DashboardCard title="PERSONALITY_MATRIX.json" className="md:col-span-2 md:row-span-2" accentColor="#00d4ff">
            <RadarChartWithEffects />
          </DashboardCard>

          {/* Friendship Age */}
          <DashboardCard title="FRIENDSHIP_AGE.log" accentColor="#bf5af2">
            <div className="text-center flex flex-col items-center justify-center h-full py-2">
              <p className="mb-2 text-sm sm:text-base" style={{ color: '#94a3b8' }}>{"We've been friends for"}</p>
              <AnimatedCounter target={friendshipDays} />
              <p className="mt-2 text-sm sm:text-base" style={{ color: '#94a3b8' }}>days</p>
            </div>
          </DashboardCard>

          {/* Messages Counter */}
          <DashboardCard title="MESSAGES_EXCHANGED" accentColor="#ff375f">
            <div className="text-center flex flex-col items-center justify-center h-full py-2">
              <AnimatedCounter target={10000} suffix="+" />
              <p className="mt-2 text-sm sm:text-base" style={{ color: '#94a3b8' }}>and counting...</p>
            </div>
          </DashboardCard>

          {/* 4-row Marquee */}
          <DashboardCard title="SHARED_INTERESTS[]" className="md:col-span-2 overflow-hidden" accentColor="#ffd60a">
            <div className="flex flex-col gap-3">
              <MarqueeRow items={row1} duration={28} />
              <MarqueeRow items={row2} duration={38} reverse />
              <MarqueeRow items={row3} duration={22} />
              <MarqueeRow items={row4} duration={32} reverse />
            </div>
          </DashboardCard>

          {/* Rich Compatibility Card */}
          <CompatibilityCard />
        </div>
      </div>
    </section>
  )
}
