'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Memory } from '@/lib/memories'

interface MemoryCardProps {
  memory: Memory
  index: number
  angle: number
  radius: number
  isHovered: boolean
  onHover: (id: string | null) => void
}

export const MemoryCard = memo(function MemoryCard({
  memory,
  index,
  angle,
  radius,
  isHovered,
  onHover,
}: MemoryCardProps) {
  // Calculate position on circle
  const x = Math.cos((angle * Math.PI) / 180) * radius
  const y = Math.sin((angle * Math.PI) / 180) * radius
  
  // Calculate depth and scale based on Y position
  const depth = (y + radius) / (radius * 2)
  const scale = 0.5 + depth * 0.5
  const zIndex = Math.round(depth * 1000)

  // Scale image to fit within max bounds
  const maxWidth = 200
  const maxHeight = 200
  let displayWidth = memory.width
  let displayHeight = memory.height

  const ratio = memory.width / memory.height
  if (displayWidth > maxWidth) {
    displayWidth = maxWidth
    displayHeight = displayWidth / ratio
  }
  if (displayHeight > maxHeight) {
    displayHeight = maxHeight
    displayWidth = displayHeight * ratio
  }

  const isMemoryHovered = isHovered

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex,
      }}
      onMouseEnter={() => onHover(memory.id)}
      onMouseLeave={() => onHover(null)}
      animate={{
        filter: isMemoryHovered ? 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.6))' : 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))',
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative rounded-lg overflow-hidden border border-cyan-400/30 bg-black/20 backdrop-blur-sm"
        animate={{
          scale: isMemoryHovered ? 1.1 : 1,
          borderColor: isMemoryHovered ? 'rgba(0, 212, 255, 0.8)' : 'rgba(0, 212, 255, 0.3)',
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Image/GIF */}
        {(memory.type === 'image' || memory.type === 'gif') && (
          <Image
            src={memory.src}
            alt={memory.caption}
            width={memory.width}
            height={memory.height}
            priority={index < 5}
            loading={index < 5 ? 'eager' : 'lazy'}
            className="object-cover"
            style={{
              width: displayWidth,
              height: displayHeight,
              aspectRatio: `${memory.width} / ${memory.height}`,
            }}
          />
        )}

        {/* Audio Card */}
        {memory.type === 'audio' && (
          <div
            className="flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-950"
            style={{ width: displayWidth, height: displayHeight }}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">♫</div>
              <p className="text-xs text-cyan-400">{memory.caption}</p>
            </div>
          </div>
        )}

        {/* Caption overlay */}
        {isMemoryHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-2 py-1"
          >
            <p className="text-xs text-cyan-300 text-center truncate font-light">
              {memory.caption}
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
})
