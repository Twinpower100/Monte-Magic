'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import * as motion from 'motion/react-client'

interface GalleryImage {
  image: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
}

interface GalleryProps {
  images: GalleryImage[]
  enableAutoscroll?: boolean
  autoscrollSpeed?: number
  enableManualNavigation?: boolean
  /** Compact mode for embedding inside tour cards */
  compact?: boolean
}

export function Gallery({
  images,
  enableAutoscroll = false,
  autoscrollSpeed = 50,
  enableManualNavigation = true,
  compact = false,
}: GalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const animationRef = useRef<number | null>(null)
  const scrollPositionsRef = useRef<number[]>([])

  const measureItems = useCallback(() => {
    if (!scrollRef.current) {
      scrollPositionsRef.current = []
      return
    }

    const container = scrollRef.current
    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth)

    scrollPositionsRef.current = Array.from(container.children).map((child) => {
      if (!(child instanceof HTMLElement)) return 0

      const centeredOffset =
        child.offsetLeft - (container.clientWidth - child.clientWidth) / 2

      return Math.min(Math.max(centeredOffset, 0), maxScrollLeft)
    })
  }, [])

  const getClosestIndex = useCallback((value: number) => {
    const offsets = scrollPositionsRef.current

    if (offsets.length === 0) return 0

    return offsets.reduce((closestIndex, offset, index) => {
      const currentDistance = Math.abs(offset - value)
      const closestDistance = Math.abs(offsets[closestIndex] - value)
      return currentDistance < closestDistance ? index : closestIndex
    }, 0)
  }, [])

  const animateScrollTo = useCallback((targetLeft: number) => {
    if (!scrollRef.current) return

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const container = scrollRef.current
    const startLeft = container.scrollLeft
    const delta = targetLeft - startLeft

    if (Math.abs(delta) < 1) {
      container.scrollLeft = targetLeft
      return
    }

    const duration = 420
    const startTime = performance.now()
    const easeInOut = (progress: number) =>
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      container.scrollLeft = startLeft + delta * easeInOut(progress)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step)
        return
      }

      animationRef.current = null
      container.scrollLeft = targetLeft
    }

    animationRef.current = requestAnimationFrame(step)
  }, [])

  // Autoscroll by slides
  useEffect(() => {
    if (!enableAutoscroll || isDragging || isHovered || images.length < 2) return

    const autoplayDelay = Math.max(1800, 6200 - autoscrollSpeed * 80)
    const timeoutId = window.setTimeout(() => {
      const nextIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1
      measureItems()
      animateScrollTo(scrollPositionsRef.current[nextIndex] ?? 0)
      setCurrentIndex(nextIndex)
    }, autoplayDelay)

    return () => window.clearTimeout(timeoutId)
  }, [
    animateScrollTo,
    autoscrollSpeed,
    currentIndex,
    enableAutoscroll,
    images.length,
    isDragging,
    isHovered,
    measureItems,
  ])

  useEffect(() => {
    measureItems()

    if (typeof window === 'undefined') return

    const handleResize = () => measureItems()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [images.length, measureItems])

  // Manual drag
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enableManualNavigation) return
      if (scrollRef.current) {
        scrollRef.current.setPointerCapture(e.pointerId)
      }

      setIsDragging(true)
      setStartX(e.clientX)
      setScrollLeft(scrollRef.current?.scrollLeft || 0)
    },
    [enableManualNavigation],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !scrollRef.current) return
      const dx = e.clientX - startX
      scrollRef.current.scrollLeft = scrollLeft - dx
    },
    [isDragging, startX, scrollLeft],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Navigation dots
  const scrollToIndex = useCallback((idx: number) => {
    if (!scrollRef.current) return

    measureItems()
    const targetOffset = scrollPositionsRef.current[idx] ?? 0

    animateScrollTo(targetOffset)
    setCurrentIndex(idx)
  }, [animateScrollTo, measureItems])

  // Track current index on scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    measureItems()

    const handleScroll = () => {
      setCurrentIndex(getClosestIndex(el.scrollLeft))
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [getClosestIndex, measureItems])

  if (!images || images.length === 0) return null

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory md:gap-5"
        style={{
          cursor: isDragging ? 'grabbing' : enableManualNavigation ? 'grab' : 'default',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {images.map((item, idx) => {
          if (!item.image?.url) return null
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className={`relative aspect-[4/3] flex-shrink-0 snap-center overflow-hidden bg-white ${compact ? 'w-full' : 'w-[85vw] rounded-[26px] border border-[rgba(117,124,100,0.12)] shadow-[0_14px_36px_rgba(31,35,28,0.06)] md:w-[60vw] lg:w-[45vw]'}`}
            >
              <Image
                src={item.image.url}
                alt={item.image.alt || `Gallery image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                sizes={compact ? '(max-width: 1280px) 100vw, 33vw' : '(max-width: 768px) 85vw, (max-width: 1200px) 60vw, 45vw'}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,22,17,0.02),rgba(18,22,17,0.18))]" />
            </motion.div>
          )
        })}
      </div>

      {/* Navigation dots */}
      {enableManualNavigation && images.length > 1 && (
        <div className={`flex justify-center gap-2 ${compact ? 'mt-3' : 'mt-6'}`}>
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to image ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${compact ? 'h-1.5 w-1.5' : 'h-2 w-2'} ${
                idx === currentIndex
                  ? `${compact ? 'w-4' : 'w-6'} bg-[#596147]`
                  : 'bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrow buttons */}
      {enableManualNavigation && images.length > 1 && (
        <>
          <button
            onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
            aria-label="Previous image"
            className={`absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-white md:flex md:group-hover:opacity-100 ${compact ? 'h-8 w-8' : 'h-12 w-12 left-4'}`}
            disabled={currentIndex === 0}
          >
            <svg width={compact ? '14' : '20'} height={compact ? '14' : '20'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => scrollToIndex(Math.min(images.length - 1, currentIndex + 1))}
            aria-label="Next image"
            className={`absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-white md:flex md:group-hover:opacity-100 ${compact ? 'h-8 w-8' : 'h-12 w-12 right-4'}`}
            disabled={currentIndex === images.length - 1}
          >
            <svg width={compact ? '14' : '20'} height={compact ? '14' : '20'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
