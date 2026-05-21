'use client'

type HeroBackgroundProps = {
  primaryImageUrl: string
  accentImageUrl?: string | null
  mode?: 'single_photo' | 'collage'
  collageUrls?: string[]
}

export function HeroBackground({
  primaryImageUrl,
  accentImageUrl,
  mode = 'single_photo',
  collageUrls,
}: HeroBackgroundProps) {
  if (mode === 'collage' && collageUrls && collageUrls.length > 0) {
    return (
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2 gap-1 bg-black">
        {collageUrls.map((url, i) => (
          <div
            key={i}
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${url}')` }}
          />
        ))}
      </div>
    )
  }

  if (!primaryImageUrl) return null

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${primaryImageUrl}')` }}
      />
    </div>
  )
}
