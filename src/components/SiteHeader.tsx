'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCopy, localeMeta, locales, type AppLocale } from '@/lib/site'

type SiteHeaderProps = {
  locale: AppLocale
  siteName: string
  tagline?: string
  logoUrl?: string | null
}

export function SiteHeader({ locale, siteName, tagline, logoUrl }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const availableLocales = locales.filter((item, pos) => locales.indexOf(item) === pos)
  const copy = getCopy(locale)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { href: '#tours-heading', label: copy.nav.tours },
    { href: '#services-heading', label: copy.nav.transfers },
    { href: '#services-heading', label: copy.nav.partners },
    { href: '#schedule-heading', label: copy.nav.schedule },
    { href: '#team-heading', label: copy.nav.team },
    { href: '#contact-heading', label: copy.nav.contact },
  ]

  const headerTone = isScrolled
    ? {
        shell: 'border-b border-black/8 bg-[#fbf8f2] shadow-[0_8px_24px_rgba(18,24,20,0.06)]',
        link: 'text-black/88 hover:text-emerald',
        minor: 'text-black/60',
        pill: 'border-black/12 bg-white text-black/88',
        cta: 'bg-emerald text-white hover:bg-emerald-dark',
        mobile: 'border-t border-black/6 bg-[#fbf8f2]',
        mobileLink: 'border-b border-black/6 text-black/88',
      }
    : {
        shell: 'border-b border-black/8 bg-[#fbf8f2] shadow-[0_8px_24px_rgba(18,24,20,0.04)]',
        link: 'text-black/88 hover:text-emerald',
        minor: 'text-black/60',
        pill: 'border-black/12 bg-white text-black/88',
        cta: 'bg-emerald text-white hover:bg-emerald-dark',
        mobile: 'border-t border-black/6 bg-[#fbf8f2]',
        mobileLink: 'border-b border-black/6 text-black/88',
      }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerTone.shell}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-4 md:px-8 md:py-5">
        <Link href={`/${locale}`} prefetch={false} className="min-w-0">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain md:h-12" />
          ) : (
            <div className="font-serif text-[2.15rem] leading-none text-emerald md:text-[2.55rem]">{siteName}</div>
          )}
          {!logoUrl && tagline ? <div className={`hidden pt-1 text-[0.66rem] uppercase tracking-[0.28em] md:block ${headerTone.minor}`}>{tagline}</div> : null}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item, index) => (
            <Link key={`${item.href}-${index}`} href={item.href} className={`whitespace-nowrap text-[0.8rem] font-semibold tracking-[0.08em] transition ${headerTone.link}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((value) => !value)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${headerTone.pill}`}
            >
              <span>{localeMeta[locale].shortLabel}</span>
            </button>
            {langOpen ? (
              <div className="absolute right-0 top-full mt-2 min-w-[12rem] overflow-hidden rounded-2xl border border-black/10 bg-[rgba(250,246,240,0.98)] shadow-[0_24px_54px_rgba(18,24,20,0.14)] backdrop-blur-xl">
                {availableLocales.map((item) => (
                  <Link
                    key={item}
                    href={`/${item}`}
                    prefetch={false}
                    className="flex items-center gap-3 whitespace-nowrap px-4 py-3 text-sm text-black/78 transition hover:bg-white hover:text-black"
                    onClick={() => setLangOpen(false)}
                  >
                    <span>{localeMeta[item].label}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <Link href="#contact-heading" className={`hidden rounded-full px-5 py-2.5 text-sm font-semibold transition md:inline-flex ${headerTone.cta}`}>
            {copy.header.contact}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className={`rounded-full border px-3.5 py-2 text-sm font-medium transition lg:hidden ${headerTone.pill}`}
          >
            {copy.header.menu}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className={`lg:hidden ${headerTone.mobile}`}>
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-4 md:px-8">
            {navItems.map((item, index) => (
              <Link
                key={`${item.href}-${index}-mobile`}
                href={item.href}
                className={`py-4 text-base font-medium last:border-b-0 ${headerTone.mobileLink}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
