"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import confetti from 'canvas-confetti'

interface Apology {
  id: string
  text: string
  color: string
  rotation: number
}

const APOLOGIES: Apology[] = [
  {
    id: '1',
    text: "I'm sorry for being right about that movie being mid.",
    color: '#ffeaa7',
    rotation: -3,
  },
  {
    id: '2',
    text: "I'm sorry for sending you 15 TikToks in a row while you were sleeping.",
    color: '#ff9ff3',
    rotation: 2,
  },
  {
    id: '3',
    text: "I'm sorry for my terrible mic quality during that one call.",
    color: '#74b9ff',
    rotation: -2,
  },
  {
    id: '4',
    text: "I'm sorry for all the times I made you laugh when you wanted to cry.",
    color: '#a29bfe',
    rotation: 3,
  },
  {
    id: '5',
    text: "I'm sorry for being the chaos in your life (you love it, but still).",
    color: '#55efc4',
    rotation: -1,
  },
  {
    id: '6',
    text: "I'm sorry for not saying sorry sooner sometimes.",
    color: '#ffeaa7',
    rotation: 2,
  },
  {
    id: '7',
    text: "I'm sorry for every moment you felt less than legendary.",
    color: '#fd79a8',
    rotation: -2,
  },
  {
    id: '8',
    text: "I'm sorry for making you read this cringe-fest.",
    color: '#81ecec',
    rotation: 1,
  },
]

export function ApologyBoard() {
  const [isOpen, setIsOpen] = useState(false)
  const [acceptedApologies, setAcceptedApologies] = useState<Set<string>>(new Set())
  const [showMore, setShowMore] = useState(false)

  const visibleApologies = showMore ? APOLOGIES : APOLOGIES.slice(0, 6)

  const handleAccept = (apologyId: string) => {
    if (acceptedApologies.has(apologyId)) return

    setAcceptedApologies(prev => new Set([...prev, apologyId]))

    // Trigger mini confetti burst
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff6b9d', '#00d4ff', '#ffd700'],
      scalar: 0.8,
    })
  }

  const allAccepted = acceptedApologies.size === APOLOGIES.length

  return (
    <>
      {/* Memory Wall Navigation Button */}
      <a href="/Memory_Wall" target="_blank" rel="noopener noreferrer">
        <motion.button
          className="fixed bottom-24 left-6 z-40 px-4 py-2 rounded-full flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            boxShadow: '0 0 25px rgba(102, 126, 234, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)',
            color: '#fff',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.2, type: 'spring' }}
        >
          <span className="text-sm font-medium">Memory Wall</span>
        </motion.button>
      </a>

      {/* Fixed badge button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <motion.button
            className="fixed bottom-6 left-6 z-40 px-4 py-2 rounded-full flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #ff6b9d, #ff9ff3)',
              boxShadow: '0 0 25px rgba(255, 107, 157, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)',
              color: '#fff',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5, type: 'spring' }}
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Apologies</span>
          </motion.button>
        </DialogTrigger>

        <DialogContent
          className="max-w-2xl max-h-[85vh] overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, #0f0a1e, #020408)',
            border: '1px solid rgba(255, 107, 157, 0.3)',
          }}
          showCloseButton={false}
        >
          <DialogHeader className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-0 right-0 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" style={{ color: 'rgba(148, 163, 184, 0.7)' }} />
            </button>
            <DialogTitle
              className="text-2xl text-center"
              style={{
                color: '#ff6b9d',
                textShadow: '0 0 20px rgba(255, 107, 157, 0.5)',
              }}
            >
              The Apology Board
            </DialogTitle>
            <DialogDescription className="text-center" style={{ color: 'rgba(148, 163, 184, 0.7)' }}>
              Things I probably should have apologized for (accept to forgive)
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] px-2 py-4">
            {/* Sticky notes grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <AnimatePresence mode="popLayout">
                {visibleApologies.map((apology, index) => {
                  const isAccepted = acceptedApologies.has(apology.id)

                  return (
                    <motion.div
                      key={apology.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, rotate: apology.rotation }}
                      animate={{
                        opacity: isAccepted ? 0.5 : 1,
                        scale: isAccepted ? 0.95 : 1,
                        rotate: apology.rotation,
                      }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative cursor-pointer group"
                      style={{
                        transform: `rotate(${apology.rotation}deg)`,
                      }}
                      onClick={() => handleAccept(apology.id)}
                    >
                      {/* Sticky note */}
                      <div
                        className="p-3 sm:p-4 rounded-sm shadow-lg min-h-[100px] sm:min-h-[120px] relative overflow-hidden"
                        style={{
                          backgroundColor: apology.color,
                          boxShadow: `4px 4px 10px rgba(0, 0, 0, 0.3), -1px -1px 3px rgba(255, 255, 255, 0.2) inset`,
                        }}
                      >
                        {/* Tape effect */}
                        <div
                          className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-4 sm:h-5 rounded-sm"
                          style={{
                            background: 'rgba(255, 255, 255, 0.4)',
                            transform: 'rotate(-2deg)',
                          }}
                        />

                        {/* Text */}
                        <p
                          className="text-xs sm:text-sm leading-relaxed pt-2"
                          style={{
                            color: '#1a1a2e',
                            fontFamily: "'Caveat', 'Comic Sans MS', cursive",
                            textDecoration: isAccepted ? 'line-through' : 'none',
                          }}
                        >
                          {apology.text}
                        </p>

                      {/* Checkbox */}
                      <motion.div
                        className="absolute bottom-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center cursor-pointer"
                        style={{
                          borderColor: isAccepted ? '#00ff88' : 'rgba(26, 26, 46, 0.3)',
                          backgroundColor: isAccepted ? '#00ff88' : 'transparent',
                        }}
                        animate={isAccepted ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAccept(apology.id)
                        }}
                      >
                        {isAccepted && (
                          <motion.svg
                            viewBox="0 0 24 24"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.path
                              d="M5 12l5 5L20 7"
                              fill="none"
                              stroke="#1a1a2e"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                            />
                          </motion.svg>
                        )}
                      </motion.div>

                        {/* Hover hint */}
                        {!isAccepted && (
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            style={{ background: 'rgba(0, 0, 0, 0.1)' }}
                          >
                            <span className="text-xs font-medium px-2 py-1 rounded bg-white/80 text-gray-700">
                              Click to forgive
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Show more button */}
            {!showMore && APOLOGIES.length > 6 && (
              <motion.button
                onClick={() => setShowMore(true)}
                className="w-full mt-6 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: 'rgba(255, 107, 157, 0.1)',
                  border: '1px dashed rgba(255, 107, 157, 0.3)',
                  color: '#ff6b9d',
                }}
                whileHover={{ background: 'rgba(255, 107, 157, 0.2)' }}
              >
                Show {APOLOGIES.length - 6} more apologies...
              </motion.button>
            )}

            {/* All accepted message */}
            <AnimatePresence>
              {allAccepted && (
                <motion.div
                  className="text-center mt-6 p-4 rounded-lg"
                  style={{ background: 'rgba(0, 255, 136, 0.1)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p
                    className="text-lg font-medium"
                    style={{ color: '#00ff88' }}
                  >
                    All forgiven!
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: 'rgba(148, 163, 184, 0.7)' }}
                  >
                    You&apos;re officially the best friend ever.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-4 text-center">
            <p className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
              {acceptedApologies.size} of {APOLOGIES.length} apologies accepted
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
