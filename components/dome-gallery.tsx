'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { domeImages } from '@/lib/dome-gallery-config'

export function DomeGallery({ onClose }: { onClose?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sphereGroupRef = useRef<THREE.Group | null>(null)
  const raycasterRef = useRef(new THREE.Raycaster())
  const rotationRef = useRef({ x: 0, y: 0 })
  const rotationVelocityRef = useRef({ x: 0.002, y: 0.005 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  const [expandedImage, setExpandedImage] = useState<(typeof domeImages)[0] | null>(null)

  const RADIUS = 1200
  const DAMPING = 0.92

  useEffect(() => {
    if (!containerRef.current) return

    // SCENE SETUP
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0812)
    sceneRef.current = scene

    // CAMERA SETUP
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    camera.position.z = 0
    cameraRef.current = camera

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // CREATE SPHERE GROUP
    const sphereGroup = new THREE.Group()
    scene.add(sphereGroup)
    sphereGroupRef.current = sphereGroup

    // DISTRIBUTE IMAGES ON SPHERE
    const imagesMeshes: Array<{ mesh: THREE.Mesh; imageData: (typeof domeImages)[0] }> = []
    const textureLoader = new THREE.TextureLoader()
    const imageCount = domeImages.length
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    domeImages.forEach((imgData, index) => {
      const i = index + 0.5
      const theta = Math.acos(1 - (2 * i) / imageCount)
      const phi = goldenAngle * index

      const x = RADIUS * Math.sin(theta) * Math.cos(phi)
      const y = RADIUS * Math.sin(theta) * Math.sin(phi)
      const z = RADIUS * Math.cos(theta)

      const geometry = new THREE.PlaneGeometry(200, 200)

      textureLoader.load(imgData.src, (texture) => {
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          emissive: new THREE.Color(0x00d4ff),
          emissiveIntensity: 0.1,
          metalness: 0.3,
          roughness: 0.4,
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, z)

        const direction = new THREE.Vector3(x, y, z).normalize()
        mesh.lookAt(direction.multiplyScalar(RADIUS + 100))

        ;(mesh as any).imageData = imgData
        ;(mesh as any).originalPosition = new THREE.Vector3(x, y, z)

        sphereGroup.add(mesh)
        imagesMeshes.push({ mesh, imageData: imgData })
      })
    })

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00d4ff, 1, 5000)
    pointLight.position.set(RADIUS * 0.5, RADIUS * 0.5, RADIUS * 0.8)
    scene.add(pointLight)

    // DRAG INTERACTION
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

    // CLICK DETECTION
    const handleClick = (e: MouseEvent) => {
      if (isDraggingRef.current) return

      const rect = containerRef.current!.getBoundingClientRect()
      const mouse2D = new THREE.Vector2(
        ((e.clientX - rect.left) / width) * 2 - 1,
        -((e.clientY - rect.top) / height) * 2 + 1
      )

      raycasterRef.current.setFromCamera(mouse2D, camera)
      const intersects = raycasterRef.current.intersectObjects(sphereGroup.children)

      if (intersects.length > 0) {
        const clicked = intersects[0].object as any
        if (clicked.imageData) {
          setExpandedImage(clicked.imageData)
        }
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseDrag)
    containerRef.current.addEventListener('click', handleClick)

    // ANIMATION LOOP
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

      if (sphereGroup) {
        sphereGroup.rotation.x = rotationRef.current.x
        sphereGroup.rotation.y = rotationRef.current.y
      }

      renderer.render(scene, camera)
    }

    animate()

    // HANDLE RESIZE
    const handleResize = () => {
      const newWidth = containerRef.current!.clientWidth
      const newHeight = containerRef.current!.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // CLEANUP
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseDrag)
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeEventListener('click', handleClick)
      if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <>
      {/* Back Button */}
      {onClose && (
        <motion.button
          onClick={onClose}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-6 left-6 z-[1000] p-3 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #764ba2)',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
            color: '#fff',
          }}
          title="Return to main page"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {/* Canvas Container */}
      <div ref={containerRef} className="w-full h-screen bg-black relative overflow-hidden" />

      {/* Expanded Image Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-4 right-4 text-[#00d4ff] text-3xl hover:text-[#bf5af2] transition z-10"
              >
                ✕
              </button>

              <Image
                src={expandedImage.src}
                alt={expandedImage.caption}
                width={600}
                height={600}
                className="rounded-lg border border-[#00d4ff]"
                style={{
                  boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)',
                }}
              />

              <p className="text-center mt-4 text-[#00d4ff] text-lg">{expandedImage.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
