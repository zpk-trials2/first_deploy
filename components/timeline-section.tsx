"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

const timelineData = [
  { date: "Oct 18", title: "Day Zero", body: "Signal detected. A new frequency entered my world.", accent: "cyan" as const },
  { date: "Oct 18+", title: "First Real Conversation", body: "We talked like we'd known each other forever. Instant.", accent: "cyan" as const },
  { date: "Late Oct", title: "First Late Night", body: "3am. Still talking. Zero regrets. Zero sleep.", accent: "cyan" as const },
  { date: "Nov", title: "The First Rant", body: "You let me be a complete mess. I never forgot that kindness.", accent: "purple" as const },
  { date: "Dec", title: "Chaos Duo Unlocked", body: "When we're together, things just... happen. Gloriously.", accent: "cyan" as const },
  { date: "Early 2026", title: "Best Friend Status", body: "Officially, permanently, irreversibly unlocked.", accent: "purple" as const },
  { date: "2026", title: "The Fight", body: "We broke. But something about us refused to stay broken.", accent: "rose" as const },
  { date: "Mar 14, 2026", title: "The Silence", body: "The hardest quiet I've ever felt. Still felt you everywhere.", accent: "rose" as const },
  { date: "After", title: "The Realisation", body: "Some people you simply cannot unlove. No matter what.", accent: "rose" as const },
  { date: "Today", title: "This Moment", body: "I built this because words in a text weren't nearly enough.", accent: "gold" as const },
  { date: "Your Birthday", title: "Here We Are", body: "Celebrating the most irreplaceable person I've ever known.", accent: "gold" as const },
  { date: "Always", title: "No Expiry Date", body: "This friendship has no end date. I checked. It's permanent.", accent: "gold" as const },
]

const accentStyles = {
  cyan: {
    border: "rgba(0,212,255,0.3)",
    dot: "#00d4ff",
    glow: "0 0 20px rgba(0,212,255,0.2)",
    text: "#00d4ff",
  },
  purple: {
    border: "rgba(191,90,242,0.3)",
    dot: "#bf5af2",
    glow: "0 0 20px rgba(191,90,242,0.2)",
    text: "#bf5af2",
  },
  rose: {
    border: "rgba(255,55,95,0.4)",
    dot: "#ff375f",
    glow: "0 0 20px rgba(255,55,95,0.25)",
    text: "#ff375f",
  },
  gold: {
    border: "rgba(255,214,10,0.3)",
    dot: "#ffd60a",
    glow: "0 0 20px rgba(255,214,10,0.2)",
    text: "#ffd60a",
  },
}

function TimelineCard({ item, index, isLeft }: { item: typeof timelineData[0]; index: number; isLeft: boolean }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-50px" })
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const styles = accentStyles[item.accent]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`relative w-full md:w-5/12 ${isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
    >
      {/* Connector line to path (desktop) */}
      <div
        className={`hidden md:block absolute top-6 w-8 h-0.5 ${isLeft ? "right-0" : "left-0"}`}
        style={{
          background: `linear-gradient(${isLeft ? "90deg" : "270deg"}, ${styles.dot}, transparent)`,
        }}
      />

      {/* Dot on timeline (desktop) */}
      <motion.div
        className={`hidden md:block absolute top-4 w-4 h-4 rounded-full ${isLeft ? "-right-10" : "-left-10"}`}
        style={{
          background: styles.dot,
          boxShadow: styles.glow,
        }}
        animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
      />

      {/* Card */}
      <motion.div
        className="relative p-5 rounded-xl cursor-pointer overflow-hidden"
        style={{
          background: isExpanded ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${isHovered ? styles.dot : styles.border}`,
          boxShadow: isHovered ? styles.glow : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsExpanded(!isExpanded)}
        animate={{
          y: isHovered ? -6 : 0,
          scale: isExpanded ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Hexagon badge */}
        <motion.span
          className="absolute top-3 right-3 text-xs"
          style={{ color: styles.dot }}
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 3, repeat: isHovered ? Infinity : 0, ease: "linear" }}
        >
          ⬡
        </motion.span>

        {/* Date */}
        <span
          className="text-xs tracking-wider block mb-2"
          style={{ color: styles.text, fontFamily: "monospace" }}
        >
          {item.date}
        </span>

        {/* Title */}
        <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>

        {/* Body */}
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "#a0a0a0",
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontStyle: "italic",
          }}
        >
          {item.body}
        </p>

        {/* Ripple effect on click */}
        {isExpanded && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: `radial-gradient(circle, ${styles.dot} 0%, transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export function TimelineSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #08080c 0%, #0a0a10 100%)",
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2
          className="text-sm tracking-[0.4em] uppercase mb-4"
          style={{ color: "#00d4ff", fontFamily: "monospace" }}
        >
          // timeline.map()
        </h2>
        <h3
          className="text-4xl md:text-5xl font-bold"
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontStyle: "italic",
            color: "#fff",
          }}
        >
          Our Story
        </h3>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        {/* Desktop: SVG winding path */}
        <svg
          className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-full hidden md:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ filter: "drop-shadow(0 0 8px rgba(0,212,255,0.3))" }}
        >
          <path
            d="M 50 2 C 75 5, 75 12, 50 16 S 25 24, 50 30 S 75 38, 50 44 S 25 52, 50 58 S 75 66, 50 72 S 25 80, 50 86 S 75 94, 50 98"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="0.3"
            strokeDasharray="2 1.5"
            opacity="0.4"
          />
        </svg>

        {/* Mobile: Vertical line */}
        <div
          className="absolute left-4 top-0 w-0.5 h-full md:hidden"
          style={{
            background: "linear-gradient(180deg, #00d4ff 0%, #bf5af2 50%, #ffd60a 100%)",
            opacity: 0.3,
          }}
        />

        {/* Timeline cards */}
        <div className="relative space-y-8 md:space-y-12">
          {timelineData.map((item, index) => (
            <TimelineCard
              key={index}
              item={item}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
