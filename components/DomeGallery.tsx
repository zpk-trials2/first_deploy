'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useGesture } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/web'
import './DomeGallery.css'

interface DomeGalleryProps {
  images: string[]
  fit?: number
  fitBasis?: string
  minRadius?: number
  maxRadius?: number | 'Infinity'
  maxVerticalRotationDeg?: number
  dragSensitivity?: number
  dragDampening?: number
  grayscale?: boolean
  imageBorderRadius?: string
  openedImageWidth?: string
  openedImageHeight?: string
  openedImageBorderRadius?: string
  onImageClick?: (index: number) => void
  customRender?: (src: string, index: number) => React.ReactNode
}

export default function DomeGallery({
  images,
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  maxVerticalRotationDeg = 50,
  dragSensitivity = 20,
  dragDampening = 0.8,
  grayscale = false,
  imageBorderRadius = '16px',
  openedImageWidth = '500px',
  openedImageHeight = '500px',
  openedImageBorderRadius = '20px',
  onImageClick,
  customRender,
}: DomeGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])
  const [rotationY, setRotationY] = useSpring(() => ({ rotationY: 0, config: { tension: 300, friction: 30 } }))
  const [rotationX, setRotationX] = useSpring(() => ({ rotationX: 0, config: { tension: 300, friction: 30 } }))
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })

  const itemCount = images.length
  const angleStep = 360 / itemCount

  // Gesture bindings for drag
  const bind = useGesture({
    onDrag: ({ offset: [x, y], velocity: [vx, vy], last }) => {
      const rotY = (x / dragSensitivity) % 360
      const rotX = Math.max(-maxVerticalRotationDeg, Math.min(maxVerticalRotationDeg, y / dragSensitivity))

      setRotationY({ rotationY: rotY, immediate: false })
      setRotationX({ rotationX: rotX, immediate: false })

      if (last) {
        setVelocity({ x: vx * dragDampening, y: vy * dragDampening })
      }
    },
  })

  // Inertial scrolling
  useEffect(() => {
    if (Math.abs(velocity.x) < 0.01 && Math.abs(velocity.y) < 0.01) return

    const interval = setInterval(() => {
      setVelocity(prev => ({
        x: prev.x * 0.95,
        y: prev.y * 0.95,
      }))

      setRotationY(prev => ({ rotationY: prev.rotationY + velocity.x * 0.5 }))
      setRotationX(prev => ({ 
        rotationX: Math.max(-maxVerticalRotationDeg, Math.min(maxVerticalRotationDeg, prev.rotationX + velocity.y * 0.5))
      }))
    }, 16)

    return () => clearInterval(interval)
  }, [velocity, maxVerticalRotationDeg])

  // Calculate radius based on container
  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    itemsRef.current.forEach((item, index) => {
      if (!item) return

      const angle = (index / itemCount) * Math.PI * 2
      const radius = Math.max(minRadius, Math.min(maxRadius === 'Infinity' ? Infinity : maxRadius, Math.min(width, height) * fit))

      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      item.style.transform = `translate3d(${x}px, 0, ${z}px)`
    })
  }, [itemCount, fit, minRadius, maxRadius])

  return (
    <div
      ref={containerRef}
      {...bind()}
      className="dome-gallery"
      style={{
        perspective: '1200px',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <animated.div
        style={{
          rotateY: rotationY.rotationY.to(r => `${r}deg`),
          rotateX: rotationX.rotationX.to(r => `${r}deg`),
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            ref={el => {
              if (el) itemsRef.current[index] = el
            }}
            className="dome-item"
            onClick={() => onImageClick?.(index)}
            style={{
              position: 'absolute',
              width: fitBasis === 'auto' ? '200px' : fitBasis,
              height: fitBasis === 'auto' ? '200px' : fitBasis,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          >
            <div
              className="item__image"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: imageBorderRadius,
                overflow: 'hidden',
                backgroundColor: '#1a0f2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0, 212, 255, 0.6)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)'
              }}
            >
              {customRender ? customRender(src, index) : <img src={src} alt={`Gallery item ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: grayscale ? 'grayscale(100%)' : 'none' }} />}
            </div>
          </div>
        ))}
      </animated.div>
    </div>
  )
}
