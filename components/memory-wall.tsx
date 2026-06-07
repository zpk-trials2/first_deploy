'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import Image from 'next/image'
import { memories } from '@/lib/memories.config'
import { ParticlePhysics } from '@/lib/particle-physics'

interface MemoryWallProps {
  isOpen: boolean
  onClose: () => void
}

export function MemoryWall({ isOpen, onClose }: MemoryWallProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<ParticlePhysics | null>(null)
  const meshesRef = useRef<Array<THREE.Mesh>>([])
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef({ x: 0, y: 0 })
  const [expandedMemory, setExpandedMemory] = useState<typeof memories[0] | null>(null)

  // Initialize Three.js scene
  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0812)
    scene.fog = new THREE.Fog(0x0a0812, 2000, 10000)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    camera.position.z = 1000
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Particle physics
    const physics = new ParticlePhysics(memories.length, new THREE.Vector3(1200, 800, 400))
    particlesRef.current = physics

    // Create memory cards
    const textureLoader = new THREE.TextureLoader()
    const meshes: THREE.Mesh[] = []

    memories.forEach((memory) => {
      let geometry: THREE.BufferGeometry
      let material: THREE.Material
      let mesh: THREE.Mesh

      if (memory.type === 'image') {
        textureLoader.load(
          memory.src,
          (texture) => {
            const aspectRatio = memory.width && memory.height ? memory.width / memory.height : 1
            geometry = new THREE.PlaneGeometry(80 * aspectRatio, 80)
            material = new THREE.MeshStandardMaterial({
              map: texture,
              emissive: 0x00d4ff,
              emissiveIntensity: 0.1
            })
            mesh = new THREE.Mesh(geometry, material)
            mesh.userData = { memoryId: memory.id, memory }
            scene.add(mesh)
            meshes.push(mesh)
          },
          undefined,
          (error) => {
            console.log('[v0] Image load error for', memory.src, error)
          }
        )
      } else if (memory.type === 'audio') {
        geometry = new THREE.PlaneGeometry(80, 80)
        material = new THREE.MeshStandardMaterial({
          color: 0xbf5af2,
          emissive: 0xbf5af2,
          emissiveIntensity: 0.2
        })
        mesh = new THREE.Mesh(geometry, material)
        mesh.userData = { memoryId: memory.id, memory, isAudio: true }
        scene.add(mesh)
        meshes.push(mesh)
      }
    })

    meshesRef.current = meshes

    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 2000)
    pointLight.position.set(500, 500, 800)
    scene.add(pointLight)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    // Click detection
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const mouse2D = new THREE.Vector2(
        ((e.clientX - rect.left) / width) * 2 - 1,
        -((e.clientY - rect.top) / height) * 2 + 1
      )

      raycasterRef.current.setFromCamera(mouse2D, cameraRef.current)
      const intersects = raycasterRef.current.intersectObjects(meshes)

      if (intersects.length > 0) {
        const clicked = intersects[0].object as THREE.Mesh
        const memory = clicked.userData.memory
        if (memory) setExpandedMemory(memory)
      }
    }

    containerRef.current.addEventListener('mousemove', handleMouseMove)
    containerRef.current.addEventListener('click', handleClick)

    // Animation loop
    let lastTime = Date.now()
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const now = Date.now()
      const deltaTime = Math.min((now - lastTime) / 1000, 0.016)
      lastTime = now

      // Update physics
      if (particlesRef.current && containerRef.current) {
        particlesRef.current.update(deltaTime, mouseRef.current, {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })

        // Update mesh positions from particles
        meshes.forEach((mesh, index) => {
          const particle = particlesRef.current!.particles[index]
          if (particle && mesh) {
            mesh.position.copy(particle.position)
            // Slight rotation for visual interest
            mesh.rotation.x += deltaTime * 0.1
            mesh.rotation.y += deltaTime * 0.05
          }
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeEventListener('click', handleClick)
      if (containerRef.current && renderer && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/90"
      >
        {/* Canvas Container */}
        <div
          ref={containerRef}
          className="w-full h-full relative"
        >
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 text-3xl text-[#00d4ff] hover:text-[#bf5af2] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✕
          </motion.button>

          {/* Instructions */}
          <div className="absolute bottom-6 left-6 text-[#00d4ff] text-sm font-light pointer-events-none">
            <p>Drag to move • Click to expand • ESC to close</p>
          </div>
        </div>

        {/* Expanded Memory Modal */}
        <AnimatePresence>
          {expandedMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedMemory(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-gradient-to-br from-[#1a0f2e] to-[#0a0812] rounded-lg p-8 max-w-2xl max-h-[80vh] border border-[#00d4ff]"
                style={{
                  boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)'
                }}
              >
                <button
                  onClick={() => setExpandedMemory(null)}
                  className="absolute top-4 right-4 text-[#00d4ff] text-3xl hover:text-[#bf5af2] transition"
                >
                  ✕
                </button>

                {expandedMemory.type === 'image' && (
                  <div className="relative w-full">
                    <Image
                      src={expandedMemory.src}
                      alt={expandedMemory.caption}
                      width={expandedMemory.width || 600}
                      height={expandedMemory.height || 600}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}

                {expandedMemory.type === 'audio' && (
                  <div className="space-y-6">
                    <div className="w-full h-24 bg-gradient-to-r from-[#bf5af2] to-[#00d4ff] rounded-lg flex items-center justify-center">
                      <span className="text-5xl">🎵</span>
                    </div>
                    <audio
                      src={expandedMemory.src}
                      controls
                      className="w-full h-12"
                      autoPlay
                    />
                  </div>
                )}

                <p className="mt-6 text-[#00d4ff] text-lg font-light">{expandedMemory.caption}</p>
                {expandedMemory.date && (
                  <p className="text-sm text-gray-400 mt-2">{expandedMemory.date}</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ESC to close */}
        <input
          type="hidden"
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
          }}
          autoFocus
        />
      </motion.div>
    </AnimatePresence>
  )
}
