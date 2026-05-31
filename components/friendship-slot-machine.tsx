'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface Reel {
  symbols: string[]
  currentValue: string
  isBlurred: boolean
}

const REEL_1_SYMBOLS = ['🪖', '💣', '⚡', '🎯', 'DKS', '🔥', 'CHAOS']
const REEL_2_SYMBOLS = ['❤️', '🪖', 'LOCKED', '💥', '🎯', 'DKS', '⚡']
const REEL_3_SYMBOLS = ['🪖', 'CHAOS', '💣', 'DKS', '🔥', '🎯', '❤️']

// Jackpot logic: appears on 3rd spin, then every 5th/6th/9th after
const getJackpotSpins = (): number[] => {
  const spins = [3]
  let current = 3
  for (let i = 0; i < 20; i++) {
    const pattern = [5, 6, 9]
    current += pattern[i % 3]
    spins.push(current)
  }
  return spins
}

export function FriendshipSlotMachine() {
  const [isSlotOpen, setIsSlotOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [reelValues, setReelValues] = useState(['🪖', '❤️', '🪖'])
  const [jackpotTriggered, setJackpotTriggered] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [reelBlurs, setReelBlurs] = useState([false, false, false])
  const [leverRotate, setLeverRotate] = useState(0)
  const [displayParallax, setDisplayParallax] = useState(0)
  
  const jackpotSpins = useRef(getJackpotSpins())
  const animFrameRefs = useRef<NodeJS.Timeout[]>([])
  const cyclingRefs = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    return () => {
      animFrameRefs.current.forEach(t => clearTimeout(t))
      cyclingRefs.current.forEach(t => clearTimeout(t))
    }
  }, [])

  const handleCloseOverlay = () => {
    animFrameRefs.current.forEach(t => clearTimeout(t))
    cyclingRefs.current.forEach(t => clearTimeout(t))
    setIsSlotOpen(false)
    setIsSpinning(false)
    setJackpotTriggered(false)
    setShowFlash(false)
    setReelBlurs([false, false, false])
    setLeverRotate(0)
    setDisplayParallax(0)
  }

  const triggerJackpot = () => {
    setShowFlash(true)
    animFrameRefs.current.push(
      setTimeout(() => setShowFlash(false), 500)
    )

    animFrameRefs.current.push(
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).confetti) {
          (window as any).confetti({
            particleCount: 120,
            spread: 90,
            origin: { x: 0.5, y: 0.6 },
            colors: ['#ffd60a', '#ff9f0a', '#ff375f', '#00d4ff'],
          })
        }
      }, 600)
    )

    animFrameRefs.current.push(
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).confetti) {
          (window as any).confetti({
            particleCount: 80,
            spread: 120,
            origin: { x: 0.2, y: 0.5 },
            colors: ['#ffd60a', '#ffffff'],
          })
        }
      }, 900)
    )

    animFrameRefs.current.push(
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).confetti) {
          (window as any).confetti({
            particleCount: 80,
            spread: 120,
            origin: { x: 0.8, y: 0.5 },
            colors: ['#ffd60a', '#ffffff'],
          })
        }
      }, 1200)
    )

    animFrameRefs.current.push(
      setTimeout(() => {
        setJackpotTriggered(true)
      }, 1500)
    )
  }

  const spinReels = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setReelBlurs([true, true, true])
    const newSpinCount = spinCount + 1
    setSpinCount(newSpinCount)

    // Lever animation: pull down then back up
    setLeverRotate(-45)
    animFrameRefs.current.push(
      setTimeout(() => {
        setLeverRotate(0)
      }, 600)
    )

    // Parallax display movement during spin
    animFrameRefs.current.push(
      setTimeout(() => {
        setDisplayParallax(-8)
      }, 50)
    )

    // Reel 1 cycles for 800ms
    let reel1Index = 0
    cyclingRefs.current.push(
      setInterval(() => {
        reel1Index = (reel1Index + 1) % REEL_1_SYMBOLS.length
        setReelValues(prev => [REEL_1_SYMBOLS[reel1Index], prev[1], prev[2]])
      }, 80)
    )

    // Reel 2 cycles for 1300ms
    let reel2Index = 0
    cyclingRefs.current.push(
      setInterval(() => {
        reel2Index = (reel2Index + 1) % REEL_2_SYMBOLS.length
        setReelValues(prev => [prev[0], REEL_2_SYMBOLS[reel2Index], prev[2]])
      }, 80)
    )

    // Reel 3 cycles for 1800ms
    let reel3Index = 0
    cyclingRefs.current.push(
      setInterval(() => {
        reel3Index = (reel3Index + 1) % REEL_3_SYMBOLS.length
        setReelValues(prev => [prev[0], prev[1], REEL_3_SYMBOLS[reel3Index]])
      }, 80)
    )

    // Stop reel 1 at 800ms
    animFrameRefs.current.push(
      setTimeout(() => {
        const finalIndex1 = Math.floor(Math.random() * REEL_1_SYMBOLS.length)
        setReelValues(prev => [REEL_1_SYMBOLS[finalIndex1], prev[1], prev[2]])
        setReelBlurs(prev => [false, prev[1], prev[2]])
        if (cyclingRefs.current.length > 0) {
          clearInterval(cyclingRefs.current[0])
          cyclingRefs.current.shift()
        }
      }, 800)
    )

    // Stop reel 2 at 1300ms
    animFrameRefs.current.push(
      setTimeout(() => {
        const finalIndex2 = Math.floor(Math.random() * REEL_2_SYMBOLS.length)
        setReelValues(prev => [prev[0], REEL_2_SYMBOLS[finalIndex2], prev[2]])
        setReelBlurs(prev => [prev[0], false, prev[2]])
        if (cyclingRefs.current.length > 0) {
          clearInterval(cyclingRefs.current[0])
          cyclingRefs.current.shift()
        }
      }, 1300)
    )

    // Stop reel 3 at 1800ms
    animFrameRefs.current.push(
      setTimeout(() => {
        const finalIndex3 = Math.floor(Math.random() * REEL_3_SYMBOLS.length)
        setReelValues(prev => [prev[0], prev[1], REEL_3_SYMBOLS[finalIndex3]])
        setReelBlurs(prev => [prev[0], prev[1], false])
        if (cyclingRefs.current.length > 0) {
          clearInterval(cyclingRefs.current[0])
          cyclingRefs.current.shift()
        }
        // Return display to normal position
        setDisplayParallax(0)
      }, 1800)
    )

    // Check for jackpot after 2200ms
    animFrameRefs.current.push(
      setTimeout(() => {
        setIsSpinning(false)
        if (jackpotSpins.current.includes(newSpinCount)) {
          triggerJackpot()
        }
      }, 2200)
    )
  }

  const handleCollectWinnings = () => {
    setJackpotTriggered(false)
    setSpinCount(0)
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsSlotOpen(true)}
        className="fixed bottom-6 right-24 z-40 rounded-full px-4 py-2 text-sm font-medium text-black cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #ffd60a, #ff9f0a)',
          boxShadow: '0 0 25px rgba(255,214,10,0.5), 0 4px 15px rgba(0,0,0,0.3)',
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, type: 'spring' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🎰 Slot Machine
      </motion.button>

      {/* Full Screen Overlay */}
      <AnimatePresence>
        {isSlotOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-auto"
            style={{ cursor: 'auto' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Military background with camo pattern */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background: `
                  repeating-linear-gradient(
                    45deg,
                    #1a2410,
                    #1a2410 10px,
                    #0d1a06 10px,
                    #0d1a06 20px
                  ),
                  repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 10px,
                    rgba(0, 0, 0, 0.2) 10px,
                    rgba(0, 0, 0, 0.2) 20px
                  ),
                  radial-gradient(ellipse 150px 100px at 30% 20%, #2d3a1a, transparent),
                  radial-gradient(ellipse 120px 140px at 70% 60%, #0f1a08, transparent)
                `,
                backgroundSize: '100% 100%, 100% 100%, 200% 200%, 200% 200%',
              }}
            />

            {/* Semi-transparent overlay for depth */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* Close button */}
            <button
              onClick={handleCloseOverlay}
              className="absolute top-4 right-4 z-50 font-mono text-xl text-[#ffd60a] hover:opacity-70 transition cursor-pointer"
              style={{ textShadow: '0 0 10px #ffd60a' }}
            >
              ✕
            </button>

            {/* Flash effect */}
            {showFlash && (
              <motion.div
                className="absolute inset-0 bg-white z-40 pointer-events-none"
                animate={{
                  opacity: [0, 1, 0, 1, 0, 1, 0],
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 1],
                }}
              />
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-4">
              {/* Header */}
              <div className="text-center">
                <div className="font-mono text-xs tracking-widest text-[#6b7c3f]">
                  🎖️ OPERATION: JACKPOT // CLASSIFIED CASINO 🎖️
                </div>
                <div
                  className="h-px w-80 mx-auto mt-3"
                  style={{ backgroundColor: 'rgba(255,214,10,0.3)' }}
                />
              </div>

              {/* Spin counter */}
              <div className="font-mono text-xs text-white/30">
                SPINS: {spinCount}
              </div>

              {/* 3D Slot Machine */}
              <motion.div
                className="relative max-w-[420px] w-full"
                style={{
                  perspective: '1200px',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-15deg) rotateX(5deg) rotateZ(2deg)',
                }}
              >
                {/* 3D Outer Frame */}
                <div
                  className="relative"
                  style={{
                    background: `
                      linear-gradient(
                        180deg,
                        #3d4a2a 0%,
                        #2d3a1a 25%,
                        #1c2b0e 75%,
                        #0a1505 100%
                      )
                    `,
                    border: '12px solid',
                    borderColor: '#5a6a3a',
                    borderRadius: '24px',
                    boxShadow: `
                      0 30px 80px rgba(0, 0, 0, 0.95),
                      inset 0 1px 0 rgba(255,255,255,0.15),
                      inset 0 -2px 8px rgba(0, 0, 0, 0.8),
                      inset -8px 0 30px rgba(0, 0, 0, 0.5),
                      inset 8px 0 30px rgba(0, 0, 0, 0.3),
                      0 0 50px rgba(255, 214, 10, 0.15),
                      0 0 100px rgba(0, 0, 0, 0.6)
                    `,
                    padding: '36px 32px',
                    position: 'relative',
                  }}
                >
                  {/* Brushed metal top bezel with realistic lighting */}
                  <div
                    className="absolute top-0 left-0 right-0 h-10"
                    style={{
                      background: `
                        linear-gradient(
                          180deg,
                          #6a7a4a 0%,
                          #5a6a3a 40%,
                          #4a5a2a 100%
                        )
                      `,
                      borderRadius: '22px 22px 0 0',
                      boxShadow: `
                        inset 0 1px 2px rgba(255,255,255,0.2),
                        inset 0 -1px 3px rgba(0,0,0,0.6),
                        0 4px 12px rgba(0,0,0,0.5),
                        repeating-linear-gradient(
                          90deg,
                          transparent,
                          transparent 2px,
                          rgba(0,0,0,0.1) 2px,
                          rgba(0,0,0,0.1) 4px
                        )
                      `,
                    }}
                  />

                  {/* Machine label with enhanced glow */}
                  <div
                    className="font-mono text-xs text-center tracking-widest mb-6"
                    style={{
                      color: '#ffd60a',
                      textShadow: '0 0 20px #ffd60a, 0 0 40px rgba(255,214,10,0.4), 0 2px 4px rgba(0,0,0,0.8)',
                      letterSpacing: '0.2em',
                      fontWeight: 'bold',
                    }}
                  >
                    ◈ FRIENDSHIP PROTOCOL ◈
                  </div>

                  {/* 3D Display Housing with recessed appearance */}
                  <motion.div
                    className="relative rounded-xl overflow-hidden mb-6"
                    style={{
                      background: `
                        linear-gradient(
                          135deg,
                          #0f1a08 0%,
                          #050a03 100%
                        )
                      `,
                      border: '4px solid #ffd60a',
                      boxShadow: `
                        inset 0 0 60px rgba(0, 0, 0, 1),
                        inset 0 8px 30px rgba(0, 0, 0, 0.95),
                        inset 0 -8px 30px rgba(0, 0, 0, 0.8),
                        inset -6px 0 20px rgba(0, 0, 0, 0.7),
                        inset 6px 0 20px rgba(0, 0, 0, 0.7),
                        0 0 40px rgba(255, 214, 10, 0.25),
                        0 12px 50px rgba(0, 0, 0, 0.6),
                        0 1px 0 rgba(255,255,255,0.08) inset
                      `,
                      padding: '6px',
                    }}
                    animate={{
                      y: displayParallax,
                      rotateX: displayParallax * 2,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {/* Reels window with glass-like appearance */}
                    <div
                      className="bg-black rounded-lg p-5 flex gap-4 justify-center"
                      style={{
                        background: `
                          linear-gradient(
                            180deg,
                            #030606 0%,
                            #000000 50%,
                            #050805 100%
                          )
                        `,
                        boxShadow: `
                          inset 0 0 40px rgba(0,0,0,1),
                          inset 0 1px 2px rgba(255,255,255,0.05),
                          inset 0 2px 8px rgba(0,0,0,0.9)
                        `,
                      }}
                    >
                      {/* Reel 1 - Realistic 3D reel */}
                      <motion.div
                        className="w-24 h-24 rounded-lg border-2 flex items-center justify-center text-3xl font-bold"
                        style={{
                          background: `
                            linear-gradient(
                              135deg,
                              #0a1006 0%,
                              #050803 50%,
                              #030505 100%
                            )
                          `,
                          borderColor: '#ffd60a',
                          textShadow: '0 0 16px rgba(255,214,10,0.8), 0 0 32px rgba(255,214,10,0.3), 0 2px 5px rgba(0,0,0,0.9)',
                          boxShadow: `
                            inset 0 0 25px rgba(0,0,0,1),
                            inset 0 2px 8px rgba(0,0,0,0.95),
                            inset -3px -3px 15px rgba(0,0,0,0.9),
                            inset 3px 3px 15px rgba(255,214,10,0.08),
                            0 0 20px rgba(255, 214, 10, 0.2),
                            0 8px 20px rgba(0, 0, 0, 0.5)
                          `,
                        }}
                        animate={{
                          rotateY: isSpinning ? 360 : 0,
                          filter: reelBlurs[0] ? 'blur(2px)' : 'blur(0)',
                        }}
                        transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
                      >
                        {reelValues[0]}
                      </motion.div>

                      {/* Reel 2 - Realistic 3D reel */}
                      <motion.div
                        className="w-24 h-24 rounded-lg border-2 flex items-center justify-center text-3xl font-bold"
                        style={{
                          background: `
                            linear-gradient(
                              135deg,
                              #0a1006 0%,
                              #050803 50%,
                              #030505 100%
                            )
                          `,
                          borderColor: '#ffd60a',
                          textShadow: '0 0 16px rgba(255,214,10,0.8), 0 0 32px rgba(255,214,10,0.3), 0 2px 5px rgba(0,0,0,0.9)',
                          boxShadow: `
                            inset 0 0 25px rgba(0,0,0,1),
                            inset 0 2px 8px rgba(0,0,0,0.95),
                            inset -3px -3px 15px rgba(0,0,0,0.9),
                            inset 3px 3px 15px rgba(255,214,10,0.08),
                            0 0 20px rgba(255, 214, 10, 0.2),
                            0 8px 20px rgba(0, 0, 0, 0.5)
                          `,
                        }}
                        animate={{
                          rotateY: isSpinning ? 360 : 0,
                          filter: reelBlurs[1] ? 'blur(2px)' : 'blur(0)',
                        }}
                        transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
                      >
                        {reelValues[1]}
                      </motion.div>

                      {/* Reel 3 - Realistic 3D reel */}
                      <motion.div
                        className="w-24 h-24 rounded-lg border-2 flex items-center justify-center text-3xl font-bold"
                        style={{
                          background: `
                            linear-gradient(
                              135deg,
                              #0a1006 0%,
                              #050803 50%,
                              #030505 100%
                            )
                          `,
                          borderColor: '#ffd60a',
                          textShadow: '0 0 16px rgba(255,214,10,0.8), 0 0 32px rgba(255,214,10,0.3), 0 2px 5px rgba(0,0,0,0.9)',
                          boxShadow: `
                            inset 0 0 25px rgba(0,0,0,1),
                            inset 0 2px 8px rgba(0,0,0,0.95),
                            inset -3px -3px 15px rgba(0,0,0,0.9),
                            inset 3px 3px 15px rgba(255,214,10,0.08),
                            0 0 20px rgba(255, 214, 10, 0.2),
                            0 8px 20px rgba(0, 0, 0, 0.5)
                          `,
                        }}
                        animate={{
                          rotateY: isSpinning ? 360 : 0,
                          filter: reelBlurs[2] ? 'blur(2px)' : 'blur(0)',
                        }}
                        transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
                      >
                        {reelValues[2]}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Scanline */}
                  <motion.div
                    className="h-0.5 bg-gradient-to-r from-transparent via-[rgba(255,214,10,0.3)] to-transparent mb-4"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  {/* Result line */}
                  {!isSpinning && !jackpotTriggered && (
                    <div className="font-mono text-xs text-center text-white/40 mb-6">
                      // PULL LEVER TO SPIN
                    </div>
                  )}
                  {isSpinning && (
                    <div className="font-mono text-xs text-center text-white/40 mb-6">
                      // SPINNING...
                    </div>
                  )}

                  {/* 3D Lever with Animation */}
                  <motion.button
                    onClick={spinReels}
                    disabled={isSpinning}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <motion.div
                      className="flex flex-col items-center gap-0"
                      animate={{ rotate: leverRotate }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                      style={{
                        transformOrigin: 'bottom center',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Ball */}
                      <motion.div
                        className="w-7 h-7 rounded-full"
                        style={{
                          background: `
                            radial-gradient(circle at 30% 30%, #ff7a7a, #ff3838, #8b0000)
                          `,
                          boxShadow: `
                            0 0 18px rgba(255,100,100,0.9),
                            inset -3px -3px 8px rgba(0,0,0,0.6),
                            inset 2px 2px 8px rgba(255,180,180,0.4),
                            0 6px 16px rgba(0,0,0,0.5),
                            0 1px 0 rgba(255,255,255,0.15) inset
                          `,
                        }}
                      />
                      {/* Shaft */}
                      <div
                        className="w-2.5 h-24"
                        style={{
                          background: `
                            linear-gradient(90deg, #3a4a1a 0%, #5a7a3a 45%, #4a5a2a 55%, #2a3a0a 100%)
                          `,
                          borderRadius: '2px',
                          boxShadow: `
                            0 6px 16px rgba(0,0,0,0.7),
                            inset -1px 0 3px rgba(0,0,0,0.6),
                            inset 1px 0 3px rgba(255,255,255,0.12),
                            0 1px 2px rgba(255,255,255,0.08) inset
                          `,
                        }}
                      />
                      {/* Base */}
                      <div
                        className="w-8 h-5 rounded-full border-2"
                        style={{
                          background: `
                            linear-gradient(180deg, #4a5a2a 0%, #2a3a0a 100%)
                          `,
                          borderColor: 'rgba(255,214,10,0.5)',
                          boxShadow: `
                            0 5px 12px rgba(0,0,0,0.6),
                            inset 0 2px 5px rgba(0,0,0,0.7),
                            inset 0 -2px 3px rgba(255,255,255,0.1)
                          `,
                        }}
                      />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Jackpot Popup */}
              <AnimatePresence>
                {jackpotTriggered && (
                  <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 cursor-auto"
                    style={{ cursor: 'auto' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Shockwave */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r="0"
                        stroke="#ffd60a"
                        strokeWidth="3"
                        fill="none"
                        animate={{ r: '200vw' }}
                        transition={{ duration: 1 }}
                        style={{ opacity: 1 }}
                      />
                    </svg>

                    {/* Jackpot text */}
                    <motion.div
                      className="text-center mb-12 relative z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
                    >
                      <div
                        className="font-mono font-bold text-6xl"
                        style={{
                          color: '#ffd60a',
                          textShadow:
                            '0 0 20px #ffd60a, 0 0 60px rgba(255,214,10,0.6)',
                        }}
                      >
                        ☢️ JACKPOT ☢️
                      </div>

                      <motion.div
                        className="font-mono text-sm tracking-widest mt-4 text-[#ff375f]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        ATOMIC DETONATION DETECTED
                      </motion.div>
                    </motion.div>

                    {/* Popup card */}
                    <motion.div
                      className="bg-gradient-to-b from-[#0d1a06] to-[#1a0612] border-2 border-[#ffd60a] rounded-lg p-8 max-w-[380px] text-center relative z-10"
                      style={{
                        boxShadow:
                          '0 0 60px rgba(255,214,10,0.4), 0 0 120px rgba(255,214,10,0.15)',
                      }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
                    >
                      <div className="text-4xl mb-4">☢️</div>

                      <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#ffd60a] to-transparent mx-auto mb-4" />

                      <div className="font-mono text-xs tracking-widest text-[#6b7c3f] mb-3">
                        MISSION ACCOMPLISHED
                      </div>

                      <div
                        className="text-3xl font-bold italic mb-4"
                        style={{
                          color: '#ffd60a',
                          textShadow: '0 0 20px #ffd60a',
                          fontFamily: 'Georgia, serif',
                        }}
                      >
                        You Hit The Jackpot
                      </div>

                      <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#ffd60a] to-transparent mx-auto mb-4" />

                      <div
                        className="text-base italic leading-relaxed mb-4"
                        style={{
                          fontFamily: 'Georgia, serif',
                          color: 'rgba(255,255,255,0.85)',
                        }}
                      >
                        Out of every possible combination,
                        <br />
                        out of every spin in this universe —
                        <br />
                        the reels landed on you.
                        <br />
                        <br />
                        They always do.
                        <br />
                        <br />
                        Happy Birthday, Dks. 🪖
                      </div>

                      <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#ffd60a] to-transparent mx-auto mb-4" />

                      <div className="font-mono text-xs text-[rgba(255,214,10,0.4)] tracking-widest">
                        // CLASSIFIED: MOST IMPORTANT PERSON DETECTED
                      </div>
                    </motion.div>

                    {/* Close button */}
                    <motion.button
                      onClick={handleCollectWinnings}
                      className="mt-8 relative z-10 font-mono text-sm px-6 py-2.5 border border-[rgba(255,214,10,0.4)] rounded text-[#ffd60a] hover:bg-[rgba(255,214,10,0.1)] transition cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      [ COLLECT WINNINGS ]
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
