'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECRET_WORD = 'soldier'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const typewrite = async (text: string, speed: number, setter: (t: string) => void) => {
  setter('')
  for (let i = 0; i <= text.length; i++) {
    await delay(speed)
    setter(text.slice(0, i))
  }
  await delay(200)
}

const STARS = [
  {x:5,y:8},{x:12,y:22},{x:88,y:15},{x:95,y:40},
  {x:3,y:55},{x:78,y:72},{x:92,y:88},{x:20,y:90},
  {x:45,y:5},{x:67,y:18},{x:15,y:35},{x:82,y:48},
  {x:33,y:60},{x:55,y:78},{x:70,y:92},{x:8,y:80},
  {x:40,y:25},{x:60,y:42},{x:25,y:70},{x:75,y:30},
  {x:50,y:88},{x:18,y:12},{x:88,y:62},{x:35,y:45},
  {x:65,y:8},{x:10,y:65},{x:90,y:25},{x:48,y:55},
  {x:22,y:48},{x:72,y:78},{x:38,y:15},{x:58,y:68},
  {x:15,y:82},{x:85,y:8},{x:28,y:32},{x:68,y:55},
  {x:42,y:72},{x:78,y:38},{x:5,y:42},{x:95,y:68},
  {x:32,y:88},{x:62,y:22},{x:18,y:58},{x:82,y:82},
  {x:48,y:12},{x:72,y:45},{x:25,y:25},{x:55,y:95},
  {x:38,y:62},{x:8,y:95}
]

function CatGoma({ phase, isBlocking }: { phase: string; isBlocking: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 140 180"
      width={140}
      height={180}
      className="absolute bottom-0 left-0"
      animate={{
        rotate: phase === 'leaning' || phase === 'whisper' ? 14 : phase === 'blocking' ? -6 : 0,
        x: phase === 'leaning' || phase === 'whisper' ? 10 : 0,
      }}
      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
    >
      {/* Body */}
      <ellipse cx="70" cy="128" rx="44" ry="36" fill="#7d7d7d" />
      <ellipse cx="70" cy="130" rx="28" ry="24" fill="#919191" />
      
      {/* Head */}
      <circle cx="70" cy="82" r="40" fill="#8c8c8c" />
      
      {/* Left Ear */}
      <motion.g animate={isBlocking ? { translateY: 6, rotate: 18 } : { translateY: 0, rotate: 0 }} transition={{ spring: { stiffness: 180 } }}>
        <ellipse cx="38" cy="50" rx="14" ry="18" transform="rotate(-15, 38, 50)" fill="#8c8c8c" />
        <ellipse cx="38" cy="52" rx="8" ry="11" transform="rotate(-15, 38, 52)" fill="#e8a0a8" opacity="0.75" />
      </motion.g>
      
      {/* Right Ear */}
      <motion.g animate={isBlocking ? { translateY: 6, rotate: -18 } : { translateY: 0, rotate: 0 }} transition={{ spring: { stiffness: 180 } }}>
        <ellipse cx="102" cy="50" rx="14" ry="18" transform="rotate(15, 102, 50)" fill="#8c8c8c" />
        <ellipse cx="102" cy="52" rx="8" ry="11" transform="rotate(15, 102, 52)" fill="#e8a0a8" opacity="0.75" />
      </motion.g>
      
      {/* Eyes */}
      <circle cx="54" cy="80" r="9" fill="#2a1a3a" />
      <circle cx="57" cy="76" r="3" fill="white" />
      <motion.rect x="45" y="71" width="18" height="9" rx="4" fill="#8c8c8c" animate={{ scaleY: [1, 1, 1, 2.2, 1] }} times={[0, 0.88, 0.9, 0.94, 1]} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, transformOrigin: 'center top' }} />
      
      <circle cx="86" cy="80" r="9" fill="#2a1a3a" />
      <circle cx="89" cy="76" r="3" fill="white" />
      <motion.rect x="77" y="71" width="18" height="9" rx="4" fill="#8c8c8c" animate={{ scaleY: [1, 1, 1, 2.2, 1] }} times={[0, 0.88, 0.9, 0.94, 1]} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, transformOrigin: 'center top' }} />
      
      {/* Nose */}
      <ellipse cx="70" cy="90" rx="4" ry="3" fill="#d4909a" />
      
      {/* Mouth */}
      {!isBlocking ? (
        <path d="M 63 95 Q 70 101 77 95" fill="none" stroke="#c4808a" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M 63 96 Q 70 94 77 96" fill="none" stroke="#c4808a" strokeWidth="2" strokeLinecap="round" />
      )}
      
      {/* Whiskers */}
      <line x1="10" y1="87" x2="58" y2="89" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <line x1="8" y1="92" x2="58" y2="92" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <line x1="12" y1="97" x2="58" y2="95" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <line x1="82" y1="89" x2="130" y2="87" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <line x1="82" y1="92" x2="132" y2="92" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <line x1="82" y1="95" x2="128" y2="97" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      
      {/* Paws */}
      <ellipse cx="50" cy="158" rx="14" ry="9" fill="#7d7d7d" />
      <line x1="44" y1="155" x2="44" y2="163" stroke="#6a6a6a" strokeWidth="1.2" />
      <ellipse cx="90" cy="158" rx="14" ry="9" fill="#7d7d7d" />
      <line x1="96" y1="155" x2="96" y2="163" stroke="#6a6a6a" strokeWidth="1.2" />
      
      {/* Tail */}
      <motion.path d="M 26 150 Q -10 140 -5 115 Q 0 95 20 105 Q 35 112 30 125" fill="none" stroke="#7d7d7d" strokeWidth="12" strokeLinecap="round" animate={{ rotate: [-6, 8, -6] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '26px 150px' }} />
      
      {/* Blush */}
      <AnimatePresence>
        {(phase === 'approved' || phase === 'reacting') && (
          <>
            <motion.ellipse cx="42" cy="94" rx="10" ry="6" fill="#ffb7c5" opacity="0.4" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.4, scale: 1 }} exit={{ opacity: 0 }} />
            <motion.ellipse cx="98" cy="94" rx="10" ry="6" fill="#ffb7c5" opacity="0.4" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.4, scale: 1 }} exit={{ opacity: 0 }} />
          </>
        )}
      </AnimatePresence>
      
      {/* Bounce */}
      {phase === 'approved' && <motion.g animate={{ y: [0, -16, 0, -8, 0, -4, 0] }} transition={{ duration: 1, ease: 'easeOut' }} />}
    </motion.svg>
  )
}

function CatPeach({ phase, isBlocking }: { phase: string; isBlocking: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 140 180"
      width={140}
      height={180}
      className="absolute bottom-0 right-0"
      animate={{
        rotate: phase === 'blocking' ? 6 : phase === 'leaning' || phase === 'whisper' ? -10 : 0,
        x: phase === 'leaning' || phase === 'whisper' ? -10 : 0,
      }}
      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
    >
      {/* Body */}
      <ellipse cx="70" cy="128" rx="44" ry="36" fill="#ede8e0" />
      <ellipse cx="70" cy="130" rx="28" ry="24" fill="#f5f2ec" />
      
      {/* Head */}
      <circle cx="70" cy="82" r="40" fill="#f0ece4" />
      
      {/* Left Ear */}
      <motion.g animate={isBlocking ? { translateY: 6, rotate: 18 } : { translateY: 0, rotate: 0 }} transition={{ spring: { stiffness: 180 } }}>
        <ellipse cx="38" cy="50" rx="14" ry="18" transform="rotate(-15, 38, 50)" fill="#ede8e0" />
        <ellipse cx="38" cy="52" rx="8" ry="11" transform="rotate(-15, 38, 52)" fill="#ffb7c5" opacity="0.85" />
      </motion.g>
      
      {/* Right Ear */}
      <motion.g animate={isBlocking ? { translateY: 6, rotate: -18 } : { translateY: 0, rotate: 0 }} transition={{ spring: { stiffness: 180 } }}>
        <ellipse cx="102" cy="50" rx="14" ry="18" transform="rotate(15, 102, 50)" fill="#ede8e0" />
        <ellipse cx="102" cy="52" rx="8" ry="11" transform="rotate(15, 102, 52)" fill="#ffb7c5" opacity="0.85" />
      </motion.g>
      
      {/* Eyes */}
      <circle cx="54" cy="80" r="9" fill="#1a2820" />
      <circle cx="57" cy="76" r="3" fill="white" />
      <motion.rect x="45" y="71" width="18" height="9" rx="4" fill="#f0ece4" animate={{ scaleY: [1, 1, 1, 2.2, 1] }} times={[0, 0.88, 0.9, 0.94, 1]} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, transformOrigin: 'center top' }} />
      
      <circle cx="86" cy="80" r="9" fill="#1a2820" />
      <circle cx="89" cy="76" r="3" fill="white" />
      <motion.rect x="77" y="71" width="18" height="9" rx="4" fill="#f0ece4" animate={{ scaleY: [1, 1, 1, 2.2, 1] }} times={[0, 0.88, 0.9, 0.94, 1]} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, transformOrigin: 'center top' }} />
      
      {/* Nose */}
      <ellipse cx="70" cy="90" rx="4" ry="3" fill="#ffb0bc" />
      
      {/* Mouth */}
      {!isBlocking ? (
        <path d="M 63 95 Q 70 101 77 95" fill="none" stroke="#ffb0bc" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M 63 96 Q 70 94 77 96" fill="none" stroke="#ffb0bc" strokeWidth="2" strokeLinecap="round" />
      )}
      
      {/* Angry Eyebrows when blocking */}
      <AnimatePresence>
        {isBlocking && (
          <>
            <motion.path d="M 42 67 Q 52 61 58 68" fill="none" stroke="#555" strokeWidth="3" strokeLinecap="round" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
            <motion.path d="M 82 68 Q 88 61 98 67" fill="none" stroke="#555" strokeWidth="3" strokeLinecap="round" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
          </>
        )}
      </AnimatePresence>
      
      {/* Whiskers */}
      <line x1="10" y1="87" x2="58" y2="89" stroke="rgba(180,160,140,0.45)" strokeWidth="1" />
      <line x1="8" y1="92" x2="58" y2="92" stroke="rgba(180,160,140,0.45)" strokeWidth="1" />
      <line x1="12" y1="97" x2="58" y2="95" stroke="rgba(180,160,140,0.45)" strokeWidth="1" />
      <line x1="82" y1="89" x2="130" y2="87" stroke="rgba(180,160,140,0.45)" strokeWidth="1" />
      <line x1="82" y1="92" x2="132" y2="92" stroke="rgba(180,160,140,0.45)" strokeWidth="1" />
      <line x1="82" y1="95" x2="128" y2="97" stroke="rgba(180,160,140,0.45)" strokeWidth="1" />
      
      {/* Paws */}
      <ellipse cx="50" cy="158" rx="14" ry="9" fill="#e0dbd3" />
      <line x1="44" y1="155" x2="44" y2="163" stroke="#ccc5bc" strokeWidth="1.2" />
      <ellipse cx="90" cy="158" rx="14" ry="9" fill="#e0dbd3" />
      <line x1="96" y1="155" x2="96" y2="163" stroke="#ccc5bc" strokeWidth="1.2" />
      
      {/* Tail */}
      <motion.path d="M 114 150 Q 150 140 145 115 Q 140 95 120 105 Q 105 112 110 125" fill="none" stroke="#e8e3db" strokeWidth="12" strokeLinecap="round" animate={{ rotate: [6, -8, 6] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} style={{ transformOrigin: '114px 150px' }} />
      
      {/* Blush */}
      <AnimatePresence>
        {(phase === 'approved' || phase === 'reacting') && (
          <>
            <motion.ellipse cx="42" cy="94" rx="10" ry="6" fill="#ffb7c5" opacity="0.4" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.4, scale: 1 }} exit={{ opacity: 0 }} />
            <motion.ellipse cx="98" cy="94" rx="10" ry="6" fill="#ffb7c5" opacity="0.4" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.4, scale: 1 }} exit={{ opacity: 0 }} />
          </>
        )}
      </AnimatePresence>
      
      {/* Blocking shake */}
      {phase === 'blocking' && <motion.g animate={{ x: [0, -5, 5, -5, 5, -3, 3, 0] }} transition={{ duration: 0.5 }} />}
    </motion.svg>
  )
}

interface CatTimeGateProps {
  onPass: () => void
}

export function CatTimeGate({ onPass }: CatTimeGateProps) {
  const [catPhase, setCatPhase] = useState<'idle' | 'leaning' | 'whisper' | 'reacting' | 'approved' | 'blocking'>('idle')
  const [whisperText, setWhisperText] = useState('')
  const [whisperVisible, setWhisperVisible] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showBypass, setShowBypass] = useState(false)
  const [bypassInput, setBypassInput] = useState('')
  const [bypassAttempts, setBypassAttempts] = useState(0)
  const [bypassError, setBypassError] = useState(false)
  const [bypassSuccess, setBypassSuccess] = useState(false)
  const [timeAllowed, setTimeAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const totalMinutes = hour * 60 + minute
    const birthdayMinutes = 22 * 60 + 10
    setTimeAllowed(totalMinutes >= birthdayMinutes)
  }, [])

  useEffect(() => {
    if (timeAllowed === null) return

    const runSequence = async () => {
      if (timeAllowed) {
        setCatPhase('idle')
        await delay(800)
        setCatPhase('leaning')
        await delay(600)
        setCatPhase('whisper')
        setWhisperVisible(true)
        setIsTyping(true)
        await typewrite('psst... she\'s here. it\'s time. 🎂', 58, setWhisperText)
        setIsTyping(false)
        await delay(600)
        setCatPhase('reacting')
        await delay(800)
        setWhisperVisible(false)
        await delay(200)
        setCatPhase('approved')
        await delay(600)
        setWhisperVisible(true)
        setIsTyping(true)
        await typewrite('happy birthday. welcome. ✨', 55, setWhisperText)
        setIsTyping(false)
        await delay(600)
        setWhisperVisible(false)
        await delay(400)
        onPass()
      } else {
        setCatPhase('idle')
        await delay(800)
        setCatPhase('leaning')
        await delay(600)
        setCatPhase('whisper')
        setWhisperVisible(true)
        setIsTyping(true)
        await typewrite('wait... she hasn\'t arrived yet. 👀', 58, setWhisperText)
        setIsTyping(false)
        await delay(500)
        setCatPhase('blocking')
        setWhisperVisible(false)
        await delay(800)
        setWhisperVisible(true)
        setIsTyping(true)
        await typewrite('you\'re early. you shouldn\'t be here.', 62, setWhisperText)
        setIsTyping(false)
        await delay(500)
        setWhisperVisible(false)
        await delay(600)
        setWhisperVisible(true)
        setIsTyping(true)
        await typewrite('...unless you know the word. 🤫', 55, setWhisperText)
        setIsTyping(false)
        await delay(400)
        setWhisperVisible(false)
        await delay(300)
        setShowBypass(true)
      }
    }

    runSequence()
  }, [timeAllowed, onPass])

  const handleBypassSubmit = async () => {
    const input = bypassInput.toLowerCase().trim()
    const containsWord = input.includes(SECRET_WORD.toLowerCase())

    if (containsWord) {
      setBypassSuccess(true)
      setShowBypass(false)
      setCatPhase('leaning')
      await delay(600)
      setWhisperText('')
      setWhisperVisible(true)
      setIsTyping(true)
      await typewrite('...they know the word. 🪖', 55, setWhisperText)
      setIsTyping(false)
      await delay(700)
      setCatPhase('approved')
      setWhisperVisible(false)
      await delay(500)
      setWhisperVisible(true)
      setIsTyping(true)
      await typewrite('happy birthday, soldier. 🎂', 55, setWhisperText)
      setIsTyping(false)
      await delay(800)
      setWhisperVisible(false)
      await delay(400)
      onPass()
    } else {
      setBypassAttempts(prev => prev + 1)
      setBypassError(true)
      setBypassInput('')
      setCatPhase('leaning')
      await delay(500)
      setWhisperVisible(true)
      setIsTyping(true)
      await typewrite('that\'s not it... 🙅', 50, setWhisperText)
      setIsTyping(false)
      await delay(600)
      setWhisperVisible(false)
      await delay(300)
      setCatPhase('blocking')
      setTimeout(() => setBypassError(false), 500)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="cat-gate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-6 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 55%, #0d0020 0%, #050010 50%, #000000 100%)',
        }}
      >
        {/* Starfield */}
        {STARS.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: i % 5 === 0 ? '2px' : '1px',
              height: i % 5 === 0 ? '2px' : '1px',
              background: 'white',
            }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{
              duration: 2 + (i % 4),
              repeat: Infinity,
              delay: (i * 0.13) % 3,
            }}
          />
        ))}

        {/* Ambient glow */}
        <motion.div
          className="absolute top-[20%] left-[15%] w-[300px] h-[300px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(191,90,242,0.06) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[40%] right-[20%] w-[250px] h-[250px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
          }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-2 font-mono text-xs tracking-widest"
            style={{ color: 'rgba(191,90,242,0.5)' }}
          >
            🐾 // SECURITY CHECKPOINT — UNIT: PEACH & GOMA 🐾
          </motion.div>
          <motion.div
            className="w-72 h-px mx-auto"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(191,90,242,0.2), transparent)',
            }}
          />

          {/* Cat Scene */}
          <div className="w-[380px] max-[400px]:w-[290px] max-[400px]:scale-90 max-[400px]:origin-center relative mx-auto" style={{ height: 300 }}>
            <AnimatePresence>
              {whisperVisible && (
                <motion.div
                  key="whisper-bubble"
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                >
                  <div
                    className="w-[240px] min-h-[68px] rounded-[22px] px-[18px] py-[14px] text-center backdrop-blur-[12px] box-shadow"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      className="font-mono text-sm leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '0.01em' }}
                    >
                      {whisperText}
                      {isTyping && (
                        <motion.span
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                        >
                          ▌
                        </motion.span>
                      )}
                    </div>
                  </div>
                  <div
                    className="w-0 h-0 mx-auto"
                    style={{
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderTop: '12px solid rgba(255,255,255,0.18)',
                    }}
                  />
                  <div className="flex justify-center gap-[6px] mt-[2px]">
                    <motion.div
                      className="w-[9px] h-[9px] rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-[7px] h-[7px] rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-[5px] h-[5px] rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <CatGoma phase={catPhase} isBlocking={catPhase === 'blocking'} />
            <CatPeach phase={catPhase} isBlocking={catPhase === 'blocking'} />

            {/* Floor line */}
            <div
              className="absolute bottom-[8px] w-[80%] left-[10%] h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
              }}
            />
          </div>

          {/* Status */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`status-${catPhase}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-xs"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {bypassSuccess ? '🐾 ...they\'ll allow it. go ahead.' : catPhase === 'approved' ? '✨ access granted. welcome.' : catPhase === 'blocking' ? '🚫 not yet. they\'re watching.' : '🐾 peach & goma are consulting...'}
            </motion.div>
          </AnimatePresence>

          {/* Bypass Form */}
          <AnimatePresence>
            {showBypass && !bypassSuccess && (
              <motion.div
                key="bypass-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-sm mx-auto flex flex-col gap-3 text-center w-full"
              >
                <div
                  className="font-mono text-xs italic"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  the cats are waiting for a word...
                </div>

                <motion.input
                  type="text"
                  value={bypassInput}
                  onChange={e => setBypassInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleBypassSubmit()
                    }
                  }}
                  placeholder="say something to peach & goma..."
                  className="w-full bg-black/60 px-4 py-3 font-mono text-sm rounded-lg focus:outline-none"
                  style={{
                    borderColor: bypassError ? 'rgba(255,55,95,0.6)' : 'rgba(191,90,242,0.3)',
                    color: 'white',
                    border: '1px solid',
                  }}
                  animate={bypassError ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                />

                <button
                  onClick={handleBypassSubmit}
                  className="font-mono text-xs tracking-wide px-7 py-2.5 border rounded hover:bg-black/30 transition-colors"
                  style={{
                    color: 'rgba(191,90,242,0.8)',
                    borderColor: 'rgba(191,90,242,0.3)',
                    border: '1px solid',
                  }}
                >
                  whisper it 🤫
                </button>

                {bypassAttempts >= 1 && !bypassError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-xs italic"
                    style={{ color: 'rgba(255,214,10,0.4)' }}
                  >
                    psst. it's a single word. hidden in plain sight. 🪖
                  </motion.div>
                )}

                {bypassError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-xs"
                    style={{ color: 'rgba(255,55,95,0.6)' }}
                  >
                    peach shook her head. try again.
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
