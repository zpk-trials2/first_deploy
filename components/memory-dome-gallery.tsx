'use client'

import { CSSdomGallery } from '@/components/css-dome-gallery'

export function MemoryDomeGallery({ onClose }: { onClose?: () => void }) {
  return <CSSdomGallery onClose={onClose} />
}
