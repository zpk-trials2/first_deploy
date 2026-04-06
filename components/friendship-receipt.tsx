"use client"

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const receiptItems = [
  { label: "Late Night Conversations", value: "∞" },
  { label: "Texts Sent & Received", value: "10,000+" },
  { label: "Unsolicited Honest Opinions", value: "∞" },
  { label: "Arguments That Made Us Stronger", value: "7" },
  { label: "Times We Almost Lost Each Other", value: "3" },
  { label: "Times We Found Our Way Back", value: "3" },
  { label: "Roasts Delivered (with love)", value: "847+" },
  { label: "Shared Chaos Sessions", value: "999+" },
  { label: "Moments of Pure Honesty", value: "∞" },
  { label: "Times I Thought of You", value: "∞" },
]

function ReceiptLine({ item, index }: { item: typeof receiptItems[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  // Create dotted line between label and value
  const dots = ".".repeat(30)

  return (
    <motion.div
      ref={ref}
      className="flex justify-between font-mono text-xs sm:text-sm overflow-hidden"
      style={{ color: '#c4b59c' }}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.12 }}
    >
      <span className="shrink-0">{item.label}</span>
      <span className="mx-1 opacity-30 overflow-hidden text-ellipsis">{dots}</span>
      <span className="shrink-0">{item.value}</span>
    </motion.div>
  )
}

function CertifiedStamp() {
  return (
    <motion.svg
      className="absolute w-24 h-24"
      style={{
        top: '60%',
        right: '10%',
        transform: 'rotate(-18deg)',
        opacity: 0.85,
      }}
      viewBox="0 0 100 100"
      initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
      animate={{ opacity: 0.85, scale: 1, rotate: -18 }}
      transition={{ duration: 0.5, type: 'spring', damping: 12 }}
    >
      <defs>
        <filter id="stampGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#ff375f"
        strokeWidth="2"
        filter="url(#stampGlow)"
      />

      {/* Inner circle for text path */}
      <path id="topArc" fill="none" d="M 15 50 A 35 35 0 0 1 85 50" />
      <path id="bottomArc" fill="none" d="M 85 50 A 35 35 0 0 1 15 50" />

      {/* Curved text */}
      <text fill="#ff375f" fontSize="10" fontFamily="monospace" fontWeight="bold">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          CERTIFIED
        </textPath>
      </text>
      <text fill="#ff375f" fontSize="10" fontFamily="monospace" fontWeight="bold">
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          REAL
        </textPath>
      </text>

      {/* Heart in center */}
      <path
        d="M 50 40 C 45 32, 35 32, 35 42 C 35 52, 50 62, 50 62 C 50 62, 65 52, 65 42 C 65 32, 55 32, 50 40"
        fill="#ff375f"
      />
    </motion.svg>
  )
}

export function FriendshipReceipt() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [showStamp, setShowStamp] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowStamp(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 px-4 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #0d0a08 0%, #020408 70%)',
      }}
    >
      <div className="max-w-md mx-auto">
        {/* Section Title */}
        <motion.h2
          className="font-mono text-base sm:text-lg md:text-xl mb-8 flex items-center justify-center gap-2"
          style={{
            color: '#fbbf24',
            textShadow: '0 0 20px rgba(251, 191, 36, 0.4)'
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          {'FRIENDSHIP_RECEIPT.pdf'}
          <span className="animate-pulse">▋</span>
        </motion.h2>

        {/* Receipt Card */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Torn edge top */}
          <div
            className="h-4 w-full"
            style={{
              background: `linear-gradient(135deg, transparent 75%, #0a0806 75%) -10px 0, 
                          linear-gradient(225deg, transparent 75%, #0a0806 75%) -10px 0`,
              backgroundSize: '20px 20px',
              backgroundColor: '#0a0806',
            }}
          />

          {/* Receipt body */}
          <div
            className="px-5 sm:px-8 py-6 font-mono relative"
            style={{ background: '#0a0806' }}
          >
            {/* Header */}
            <div className="text-center mb-6" style={{ color: '#c4b59c' }}>
              <div className="text-xs">════════════════════════════</div>
              <div className="text-sm sm:text-base font-bold my-2">FRIENDSHIP INVOICE</div>
              <div className="text-xs">Est. October 18th</div>
              <div className="text-xs">Customer: Diksha Jangra</div>
              <div className="text-xs">Cashier: Zapking</div>
              <div className="text-xs">════════════════════════════</div>
            </div>

            {/* Line items */}
            <div className="space-y-2 mb-6">
              {receiptItems.map((item, index) => (
                <ReceiptLine key={item.label} item={item} index={index} />
              ))}
            </div>

            {/* Totals */}
            <div className="text-center space-y-1" style={{ color: '#c4b59c' }}>
              <div className="text-xs">════════════════════════════</div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>SUBTOTAL</span>
                <span>Immeasurable</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>TAX</span>
                <span>(waived, for you)</span>
              </div>
              <div className="text-xs">════════════════════════════</div>
              <div className="flex justify-between text-sm sm:text-base font-bold py-2">
                <span>TOTAL VALUE</span>
                <span>PRICELESS</span>
              </div>
              <div className="text-xs">════════════════════════════</div>
            </div>

            {/* Footer message */}
            <div className="mt-6 text-center">
              <p
                className="italic text-sm leading-relaxed"
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  color: '#fbbf24'
                }}
              >
                No returns. No exchanges. Non-transferable.<br />
                This friendship is yours. It always was.
              </p>
            </div>

            {/* Stamp */}
            {showStamp && <CertifiedStamp />}
          </div>

          {/* Torn edge bottom */}
          <div
            className="h-4 w-full"
            style={{
              background: `linear-gradient(315deg, transparent 75%, #0a0806 75%) -10px 0, 
                          linear-gradient(45deg, transparent 75%, #0a0806 75%) -10px 0`,
              backgroundSize: '20px 20px',
              backgroundColor: '#0a0806',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
