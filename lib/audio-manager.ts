/**
 * Audio Manager - Handles all audio playback for the friendship birthday app
 */

class AudioManager {
  private audioElement: HTMLAudioElement | null = null

  playAudio(audioPath: string, options?: { volume?: number; loop?: boolean }) {
    // Stop existing audio if playing
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
    }

    try {
      this.audioElement = new Audio(audioPath)
      this.audioElement.volume = options?.volume ?? 0.7
      this.audioElement.loop = options?.loop ?? false
      this.audioElement.play().catch(err => {
        console.log('[v0] Audio playback error:', err)
      })
    } catch (error) {
      console.log('[v0] Audio error:', error)
    }
  }

  stopAudio() {
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
    }
  }

  playLaserTune() {
    this.playAudio('/audio/laser-tune.mp3', { volume: 1 })
  }

  playNetflixIntro() {
    this.playAudio('/audio/netflix-intro.mp4', { volume: 1 })
  }

  playSuzume() {
    this.playAudio('/audio/suzume.mp3', { volume: 1 })
  }

  playSquidGameTune() {
    // Using laser tune as placeholder for Squid Game tune
    // Will be replaced when Squid_Game_tune file is provided
    this.playAudio('/audio/laser-tune.mp3', { volume: 1 })
  }
}

export const audioManager = new AudioManager()
