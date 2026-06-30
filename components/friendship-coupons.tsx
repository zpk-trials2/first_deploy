"use client"

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, MessageCircle, Gamepad2, VolumeX, X, Download } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer'
import html2canvas from 'html2canvas'
import DomeGallery from '@/components/DomeGallery'

interface Coupon {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const COUPONS: Coupon[] = [
  {
    id: 'venting-pass',
    title: 'The Venting Pass',
    description: 'Good for one 30-minute session where I just listen to you complain about your boss/school and I don\'t give any unwanted advice.',
    icon: <MessageCircle className="w-6 h-6" />,
    color: '#00d4ff',
  },
  {
    id: 'game-token',
    title: 'Pick the Game Token',
    description: 'You get to choose what we play/watch next time, no questions asked.',
    icon: <Gamepad2 className="w-6 h-6" />,
    color: '#bf5af2',
  },
  {
    id: 'bad-joke-exemption',
    title: 'Bad Joke Exemption',
    description: 'I promise not to make a "that\'s what she said" joke for 24 hours.',
    icon: <VolumeX className="w-6 h-6" />,
    color: '#ffd700',
  },
  {
    id: 'no-judgement-pass',
    title: 'The No-Judgement Pass',
    description: 'Tell me literally anything without fear. No judgment, no lectures, no side-eyes.',
    icon: <MessageCircle className="w-6 h-6" />,
    color: '#ff6b9d',
  },
  {
    id: 'favor-card',
    title: 'Unlimited Favor Card',
    description: 'Cash this in for me doing literally one thing you want. Anything. (Within legal limits, probably).',
    icon: <Gamepad2 className="w-6 h-6" />,
    color: '#00ff88',
  },
  {
    id: 'midnight-call-pass',
    title: 'The Midnight Call Pass',
    description: 'You can call me at 3am and I\'ll answer. Always. No questions about why.',
    icon: <MessageCircle className="w-6 h-6" />,
    color: '#ffa500',
  },
  {
    id: 'honest-opinion-pass',
    title: 'Brutally Honest Opinion Pass',
    description: 'Ask me anything and get the 100% real, unfiltered, no-sugar-coating truth.',
    icon: <VolumeX className="w-6 h-6" />,
    color: '#ff375f',
  },
]

const FIXED_VALIDATION_CODES: { [key: string]: string } = {
  'venting-pass': 'FC-VP-2024',
  'game-token': 'FC-GT-2024',
  'bad-joke-exemption': 'FC-BJE-2024',
  'no-judgement-pass': 'FC-NJP-2024',
  'favor-card': 'FC-UFC-2024',
  'midnight-call-pass': 'FC-MCP-2024',
  'honest-opinion-pass': 'FC-HOP-2024',
}

export function FriendshipCoupons() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showMemoryWall, setShowMemoryWall] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  const generateReceipt = useCallback(async (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setIsGenerating(true)

    // Wait for receipt to render
    await new Promise(resolve => setTimeout(resolve, 100))

    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          backgroundColor: '#0a0812',
          scale: 2,
        })
        
        const link = document.createElement('a')
        link.download = `friendship-coupon-${coupon.id}-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } catch (error) {
        console.error('Failed to generate receipt:', error)
      }
    }

    setTimeout(() => {
      setIsGenerating(false)
      setSelectedCoupon(null)
    }, 500)
  }, [])

  const validationCode = FIXED_VALIDATION_CODES[selectedCoupon?.id || ''] || 'FC-INVALID'
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      {/* Memory Wall Button - Above Cart */}
      <motion.button
        onClick={() => setShowMemoryWall(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #00d4ff, #764ba2)',
          boxShadow: '0 0 25px rgba(0, 212, 255, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.1, type: 'spring' }}
        title="View Memory Wall"
      >
        <span className="text-xl">🖼️</span>
      </motion.button>

      {/* Memory Wall Modal */}
      <AnimatePresence>
        {showMemoryWall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
            onClick={() => setShowMemoryWall(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowMemoryWall(false)}
                className="absolute top-6 right-6 z-[10000] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <DomeGallery
                fit={0.8}
                minRadius={600}
                maxVerticalRotationDeg={0}
                segments={34}
                dragDampening={2}
                grayscale
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed cart icon */}
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
        <DrawerTrigger asChild>
          <motion.button
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #bf5af2, #00d4ff)',
              boxShadow: '0 0 25px rgba(191, 90, 242, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, type: 'spring' }}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff6b9d] text-white text-xs flex items-center justify-center font-bold">
              7
            </span>
          </motion.button>
        </DrawerTrigger>

        <DrawerContent
          className="h-full"
          style={{
            background: 'linear-gradient(to bottom, #0f0a1e, #020408)',
            borderLeft: '1px solid rgba(191, 90, 242, 0.3)',
          }}
        >
          <DrawerHeader className="border-b border-white/10">
            <DrawerTitle className="text-xl" style={{ color: '#00d4ff' }}>
              Friendship Coupons
            </DrawerTitle>
            <DrawerDescription style={{ color: 'rgba(148, 163, 184, 0.8)' }}>
              Redeem your exclusive friendship perks
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {COUPONS.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                className="relative p-4 rounded-lg cursor-pointer group"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `2px dashed ${coupon.color}40`,
                  boxShadow: `0 0 15px ${coupon.color}15`,
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  borderColor: `${coupon.color}80`,
                  boxShadow: `0 0 25px ${coupon.color}30`,
                }}
                onClick={() => generateReceipt(coupon)}
              >
                {/* Icon */}
                <div
                  className="absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${coupon.color}, ${coupon.color}80)`,
                    boxShadow: `0 0 15px ${coupon.color}50`,
                  }}
                >
                  {coupon.icon}
                </div>

                {/* Content */}
                <div className="ml-6">
                  <h3
                    className="font-semibold text-base mb-1"
                    style={{ color: coupon.color }}
                  >
                    {coupon.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(148, 163, 184, 0.9)' }}
                  >
                    {coupon.description}
                  </p>
                </div>

                {/* Redeem button */}
                <motion.div
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs px-2 py-1 rounded"
                  style={{ background: `${coupon.color}20`, color: coupon.color }}
                >
                  <Download className="w-3 h-3" />
                  Redeem
                </motion.div>

                {/* Decorative corner cuts */}
                <div
                  className="absolute top-0 right-0 w-4 h-4"
                  style={{
                    background: 'linear-gradient(135deg, transparent 50%, #0f0a1e 50%)',
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 w-4 h-4"
                  style={{
                    background: 'linear-gradient(-45deg, transparent 50%, #0f0a1e 50%)',
                  }}
                />
              </motion.div>
            ))}

            {/* Footer text */}
            <p className="text-center text-xs pt-4" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
              Click a coupon to download your redemption receipt
            </p>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Hidden receipt for capture */}
      <AnimatePresence>
        {selectedCoupon && (
          <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
            <div
              ref={receiptRef}
              className="w-[350px] p-6 rounded-lg"
              style={{
                background: 'linear-gradient(to bottom, #0f0a1e, #0a0812)',
                border: `2px solid ${selectedCoupon.color}`,
                boxShadow: `0 0 30px ${selectedCoupon.color}40`,
              }}
            >
              {/* Header */}
              <div className="text-center border-b border-white/10 pb-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${selectedCoupon.color}, ${selectedCoupon.color}60)`,
                    boxShadow: `0 0 20px ${selectedCoupon.color}50`,
                  }}
                >
                  {selectedCoupon.icon}
                </div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: selectedCoupon.color }}
                >
                  {selectedCoupon.title}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                  FRIENDSHIP COUPON
                </p>
              </div>

              {/* Description */}
              <div className="text-center mb-4">
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(148, 163, 184, 0.9)' }}>
                  {selectedCoupon.description}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Dealer:</span>
                  <span style={{ color: '#00d4ff' }}>Your Best Friend</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Customer:</span>
                  <span style={{ color: '#bf5af2' }}>Diksha Jangra</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(148, 163, 184, 0.6)' }}>Date:</span>
                  <span style={{ color: 'rgba(148, 163, 184, 0.9)' }}>{timestamp}</span>
                </div>
              </div>

              {/* Validation code */}
              <div
                className="mt-4 p-3 rounded text-center"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              >
                <p className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                  VALIDATION CODE
                </p>
                <p
                  className="font-mono text-lg font-bold tracking-wider"
                  style={{ color: '#ffd700' }}
                >
                  {validationCode}
                </p>
              </div>

              {/* Stamp */}
              <div className="mt-4 text-center">
                <div
                  className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    border: '2px solid #00ff88',
                    color: '#00ff88',
                    transform: 'rotate(-5deg)',
                  }}
                >
                  VALID FOREVER
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            className="fixed inset-0 z-[99] flex items-center justify-center"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4"
                style={{ borderColor: '#bf5af2', borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p style={{ color: '#00d4ff' }}>Generating your receipt...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
