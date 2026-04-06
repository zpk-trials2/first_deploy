"use client"

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'

const playlist = [
  { num: "01", title: "lovely", artist: "Billie Eilish & Khalid", duration: "3:20", note: "This one played on repeat during that one conversation." },
  { num: "02", title: "the night we met", artist: "Lord Huron", duration: "3:28", note: "Every time I hear this, I think of you." },
  { num: "03", title: "driver's license", artist: "Olivia Rodrigo", duration: "4:02", note: "You made me listen to this at 2am. Worth it." },
  { num: "04", title: "cardigan", artist: "Taylor Swift", duration: "3:59", note: "Certified our chaos era." },
  { num: "05", title: "saturn", artist: "SZA", duration: "2:37", note: "This is just... us. Somehow." },
  { num: "06", title: "telepatia", artist: "Kali Uchis", duration: "2:54", note: "Because sometimes no words are needed." },
  { num: "07", title: "see you again", artist: "Tyler the Creator", duration: "3:44", note: "For the quiet moments between us." },
  { num: "08", title: "you belong with me", artist: "Taylor Swift", duration: "3:52", note: "Don't look at me." }
]

function EqualizerIcon() {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ background: '#00d4ff' }}
          animate={{
            height: ['8px', '16px', '6px', '14px', '8px'],
          }}
          transition={{
            duration: 0.8 + i * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function TrackRow({ track, index }: { track: typeof playlist[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div
        className="group px-4 py-3 rounded-lg transition-all cursor-pointer"
        style={{
          background: isHovered ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-4">
          {/* Track number / Play button */}
          <div className="w-8 flex justify-center">
            {isHovered ? (
              <Play className="w-4 h-4" style={{ color: '#00d4ff' }} fill="#00d4ff" />
            ) : (
              <span className="font-mono text-sm" style={{ color: '#64748b' }}>{track.num}</span>
            )}
          </div>

          {/* Title and Artist */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{track.title}</p>
            <p className="text-sm truncate" style={{ color: '#94a3b8' }}>{track.artist}</p>
          </div>

          {/* Duration */}
          <span className="font-mono text-sm" style={{ color: '#64748b' }}>{track.duration}</span>
        </div>

        {/* Personal note - slides in on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="pt-2 pl-12 text-sm italic" style={{ color: '#fbbf24' }}>
                {track.note}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function WaveformBars() {
  return (
    <div className="flex items-end justify-center gap-[2px] h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: `linear-gradient(to top, #00d4ff, #00a3cc)`,
          }}
          animate={{
            height: ['8px', `${12 + Math.random() * 20}px`, '6px', `${10 + Math.random() * 18}px`, '8px'],
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  )
}

export function FriendshipPlaylist() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 60) {
          clearInterval(timer)
          return 60
        }
        return p + 1
      })
    }, 50)
    return () => clearInterval(timer)
  }, [isInView])

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 sm:py-20 px-4 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #0f0a1e 0%, #020408 60%)',
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Section Title */}
        <motion.h2
          className="font-mono text-base sm:text-lg md:text-xl mb-8 flex items-center justify-center gap-3"
          style={{ color: '#00d4ff' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          <EqualizerIcon />
          {'FRIENDSHIP_PLAYLIST.mp3'}
          <span className="animate-pulse">▋</span>
        </motion.h2>

        {/* Player Card */}
        <motion.div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10, 10, 15, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 60px rgba(0, 212, 255, 0.08)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header bar */}
          <div 
            className="px-4 py-3 flex items-center gap-2"
            style={{ 
              background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.15), rgba(191, 90, 242, 0.1))',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <Play className="w-4 h-4" style={{ color: '#00d4ff' }} fill="#00d4ff" />
            <span className="text-sm font-mono" style={{ color: '#e2e8f0' }}>
              NOW PLAYING — Your Friendship Soundtrack
            </span>
          </div>

          {/* Track list */}
          <div className="py-2">
            {playlist.map((track, index) => (
              <TrackRow key={track.num} track={track} index={index} />
            ))}
          </div>

          {/* Now Playing bar */}
          <div 
            className="px-4 py-4"
            style={{ 
              background: 'rgba(0, 0, 0, 0.4)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">01 — lovely</span>
              <span className="text-xs font-mono" style={{ color: '#64748b' }}>1:47 / 3:20</span>
            </div>

            {/* Waveform */}
            <WaveformBars />

            {/* Progress bar */}
            <div className="mt-3 h-1 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  background: 'linear-gradient(90deg, #00d4ff, #00a3cc)',
                  boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
