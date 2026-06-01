"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GrimReaper404Props {
  onRetry: () => void
}

export function GrimReaper404({ onRetry }: GrimReaper404Props) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <AnimatePresence>
      <motion.div
        key="grim-404"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, #1a0000 0%, #0d0000 50%, #000000 100%)',
        }}
      >
        {/* Ambient Red Glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,0,0,0.08), transparent 70%)',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-6 py-8 max-w-6xl mx-auto">
          {/* LEFT: 3D Model (Sketchfab Grim Reaper) */}
          <motion.div
            className="w-full md:w-1/2 h-[400px] md:h-[500px] rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '2px solid rgba(255,0,0,0.3)',
              boxShadow: '0 0 40px rgba(255,0,0,0.2), inset 0 0 30px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <iframe
                title="Run&Raid - Abyss - Grim Reaper Skin"
                frameBorder="0"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'rgba(0,0,0,0.8)',
                }}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src="https://sketchfab.com/models/6485c34d9f6347dbb397a4719ff1504c/embed?autospin=1&autostart=1&preload=1&ui_theme=dark"
              />
            </div>
          </motion.div>
          {/* RIGHT: Text Content */}
          <div className="relative z-10 max-w-lg text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                fontWeight: 900,
                fontFamily: 'monospace',
                color: '#ff0000',
                textShadow: '0 0 20px rgba(255,0,0,0.5)',
                letterSpacing: '0.2em',
              }}
            >
              403 — ACCESS DENIED
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 font-mono text-sm leading-relaxed"
              style={{ color: 'rgba(255,0,0,0.7)' }}
            >
              <div className="mb-4 p-4 rounded" style={{ background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,0,0,0.2)' }}>
                <div style={{ color: '#ff0000', marginBottom: '0.5rem' }}>🚫 UNAUTHORIZED ACCESS ATTEMPT</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Your bypass code was invalid. The system has logged this attempt.
                </div>
              </div>
            </motion.div>

            {/* Details Toggle */}
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-6 font-mono text-xs px-4 py-2 border rounded hover:bg-black/30 transition-all"
              style={{
                color: '#ff0000',
                borderColor: 'rgba(255,0,0,0.3)',
                border: '1px solid',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showDetails ? '▼ HIDE DETAILS' : '▶ SHOW DETAILS'}
            </motion.button>

            {/* Expandable Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 rounded text-xs font-mono"
                  style={{
                    background: 'rgba(255,0,0,0.05)',
                    border: '1px solid rgba(255,0,0,0.2)',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: '1.6',
                  }}
                >
                  <div>ERROR_CODE: 403-FORBIDDEN</div>
                  <div>TIMESTAMP: {new Date().toISOString()}</div>
                  <div>REASON: Invalid bypass sequence</div>
                  <div className="mt-2" style={{ color: 'rgba(255,0,0,0.5)' }}>
                    // This gate requires a valid word to proceed.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Retry Button */}
            <motion.button
              onClick={onRetry}
              className="mt-8 font-mono text-sm tracking-wide px-8 py-3 border rounded hover:bg-red-900/20 transition-all"
              style={{
                color: '#ff3333',
                borderColor: '#ff3333',
                border: '2px solid',
                boxShadow: '0 0 20px rgba(255,0,0,0.2)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{
                boxShadow: '0 0 30px rgba(255,0,0,0.4)',
                background: 'rgba(255,0,0,0.05)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              ⟲ TRY AGAIN
            </motion.button>

            {/* Status Indicator */}
            <motion.div
              className="mt-6 text-xs"
              style={{ color: 'rgba(255,255,255,0.2)' }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔴 SYSTEM LOCKED
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
