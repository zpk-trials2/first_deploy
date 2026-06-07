'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MemoryCard } from './memory-card'
import { memories } from '@/lib/memories'

interface MemoryWallProps {
  isOpen: boolean
  onClose: () => void
}

export function MemoryWall({ isOpen, onClose }: MemoryWallProps) {
  const [rotation, setRotation] = useState(0)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const dragStartRef = useRef({ x: 0, rotation: 0 })

  const radius = 400
  const autoRotationSpeed = 0.2 // degrees per frame

  // Auto-rotation animation loop
  useEffect(() => {
    if (!isDragging && isOpen) {
      const animate = () => {
        setRotation(prev => (prev + autoRotationSpeed) % 360)
        animationFrameRef.current = requestAnimationFrame(animate)
      }
      animationFrameRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isDragging, isOpen])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      rotation,
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStartRef.current.x
    const newRotation = dragStartRef.current.rotation + deltaX * 0.5
    setRotation(newRotation % 360)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown as any)
      return () => {
        window.removeEventListener('keydown', handleKeyDown as any)
      }
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000] pointer-events-auto bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            ref={containerRef}
            onClick={e => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{
              background: 'radial-gradient(ellipse at center, #1a0f2e 0%, #0a0812 100%)',
              perspective: '1200px',
            }}
          >
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '50px 50px',
                  animation: 'scroll 20s linear infinite',
                }}
              />
            </div>

            {/* Memory gallery container */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {memories.map((memory, index) => {
                const angle = (rotation + (index * 360) / memories.length) % 360
                return (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    index={index}
                    angle={angle}
                    radius={radius}
                    isHovered={hoveredId === memory.id}
                    onHover={setHoveredId}
                  />
                )
              })}
            </div>

            {/* Back button */}
            <motion.button
              onClick={onClose}
              className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full backdrop-blur-md border border-cyan-400/50 bg-black/30 hover:bg-black/50 transition-colors"
              style={{
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
              }}
              whileHover={{
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)',
              }}
            >
              <span className="text-sm font-light text-cyan-300">← Back</span>
            </motion.button>

            {/* Instructions */}
            <motion.div
              className="absolute bottom-6 left-6 text-xs text-cyan-300/60 font-light max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Drag to rotate • Hover to view caption • Press ESC to close
            </motion.div>

            {/* Title */}
            <motion.div
              className="absolute top-6 right-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2
                className="text-2xl font-light tracking-wide"
                style={{
                  color: '#00d4ff',
                  textShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
                }}
              >
                Our Memories
              </h2>
            </motion.div>
          </motion.div>

          <style>{`
            @keyframes scroll {
              0% { transform: translate(0, 0); }
              100% { transform: translate(50px, 50px); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
