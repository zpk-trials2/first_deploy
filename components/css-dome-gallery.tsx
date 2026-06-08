'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { domeImages } from '@/lib/dome-gallery-config'
import './css-dome-gallery.css'

export function CSSdomGallery({ onClose }: { onClose?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  const rotationRef = useRef({ x: 0, y: 0 })
  const rotationVelocityRef = useRef({ x: 0.002, y: 0.005 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  const [expandedImage, setExpandedImage] = useState<(typeof domeImages)[0] | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const RADIUS = 800
  const CARD_WIDTH = 200
  const CARD_HEIGHT = 200
  const DAMPING = 0.92

  const calculateCardPosition = (index: number) => {
    const imageCount = domeImages.length
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    const i = index + 0.5

    const theta = Math.acos(1 - (2 * i) / imageCount)
    const phi = goldenAngle * index

    const x = RADIUS * Math.sin(theta) * Math.cos(phi)
    const y = RADIUS * Math.sin(theta) * Math.sin(phi)
    const z = RADIUS * Math.cos(theta)

    return { x, y, z }
  }

  useEffect(() => {
    if (!containerRef.current || !sphereRef.current) return

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      dragStartRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    const handleMouseDrag = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      rotationVelocityRef.current.y = deltaX * 0.01
      rotationVelocityRef.current.x = deltaY * 0.01

      dragStartRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const card = target.closest('[data-image-id]')
      if (card && !isDraggingRef.current) {
        const imageId = card.getAttribute('data-image-id')
        const image = domeImages.find(img => img.id === imageId)
        if (image) {
          setExpandedImage(image)
        }
      }
    }

    containerRef.current.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseDrag)
    containerRef.current.addEventListener('click', handleClick)

    const animate = () => {
      requestAnimationFrame(animate)

      if (!isDraggingRef.current) {
        rotationVelocityRef.current.x *= DAMPING
        rotationVelocityRef.current.y *= DAMPING

        if (Math.abs(rotationVelocityRef.current.x) < 0.0001) {
          rotationVelocityRef.current.x = 0.002
        }
        if (Math.abs(rotationVelocityRef.current.y) < 0.0005) {
          rotationVelocityRef.current.y = 0.005
        }
      }

      rotationRef.current.x += rotationVelocityRef.current.x
      rotationRef.current.y += rotationVelocityRef.current.y

      if (sphereRef.current) {
        sphereRef.current.style.transform = `rotateX(${rotationRef.current.x}rad) rotateY(${rotationRef.current.y}rad)`
      }

      cardsRef.current.forEach((card, index) => {
        if (card) {
          const rotY = rotationRef.current.y
          const rotX = rotationRef.current.x
          const depth = Math.sin(rotY) * Math.cos(rotX)
          card.style.zIndex = Math.round((depth + 1) * 1000).toString()
        }
      })
    }

    animate()

    return () => {
      containerRef.current?.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseDrag)
      containerRef.current?.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <>
      <div ref={containerRef} className="dome-gallery-container">
        {/* Back Button */}
        {onClose && (
          <motion.button
            onClick={onClose}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="dome-back-button"
            title="Return to main page"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}

        <div ref={sphereRef} className="dome-sphere">
          {domeImages.map((image, index) => {
            const { x, y, z } = calculateCardPosition(index)
            return (
              <div
                key={image.id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
                className="dome-card"
                data-image-id={image.id}
                style={{
                  transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                }}
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="dome-card-inner">
                  <Image
                    src={image.src}
                    alt={image.caption}
                    fill
                    className="dome-card-image"
                    sizes="(max-width: 768px) 100vw, 200px"
                    onError={(e) => {
                      console.log(`[v0] Image failed to load: ${image.src}`)
                    }}
                  />
                  <div className="dome-card-label">{image.caption}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="dome-overlay" />
      </div>

      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
            className="dome-modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="dome-modal"
            >
              <button
                onClick={() => setExpandedImage(null)}
                className="dome-modal-close"
              >
                ✕
              </button>

              <div className="dome-modal-content">
                <Image
                  src={expandedImage.src}
                  alt={expandedImage.caption}
                  width={500}
                  height={500}
                  className="dome-modal-image"
                />
                <p className="dome-modal-caption">{expandedImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
