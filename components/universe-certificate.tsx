"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function CornerFlourish({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotations = { tl: 0, tr: 90, bl: -90, br: 180 }
  const positions = {
    tl: 'top-3 left-3',
    tr: 'top-3 right-3',
    bl: 'bottom-3 left-3',
    br: 'bottom-3 right-3',
  }

  return (
    <svg
      className={`absolute ${positions[position]} w-6 h-6`}
      style={{ transform: `rotate(${rotations[position]}deg)` }}
      viewBox="0 0 24 24"
    >
      <path
        d="M 2 2 L 2 14 M 2 2 L 14 2"
        fill="none"
        stroke="rgba(255, 214, 10, 0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="2" cy="2" r="2" fill="rgba(255, 214, 10, 0.6)" />
    </svg>
  )
}

function WaxSeal() {
  return (
    <svg className="w-16 h-16" viewBox="0 0 100 100" style={{ transform: 'rotate(-5deg)' }}>
      <defs>
        <filter id="sealGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="rgba(255, 214, 10, 0.15)"
        stroke="#ffd60a"
        strokeWidth="2"
        filter="url(#sealGlow)"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffd60a"
        fontSize="32"
        fontWeight="bold"
        fontFamily="serif"
        fontStyle="italic"
      >
        D
      </text>
    </svg>
  )
}

function Divider() {
  return (
    <svg className="w-48 h-4 mx-auto my-4" viewBox="0 0 200 20">
      <line x1="0" y1="10" x2="85" y2="10" stroke="rgba(255, 214, 10, 0.4)" strokeWidth="1" />
      <path d="M 95 10 L 100 5 L 105 10 L 100 15 Z" fill="rgba(255, 214, 10, 0.6)" />
      <line x1="115" y1="10" x2="200" y2="10" stroke="rgba(255, 214, 10, 0.4)" strokeWidth="1" />
    </svg>
  )
}

export function UniverseCertificate() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 px-4 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #1a150a 0%, #020408 70%)',
      }}
    >
      {/* Warm gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 214, 10, 0.06) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
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
          {'OFFICIAL_DECREE.stellar'}
          <span className="animate-pulse">▋</span>
        </motion.h2>

        {/* Certificate Card */}
        <motion.div
          className="relative rounded-xl p-6 sm:p-10 text-center"
          style={{
            background: 'rgba(10, 8, 5, 0.8)',
            border: '3px double rgba(255, 214, 10, 0.6)',
            backdropFilter: 'blur(16px)',
          }}
          initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          {/* Corner Flourishes */}
          <CornerFlourish position="tl" />
          <CornerFlourish position="tr" />
          <CornerFlourish position="bl" />
          <CornerFlourish position="br" />

          {/* Stars */}
          <div className="flex justify-center gap-3 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: '#ffd60a' }}>✦</span>
            ))}
          </div>

          {/* Header */}
          <h3
            className="text-xl sm:text-2xl md:text-3xl italic mb-2"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              color: '#ffd60a',
              textShadow: '0 0 15px rgba(255, 214, 10, 0.3)'
            }}
          >
            CERTIFICATE OF COSMIC SIGNIFICANCE
          </h3>

          {/* Subheader */}
          <p className="font-mono text-xs mb-4" style={{ color: '#64748b' }}>
            Issued by: The Universe · Department of Extraordinary Humans
          </p>

          <Divider />

          {/* Body Text */}
          <div
            className="space-y-4 text-base sm:text-lg leading-relaxed"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              color: '#f5f0e6'
            }}
          >
            <p>This document hereby declares that</p>

            <p
              className="text-2xl sm:text-3xl md:text-4xl font-semibold py-2"
              style={{
                color: '#ffd60a',
                textShadow: '0 0 20px rgba(255, 214, 10, 0.4)'
              }}
            >
              DIKSHA JANGRA
            </p>

            <p>
              born June 10th, under the constellation of Gemini,<br />
              is officially recognized as a person of<br />
              <span className="italic">extraordinary warmth, devastating wit,</span><br />
              and irreplaceable presence in this universe.
            </p>

            <p className="pt-2">
              She thinks in ways that surprise even the stars.<br />
              She loves with a loyalty that defies all metrics.<br />
              She is, in every measurable and unmeasurable way,<br />
              <span className="font-semibold italic">one of a kind.</span>
            </p>
          </div>

          <Divider />

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 my-6">
            {['The Universe', 'The Stars', 'Zapking'].map((name) => (
              <div key={name} className="flex flex-col items-center">
                <span
                  className="text-sm sm:text-base italic mb-1"
                  style={{
                    fontFamily: 'var(--font-cormorant), cursive',
                    color: '#d4c9b0'
                  }}
                >
                  {name}
                </span>
                <div className="w-16 h-px" style={{ background: 'rgba(255, 214, 10, 0.4)' }} />
              </div>
            ))}
          </div>

          {/* Wax Seal */}
          <div className="flex justify-center my-4" style={{ opacity: 0.85 }}>
            <WaxSeal />
          </div>

          {/* Footer */}
          <p className="font-mono text-xs mt-4" style={{ color: '#64748b' }}>
            Est. October 18 · Serial No. ∞ · Non-transferable
          </p>
        </motion.div>
      </div>
    </section>
  )
}
