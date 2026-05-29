"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #00d4ff 0%, #bf5af2 50%, #ffd60a 100%)",
        boxShadow: "0 0 10px rgba(0,212,255,0.5)",
      }}
    />
  )
}
