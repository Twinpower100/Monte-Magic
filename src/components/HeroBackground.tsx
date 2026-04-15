'use client'

type HeroBackgroundProps = {
  primaryImageUrl: string
  accentImageUrl?: string | null
  mode?: 'single_photo' | 'collage'
}

export function HeroBackground({
  primaryImageUrl,
  accentImageUrl,
  mode = 'single_photo',
}: HeroBackgroundProps) {
  if (!primaryImageUrl) return null

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${primaryImageUrl})` }}
      />
      {mode === 'collage' && accentImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.16] blur-[1px]"
          style={{ backgroundImage: `url(${accentImageUrl})`, transform: 'scale(1.05)' }}
        />
      ) : null}
    </div>
  )
}
