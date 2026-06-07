'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import * as THREE from 'three'

interface Memory {
  id: string
  type: 'image' | 'audio'
  src: string
  width: number
  height: number
  title: string
}

const MEMORIES: Memory[] = [
  // Images (35)
  { id: '1', type: 'image', src: '/Memory_Wall/1.webp', width: 800, height: 600, title: 'Memory 1' },
  { id: '2', type: 'image', src: '/Memory_Wall/2.webp', width: 800, height: 600, title: 'Memory 2' },
  { id: '3', type: 'image', src: '/Memory_Wall/3.webp', width: 800, height: 600, title: 'Memory 3' },
  { id: '4', type: 'image', src: '/Memory_Wall/4.webp', width: 800, height: 600, title: 'Memory 4' },
  { id: '5', type: 'image', src: '/Memory_Wall/5.webp', width: 800, height: 600, title: 'Memory 5' },
  { id: '6', type: 'image', src: '/Memory_Wall/6.webp', width: 800, height: 600, title: 'Memory 6' },
  { id: '7', type: 'image', src: '/Memory_Wall/7.webp', width: 800, height: 600, title: 'Memory 7' },
  { id: '8', type: 'image', src: '/Memory_Wall/8.webp', width: 800, height: 600, title: 'Memory 8' },
  { id: '9', type: 'image', src: '/Memory_Wall/9.webp', width: 800, height: 600, title: 'Memory 9' },
  { id: '10', type: 'image', src: '/Memory_Wall/10.webp', width: 800, height: 600, title: 'Memory 10' },
  { id: '11', type: 'image', src: '/Memory_Wall/11.webp', width: 800, height: 600, title: 'Memory 11' },
  { id: '12', type: 'image', src: '/Memory_Wall/12.webp', width: 800, height: 600, title: 'Memory 12' },
  { id: '13', type: 'image', src: '/Memory_Wall/13.webp', width: 800, height: 600, title: 'Memory 13' },
  { id: '14', type: 'image', src: '/Memory_Wall/14.webp', width: 800, height: 600, title: 'Memory 14' },
  { id: '15', type: 'image', src: '/Memory_Wall/15.webp', width: 800, height: 600, title: 'Memory 15' },
  { id: '16', type: 'image', src: '/Memory_Wall/16.webp', width: 800, height: 600, title: 'Memory 16' },
  { id: '17', type: 'image', src: '/Memory_Wall/17.webp', width: 800, height: 600, title: 'Memory 17' },
  { id: '18', type: 'image', src: '/Memory_Wall/18.webp', width: 800, height: 600, title: 'Memory 18' },
  { id: '19', type: 'image', src: '/Memory_Wall/19.webp', width: 800, height: 600, title: 'Memory 19' },
  { id: '20', type: 'image', src: '/Memory_Wall/20.webp', width: 800, height: 600, title: 'Memory 20' },
  { id: '21', type: 'image', src: '/Memory_Wall/21.webp', width: 800, height: 600, title: 'Memory 21' },
  { id: '22', type: 'image', src: '/Memory_Wall/22.webp', width: 800, height: 600, title: 'Memory 22' },
  { id: '23', type: 'image', src: '/Memory_Wall/23.webp', width: 800, height: 600, title: 'Memory 23' },
  { id: '24', type: 'image', src: '/Memory_Wall/24.webp', width: 800, height: 600, title: 'Memory 24' },
  { id: '25', type: 'image', src: '/Memory_Wall/25.webp', width: 800, height: 600, title: 'Memory 25' },
  { id: '26', type: 'image', src: '/Memory_Wall/26.webp', width: 800, height: 600, title: 'Memory 26' },
  { id: '27', type: 'image', src: '/Memory_Wall/27.webp', width: 800, height: 600, title: 'Memory 27' },
  { id: '28', type: 'image', src: '/Memory_Wall/28.webp', width: 800, height: 600, title: 'Memory 28' },
  { id: '29', type: 'image', src: '/Memory_Wall/29.webp', width: 800, height: 600, title: 'Memory 29' },
  { id: '30', type: 'image', src: '/Memory_Wall/30.webp', width: 800, height: 600, title: 'Memory 30' },
  { id: '31', type: 'image', src: '/Memory_Wall/31.jpeg', width: 800, height: 600, title: 'Memory 31' },
  { id: '32', type: 'image', src: '/Memory_Wall/32.jpeg', width: 800, height: 600, title: 'Memory 32' },
  { id: '33', type: 'image', src: '/Memory_Wall/33.jpeg', width: 800, height: 600, title: 'Memory 33' },
  { id: '34', type: 'image', src: '/Memory_Wall/34.jpeg', width: 800, height: 600, title: 'Memory 34' },
  { id: '35', type: 'image', src: '/Memory_Wall/35.jpeg', width: 800, height: 600, title: 'Memory 35' },
  // Audio
  { id: 'audio1', type: 'audio', src: '/Memory_Wall/1.opus', width: 200, height: 200, title: 'Audio 1' },
  { id: 'audio2', type: 'audio', src: '/Memory_Wall/2.opus', width: 200, height: 200, title: 'Audio 2' },
  { id: 'audio3', type: 'audio', src: '/Memory_Wall/3.opus', width: 200, height: 200, title: 'Audio 3' },
  { id: 'audio4', type: 'audio', src: '/Memory_Wall/4.opus', width: 200, height: 200, title: 'Audio 4' },
  { id: 'track1', type: 'audio', src: '/Memory_Wall/1.mp3', width: 200, height: 200, title: 'Track 1' },
  { id: 'track2', type: 'audio', src: '/Memory_Wall/2.mp3', width: 200, height: 200, title: 'Track 2' },
]

function MemoryGallery3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const rotationRef = useRef({ x: 0, y: 0 })
  const targetRotationRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const lastMouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 8
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const textureLoader = new THREE.TextureLoader()
    const group = new THREE.Group()
    scene.add(group)

    // Create memory cards arranged in a sphere
    const radius = 6
    const itemsCount = MEMORIES.length

    MEMORIES.forEach((memory, index) => {
      const phi = Math.acos(-1 + (2 * index) / itemsCount)
      const theta = Math.sqrt(itemsCount * Math.PI) * phi

      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      // Create plane geometry for each memory
      const geometry = new THREE.PlaneGeometry(2, 1.5)

      if (memory.type === 'image') {
        textureLoader.load(
          memory.src,
          (texture) => {
            const material = new THREE.MeshBasicMaterial({ map: texture })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(x, y, z)
            mesh.lookAt(0, 0, 0)
            group.add(mesh)
          },
          undefined,
          (error) => console.error('Texture load error:', error)
        )
      } else {
        // Audio: show as colored plane
        const material = new THREE.MeshBasicMaterial({
          color: Math.random() * 0xffffff,
          wireframe: false,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, z)
        mesh.lookAt(0, 0, 0)
        group.add(mesh)
      }
    })

    // Mouse controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      lastMouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = e.clientX - lastMouseRef.current.x
      const deltaY = e.clientY - lastMouseRef.current.y

      targetRotationRef.current.y += deltaX * 0.005
      targetRotationRef.current.x += deltaY * 0.005

      lastMouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    renderer.domElement.addEventListener('mousedown', handleMouseDown)
    renderer.domElement.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('mouseup', handleMouseUp)
    renderer.domElement.addEventListener('mouseleave', handleMouseUp)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Smooth rotation interpolation
      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1

      if (!isDraggingRef.current) {
        // Auto-rotate when not dragging
        targetRotationRef.current.y += 0.001
      }

      group.rotation.x = rotationRef.current.x
      group.rotation.y = rotationRef.current.y

      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('mousedown', handleMouseDown)
      renderer.domElement.removeEventListener('mousemove', handleMouseMove)
      renderer.domElement.removeEventListener('mouseup', handleMouseUp)
      renderer.domElement.removeEventListener('mouseleave', handleMouseUp)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="w-full h-screen" />
}

export default function MemoryWallPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a0a3e 0%, #0a0410 100%)' }}>
      {/* Back Button */}
      <Link href="/">
        <motion.button
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
          }}
          whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.15)' }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>
      </Link>

      {/* 3D Gallery */}
      <MemoryGallery3D />

      {/* Instructions */}
      <div className="fixed bottom-6 left-6 z-40 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        <p>Drag to rotate • Full 360° freedom</p>
      </div>
    </div>
  )
}
