'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Animation delay in ms (overrides staggerIndex) */
  delay?: number
  /** If inside a list, auto-generates delay from index */
  staggerIndex?: number
  /** Stagger step per item (ms). Default 100 */
  staggerStep?: number
  /** IntersectionObserver threshold. Default 0.1 */
  threshold?: number
  /** Direction from which the element enters */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Translate distance in px. Default 40 */
  distance?: number
  /** Animation duration in ms. Default 700 */
  duration?: number
}

export function ScrollReveal({
  children,
  className = '',
  style,
  delay,
  staggerIndex,
  staggerStep = 100,
  threshold = 0.1,
  direction = 'up',
  distance = 40,
  duration = 700,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isReady, setIsReady] = useState(false)

  const computedDelay =
    delay ?? (staggerIndex !== undefined ? staggerIndex * staggerStep : 0)

  const translateMap = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setIsVisible(true)
      setIsReady(true)
      return
    }

    const isInitiallyInView = () => {
      const rect = el.getBoundingClientRect()
      return rect.top <= window.innerHeight - 80 && rect.bottom >= 0
    }

    if (isInitiallyInView()) {
      setIsVisible(true)
      setIsReady(true)
      return
    }

    setIsVisible(false)

    const readyFrame = window.requestAnimationFrame(() => {
      setIsReady(true)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target
            setIsVisible(true)
            observer.unobserve(target)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -12% 0px',
      },
    )

    observer.observe(el)

    return () => {
      window.cancelAnimationFrame(readyFrame)
      observer.disconnect()
    }
  }, [computedDelay, threshold])

  return (
    <div
      ref={ref}
      className={`sr-reveal ${isReady && !isVisible ? 'sr-hidden' : 'sr-visible'} ${className}`}
      style={{
        ...style,
        '--sr-transform': translateMap[direction],
        '--sr-duration': `${duration}ms`,
        '--sr-delay': `${computedDelay}ms`,
      } as CSSProperties}
    >
      {children}
    </div>
  )
}
