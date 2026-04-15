'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { getCopy, sanitizePhone, type AppLocale } from '@/lib/site'
import { Gallery } from '@/components/Gallery'

type GalleryImage = {
  image: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
}

type TourCard = {
  id: string
  title: string
  category: 'coast' | 'north' | 'monastery' | 'custom'
  duration: string
  difficulty: 'easy' | 'medium' | 'active' | 'custom'
  shortDescription: string
  routePoints?: string
  priceNote?: string
  image?: {
    url: string
    alt: string
  } | null
  gallery?: GalleryImage[]
}

export function ToursCatalog({
  locale,
  phone,
  tours,
  galleryScrollMode = 'user_choice',
}: {
  locale: AppLocale
  phone?: string
  tours: TourCard[]
  galleryScrollMode?: 'auto' | 'manual' | 'user_choice'
}) {
  const copy = getCopy(locale)
  const [activeFilter, setActiveFilter] = useState<'all' | TourCard['category']>('all')

  const visibleTours = useMemo(() => {
    if (activeFilter === 'all') return tours
    return tours.filter((tour) => tour.category === activeFilter)
  }, [activeFilter, tours])

  const filterButtons = [
    { value: 'all', label: copy.filters.all },
    { value: 'coast', label: copy.filters.coast },
    { value: 'north', label: copy.filters.north },
    { value: 'monastery', label: copy.filters.monastery },
    { value: 'custom', label: copy.filters.custom },
  ] as const

  const cleanedPhone = sanitizePhone(phone)

  const enableAutoscroll = galleryScrollMode === 'auto' || galleryScrollMode === 'user_choice'
  const enableManual = galleryScrollMode === 'manual' || galleryScrollMode === 'user_choice'

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {filterButtons.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full border px-5 py-3 text-sm font-semibold tracking-[0.04em] transition ${
              activeFilter === filter.value
                ? 'border-[#1e4436] bg-[#1f4435] text-white shadow-[0_12px_24px_rgba(31,68,53,0.16)]'
                : 'border-black/12 bg-white text-black/82 hover:border-emerald hover:text-emerald'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleTours.map((tour) => {
          const hasGallery = tour.gallery && tour.gallery.length > 0
          return (
            <article key={tour.id} className="premium-panel flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
              {hasGallery ? (
                <div className="tour-gallery-wrapper">
                  <Gallery
                    images={tour.gallery!}
                    enableAutoscroll={enableAutoscroll}
                    autoscrollSpeed={30}
                    enableManualNavigation={enableManual}
                    compact
                  />
                </div>
                ) : (
                <div className="relative h-64">
                  {tour.image?.url ? (
                    <Image
                      src={tour.image.url}
                      alt={tour.image.alt || tour.title}
                      fill
                      sizes="(max-width: 1280px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                )}
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <div className="eyebrow">{filterButtons.find((item) => item.value === tour.category)?.label || copy.filters.custom}</div>
                <h3 className="mt-3 text-[2rem] font-extrabold leading-tight text-[#264737]">{tour.title}</h3>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-black/72">
                  <span className="rounded-full border border-black/10 bg-[#f7f3ec] px-3 py-1.5">{tour.duration}</span>
                  <span className="rounded-full border border-black/10 bg-[#f7f3ec] px-3 py-1.5">{copy.difficulty[tour.difficulty]}</span>
                </div>
                <p className="mt-5 text-sm leading-7 text-black/82">{tour.shortDescription}</p>
                {tour.routePoints ? (
                  <p className="mt-3 text-sm leading-7 text-black/68">{tour.routePoints}</p>
                ) : null}
                {tour.priceNote ? (
                  <p className="mt-3 text-sm font-medium text-terracotta">{tour.priceNote}</p>
                ) : null}
                <div className="mt-auto pt-6">
                  {cleanedPhone ? (
                    <a
                      href={`https://wa.me/${cleanedPhone}?text=${encodeURIComponent(copy.messengerTemplates.tour(tour.title))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full bg-emerald px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-dark"
                    >
                      {copy.buttons.details}
                    </a>
                  ) : (
                    <a
                      href="#contact-heading"
                      className="inline-flex w-full items-center justify-center rounded-full bg-emerald px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-dark"
                    >
                      {copy.buttons.toForm}
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
