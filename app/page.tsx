"use client"

import { useState, useEffect } from 'react'
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
import { MemoryWall } from '@/components/memory-wall'

// Preload the 3D model in the background on page load
const GLB_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grim_reaper_with_golden_angel_dark_wings-UIapNESP2iFXd6QFlTCQZw52ZvZQuD.glb'

export default function BirthdayPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [catGatePassed, setCatGatePassed] = useState(false)
  const [cakeBlewOut, setCakeBlewOut] = useState(false)
  const [isHacked, setIsHacked] = useState(false)
  const [memoryWallOpen, setMemoryWallOpen] = useState(false)

  // Preload the 3D model when component mounts
  useEffect(() => {
    // Preload the GLB model by fetching it in the background
    const preloadModel = async () => {
      try {
        await fetch(GLB_URL, { mode: 'cors' })
      } catch (error) {
        console.log('[v0] Model preload initiated')
      }
    }
    preloadModel()
  }, [])

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
          <ApologyBoard onMemoryWallClick={() => setMemoryWallOpen(true)} />
          <FriendshipSlotMachine />
          <MemoryWall isOpen={memoryWallOpen} onClose={() => setMemoryWallOpen(false)} />
        </motion.div>
      )}
    </main>
  )
}
