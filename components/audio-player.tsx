'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function AudioPlayer({ src, caption }: { src: string; caption: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoadedMetadata = () => setDuration(audio.duration)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="w-full space-y-4">
      {/* Waveform Visualization */}
      <div className="w-full h-20 bg-gradient-to-r from-[#bf5af2]/20 to-[#00d4ff]/20 rounded-lg flex items-center justify-center gap-1 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-[#00d4ff] to-[#bf5af2] rounded-full"
            animate={{ height: isPlaying ? `${30 + Math.random() * 70}%` : '20%' }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[#bf5af2] hover:bg-[#00d4ff] text-white flex items-center justify-center transition"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              if (audioRef.current) audioRef.current.currentTime = parseFloat(e.target.value)
            }}
            className="w-full h-2 bg-[#0a0812] rounded-full accent-[#00d4ff] cursor-pointer"
          />
        </div>

        {/* Time Display */}
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <audio ref={audioRef} src={src} crossOrigin="anonymous" />
    </div>
  )
}
