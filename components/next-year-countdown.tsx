"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeUnit {
  value: number
  label: string
}

function getNextBirthday(): Date {
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // Birthday is June 10
  let nextBirthday = new Date(currentYear, 5, 10) // Month is 0-indexed
  
  // If this year's birthday has passed, use next year
  if (now > nextBirthday) {
    nextBirthday = new Date(currentYear + 1, 5, 10)
  }
  
  return nextBirthday
}

function calculateTimeLeft(targetDate: Date): TimeUnit[] {
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()
  
  if (difference <= 0) {
    return [
      { value: 0, label: 'Days' },
      { value: 0, label: 'Hours' },
      { value: 0, label: 'Minutes' },
      { value: 0, label: 'Seconds' },
    ]
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)
  
  return [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
    { value: seconds, label: 'Seconds' },
  ]
}

function DigitDisplay({ value, prevValue }: { value: string; prevValue: string }) {
  const hasChanged = value !== prevValue

  return (
    <div className="relative overflow-hidden w-[1ch]">
      <motion.span
        key={value}
        initial={hasChanged ? { y: -20, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="inline-block"
      >
        {value}
      </motion.span>
    </div>
  )
}

function TimeBlock({ value, label, prevValue }: { value: number; label: string; prevValue: number }) {
  const displayValue = value.toString().padStart(2, '0')
  const prevDisplayValue = prevValue.toString().padStart(2, '0')
  
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center justify-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-lg"
        style={{
          background: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1), inset 0 0 15px rgba(0, 255, 136, 0.05)',
        }}
      >
        <div
          className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider flex"
          style={{
            color: '#00ff88',
            textShadow: '0 0 10px #00ff88, 0 0 30px rgba(0, 255, 136, 0.5)',
          }}
        >
          {displayValue.split('').map((digit, i) => (
            <DigitDisplay
              key={i}
              value={digit}
              prevValue={prevDisplayValue[i]}
            />
          ))}
        </div>
      </div>
      <span
        className="mt-2 text-xs sm:text-sm uppercase tracking-widest"
        style={{ color: 'rgba(0, 255, 136, 0.6)' }}
      >
        {label}
      </span>
    </div>
  )
}

export function NextYearCountdown() {
  const [mounted, setMounted] = useState(false)
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>([
    { value: 0, label: 'Days' },
    { value: 0, label: 'Hours' },
    { value: 0, label: 'Minutes' },
    { value: 0, label: 'Seconds' },
  ])
  const [prevTimeUnits, setPrevTimeUnits] = useState<TimeUnit[]>(timeUnits)

  useEffect(() => {
    setMounted(true)
    const targetDate = getNextBirthday()
    
    const updateTimer = () => {
      setPrevTimeUnits(timeUnits)
      setTimeUnits(calculateTimeLeft(targetDate))
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <section
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #020408, #0a0812, #020408)',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(0, 255, 136, 0.08)' }}
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(0, 212, 255, 0.06)' }}
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.2, 0.4, 0.2],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-light mb-2"
            style={{
              color: '#00d4ff',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
            }}
          >
            Countdown to Next Year
          </h2>
          <div
            className="w-24 h-px mx-auto mb-8 sm:mb-12"
            style={{ background: 'linear-gradient(to right, transparent, #00ff88, transparent)' }}
          />
        </motion.div>

        {/* Timer display */}
        <motion.div
          className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {timeUnits.map((unit, index) => (
            <div key={unit.label} className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <TimeBlock
                value={unit.value}
                label={unit.label}
                prevValue={prevTimeUnits[index]?.value ?? 0}
              />
              {index < timeUnits.length - 1 && (
                <motion.span
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono"
                  style={{ color: 'rgba(0, 255, 136, 0.4)' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  :
                </motion.span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Caption */}
        <motion.div
          className="mt-10 sm:mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p
            className="text-base sm:text-lg md:text-xl italic leading-relaxed max-w-2xl mx-auto px-4"
            style={{ color: 'rgba(148, 163, 184, 0.8)' }}
          >
            &ldquo;One day isn&apos;t enough to celebrate how much of a legend you are.
            <br className="hidden sm:block" />
            {' '}Starting the prep for next year right... now.&rdquo;
          </p>
          
          {/* Decorative stars */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                style={{ color: '#ffd700', fontSize: '12px' }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              >
                ★
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
