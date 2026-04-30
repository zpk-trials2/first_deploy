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

export default function BirthdayPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [cakeBlewOut, setCakeBlewOut] = useState(false)

  return (
    <main className="relative">
      <GlobalCursor />
      <FloatingBubbles />
      
      <AnimatePresence mode="wait">
        {!isUnlocked && (
          <EntryGate onUnlock={() => setIsUnlocked(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isUnlocked && !cakeBlewOut && (
          <BirthdayCake onCakeBlewOut={() => setCakeBlewOut(true)} />
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
        </motion.div>
      )}
    </main>
  )
}
