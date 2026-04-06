"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MatrixRain } from './matrix-rain'

const CLUES = [
  `She answers to a name that starts like "Darkness" but ends like a key... 3 letters. Case-sensitive.`,
  `D + ks. It's right there in the name itself.`,
  `Come on. It's literally her initials. D... k... s...`,
]

const CORRECT_KEY = 'Dks'

export function EntryGate({ onUnlock }: { onUnlock: () => void }) {
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [currentClueIndex, setCurrentClueIndex] = useState(0)
  const [pastClues, setPastClues] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(true)
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [showScanlines, setShowScanlines] = useState(false)
  const [currentClueText, setCurrentClueText] = useState('')
  const [isClueAnimating, setIsClueAnimating] = useState(false)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countdownText, setCountdownText] = useState('')
  const [borderFlash, setBorderFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const baseLines = [
    '> DIKSHA SECURITY PROTOCOL v2.4.1',
    '> STATUS: ACTIVE',
    '> FRIENDSHIP DATABASE: ENCRYPTED',
    '> AUTHORIZATION REQUIRED',
    '',
  ]

  // Initial typewriter for base terminal lines
  const typeTerminalLines = useCallback(async () => {
    setIsTyping(true)
    setShowInput(false)
    setTerminalLines([])

    for (let lineIndex = 0; lineIndex < baseLines.length; lineIndex++) {
      const line = baseLines[lineIndex]
      for (let charIndex = 0; charIndex <= line.length; charIndex++) {
        await new Promise(resolve => setTimeout(resolve, 25))
        setTerminalLines(prev => {
          const newLines = [...prev]
          newLines[lineIndex] = line.slice(0, charIndex)
          return newLines
        })
      }
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    // Type the first clue
    await typeClue(CLUES[0])
    setIsTyping(false)
    setShowInput(true)
  }, [])

  const typeClue = async (clue: string) => {
    const cluePrefix = `> CLUE [${currentClueIndex + 1}/3]: `
    const fullClue = cluePrefix + clue
    setCurrentClueText('')
    
    for (let i = 0; i <= fullClue.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30))
      setCurrentClueText(fullClue.slice(0, i))
    }
  }

  const typeNewClue = async (clueIndex: number) => {
    const clue = CLUES[clueIndex]
    const cluePrefix = `> CLUE [${clueIndex + 1}/3]: `
    const fullClue = cluePrefix + clue
    setCurrentClueText('')
    
    for (let i = 0; i <= fullClue.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30))
      setCurrentClueText(fullClue.slice(0, i))
    }
  }

  useEffect(() => {
    typeTerminalLines()
  }, [typeTerminalLines])

  const playChime = () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch {
      // Audio not available
    }
  }

  const scrambleText = async () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
    const allText = terminalLines.join('\n') + '\n' + currentClueText
    
    for (let iteration = 0; iteration < 15; iteration++) {
      const scrambled = allText
        .split('')
        .map(char => (char !== '\n' && char !== ' ' && Math.random() > 0.5) 
          ? chars[Math.floor(Math.random() * chars.length)] 
          : char)
        .join('')
      const lines = scrambled.split('\n')
      setTerminalLines(lines.slice(0, baseLines.length))
      setCurrentClueText(lines.slice(baseLines.length).join('\n'))
      await new Promise(resolve => setTimeout(resolve, 40))
    }
  }

  const handleWrongAttempt = async () => {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    setInputValue('')

    if (newAttempts >= 3) {
      // Flash border red 3 times
      setShowInput(false)
      for (let i = 0; i < 3; i++) {
        setBorderFlash(true)
        await new Promise(resolve => setTimeout(resolve, 200))
        setBorderFlash(false)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Typewrite ACCESS DENIED
      setIsCountingDown(true)
      const deniedText = '> ACCESS DENIED. TOO MANY FAILED ATTEMPTS.'
      for (let i = 0; i <= deniedText.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setCountdownText(deniedText.slice(0, i))
      }
      await new Promise(resolve => setTimeout(resolve, 500))

      // Countdown character by character
      const countdownBase = '\n> SYSTEM REBOOT IN '
      for (let i = 0; i <= countdownBase.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setCountdownText(deniedText + countdownBase.slice(0, i))
      }

      // 3...
      setCountdownText(deniedText + countdownBase + '3...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 2...
      setCountdownText(deniedText + countdownBase + '3... 2...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 1...
      setCountdownText(deniedText + countdownBase + '3... 2... 1...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Unlock
      setIsUnlocking(true)
      await scrambleText()
      setShowScanlines(true)
      playChime()
      await new Promise(resolve => setTimeout(resolve, 800))
      onUnlock()
    } else {
      // Animate current clue out
      setIsClueAnimating(true)
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Move to past clues
      setPastClues(prev => [...prev, `> CLUE [${currentClueIndex + 1}/3]: ${CLUES[currentClueIndex]}`])
      setCurrentClueIndex(newAttempts)
      setIsClueAnimating(false)
      
      // Type new clue
      await typeNewClue(newAttempts)
      
      // Focus input
      inputRef.current?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (inputValue === CORRECT_KEY) {
      setIsUnlocking(true)
      await scrambleText()
      setShowScanlines(true)
      playChime()
      await new Promise(resolve => setTimeout(resolve, 800))
      onUnlock()
    } else {
      await handleWrongAttempt()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <MatrixRain />
        
        {showScanlines && (
          <motion.div
            className="fixed inset-0 z-10 pointer-events-none"
            initial={{ y: '-100%' }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.5, ease: 'linear' }}
            style={{
              background: 'linear-gradient(transparent 50%, rgba(0, 255, 65, 0.1) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        )}

        <motion.div
          className="relative z-20 backdrop-blur-lg bg-black/70 rounded-xl w-[92vw] max-w-lg mx-4 p-5 sm:p-8"
          style={{
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: borderFlash ? '#ef4444' : 'rgba(0, 255, 136, 0.3)',
            boxShadow: borderFlash ? '0 0 30px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(239, 68, 68, 0.1)' : 'none',
            transition: 'border-color 0.1s, box-shadow 0.1s',
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-mono text-[#00ff88] text-xs sm:text-sm leading-relaxed">
            {/* Static terminal lines */}
            {terminalLines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">{line}</div>
            ))}

            {/* Past clues - struck through and dimmed */}
            {pastClues.map((clue, i) => (
              <div 
                key={`past-${i}`} 
                className="text-[#00ff88]/40 line-through whitespace-pre-wrap"
              >
                {clue}
              </div>
            ))}

            {/* Current clue with animation */}
            {!isCountingDown && (
              <motion.div
                className="whitespace-pre-wrap"
                initial={{ opacity: 1, y: 0 }}
                animate={isClueAnimating ? { 
                  opacity: 0, 
                  y: -20,
                  textDecoration: 'line-through'
                } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentClueText}
                {isTyping && <span className="animate-pulse">▋</span>}
              </motion.div>
            )}

            {/* Countdown text */}
            {isCountingDown && (
              <div className="text-red-500 whitespace-pre-wrap">
                {countdownText}
              </div>
            )}

            {/* Input prompt */}
            {showInput && !isCountingDown && !isUnlocking && (
              <div className="mt-2">{"> ENTER DECRYPTION KEY: _"}</div>
            )}
          </div>

          {showInput && !isCountingDown && !isUnlocking && (
            <motion.form
              onSubmit={handleSubmit}
              className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-black/80 border border-[#00ff88]/50 rounded px-4 py-3 sm:py-2 font-mono text-[#00ff88] focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/50 text-base"
                placeholder="Enter key..."
                autoFocus
                disabled={isClueAnimating}
                style={{
                  opacity: isClueAnimating ? 0.4 : 1,
                  pointerEvents: isClueAnimating ? 'none' : 'auto',
                }}
              />
              <button
                type="submit"
                className="w-full bg-[#00ff88]/20 border border-[#00ff88]/50 rounded px-4 py-3 sm:py-2 font-mono text-[#00ff88] hover:bg-[#00ff88]/30 active:bg-[#00ff88]/40 transition-colors uppercase tracking-wider min-h-[44px]"
                disabled={isClueAnimating}
                style={{
                  opacity: isClueAnimating ? 0.4 : 1,
                  pointerEvents: isClueAnimating ? 'none' : 'auto',
                }}
              >
                {'>'} Submit
              </button>
            </motion.form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
