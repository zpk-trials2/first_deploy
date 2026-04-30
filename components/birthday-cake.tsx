"use client"

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface BirthdayCakeProps {
  onCakeBlewOut: () => void
}

export function BirthdayCake({ onCakeBlewOut }: BirthdayCakeProps) {
  const [flamesOut, setFlamesOut] = useState(false)
  const [isBlowing, setIsBlowing] = useState(false)

  const playSuccessSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      
      // Celebratory chime sequence
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15)
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.4)
        
        oscillator.start(audioContext.currentTime + i * 0.15)
        oscillator.stop(audioContext.currentTime + i * 0.15 + 0.4)
      })
    } catch {
      // Audio not available
    }
  }, [])

  const triggerConfetti = useCallback(() => {
    const colors = ['#00d4ff', '#bf5af2', '#ffd700', '#ff6b9d', '#00ff88']
    
    // First burst - center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6, x: 0.5 },
      colors,
    })

    // Second burst - left
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      })
    }, 200)

    // Third burst - right
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      })
    }, 400)

    // Final celebration burst
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5, x: 0.5 },
        colors,
      })
    }, 600)
  }, [])

  const handleBlowOut = async () => {
    if (isBlowing) return
    setIsBlowing(true)
    
    // Blow out flames
    setFlamesOut(true)
    
    // Small delay before confetti
    setTimeout(() => {
      playSuccessSound()
      triggerConfetti()
    }, 300)

    // Transition to main content after animations
    setTimeout(() => {
      onCakeBlewOut()
    }, 3000)
  }

  const candles = [
    { id: 1, left: '20%' },
    { id: 2, left: '32%' },
    { id: 3, left: '44%' },
    { id: 4, left: '56%' },
    { id: 5, left: '68%' },
    { id: 6, left: '80%' },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0f0a1e 0%, #020408 70%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(191, 90, 242, 0.15)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      {/* Title */}
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-light mb-8 text-center px-4"
        style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Make a Wish, Diksha!
      </motion.h1>

      {/* Cake container */}
      <motion.div
        className="relative w-[280px] sm:w-[320px] md:w-[380px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Candles */}
        <div className="relative h-24 sm:h-28 md:h-32">
          {candles.map((candle, index) => (
            <div
              key={candle.id}
              className="absolute bottom-0"
              style={{ left: candle.left, transform: 'translateX(-50%)' }}
            >
              {/* Candle stick */}
              <motion.div
                className="w-2 sm:w-2.5 h-12 sm:h-14 md:h-16 rounded-t-sm mx-auto"
                style={{
                  background: 'linear-gradient(to bottom, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
                  boxShadow: '0 0 8px rgba(255, 180, 160, 0.3)',
                  transformOrigin: 'bottom',
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              />

              {/* Flame */}
              <AnimatePresence>
                {!flamesOut && (
                  <motion.div
                    className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ 
                      scale: 0, 
                      opacity: 0, 
                      y: -20,
                      transition: { duration: 0.3, delay: index * 0.05 }
                    }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {/* Outer flame */}
                    <motion.div
                      className="w-3 sm:w-4 h-5 sm:h-6 rounded-full"
                      style={{
                        background: 'radial-gradient(ellipse at bottom, #ff9500 0%, #ff5e00 40%, transparent 70%)',
                        filter: 'blur(1px)',
                      }}
                      animate={{
                        scaleY: [1, 1.1, 0.95, 1.05, 1],
                        scaleX: [1, 0.95, 1.05, 0.98, 1],
                      }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    {/* Inner flame */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 sm:w-2.5 h-3 sm:h-4 rounded-full"
                      style={{
                        background: 'radial-gradient(ellipse at bottom, #ffff00 0%, #ff9500 60%, transparent 80%)',
                      }}
                      animate={{
                        scaleY: [1, 1.15, 0.9, 1.1, 1],
                        scaleX: [1, 0.9, 1.1, 0.95, 1],
                      }}
                      transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                    />
                    {/* Glow */}
                    <div
                      className="absolute -inset-4 rounded-full opacity-50"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 200, 100, 0.4) 0%, transparent 70%)',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Cake layers */}
        <div className="relative">
          {/* Top decoration border */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-[85%] h-4 rounded-t-lg"
            style={{
              background: 'linear-gradient(to bottom, #bf5af2, #9945d4)',
              boxShadow: '0 0 15px rgba(191, 90, 242, 0.5)',
            }}
          />

          {/* Top layer */}
          <motion.div
            className="relative w-[85%] h-14 sm:h-16 md:h-20 mx-auto rounded-lg"
            style={{
              background: 'linear-gradient(to bottom, #2a1f42 0%, #1a1230 100%)',
              border: '2px solid rgba(191, 90, 242, 0.4)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 2px 10px rgba(191, 90, 242, 0.2)',
            }}
          >
            {/* Decorative dots on top layer */}
            <div className="absolute inset-0 flex items-center justify-around px-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                  style={{
                    backgroundColor: '#00d4ff',
                    boxShadow: '0 0 8px #00d4ff',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Middle layer */}
          <motion.div
            className="relative w-[95%] h-12 sm:h-14 md:h-16 mx-auto rounded-lg -mt-1"
            style={{
              background: 'linear-gradient(to bottom, #1f1833 0%, #150f25 100%)',
              border: '2px solid rgba(0, 212, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 2px 10px rgba(0, 212, 255, 0.15)',
            }}
          >
            {/* Wavy decoration */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-around px-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{
                    backgroundColor: '#ffd700',
                    boxShadow: '0 0 6px #ffd700',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Bottom layer */}
          <motion.div
            className="relative w-full h-14 sm:h-16 md:h-20 mx-auto rounded-lg -mt-1"
            style={{
              background: 'linear-gradient(to bottom, #15101f 0%, #0a0812 100%)',
              border: '2px solid rgba(191, 90, 242, 0.25)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), inset 0 2px 10px rgba(191, 90, 242, 0.1)',
            }}
          >
            {/* Bottom decoration stripe */}
            <div
              className="absolute bottom-3 inset-x-4 h-1.5 rounded-full"
              style={{
                background: 'linear-gradient(to right, #00d4ff, #bf5af2, #ffd700)',
                boxShadow: '0 0 10px rgba(191, 90, 242, 0.5)',
              }}
            />
          </motion.div>

          {/* Cake plate */}
          <div
            className="w-[110%] h-4 sm:h-5 mx-auto -ml-[5%] rounded-b-xl"
            style={{
              background: 'linear-gradient(to bottom, #333 0%, #1a1a1a 100%)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
            }}
          />
        </div>
      </motion.div>

      {/* Blow out button */}
      <motion.button
        onClick={handleBlowOut}
        disabled={isBlowing}
        className="mt-10 sm:mt-12 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: flamesOut 
            ? 'linear-gradient(135deg, #00ff88, #00d4ff)'
            : 'linear-gradient(135deg, #bf5af2, #ff6b9d)',
          color: '#fff',
          boxShadow: flamesOut 
            ? '0 0 30px rgba(0, 255, 136, 0.4)'
            : '0 0 30px rgba(191, 90, 242, 0.4)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: isBlowing ? 1 : 1.05 }}
        whileTap={{ scale: isBlowing ? 1 : 0.95 }}
      >
        {flamesOut ? 'Happy Birthday!' : 'Blow Out the Candles'}
      </motion.button>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-sm sm:text-base px-4 text-center"
        style={{ color: 'rgba(148, 163, 184, 0.7)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {flamesOut ? 'Your wish is on its way...' : 'Close your eyes and make a wish'}
      </motion.p>
    </motion.div>
  )
}
