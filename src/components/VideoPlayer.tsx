'use client'

import { useRef, useEffect, useState } from 'react'

interface VideoPlayerProps {
  src: string
  poster?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  playsinline?: boolean
}

export function VideoPlayer({
  src,
  poster,
  autoplay = true,
  muted = true,
  loop = true,
  controls = false,
  playsinline = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoplay) return

    // Safe autoplay: muted + playsinline is required for most browsers
    const tryAutoplay = async () => {
      try {
        video.muted = true
        await video.play()
        setIsPlaying(true)
      } catch {
        // Autoplay blocked — show poster with play button
        setIsPlaying(false)
      }
    }

    // Use IntersectionObserver to only autoplay when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryAutoplay()
          } else {
            video.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [autoplay])

  const handleManualPlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  if (hasError) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center bg-premium-200 text-premium-500"
        style={poster ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover' } : {}}
      >
        <span className="text-sm tracking-wider uppercase">Video unavailable</span>
      </div>
    )
  }

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-[24px] bg-premium-950">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline={playsinline}
        onError={() => setHasError(true)}
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,22,17,0.04),rgba(18,22,17,0.22))]" />
      {/* Manual play overlay (shown when not autoplaying or paused) */}
      {!controls && !isPlaying && (
        <button
          onClick={handleManualPlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/18 transition-opacity"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/45 bg-white/88 backdrop-blur transition-transform hover:scale-105">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#232520">
              <polygon points="6 3 20 12 6 21" />
            </svg>
          </div>
        </button>
      )}
    </div>
  )
}
