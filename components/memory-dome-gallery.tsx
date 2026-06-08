'use client'

import { DomeGallery } from '@/components/dome-gallery'

export function MemoryDomeGallery({ onClose }: { onClose?: () => void }) {
  return <DomeGallery onClose={onClose} />
}
