"use client"

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const stars = [
  { x: 20, y: 20, name: "Loyalty", desc: "The brightest fixed star. Never wavers.", color: "#ffd60a" },
  { x: 45, y: 12, name: "Humor", desc: "Makes the whole sky laugh.", color: "#00d4ff" },
  { x: 70, y: 18, name: "Intelligence", desc: "Burns hotter than most.", color: "#bf5af2" },
  { x: 80, y: 40, name: "Sarcasm", desc: "A necessary constellation.", color: "#00d4ff" },
  { x: 65, y: 60, name: "Empathy", desc: "Feels everything. Carries it anyway.", color: "#bf5af2" },
  { x: 50, y: 72, name: "Chaos", desc: "Her natural habitat. Thrives here.", color: "#00d4ff" },
  { x: 30, y: 65, name: "Music", desc: "Hears things others miss.", color: "#bf5af2" },
  { x: 15, y: 50, name: "Depth", desc: "Goes deeper than anyone expects.", color: "#00d4ff" },
  { x: 35, y: 38, name: "Creativity", desc: "Sees different in everything.", color: "#bf5af2" },
  { x: 58, y: 42, name: "Realness", desc: "Never pretends. Ever.", color: "#00d4ff" },
  { x: 25, y: 82, name: "Dreams", desc: "Aiming further than the sky.", color: "#bf5af2" },
  { x: 72, y: 78, name: "Us", desc: "The most important star of all.", color: "#ffd60a" },
]

// Connect stars to form constellation pattern
const connections = [
  [0, 7], [7, 8], [8, 1], [1, 2], [2, 3],
  [3, 9], [9, 4], [4, 5], [5, 6], [6, 7],
  [5, 10], [4, 11], [8, 9]
]

function Star({ 
  star, 
  index, 
  isHovered, 
  hoveredIndex,
  onHover 
}: { 
  star: typeof stars[0]
  index: number
  isHovered: boolean
  hoveredIndex: number | null
  onHover: (index: number | null) => void 
}) {
  const isDimmed = hoveredIndex !== null && !isHovered

  return (
    <g>
      {/* Glow effect */}
      <circle
        cx={`${star.x}%`}
        cy={`${star.y}%`}
        r={isHovered ? 16 : 10}
        fill={star.color}
        opacity={isHovered ? 0.3 : 0.15}
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Star core */}
      <motion.circle
        cx={`${star.x}%`}
        cy={`${star.y}%`}
        r={6}
        fill={star.color}
        opacity={isDimmed ? 0.3 : 1}
        style={{ 
          cursor: 'pointer',
          filter: `drop-shadow(0 0 8px ${star.color})`,
        }}
        animate={isHovered ? { scale: [1, 2, 1.4] } : { scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 200 }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onHover(isHovered ? null : index)}
      />
    </g>
  )
}

function Tooltip({ star, isMobile }: { star: typeof stars[0]; isMobile: boolean }) {
  return (
    <motion.div
      className="absolute z-50 px-4 py-3 rounded-xl max-w-[200px]"
      style={{
        left: `${star.x}%`,
        top: isMobile ? `${star.y + 8}%` : `${star.y - 12}%`,
        transform: 'translateX(-50%)',
        background: 'rgba(10, 10, 20, 0.95)',
        border: `1px solid ${star.color}50`,
        backdropFilter: 'blur(16px)',
        boxShadow: `0 0 20px ${star.color}30`,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <p className="font-semibold text-sm mb-1" style={{ color: star.color }}>{star.name}</p>
      <p className="text-xs" style={{ color: '#94a3b8' }}>{star.desc}</p>
    </motion.div>
  )
}

export function ConstellationMap() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [backgroundStars, setBackgroundStars] = useState<Array<{ x: number; y: number; opacity: number }>>([])

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    // Generate random background stars
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.1 + Math.random() * 0.3,
    }))
    setBackgroundStars(stars)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 sm:py-20 px-4 overflow-hidden"
      style={{
        background: '#04060f',
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.h2
          className="font-mono text-base sm:text-lg md:text-xl mb-8 flex items-center justify-center gap-2"
          style={{ 
            color: '#bf5af2',
            textShadow: '0 0 20px rgba(191, 90, 242, 0.4)'
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          {'DIKSHA.constellation'}
          <motion.span 
            className="text-xs"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✦
          </motion.span>
        </motion.h2>

        {/* Star Map Container */}
        <motion.div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            height: isMobile ? '400px' : '500px',
            background: '#04060f',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Background stars */}
          <svg className="absolute inset-0 w-full h-full">
            {backgroundStars.map((star, i) => (
              <circle
                key={i}
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={1}
                fill="white"
                opacity={star.opacity}
              />
            ))}

            {/* Constellation lines */}
            {connections.map(([from, to], i) => (
              <motion.line
                key={i}
                x1={`${stars[from].x}%`}
                y1={`${stars[from].y}%`}
                x2={`${stars[to].x}%`}
                y2={`${stars[to].y}%`}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.2 } : {}}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            ))}

            {/* Stars */}
            {stars.map((star, index) => (
              <Star
                key={star.name}
                star={star}
                index={index}
                isHovered={hoveredIndex === index}
                hoveredIndex={hoveredIndex}
                onHover={setHoveredIndex}
              />
            ))}
          </svg>

          {/* Tooltips */}
          <AnimatePresence>
            {hoveredIndex !== null && (
              <Tooltip star={stars[hoveredIndex]} isMobile={isMobile} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center mt-8 italic"
          style={{ 
            fontFamily: 'var(--font-cormorant), serif',
            color: '#64748b',
            fontSize: '1rem',
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Every star here exists because of who you are.
        </motion.p>
      </div>
    </section>
  )
}
