'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const REEL_1_SYMBOLS = ['🪖', '💣', '⚡', '🎯', 'DKS', '🔥', 'CHAOS']
const REEL_2_SYMBOLS = ['❤️', '🪖', 'LOCKED', '💥', '🎯', 'DKS', '⚡']
const REEL_3_SYMBOLS = ['🪖', 'CHAOS', '💣', 'DKS', '🔥', '🎯', '❤️']

// Three possible jackpot emoji combinations - guaranteed on 3rd spin
const JACKPOT_COMBOS = [
  ['😎', 'DKS', '😎'],
  ['🙈', 'DKS', '🙈'],
  ['🤣', 'DKS', '🤣'],
]
let lastJackpotCombo = 0

const getJackpotSpins = (): number[] => [3]

function getRandomJackpotCombo(): [string, string, string] {
  const combo = JACKPOT_COMBOS[lastJackpotCombo % JACKPOT_COMBOS.length]
  lastJackpotCombo++
  return combo as [string, string, string]
}

interface FriendshipSlotMachineProps {
  isOpen: boolean
  onClose: () => void
}

export function FriendshipSlotMachine({ isOpen, onClose }: FriendshipSlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [reelValues, setReelValues] = useState<[string, string, string]>(['🎰', '💫', '🎰'])
  const [jackpotTriggered, setJackpotTriggered] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [reelBlurs, setReelBlurs] = useState<[boolean, boolean, boolean]>([false, false, false])
  const [leverPhase, setLeverPhase] = useState<'idle' | 'pulled' | 'returning'>('idle')
  const [coinInserted, setCoinInserted] = useState(false)

  const gsapRef = useRef<any>(null)
  const leverRef = useRef<HTMLDivElement>(null)
  const leverKnobRef = useRef<HTMLDivElement>(null)
  const leverShaftRef = useRef<HTMLDivElement>(null)
  const leverBaseRef = useRef<HTMLDivElement>(null)
  const reel1Ref = useRef<HTMLDivElement>(null)
  const reel2Ref = useRef<HTMLDivElement>(null)
  const reel3Ref = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const jackpotSpins = useRef(getJackpotSpins())
  const timeouts = useRef<NodeJS.Timeout[]>([])
  const intervals = useRef<NodeJS.Timeout[]>([])

  // GSAP Initialization
  useEffect(() => {
    (async () => {
      if (typeof window === 'undefined') return
      const { gsap } = await import('gsap')
      gsapRef.current = gsap
    })()

    return () => {
      timeouts.current.forEach(clearTimeout)
      intervals.current.forEach(clearInterval)
    }
  }, [])

  // Web Audio Sounds
  const playLeverClick = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(180, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08)
      gain.gain.setValueAtTime(0.4, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch {}
  }, [])

  const playReelStop = useCallback((reelIndex: number) => {
    const pitches = [220, 196, 174]
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(pitches[reelIndex], ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(pitches[reelIndex] * 0.7, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    } catch {}
  }, [])

  const playJackpotAlarm = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'square'
        osc.frequency.value = i % 2 === 0 ? 880 : 660
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.1)
        osc.start(ctx.currentTime + i * 0.12)
        osc.stop(ctx.currentTime + i * 0.12 + 0.1)
      }
    } catch {}
  }, [])

  const animateLever = useCallback(() => {
    const gsap = gsapRef.current
    if (!gsap || !leverRef.current) return

    gsap.timeline()
      .to(leverRef.current, {
        rotation: 38,
        transformOrigin: '50% 100%',
        duration: 0.18,
        ease: 'power2.in',
        onStart: () => {
          playLeverClick()
          setLeverPhase('pulled')
        },
      })
      .to(leverRef.current, {
        rotation: 45,
        duration: 0.08,
        ease: 'power1.out',
      })
      .to(leverRef.current, {
        rotation: -8,
        duration: 0.35,
        ease: 'power3.out',
        onStart: () => setLeverPhase('returning'),
      })
      .to(leverRef.current, {
        rotation: 4,
        duration: 0.15,
        ease: 'power2.inOut',
      })
      .to(leverRef.current, {
        rotation: -2,
        duration: 0.1,
        ease: 'power2.inOut',
      })
      .to(leverRef.current, {
        rotation: 0,
        duration: 0.1,
        ease: 'power2.out',
        onComplete: () => setLeverPhase('idle'),
      })

    if (leverKnobRef.current) {
      gsap.to(leverKnobRef.current, {
        scaleY: 0.85,
        scaleX: 1.15,
        duration: 0.18,
        ease: 'power2.in',
        yoyo: true,
        repeat: 1,
      })
    }
  }, [playLeverClick])

  const triggerJackpot = useCallback(() => {
    setShowFlash(true)
    const t1 = setTimeout(() => setShowFlash(false), 100)
    const t2 = setTimeout(() => confetti(), 600)
    const t3 = setTimeout(() => confetti(), 900)
    const t4 = setTimeout(() => confetti(), 1200)
    const t5 = setTimeout(() => setJackpotTriggered(true), 1500)
    timeouts.current.push(t1, t2, t3, t4, t5)
  }, [])

  const handleSpin = useCallback(() => {
    if (isSpinning) return
    const gsap = gsapRef.current
    if (!gsap) return

    setIsSpinning(true)
    setCoinInserted(true)
    const newSpinCount = spinCount + 1
    setSpinCount(newSpinCount)

    animateLever()

    setReelBlurs([true, true, true])
    const reelRefs = [reel1Ref, reel2Ref, reel3Ref]
    reelRefs.forEach((ref) => {
      gsap.to(ref.current, {
        rotateX: 360,
        duration: 0.1,
        repeat: -1,
        ease: 'none',
        transformPerspective: 300,
        transformOrigin: 'center center',
      })
    })

    let r1i = 0, r2i = 0, r3i = 0
    const i1 = setInterval(() => {
      r1i = (r1i + 1) % REEL_1_SYMBOLS.length
      setReelValues(p => [REEL_1_SYMBOLS[r1i], p[1], p[2]])
    }, 80)
    const i2 = setInterval(() => {
      r2i = (r2i + 1) % REEL_2_SYMBOLS.length
      setReelValues(p => [p[0], REEL_2_SYMBOLS[r2i], p[2]])
    }, 80)
    const i3 = setInterval(() => {
      r3i = (r3i + 1) % REEL_3_SYMBOLS.length
      setReelValues(p => [p[0], p[1], REEL_3_SYMBOLS[r3i]])
    }, 80)
    intervals.current.push(i1, i2, i3)

    const isJackpot = jackpotSpins.current.includes(newSpinCount)
    const jackpotCombo = isJackpot ? getRandomJackpotCombo() : null
    const final1 = isJackpot ? jackpotCombo![0] : REEL_1_SYMBOLS[Math.floor(Math.random() * REEL_1_SYMBOLS.length)]
    const final2 = isJackpot ? jackpotCombo![1] : REEL_2_SYMBOLS[Math.floor(Math.random() * REEL_2_SYMBOLS.length)]
    const final3 = isJackpot ? jackpotCombo![2] : REEL_3_SYMBOLS[Math.floor(Math.random() * REEL_3_SYMBOLS.length)]

    const t1 = setTimeout(() => {
      clearInterval(i1)
      gsap.killTweensOf(reel1Ref.current)
      gsap.to(reel1Ref.current, {
        rotateX: '+=1080',
        duration: 0.5,
        ease: 'power4.out',
        transformPerspective: 300,
        onComplete: () => {
          gsap.set(reel1Ref.current, { rotateX: 0 })
          setReelValues(p => [final1, p[1], p[2]])
          setReelBlurs(p => [false, p[1], p[2]])
          gsap.fromTo(reel1Ref.current, { scale: 1.12 }, { scale: 1, duration: 0.25, ease: 'back.out(4)' })
          playReelStop(0)
        },
      })
    }, 900)

    const t2 = setTimeout(() => {
      clearInterval(i2)
      gsap.killTweensOf(reel2Ref.current)
      gsap.to(reel2Ref.current, {
        rotateX: '+=1080',
        duration: 0.5,
        ease: 'power4.out',
        transformPerspective: 300,
        onComplete: () => {
          gsap.set(reel2Ref.current, { rotateX: 0 })
          setReelValues(p => [p[0], final2, p[2]])
          setReelBlurs(p => [p[0], false, p[2]])
          gsap.fromTo(reel2Ref.current, { scale: 1.12 }, { scale: 1, duration: 0.25, ease: 'back.out(4)' })
          playReelStop(1)
        },
      })
    }, 1500)

    const t3 = setTimeout(() => {
      clearInterval(i3)
      gsap.killTweensOf(reel3Ref.current)
      gsap.to(reel3Ref.current, {
        rotateX: '+=1080',
        duration: 0.5,
        ease: 'power4.out',
        transformPerspective: 300,
        onComplete: () => {
          gsap.set(reel3Ref.current, { rotateX: 0 })
          setReelValues(p => [p[0], p[1], final3])
          setReelBlurs(p => [p[0], p[1], false])
          gsap.fromTo(reel3Ref.current, { scale: 1.12 }, { scale: 1, duration: 0.25, ease: 'back.out(4)' })
          playReelStop(2)
        },
      })
    }, 2100)

    const t4 = setTimeout(() => {
      setIsSpinning(false)
      if (isJackpot) {
        playJackpotAlarm()
        triggerJackpot()
      }
    }, 2700)

    timeouts.current.push(t1, t2, t3, t4)
  }, [isSpinning, spinCount, animateLever, playReelStop, playJackpotAlarm, triggerJackpot])

  const handleCloseOverlay = () => {
    const gsap = gsapRef.current
    if (gsap) {
      gsap.killTweensOf(leverRef.current)
      gsap.killTweensOf(reel1Ref.current)
      gsap.killTweensOf(reel2Ref.current)
      gsap.killTweensOf(reel3Ref.current)
      gsap.killTweensOf(spotlightRef.current)
    }
    timeouts.current.forEach(clearTimeout)
    intervals.current.forEach(clearInterval)
    onClose()
  }

  const handleCollectWinnings = () => {
    setJackpotTriggered(false)
    setSpinCount(0)
    jackpotSpins.current = getJackpotSpins()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="slot-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          {/* 360 Panorama Background */}
          <iframe
            width="100%"
            height="100%"
            allowFullScreen={true}
            allow="accelerometer; magnetometer; gyroscope; xr-spatial-tracking"
            style={{
              display: 'block',
              border: 'none',
              position: 'absolute',
              inset: 0,
            }}
            src="https://panoraven.com/en/embed/ljoSJ2eLag"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 z-0" style={{ background: 'rgba(0,0,0,0.45)' }} />

          {/* Flash Effect */}
          <AnimatePresence>
            {showFlash && (
              <motion.div
                key="flash"
                className="absolute inset-0 z-40 bg-white"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 px-4 w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mt-8"
            >
              <div className="font-mono text-xs tracking-widest" style={{ color: '#ffd60a', textShadow: '0 0 10px #ffd60a' }}>
                🎖️ OPERATION: JACKPOT // CLASSIFIED CASINO 🎖️
              </div>
              <div className="w-72 h-px bg-opacity-30 mx-auto mt-2" style={{ background: 'rgba(255,214,10,0.3)' }} />
              <div className="font-mono text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                SPINS: {spinCount}
              </div>
            </motion.div>

            {/* Machine Cabinet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-[360px] md:max-w-[360px] min-[480px]:max-w-[360px] w-full relative"
              style={{
                background: 'linear-gradient(180deg, #1c2b0e 0%, #111d08 50%, #0a1205 100%)',
                border: '3px solid rgba(106,138,58,0.8)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 0 60px rgba(255,214,10,0.12), 0 40px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -4px 16px rgba(0,0,0,0.8)',
              }}
            >
              {/* Top Bezel */}
              <div
                className="h-10 rounded-t-xl relative overflow-hidden mb-4"
                style={{
                  background: 'linear-gradient(180deg, #7a8a5a 0%, #5a7a2a 50%, #3a5a0a 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.6)',
                }}
              >
                <div className="flex justify-between px-4 items-center h-full">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #aaba7a, #5a6a3a)',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="text-center font-mono font-bold text-sm tracking-widest mb-4" style={{ color: '#ffd60a', textShadow: '0 0 30px #ffd60a' }}>
                ◈ FRIENDSHIP PROTOCOL ◈
              </div>

              {/* Reel Window */}
              <div
                className="relative rounded-[10px] p-2 mb-4 overflow-visible"
                style={{
                  background: '#000',
                  border: '5px solid #ffd60a',
                  boxShadow: 'inset 0 0 60px rgba(0,0,0,1), inset 0 8px 30px rgba(0,0,0,0.9), 0 0 50px rgba(255,214,10,0.3)',
                }}
                ref={spotlightRef}
              >
                {/* Spotlight */}
                <div
                  className="absolute top-[-24px] w-20 h-20 pointer-events-none z-10"
                  style={{
                    background: 'radial-gradient(circle at 50% 80%, rgba(255,255,200,0.4) 0%, rgba(255,255,100,0.15) 40%, transparent 70%)',
                    filter: 'blur(6px)',
                    left: 'calc(50% - 40px)',
                  }}
                />

                {/* Reels Container */}
                <div
                  className="rounded-[6px] px-3 py-4 flex gap-3 justify-center"
                  style={{
                    background: 'linear-gradient(180deg, #080c06 0%, #000 50%, #080c06 100%)',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,1), inset 0 2px 8px rgba(0,0,0,0.9)',
                  }}
                >
                  {[reel1Ref, reel2Ref, reel3Ref].map((ref, idx) => (
                    <div
                      key={idx}
                      ref={ref}
                      className="w-[88px] h-[88px] rounded-[8px] flex items-center justify-center relative overflow-hidden border-2"
                      style={{
                        borderColor: 'rgba(255,214,10,0.5)',
                        background: 'linear-gradient(135deg, #0c120a 0%, #060906 50%, #030503 100%)',
                        boxShadow: 'inset 0 0 30px rgba(0,0,0,1), inset 0 4px 16px rgba(0,0,0,0.95)',
                        filter: reelBlurs[idx] ? 'blur(4px) brightness(1.3)' : 'blur(0) brightness(1)',
                        transition: 'filter 200ms',
                        transformStyle: 'preserve-3d' as any,
                      }}
                    >
                      <div className="text-2xl" style={{ color: 'white', textShadow: '0 0 15px rgba(255,214,10,0.8)' }}>
                        {reelValues[idx]}
                      </div>
                      <div className="absolute inset-0 top-0 h-2 bg-gradient-to-b from-black/90 pointer-events-none z-20" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent)' }} />
                      <div className="absolute inset-0 bottom-0 h-2 bg-gradient-to-t pointer-events-none z-20" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              {!isSpinning && !jackpotTriggered && (
                <div className="text-center font-mono text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  // PULL LEVER TO SPIN
                </div>
              )}

              {/* Coin Slot Visual */}
              <div className="w-12 h-1.5 mx-auto mt-2 rounded-sm" style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,214,10,0.3)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9)' }} />

              {/* Coin Insert Animation */}
              <AnimatePresence>
                {coinInserted && (
                  <motion.div
                    key="coin-flash"
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, #ffd60a, #ff9f0a)',
                      boxShadow: '0 0 20px #ffd60a',
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    onAnimationComplete={() => setCoinInserted(false)}
                  />
                )}
              </AnimatePresence>

              {/* Bottom Trim */}
              <div className="h-3 rounded-b-xl mt-2" style={{ background: 'linear-gradient(180deg, #3a5a1a, #2a4a0a)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)' }} />
            </motion.div>

            {/* Lever (Desktop) */}
            <div className="hidden min-[480px]:block absolute right-0 top-1/2 -translate-y-1/3 -mr-12">
              <motion.div
                ref={leverRef}
                className="cursor-pointer"
                onClick={handleSpin}
                style={{ pointerEvents: isSpinning ? 'none' : 'auto', transformStyle: 'preserve-3d' as any }}
              >
                {/* Lever Mount */}
                <div
                  ref={leverBaseRef}
                  className="w-9 h-4.5 mx-auto rounded-b-2xl rounded-t-lg"
                  style={{
                    background: 'linear-gradient(180deg, #4a6a2a, #2a4a0a)',
                    border: '2px solid rgba(255,214,10,0.5)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full mx-auto mt-1" style={{ background: 'radial-gradient(circle at 35% 35%, #8a9a6a, #3a4a1a)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)' }} />
                </div>

                {/* Shaft */}
                <div
                  ref={leverShaftRef}
                  className="w-2.5 h-28 mx-auto"
                  style={{
                    background: 'linear-gradient(90deg, #3a5a1a 0%, #6a8a3a 30%, #8a9a5a 50%, #6a8a3a 70%, #3a5a1a 100%)',
                    borderRadius: '5px',
                    boxShadow: '-3px 0 6px rgba(0,0,0,0.7), 3px 0 4px rgba(255,255,255,0.08)',
                  }}
                >
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="h-0.5 w-full mt-6" style={{ background: 'rgba(0,0,0,0.35)', borderTop: '1px solid rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
                  ))}
                </div>

                {/* Knob */}
                <motion.div
                  ref={leverKnobRef}
                  className="w-9 h-9 rounded-full mx-auto relative"
                  style={{
                    background: 'radial-gradient(circle at 32% 28%, #ff9a7a 0%, #ff5a3a 35%, #cc3010 70%, #8b1a08 100%)',
                    boxShadow: '0 0 30px rgba(255,80,50,0.8), 0 0 60px rgba(255,80,50,0.3), inset -4px -4px 12px rgba(0,0,0,0.6), inset 4px 4px 12px rgba(255,200,180,0.4)',
                  }}
                  animate={leverPhase === 'idle' ? { y: [0, -2, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute w-2.5 h-2.5 rounded-full top-4 left-5" style={{ background: 'rgba(255,255,255,0.45)', filter: 'blur(2px)' }} />
                </motion.div>
              </motion.div>
            </div>

            {/* Mobile Button */}
            <div className="min-[480px]:hidden mt-4">
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="font-mono text-xs tracking-wide px-6 py-2 border rounded hover:bg-black/30 transition-colors"
                style={{
                  color: 'rgba(191,90,242,0.8)',
                  borderColor: 'rgba(191,90,242,0.3)',
                  border: '1px solid',
                }}
              >
                [ PULL ]
              </button>
            </div>

            {/* Close Button */}
            <motion.button
              onClick={handleCloseOverlay}
              className="absolute top-4 right-4 z-30 font-mono text-xs px-4 py-2 border rounded hover:bg-black/30 transition-colors"
              style={{
                color: 'rgba(255,255,255,0.4)',
                borderColor: 'rgba(255,255,255,0.2)',
                border: '1px solid',
              }}
              whileHover={{ scale: 1.05 }}
            >
              ✕ CLOSE
            </motion.button>

            {/* Jackpot Card */}
            <AnimatePresence>
              {jackpotTriggered && (
                <motion.div
                  key="jackpot-card"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute z-40 max-w-sm mx-auto p-8 rounded-2xl text-center backdrop-blur-lg"
                  style={{
                    background: 'rgba(255,214,10,0.15)',
                    border: '2px solid #ffd60a',
                    boxShadow: '0 0 60px #ffd60a, inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="text-4xl mb-4">🎉</div>
                  <h2 className="font-mono font-bold text-xl mb-2" style={{ color: '#ffd60a' }}>
                    🪖 JACKPOT! 🪖
                  </h2>
                  <p className="font-mono text-sm mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    She knows the word. Welcome, soldier. Happy Birthday.
                  </p>
                  <button
                    onClick={handleCollectWinnings}
                    className="font-mono text-xs tracking-wide px-6 py-2 border rounded hover:bg-yellow-900/30 transition-colors"
                    style={{
                      color: '#ffd60a',
                      borderColor: '#ffd60a',
                      border: '2px solid',
                    }}
                  >
                    COLLECT WINNINGS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
