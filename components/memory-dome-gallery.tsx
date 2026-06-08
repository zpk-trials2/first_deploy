'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import DomeGallery from './DomeGallery'
import { allMemories, MemoryItem } from '@/lib/memories.extended'
import { AudioPlayer } from './audio-player'
import './DomeGallery.css'

export function MemoryDomeGallery() {
  const [expandedMemory, setExpandedMemory] = useState<MemoryItem | null>(null)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const emojiRainfallRef = useRef<HTMLDivElement>(null)

  // Prepare images array for DomeGallery - use placeholder for non-images
  const galleryItems = allMemories.map((memory, idx) => ({
    id: memory.id,
    type: memory.type,
    memory,
    index: idx,
  }))

  // Custom tile renderer for DomeGallery
  const renderTile = useCallback((memory: MemoryItem) => {
    if (memory.type === 'image') {
      return (
        <Image
          src={memory.src!}
          alt={memory.caption}
          fill
          style={{ objectFit: 'cover' }}
          priority={false}
          unoptimized
        />
      )
    }

    if (memory.type === 'audio') {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#bf5af2] to-[#00d4ff]">
          <span className="text-4xl">🎵</span>
        </div>
      )
    }

    if (memory.type === 'emoji') {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#1a0f2e] to-[#0a0812] rounded-lg border-2 border-[#00d4ff]">
          <span className="text-6xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(191, 90, 242, 0.8))' }}>
            {memory.emoji}
          </span>
        </div>
      )
    }
  }, [])

  // Handle tile click
  const handleTileClick = useCallback((index: number) => {
    const memory = allMemories[index]
    if (!memory) return

    if (memory.type === 'emoji') {
      setSelectedEmoji(memory.emoji!)
      triggerEmojiRainfall(memory.emoji!)
    } else {
      setExpandedMemory(memory)
    }
  }, [])

  // Emoji rainfall effect
  const triggerEmojiRainfall = (emoji: string) => {
    if (!emojiRainfallRef.current) return

    for (let i = 0; i < 30; i++) {
      const fall = document.createElement('div')
      fall.textContent = emoji
      fall.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: -50px;
        font-size: ${30 + Math.random() * 40}px;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.8;
        transform: rotate(${Math.random() * 360}deg);
        filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.6));
        animation: fall ${2 + Math.random() * 2}s linear forwards;
      `

      document.body.appendChild(fall)

      fall.addEventListener('animationend', () => fall.remove())
    }
  }

  return (
    <>
      <div ref={emojiRainfallRef} />

      {/* CSS for emoji falling animation */}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* DomeGallery Component */}
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <DomeGallery
          images={allMemories.map(() => 'data:image/svg+xml,%3Csvg/%3E')}
          fit={0.5}
          fitBasis="200px"
          minRadius={600}
          maxRadius={Infinity}
          maxVerticalRotationDeg={50}
          dragSensitivity={20}
          dragDampening={0.8}
          grayscale={false}
          imageBorderRadius="16px"
          customRender={(_, index) => renderTile(allMemories[index])}
          onImageClick={handleTileClick}
        />
      </div>

      {/* Expanded Memory Modal */}
      <AnimatePresence>
        {expandedMemory && (
          <ExpandedMemoryModal
            memory={expandedMemory}
            onClose={() => setExpandedMemory(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Modal for expanded image/audio view
function ExpandedMemoryModal({ memory, onClose }: { memory: MemoryItem; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.5, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-gradient-to-br from-[#1a0f2e] to-[#0a0812] rounded-lg p-8 max-w-3xl border border-[#00d4ff]"
        style={{
          boxShadow: '0 0 50px rgba(0, 212, 255, 0.3), 0 0 20px rgba(191, 90, 242, 0.2)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#00d4ff] text-3xl hover:text-[#bf5af2] transition"
        >
          ✕
        </button>

        {memory.type === 'image' && (
          <div className="space-y-4">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <Image
                src={memory.src!}
                alt={memory.caption}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
          </div>
        )}

        {memory.type === 'audio' && (
          <div className="space-y-6">
            <div className="w-full h-24 bg-gradient-to-r from-[#bf5af2] to-[#00d4ff] rounded-lg flex items-center justify-center">
              <span className="text-6xl">🎵</span>
            </div>
            <AudioPlayer src={memory.src!} caption={memory.caption} />
          </div>
        )}

        <div className="mt-6 space-y-2">
          <p className="text-[#00d4ff] text-2xl font-light">{memory.caption}</p>
          {memory.date && <p className="text-sm text-gray-400">{memory.date}</p>}
        </div>
      </motion.div>
    </motion.div>
  )
}
