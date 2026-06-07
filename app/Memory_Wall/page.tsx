"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface MemoryItem {
  id: string
  type: 'image' | 'audio'
  src: string
  title: string
}

const MEMORIES: MemoryItem[] = [
  // Images
  { id: '1', type: 'image', src: '/Memory_Wall/1.webp', title: 'Memory 1' },
  { id: '2', type: 'image', src: '/Memory_Wall/2.webp', title: 'Memory 2' },
  { id: '3', type: 'image', src: '/Memory_Wall/3.webp', title: 'Memory 3' },
  { id: '4', type: 'image', src: '/Memory_Wall/4.webp', title: 'Memory 4' },
  { id: '5', type: 'image', src: '/Memory_Wall/5.webp', title: 'Memory 5' },
  { id: '6', type: 'image', src: '/Memory_Wall/6.webp', title: 'Memory 6' },
  { id: '7', type: 'image', src: '/Memory_Wall/7.webp', title: 'Memory 7' },
  { id: '8', type: 'image', src: '/Memory_Wall/8.webp', title: 'Memory 8' },
  { id: '9', type: 'image', src: '/Memory_Wall/9.webp', title: 'Memory 9' },
  { id: '10', type: 'image', src: '/Memory_Wall/10.webp', title: 'Memory 10' },
  { id: '11', type: 'image', src: '/Memory_Wall/11.webp', title: 'Memory 11' },
  { id: '12', type: 'image', src: '/Memory_Wall/12.webp', title: 'Memory 12' },
  { id: '13', type: 'image', src: '/Memory_Wall/13.webp', title: 'Memory 13' },
  { id: '14', type: 'image', src: '/Memory_Wall/14.webp', title: 'Memory 14' },
  { id: '15', type: 'image', src: '/Memory_Wall/15.webp', title: 'Memory 15' },
  { id: '16', type: 'image', src: '/Memory_Wall/16.webp', title: 'Memory 16' },
  { id: '17', type: 'image', src: '/Memory_Wall/17.webp', title: 'Memory 17' },
  { id: '18', type: 'image', src: '/Memory_Wall/18.webp', title: 'Memory 18' },
  { id: '19', type: 'image', src: '/Memory_Wall/19.webp', title: 'Memory 19' },
  { id: '20', type: 'image', src: '/Memory_Wall/20.webp', title: 'Memory 20' },
  { id: '21', type: 'image', src: '/Memory_Wall/21.webp', title: 'Memory 21' },
  { id: '22', type: 'image', src: '/Memory_Wall/22.webp', title: 'Memory 22' },
  { id: '23', type: 'image', src: '/Memory_Wall/23.webp', title: 'Memory 23' },
  { id: '24', type: 'image', src: '/Memory_Wall/24.webp', title: 'Memory 24' },
  { id: '25', type: 'image', src: '/Memory_Wall/25.webp', title: 'Memory 25' },
  { id: '26', type: 'image', src: '/Memory_Wall/26.webp', title: 'Memory 26' },
  { id: '27', type: 'image', src: '/Memory_Wall/27.webp', title: 'Memory 27' },
  { id: '28', type: 'image', src: '/Memory_Wall/28.webp', title: 'Memory 28' },
  { id: '29', type: 'image', src: '/Memory_Wall/29.webp', title: 'Memory 29' },
  { id: '30', type: 'image', src: '/Memory_Wall/30.webp', title: 'Memory 30' },
  { id: '31', type: 'image', src: '/Memory_Wall/31.jpeg', title: 'Memory 31' },
  { id: '32', type: 'image', src: '/Memory_Wall/32.jpeg', title: 'Memory 32' },
  { id: '33', type: 'image', src: '/Memory_Wall/33.jpeg', title: 'Memory 33' },
  { id: '34', type: 'image', src: '/Memory_Wall/34.jpeg', title: 'Memory 34' },
  { id: '35', type: 'image', src: '/Memory_Wall/35.jpeg', title: 'Memory 35' },
  // Audio
  { id: 'audio1', type: 'audio', src: '/Memory_Wall/1.opus', title: 'Audio Memory 1' },
  { id: 'audio2', type: 'audio', src: '/Memory_Wall/2.opus', title: 'Audio Memory 2' },
  { id: 'audio3', type: 'audio', src: '/Memory_Wall/3.opus', title: 'Audio Memory 3' },
  { id: 'audio4', type: 'audio', src: '/Memory_Wall/4.opus', title: 'Audio Memory 4' },
  { id: 'track1', type: 'audio', src: '/Memory_Wall/1.mp3', title: 'Track 1' },
  { id: 'track2', type: 'audio', src: '/Memory_Wall/2.mp3', title: 'Track 2' },
]

export default function MemoryWallPage() {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  return (
    <div className="relative min-h-screen" style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a0a3e 0%, #0a0410 100%)' }}>
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

      {/* Header */}
      <motion.div
        className="text-center pt-20 pb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#fff' }}>
          Memory Wall
        </h1>
        <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          A collection of precious moments and memories
        </p>
      </motion.div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {MEMORIES.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className="relative group cursor-pointer"
              onClick={() => memory.type === 'image' && setSelectedMemory(memory)}
            >
              {memory.type === 'image' ? (
                <div className="relative overflow-hidden rounded-lg aspect-square bg-black/20">
                  <img
                    src={memory.src}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ) : (
                <div
                  className="relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center cursor-pointer group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300"
                  onClick={() => {
                    setIsPlaying(isPlaying === memory.id ? null : memory.id)
                  }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {isPlaying === memory.id ? '⏸' : '▶'}
                    </div>
                    <p className="text-xs text-white text-center px-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Audio
                    </p>
                  </div>
                  {isPlaying === memory.id && (
                    <audio
                      autoPlay
                      onEnded={() => setIsPlaying(null)}
                      style={{ display: 'none' }}
                    >
                      <source src={memory.src} type={memory.src.endsWith('.opus') ? 'audio/opus' : 'audio/mpeg'} />
                    </audio>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      {selectedMemory && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setSelectedMemory(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="relative max-w-3xl w-full rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <img
              src={selectedMemory.src}
              alt={selectedMemory.title}
              className="w-full h-auto"
            />
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
