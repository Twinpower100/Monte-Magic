import '@/app/globals.css'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { SiteHeader } from '@/components/SiteHeader'
import Link from 'next/link'
import { cleanDisplayText, getCopy, getLocale, localeMeta, locales, sanitizePhone, formatTelegramUrl } from '@/lib/site'
import { Inter, Playfair_Display } from 'next/font/google'
import type { ReactNode } from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3006'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = getLocale(resolvedParams.locale)
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    locale,
  })
  const settingsTyped = settings as any
  const siteName = settingsTyped?.siteName || 'Montenegro Travel'
  const title = settingsTyped?.seoDefaults?.title || siteName
  const description =
    settingsTyped?.seoDefaults?.description ||
    'Tours, transfers and travel planning across Montenegro.'

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: Object.fromEntries(locales.map((item) => [item, `${SITE_URL}/${item}`])),
    },
    openGraph: {
      title,
      description,
      siteName,
      locale: localeMeta[locale].bcp47,
      url: `${SITE_URL}/${locale}`,
      type: 'website',
    },
  }
}

export default async function AppLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params
  const locale = getLocale(resolvedParams.locale)
  const copy = getCopy(locale)
  const payload = await getPayload({ config: configPromise })

  const [settings, socialLinks, homePage] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', locale }),
    payload.findGlobal({ slug: 'social-links' }),
    payload.findGlobal({ slug: 'home-page', locale }),
  ])

  const settingsTyped = settings as any
  const socialTyped = socialLinks as any
  const homeTyped = homePage as any
  const siteName = settingsTyped?.siteName || 'Montenegro Travel'
  const logoObj = settingsTyped?.logo
  const logoUrl = logoObj && typeof logoObj === 'object' && logoObj.url ? logoObj.url : null
  const footerTagline = cleanDisplayText(homeTyped?.footerTagline) || cleanDisplayText(settingsTyped?.tagline) || ''
  const phone = settingsTyped?.phone || settingsTyped?.whatsappNumber || ''
  const whatsappPhone = sanitizePhone(settingsTyped?.whatsappNumber || settingsTyped?.phone)

  const socialEntries = [
    socialTyped?.instagramUrl ? { label: 'Instagram', href: socialTyped.instagramUrl } : null,
    socialTyped?.telegramUrl ? { label: 'Telegram', href: formatTelegramUrl(socialTyped.telegramUrl) } : null,
    socialTyped?.facebookUrl ? { label: 'Facebook', href: socialTyped.facebookUrl } : null,
    socialTyped?.youtubeUrl ? { label: 'YouTube', href: socialTyped.youtubeUrl } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>

  const quickLinks = [
    { href: '#tours-heading', label: copy.nav.tours },
    { href: '#services-heading', label: copy.nav.transfers },
    { href: '#services-heading', label: copy.nav.partners },
    { href: '#schedule-heading', label: copy.nav.schedule },
    { href: '#team-heading', label: copy.nav.team },
    { href: '#contact-heading', label: copy.nav.contact },
  ]

  return (
    <div className={`${inter.variable} ${playfair.variable} app-shell`}>
      <SiteHeader locale={locale} siteName={siteName} tagline={cleanDisplayText(settingsTyped?.tagline) || ''} logoUrl={logoUrl} />
      <main>{children}</main>

      <footer className="relative overflow-hidden bg-[#17221d] px-4 py-16 text-white md:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(198,123,92,0.7),transparent)]" />
        <div className="absolute right-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(198,123,92,0.2),transparent_70%)]" />
        <div className="container-shell relative grid gap-10 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <div>
            <div className="font-serif text-4xl text-[#f4d8bf]">{siteName}</div>
            {footerTagline ? (
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/84">{footerTagline}</p>
            ) : null}
            {settingsTyped?.email ? (
              <a href={`mailto:${settingsTyped.email}`} className="mt-6 inline-flex text-sm font-semibold text-white/92 transition hover:text-white">
                {settingsTyped.email}
              </a>
            ) : null}
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d6a282]">
              {copy.footer.quickLinks}
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {quickLinks.map((item, index) => (
                <Link key={`${item.href}-${index}`} href={item.href} className="text-sm font-medium text-white/84 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d6a282]">
              {copy.footer.followUs}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialEntries.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/28 hover:bg-white/12 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container-shell relative mt-10 border-t border-white/10 pt-6 text-sm text-white/68">
          © {new Date().getFullYear()} {siteName}. {copy.footer.rights}
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-black/10 bg-white/92 px-4 shadow-soft backdrop-blur md:hidden">
        {whatsappPhone ? (
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(copy.messengerTemplates.general())}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white"
          >
            WhatsApp
          </a>
        ) : null}
        {settingsTyped?.telegramUrl ? (
          <a
            href={formatTelegramUrl(settingsTyped.telegramUrl)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#0088cc] px-4 py-2 text-sm font-semibold text-white"
          >
            Telegram
          </a>
        ) : null}
        {phone ? (
          <a
            href={`tel:${sanitizePhone(phone)}`}
            className="rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-white"
          >
            {copy.form.contacts.phone}
          </a>
        ) : null}
      </div>
    </div>
  )
}
