"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

// Place your .mp3 files in /public/music/
// Filenames must match the `file` field below.
const playlist = [
  { num: "01", title: "lovely", artist: "Billie Eilish & Khalid", duration: "3:20", note: "This one played on repeat during that one conversation.", file: "/music/01-lovely.mp3" },
  { num: "02", title: "the night we met", artist: "Lord Huron", duration: "3:28", note: "Every time I hear this, I think of you.", file: "/music/02-night-we-met.mp3" },
  { num: "03", title: "driver's license", artist: "Olivia Rodrigo", duration: "4:02", note: "You made me listen to this at 2am. Worth it.", file: "/music/03-drivers-license.mp3" },
  { num: "04", title: "cardigan", artist: "Taylor Swift", duration: "3:59", note: "Certified our chaos era.", file: "/music/04-cardigan.mp3" },
  { num: "05", title: "saturn", artist: "SZA", duration: "2:37", note: "This is just... us. Somehow.", file: "/music/05-saturn.mp3" },
  { num: "06", title: "telepatia", artist: "Kali Uchis", duration: "2:54", note: "Because sometimes no words are needed.", file: "/music/06-telepatia.mp3" },
  { num: "07", title: "see you again", artist: "Tyler the Creator", duration: "3:44", note: "For the quiet moments between us.", file: "/music/07-see-you-again.mp3" },
  { num: "08", title: "you belong with me", artist: "Taylor Swift", duration: "3:52", note: "Don't look at me.", file: "/music/08-you-belong-with-me.mp3" }
]

const formatTime = (s: number): string => {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function EqualizerIcon({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex gap-0.5 items-end h-4">
      {[0.3, 0.7, 0.4].map((h, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: '#00d4ff', height: `${h * 16}px` }}
          animate={isPlaying ? { scaleY: [h, 1, h] } : { scaleY: h }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  )
}

function WaveformBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex gap-0.5 items-center justify-center h-8">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: 'linear-gradient(180deg, #00d4ff, #0099bb)' }}
          animate={isPlaying ? { scaleY: Math.random() * 0.8 + 0.2 } : { scaleY: 0.15 }}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 0.1 }}
        />
      ))}
    </div>
  )
}

function TrackRow({ track, index, isActive, isPlaying, isLoading, onClick }: {
  track: typeof playlist[0]
  index: number
  isActive: boolean
  isPlaying: boolean
  isLoading: boolean
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="px-4 py-2.5 rounded-lg cursor-pointer transition-all border-l-2"
      style={{
        background: isActive ? 'rgba(0, 212, 255, 0.08)' : isHovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        borderColor: isActive ? '#00d4ff' : 'transparent',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 flex items-center justify-center">
          {isLoading && isActive ? (
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00d4ff' }} />
          ) : isActive && isPlaying ? (
            <EqualizerIcon isPlaying />
          ) : isActive && !isPlaying ? (
            <Pause className="w-4 h-4" style={{ color: '#00d4ff' }} />
          ) : !isActive && isHovered ? (
            <Play className="w-4 h-4 fill-current" style={{ color: '#00d4ff' }} />
          ) : (
            <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{track.num}</span>
          )}
        </div>
        <div className="flex-1">
          <p className="font-mono text-sm" style={{ color: isActive ? '#00d4ff' : 'white' }}>{track.title}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{track.artist}</p>
        </div>
        <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{track.duration}</p>
      </div>
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 font-mono text-xs italic"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            💭 {track.note}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FriendshipPlaylist() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioError, setAudioError] = useState(false)

  useEffect(() => {
    const audio = new Audio()
    audio.volume = 0.8
    audio.preload = 'none'
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setIsLoading(false)
    })
    audio.addEventListener('ended', () => {
      setCurrentTrack(prev => prev === null ? null : (prev + 1) % playlist.length)
    })
    audio.addEventListener('error', (e) => {
      console.log('[v0] Audio error:', (e.target as HTMLAudioElement)?.error?.message)
      setIsLoading(false)
      setAudioError(true)
      setIsPlaying(false)
    })
    audio.addEventListener('playing', () => {
      setIsPlaying(true)
      setIsLoading(false)
      setAudioError(false)
    })
    audio.addEventListener('pause', () => setIsPlaying(false))
    audio.addEventListener('waiting', () => setIsLoading(true))
    audio.addEventListener('canplay', () => setIsLoading(false))

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current || currentTrack === null) return
    setAudioError(false)
    setIsLoading(true)
    setCurrentTime(0)
    setDuration(0)
    
    const trackFile = playlist[currentTrack].file
    audioRef.current.src = trackFile
    audioRef.current.load()
    
    // Set a timeout to catch if the file never loads
    const loadTimeout = setTimeout(() => {
      if (audioRef.current && audioRef.current.readyState === 0) {
        setAudioError(true)
        setIsLoading(false)
        setIsPlaying(false)
      }
    }, 3000)
    
    audioRef.current.play().catch(() => {
      setIsPlaying(false)
      setIsLoading(false)
    })
    
    return () => clearTimeout(loadTimeout)
  }, [currentTrack])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const handleTrackClick = useCallback((index: number) => {
    if (currentTrack === index) {
      if (isPlaying) audioRef.current?.pause()
      else audioRef.current?.play().catch(() => {})
    } else {
      setCurrentTrack(index)
    }
  }, [currentTrack, isPlaying])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const newTime = ratio * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <section ref={sectionRef} className="relative py-12 px-4 overflow-hidden" style={{
      background: 'radial-gradient(ellipse at 80% 0%, #0a0814 0%, #020408 60%)',
    }}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="font-mono text-lg mb-8 flex items-center gap-2"
          style={{ color: '#00d4ff' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          ▶ NOW PLAYING — {currentTrack !== null ? playlist[currentTrack].title : 'Your Friendship Soundtrack'}
          <span className="animate-pulse">▋</span>
        </motion.h2>

        <motion.div
          className="rounded-xl p-6 overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            boxShadow: '0 0 30px rgba(0,212,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Playlist Tracks */}
          <div className="space-y-1 mb-6 max-h-96 overflow-y-auto">
            {playlist.map((track, idx) => (
              <TrackRow
                key={track.num}
                track={track}
                index={idx}
                isActive={currentTrack === idx}
                isPlaying={isPlaying && currentTrack === idx}
                isLoading={isLoading && currentTrack === idx}
                onClick={() => handleTrackClick(idx)}
              />
            ))}
          </div>

          {/* Now Playing Bar */}
          <AnimatePresence>
            {currentTrack !== null && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t pt-4"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                {/* Control Bar */}
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-sm" style={{ color: 'white' }}>{playlist[currentTrack].num} — {playlist[currentTrack].title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentTrack(prev => prev === null || prev === 0 ? playlist.length - 1 : prev - 1)}
                      className="px-2 py-1 text-xs hover:bg-black/30 rounded"
                      style={{ color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
                    >
                      ◀◀
                    </button>
                    <button
                      onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                      className="px-4 py-2 rounded-full text-sm font-mono"
                      style={{
                        background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
                        boxShadow: '0 0 20px rgba(0,212,255,0.4)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button
                      onClick={() => setCurrentTrack(prev => prev === null ? null : (prev + 1) % playlist.length)}
                      className="px-2 py-1 text-xs hover:bg-black/30 rounded"
                      style={{ color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
                    >
                      ▶▶
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="px-2 py-1 text-xs hover:bg-black/30 rounded"
                      style={{ color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                </div>

                {/* Waveform */}
                <div className="mb-4">
                  <WaveformBars isPlaying={isPlaying} />
                </div>

                {/* Progress Bar */}
                <div
                  onClick={handleSeek}
                  className="h-2 rounded-full cursor-pointer mb-4"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <div
                    style={{
                      width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #00d4ff, #00a3cc)',
                      borderRadius: 'inherit',
                      boxShadow: '0 0 10px rgba(0,212,255,0.5)',
                      transition: 'width 250ms linear',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 0 6px rgba(0,212,255,0.8)',
                        right: '-6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                  </div>
                </div>

                {/* Error State */}
                <AnimatePresence>
                  {audioError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-lg mt-2 text-center"
                      style={{ background: 'rgba(255,55,95,0.08)', border: '1px solid rgba(255,55,95,0.2)' }}
                    >
                      <p className="font-mono text-xs" style={{ color: 'rgba(255,55,95,0.6)' }}>
                        Audio file not available. Add .mp3 files to /public/music/ directory.
                      </p>
                      <p className="font-mono text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Expected: {playlist[currentTrack]?.file}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
