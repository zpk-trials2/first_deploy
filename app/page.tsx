"use client"

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EntryGate } from '@/components/entry-gate'
import { BirthdayCake } from '@/components/birthday-cake'
import { ScrollProgress } from '@/components/scroll-progress'
import { HeroSection } from '@/components/hero-section'
import { PersonalityDashboard } from '@/components/personality-dashboard'
import { ZodiacProfile } from '@/components/zodiac-profile'
import { FriendshipPlaylist } from '@/components/friendship-playlist'
import { UniverseCertificate } from '@/components/universe-certificate'
import { ConstellationMap } from '@/components/constellation-map'
import { TimelineSection } from '@/components/timeline-section'
import { FriendshipReceipt } from '@/components/friendship-receipt'
import { EnvelopeLetters } from '@/components/envelope-letters'
import { EmotionalClosing } from '@/components/emotional-closing'
import { NextYearCountdown } from '@/components/next-year-countdown'
import { FloatingBubbles } from '@/components/floating-bubbles'
import { GlobalCursor } from '@/components/global-cursor'
import { FriendshipCoupons } from '@/components/friendship-coupons'
import { ApologyBoard } from '@/components/apology-board'
import { FriendshipSlotMachine } from '@/components/friendship-slot-machine'
import { GrimReaper404 } from '@/components/grim-reaper-404'
import { CatTimeGate } from '@/components/cat-time-gate'

export default function BirthdayPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [catGatePassed, setCatGatePassed] = useState(false)
  const [cakeBlewOut, setCakeBlewOut] = useState(false)
  const [isHacked, setIsHacked] = useState(false)
  const [slotOpen, setSlotOpen] = useState(false)
  const [slotUnlocked, setSlotUnlocked] = useState(false)

  return (
    <main className="relative">
      <GlobalCursor />
      <FloatingBubbles />
      
      <AnimatePresence mode="wait">
        {!isUnlocked && !isHacked && (
          <EntryGate onUnlock={() => setIsUnlocked(true)} onHacked={() => setIsHacked(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHacked && (
          <GrimReaper404 onRetry={() => {
            setIsHacked(false)
          }} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isUnlocked && !catGatePassed && (
          <CatTimeGate onPass={() => setCatGatePassed(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isUnlocked && catGatePassed && !cakeBlewOut && (
          <BirthdayCake onCakeBlewOut={() => {
            setCakeBlewOut(true)
            setTimeout(() => setSlotUnlocked(true), 3000)
          }} />
        )}
      </AnimatePresence>

      {isUnlocked && cakeBlewOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <ScrollProgress />
          <HeroSection />
          <PersonalityDashboard />
          <ZodiacProfile />
          <FriendshipPlaylist />
          <UniverseCertificate />
          <ConstellationMap />
          <TimelineSection />
          <FriendshipReceipt />
          <EnvelopeLetters />
          <EmotionalClosing />
          <NextYearCountdown />
          
          {/* Fixed position UI elements */}
          <FriendshipCoupons />
          <ApologyBoard />

          {/* 🎰 SLOT MACHINE BADGE — top right corner */}
          <AnimatePresence>
            {slotUnlocked && (
              <motion.button
                onClick={() => setSlotOpen(true)}
                className="fixed top-4 right-4 z-40 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,214,10,0.15), rgba(255,159,10,0.1))',
                  border: '1px solid rgba(255,214,10,0.4)',
                  boxShadow: '0 0 20px rgba(255,214,10,0.2)',
                  backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255,214,10,0.4)' }}
                whileTap={{ scale: 0.92 }}
                aria-label="Open slot machine"
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🎰</span>
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ border: '1px solid rgba(255,214,10,0.3)' }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.button>
            )}
          </AnimatePresence>

          {/* SLOT MACHINE MODAL */}
          <FriendshipSlotMachine
            isOpen={slotOpen}
            onClose={() => setSlotOpen(false)}
          />
        </motion.div>
      )}
    </main>
  )
}
