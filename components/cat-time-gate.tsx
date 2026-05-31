"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CatTimeGateProps {
  onPass: () => void
}

const SECRET_WORD = 'soldier'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const typewrite = async (
  text: string,
  speed: number,
  setWhisperText: (text: string) => void
) => {
  setWhisperText('')
  for (let i = 0; i <= text.length; i++) {
    await delay(speed)
    setWhisperText(text.slice(0, i))
  }
}

function CatGoma({
  phase,
  isBlocking,
}: {
  phase: string
  isBlocking: boolean
}) {
  const getRotation = () => {
    switch (phase) {
      case 'leaning':
      case 'whisper':
        return 12
      case 'blocking':
        return -5
      default:
        return 0
    }
  }

  const getX = () => {
    switch (phase) {
      case 'leaning':
      case 'whisper':
        return 8
      default:
        return 0
    }
  }

  return (
    <motion.svg
      key={`goma-${phase}`}
      viewBox="0 0 120 160"
      width={120}
      height={160}
      className="absolute bottom-0 left-5"
      animate={{
        rotate: getRotation(),
        x: getX(),
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <ellipse cx={60} cy={120} rx={38} ry={32} fill="#8a8a8a" />
      <circle cx={60} cy={78} r={34} fill="#9a9a9a" />
      <polygon points="22,52 32,28 42,52" fill="#9a9a9a" />
      <motion.polygon
        points="25,50 32,32 39,50"
        fill="#c4868a"
        opacity={0.7}
        animate={
          isBlocking
            ? { translateY: 4, rotate: 10 }
            : { translateY: 0, rotate: 0 }
        }
        transition={{ type: 'spring', stiffness: 200 }}
      />
      <polygon points="78,52 88,28 98,52" fill="#9a9a9a" />
      <motion.polygon
        points="81,50 88,32 95,50"
        fill="#c4868a"
        opacity={0.7}
        animate={
          isBlocking
            ? { translateY: 4, rotate: -10 }
            : { translateY: 0, rotate: 0 }
        }
        transition={{ type: 'spring', stiffness: 200 }}
      />
      <motion.ellipse
        cx={48}
        cy={76}
        rx={6}
        ry={7}
        fill="#2a1a3a"
        animate={phase === 'leaning' ? { ry: 5 } : { ry: 7 }}
        transition={{ duration: 0.3 }}
      />
      <circle cx={50} cy={73} r={2} fill="white" />
      <motion.ellipse
        cx={72}
        cy={76}
        rx={6}
        ry={7}
        fill="#2a1a3a"
        animate={phase === 'leaning' ? { ry: 5 } : { ry: 7 }}
        transition={{ duration: 0.3 }}
      />
      <circle cx={74} cy={73} r={2} fill="white" />
      <ellipse cx={60} cy={86} rx={4} ry={3} fill="#c4868a" />
      <path
        d="M 54 90 Q 60 95 66 90"
        fill="none"
        stroke="#c4868a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line x1={20} y1={84} x2={50} y2={87} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <line x1={18} y1={89} x2={50} y2={90} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <line x1={70} y1={87} x2={100} y2={84} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <line x1={70} y1={90} x2={102} y2={89} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      {(phase === 'approved' || phase === 'reacting') && (
        <>
          <circle cx={40} cy={88} r={8} fill="#ffb7c5" opacity={0.35} />
          <circle cx={80} cy={88} r={8} fill="#ffb7c5" opacity={0.35} />
        </>
      )}
      <motion.path
        d="M 22 148 Q 0 170 10 190 Q 20 210 35 195"
        fill="none"
        stroke="#8a8a8a"
        strokeWidth={8}
        strokeLinecap="round"
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '35px 148px' }}
      />
    </motion.svg>
  )
}

function CatPeach({
  phase,
  isBlocking,
}: {
  phase: string
  isBlocking: boolean
}) {
  return (
    <motion.svg
      key={`peach-${phase}`}
      viewBox="0 0 120 160"
      width={120}
      height={160}
      className="absolute bottom-0 right-5"
      animate={{
        rotate: phase === 'blocking' ? 5 : phase === 'leaning' ? -8 : 0,
        x: phase === 'leaning' || phase === 'whisper' ? -6 : 0,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <ellipse cx={60} cy={120} rx={38} ry={32} fill="#f0ede8" />
      <circle cx={60} cy={78} r={34} fill="#f5f2ee" />
      <polygon points="22,52 32,28 42,52" fill="#f0ede8" />
      <motion.polygon
        points="25,50 32,32 39,50"
        fill="#ffb7c5"
        opacity={0.8}
        animate={
          isBlocking
            ? { translateY: 4, rotate: 10 }
            : { translateY: 0, rotate: 0 }
        }
        transition={{ type: 'spring', stiffness: 200 }}
      />
      <polygon points="78,52 88,28 98,52" fill="#f0ede8" />
      <motion.polygon
        points="81,50 88,32 95,50"
        fill="#ffb7c5"
        opacity={0.8}
        animate={
          isBlocking
            ? { translateY: 4, rotate: -10 }
            : { translateY: 0, rotate: 0 }
        }
        transition={{ type: 'spring', stiffness: 200 }}
      />
      <motion.ellipse
        cx={48}
        cy={76}
        rx={6}
        ry={isBlocking ? 4 : 7}
        fill="#1a2a1a"
        transition={{ duration: 0.3 }}
      />
      <circle cx={50} cy={73} r={2} fill="white" />
      <motion.ellipse
        cx={72}
        cy={76}
        rx={6}
        ry={isBlocking ? 4 : 7}
        fill="#1a2a1a"
        transition={{ duration: 0.3 }}
      />
      <circle cx={74} cy={73} r={2} fill="white" />
      {isBlocking && (
        <>
          <path
            d="M 38 64 Q 48 60 52 66"
            fill="none"
            stroke="#333"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 68 66 Q 72 60 82 64"
            fill="none"
            stroke="#333"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      )}
      <ellipse cx={60} cy={86} rx={4} ry={3} fill="#ffb7c5" />
      <path
        d={isBlocking ? "M 54 93 Q 60 89 66 93" : "M 54 90 Q 60 95 66 90"}
        fill="none"
        stroke="#ffb7c5"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line x1={20} y1={84} x2={50} y2={87} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <line x1={18} y1={89} x2={50} y2={90} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <line x1={70} y1={87} x2={100} y2={84} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <line x1={70} y1={90} x2={102} y2={89} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      {(phase === 'approved' || phase === 'reacting') && (
        <>
          <circle cx={40} cy={88} r={8} fill="#ffb7c5" opacity={0.35} />
          <circle cx={80} cy={88} r={8} fill="#ffb7c5" opacity={0.35} />
        </>
      )}
      <motion.path
        d="M 98 148 Q 120 170 110 190 Q 100 210 85 195"
        fill="none"
        stroke="#f0ede8"
        strokeWidth={8}
        strokeLinecap="round"
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        style={{ transformOrigin: '85px 148px' }}
      />
    </motion.svg>
  )
}

export function CatTimeGate({ onPass }: CatTimeGateProps) {
  const [timeAllowed, setTimeAllowed] = useState<boolean | null>(null)
  const [catPhase, setCatPhase] = useState<
    'idle' | 'leaning' | 'whisper' | 'reacting' | 'approved' | 'blocking'
  >('idle')
  const [whisperText, setWhisperText] = useState('')
  const [whisperVisible, setWhisperVisible] = useState(false)
  const [showBypass, setShowBypass] = useState(false)
  const [bypassInput, setBypassInput] = useState('')
  const [bypassAttempts, setBypassAttempts] = useState(0)
  const [bypassError, setBypassError] = useState(false)
  const [bypassSuccess, setBypassSuccess] = useState(false)

  useEffect(() => {
    const now = new Date()
    const birthdayTime = new Date(now.getFullYear(), 5, 10, 22, 10, 0)
    const isAllowed = now >= birthdayTime
    setTimeAllowed(isAllowed)
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
        await typewrite("psst... she's here. it's time. 🎂", 35, setWhisperText)
        await delay(600)
        setCatPhase('reacting')
        await delay(800)
        setWhisperVisible(false)
        await delay(200)
        setCatPhase('approved')
        await delay(600)
        setWhisperVisible(true)
        await typewrite('happy birthday. welcome. ✨', 35, setWhisperText)
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
        await typewrite("wait... she hasn't arrived yet. 👀", 35, setWhisperText)
        await delay(500)
        setCatPhase('blocking')
        setWhisperVisible(false)
        await delay(800)
        setWhisperVisible(true)
        await typewrite("you're early. you shouldn't be here.", 40, setWhisperText)
        await delay(500)
        setWhisperVisible(false)
        await delay(600)
        setWhisperVisible(true)
        await typewrite('...unless you know the word. 🤫', 40, setWhisperText)
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
      await typewrite('...they know the word. 🪖', 35, setWhisperText)
      await delay(700)
      setCatPhase('approved')
      setWhisperVisible(false)
      await delay(500)
      setWhisperVisible(true)
      await typewrite('happy birthday, soldier. 🎂', 35, setWhisperText)
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
      await typewrite("that's not it... 🙅", 40, setWhisperText)
      await delay(600)
      setWhisperVisible(false)
      await delay(300)
      setCatPhase('blocking')
      setTimeout(() => setBypassError(false), 500)
    }
  }

  const statusText = () => {
    if (bypassSuccess) {
      return "🐾 ...they'll allow it. go ahead."
    }
    if (catPhase === 'approved') {
      return '✨ access granted. welcome.'
    }
    if (catPhase === 'blocking') {
      return "🚫 not yet. they're watching."
    }
    return '🐾 peach & goma are consulting...'
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
          background: 'radial-gradient(ellipse at 50% 60%, #0a0014 0%, #000000 80%)',
        }}
      >
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-mono text-xs tracking-widest"
            style={{ color: 'rgba(191,90,242,0.6)' }}
          >
            // SECURITY CHECKPOINT — UNIT: PEACH & GOMA
          </motion.div>

          <div
            className="relative w-[340px] max-[400px]:w-[280px] max-[400px]:scale-90"
            style={{ height: 280 }}
          >
            <AnimatePresence>
              {whisperVisible && (
                <motion.div
                  key="whisper-bubble"
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
                >
                  <div
                    className="w-[220px] min-h-[60px] rounded-[20px] px-4 py-3 text-center backdrop-blur-lg"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <div
                      className="font-mono text-xs leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                      {whisperText}
                      {whisperText.length > 0 && (
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        >
                          ▌
                        </motion.span>
                      )}
                    </div>
                  </div>
                  <div
                    className="w-0 h-0 mx-auto"
                    style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '10px solid rgba(255,255,255,0.15)',
                    }}
                  />
                  <div className="flex justify-center gap-1 mt-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    />
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <CatGoma phase={catPhase} isBlocking={catPhase === 'blocking'} />
            <CatPeach phase={catPhase} isBlocking={catPhase === 'blocking'} />
          </div>

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
              {statusText()}
            </motion.div>
          </AnimatePresence>

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
                  className="w-full bg-black/60 border border-solid px-4 py-3 font-mono text-sm rounded-lg focus:outline-none"
                  style={{
                    borderColor: bypassError
                      ? 'rgba(255,55,95,0.6)'
                      : 'rgba(191,90,242,0.3)',
                    color: 'white',
                  }}
                  animate={bypassError ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                />

                <button
                  onClick={handleBypassSubmit}
                  className="font-mono text-xs tracking-wide px-7 py-2.5 border border-solid rounded hover:bg-black/30 transition-colors"
                  style={{
                    color: 'rgba(191,90,242,0.8)',
                    borderColor: 'rgba(191,90,242,0.3)',
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
