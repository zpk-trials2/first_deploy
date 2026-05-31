"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

const GLB_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grim_reaper_with_golden_angel_dark_wings-UIapNESP2iFXd6QFlTCQZw52ZvZQuD.glb'

const dragState = { isDragging: false, startX: 0, startY: 0, velocityX: 0, velocityY: 0, autoRotate: true }

// ─── 3D Model ─────────────────────────────────────────────────────────────────

function GrimReaperModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(GLB_URL)
  const ready = useRef(false)

  // Clone once so we never mutate the cached scene
  const cloned = useRef<THREE.Object3D | null>(null)
  if (!cloned.current) {
    cloned.current = scene.clone(true)
  }

  useEffect(() => {
    if (!cloned.current || ready.current) return
    ready.current = true

    // Compute bounds on the cloned object, then scale + center it
    const box = new THREE.Box3().setFromObject(cloned.current)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 6.0 / maxDim

    cloned.current.scale.setScalar(scale)
    // After scaling, recompute center to shift it to origin
    const box2 = new THREE.Box3().setFromObject(cloned.current)
    const center2 = box2.getCenter(new THREE.Vector3())
    cloned.current.position.set(-center2.x +1.0, -center2.y -1.5, -center2.z)

    // Crimson tint
    cloned.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            const mc = m.clone()
            mc.color.multiplyScalar(0.25)
            mc.color.lerp(new THREE.Color('#220000'), 0.5)
            mc.emissive = new THREE.Color('#1a0000')
            mc.emissiveIntensity = 0.2
            mc.roughness = 0.85
            mc.metalness = 0.15
            mesh.material = mc
          }
        })
      }
    })
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    if (dragState.isDragging) {
      groupRef.current.rotation.y += dragState.velocityX
      groupRef.current.rotation.x += dragState.velocityY
      dragState.velocityX *= 0.92
      dragState.velocityY *= 0.92
    } else if (dragState.autoRotate) {
      groupRef.current.rotation.y += 0.004
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={cloned.current!} />
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.12} color="#1a0000" />
      <directionalLight position={[0, 4, 3]} intensity={2.0} color="#ff1a1a" />
      <directionalLight position={[0, 2, -4]} intensity={0.6} color="#ff0000" />
      <pointLight position={[2, 2, 2]} intensity={1.2} color="#ff2200" distance={8} />
      <pointLight position={[-2, 0, 2]} intensity={0.4} color="#660000" distance={6} />
      <Suspense fallback={null}>
        <GrimReaperModel />
        <ContactShadows
          position={[0, -7.0, 0]}
          opacity={0.6}
          scale={4}
          blur={2.5}
          color="#ff0000"
          far={4}
        />
      </Suspense>
    </>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface GrimReaper404Props {
  onRetry: () => void
}

export function GrimReaper404({ onRetry }: GrimReaper404Props) {
  const [phase, setPhase] = useState<'glitch' | 'reaper'>('glitch')
  const [glitchLines, setGlitchLines] = useState<Array<{ text: string; color: string }>>([])
  const [breachNumber, setBreachNumber] = useState('')
  const [timestamp, setTimestamp] = useState('')

  const corruptedStrings = [
    'SYSTEM BREACH DETECTED',
    'UNAUTHORIZED ACCESS ATTEMPT',
    'FIREWALL COMPROMISED',
    'ERR_NULL_0x',
    'MEMORY DUMP: 0xFFFFFF',
    'KERNEL PANIC — NOT SYNCING',
    '████████████████████',
    '̷̡̛̗̳͎͙̩͗̋C̸O̷R̸R̸U̸P̸T̸E̸D̸',
  ]
  const colors = ['#ff0000', '#ff3b3b', '#ff6b6b']

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragState.isDragging = true
    dragState.autoRotate = false
    dragState.startX = e.clientX
    dragState.startY = e.clientY
    dragState.velocityX = 0
    dragState.velocityY = 0
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.isDragging) return
    dragState.velocityX = (e.clientX - dragState.startX) * 0.01
    dragState.velocityY = (e.clientY - dragState.startY) * 0.01
    dragState.startX = e.clientX
    dragState.startY = e.clientY
  }
  const handlePointerUp = () => {
    dragState.isDragging = false
    setTimeout(() => { dragState.autoRotate = true }, 500)
  }

  useEffect(() => {
    const initialLines = Array.from({ length: 12 }, () => ({
      text: corruptedStrings[Math.floor(Math.random() * corruptedStrings.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setGlitchLines(initialLines)
    setBreachNumber(Math.floor(Math.random() * 9000 + 1000).toString())
    const now = new Date()
    setTimestamp(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`)

    const glitchInterval = setInterval(() => {
      setGlitchLines(prev => {
        const next = [...prev]
        ;[0,1,2,3].map(() => Math.floor(Math.random() * 12)).forEach(i => {
          next[i] = {
            text: corruptedStrings[Math.floor(Math.random() * corruptedStrings.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
          }
        })
        return next
      })
    }, 120)

    const timer = setTimeout(() => {
      clearInterval(glitchInterval)
      setPhase('reaper')
    }, 1500)

    return () => { clearInterval(glitchInterval); clearTimeout(timer) }
  }, [])

  const glitchStyles = `
    @keyframes glitch-skew {
      0%   { transform: skewX(0deg) }
      20%  { transform: skewX(-3deg) }
      40%  { transform: skewX(2deg) }
      60%  { transform: skewX(-1deg) }
      80%  { transform: skewX(3deg) }
      100% { transform: skewX(0deg) }
    }
    @keyframes error-flicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1 }
      20%, 24%, 55% { opacity: 0 }
    }
    .glitch-line { animation: glitch-skew 0.3s infinite; }
    .error-text  { animation: error-flicker 1.5s infinite; }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: glitchStyles }} />

      <AnimatePresence mode="wait">

        {/* ── GLITCH PHASE ── */}
        {phase === 'glitch' && (
          <div className="fixed inset-0 z-[9999] bg-black overflow-hidden cursor-none">
            <div className="absolute inset-0 pointer-events-none z-10"
              style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)' }}
            />
            <div className="absolute inset-0 flex flex-col justify-center px-10 py-20">
              {glitchLines.map((line, idx) => (
                <div key={idx} className={`font-mono text-sm mb-2 ${idx % 3 === 0 ? 'glitch-line' : ''}`}
                  style={{ color: line.color }}>
                  {line.text}
                </div>
              ))}
            </div>
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 error-text whitespace-nowrap"
              style={{ fontSize: 'clamp(4rem,15vw,10rem)', fontWeight: 900, fontFamily: 'monospace',
                color: '#ff0000', textShadow: '4px 0 #ff0000, -4px 0 rgba(0,255,255,0.5)', letterSpacing: '0.1em' }}>
              ERROR
            </div>
          </div>
        )}

        {/* ── REAPER PHASE ── */}
        {phase === 'reaper' && (
          <motion.div
            className="fixed inset-0 z-50 overflow-visible"
            style={{ background: 'linear-gradient(180deg, #0a0305 0%, #1a0a15 50%, #0d0005 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(80,0,0,0.7) 100%)' }}
            />

            <div className="relative z-10 w-full h-full flex flex-col md:w-full md:flex-row items-center justify-center gap-8 md:gap-12 px-6 py-8">

              {/* ── LEFT: 3D Canvas ── */}
              <motion.div
               className="absolute inset-0"
               initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                  <Canvas
                    camera={{ position: [0, 0, 5.5], fov: 50 }}
                    style={{ width: '100%', height: '100%', background: 'transparent' }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, alpha: true }}
                  >
                  <Scene />
                </Canvas>

                <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-xs"
                  style={{ color: 'rgba(255,0,0,0.3)' }}>
                  drag to rotate
                </p>
              </motion.div>

              {/* ── RIGHT: Text ── */}
              <div className="relative z-10 max-w-lg text-center md:text-left">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  style={{ fontSize: 'clamp(1.5rem,5vw,2.5rem)', fontWeight: 900,
                    fontFamily: 'monospace', color: '#ff0000',
                    textShadow: '0 0 20px rgba(255,0,0,0.5)', letterSpacing: '0.2em' }}>
                  403 — ACCESS DENIED
                </motion.div>

                <motion.svg width="96" height="2" viewBox="0 0 96 2" className="mx-auto md:mx-0 my-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.3, duration: 0.6 }}>
                  <line x1="0" y1="1" x2="96" y2="1" stroke="#ff0000" strokeWidth="1" />
                </motion.svg>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="font-mono text-xs tracking-widest mb-6"
                  style={{ color: 'rgba(255,0,0,0.6)' }}>
                  THE GRIM REAPER HAS LOGGED YOUR ATTEMPT
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="font-mono text-sm leading-relaxed mb-8"
                  style={{ color: 'rgba(255,100,100,0.8)' }}>
                  <p>You knocked on the wrong door.</p>
                  <p>Three times.</p>
                  <p>The system noticed.</p>
                  <p className="mt-3" />
                  <p>This terminal has been seized.</p>
                  <p>Your access record has been filed.</p>
                  <p>Somewhere the Reaper is writing your name.</p>
                  <p className="mt-3" />
                  <p>// BREACH LOG #{breachNumber}</p>
                  <p>// TIMESTAMP: {timestamp}</p>
                  <p>// VERDICT: DENIED. PERMANENTLY.</p>
                </motion.div>

                <motion.svg width="96" height="2" viewBox="0 0 96 2" className="mx-auto md:mx-0 mb-6"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.9, duration: 0.6 }}>
                  <line x1="0" y1="1" x2="96" y2="1" stroke="#ff0000" strokeWidth="1" />
                </motion.svg>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ delay: 1, duration: 2, repeat: Infinity }}
                  className="text-xl tracking-widest mb-8">
                  💀  ☠️  💀
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  onClick={onRetry}
                  className="font-mono text-xs tracking-widest px-8 py-3 border rounded cursor-pointer transition-all"
                  style={{ color: 'rgba(255,0,0,0.5)', borderColor: 'rgba(255,0,0,0.2)', background: 'transparent' }}
                  onMouseEnter={(e) => {
                    const el = e.target as HTMLButtonElement
                    el.style.color = 'rgba(255,0,0,0.9)'
                    el.style.borderColor = 'rgba(255,0,0,0.5)'
                    el.style.boxShadow = '0 0 20px rgba(255,0,0,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.target as HTMLButtonElement
                    el.style.color = 'rgba(255,0,0,0.5)'
                    el.style.borderColor = 'rgba(255,0,0,0.2)'
                    el.style.boxShadow = 'none'
                  }}>
                  [ REQUEST CLEMENCY ]
                </motion.button>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  className="font-mono text-xs mt-4"
                  style={{ color: 'rgba(255,0,0,0.25)' }}>
                  // warning: a second breach will be remembered
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  )
}
