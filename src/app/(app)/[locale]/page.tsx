import { getPayload } from 'payload'
import Image from 'next/image'
import configPromise from '@/payload.config'
import { InquiryForm } from '@/components/InquiryForm'
import { ToursCatalog } from '@/components/ToursCatalog'
import { ScrollReveal } from '@/components/ScrollReveal'
import { HeroBackground } from '@/components/HeroBackground'
import { cleanDisplayText, formatScheduleDate, getCopy, getLocale, sanitizePhone, formatTelegramUrl, type AppLocale } from '@/lib/site'

function mediaValue(value: any) {
  if (!value || typeof value !== 'object' || !value.url) return null
  return {
    url: value.url as string,
    alt: (value.alt as string) || '',
  }
}

function whatsappLink(phone: string | undefined, text: string) {
  const cleanPhone = sanitizePhone(phone)
  if (!cleanPhone) return '#contact-heading'
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
}

function viberLink(phone: string | undefined, text: string) {
  const cleanPhone = sanitizePhone(phone)
  if (!cleanPhone) return '#contact-heading'
  return `viber://chat?number=%2B${cleanPhone}&text=${encodeURIComponent(text)}`
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = getLocale((await params).locale)
  const copy = getCopy(locale)
  const payload = await getPayload({ config: configPromise })

  const [homePage, settings, transfers, partners, contactSettings, toursResult, scheduleResult, teamResult] =
    await Promise.all([
      payload.findGlobal({ slug: 'home-page', locale }),
      payload.findGlobal({ slug: 'site-settings', locale }),
      payload.findGlobal({ slug: 'transfers-settings', locale }),
      payload.findGlobal({ slug: 'partners-settings', locale }),
      payload.findGlobal({ slug: 'contact-settings', locale }),
      payload.find({ collection: 'tours', locale, sort: 'displayOrder', limit: 50 }),
      payload.find({ collection: 'schedule-items', locale, sort: 'tripDate', limit: 20 }),
      payload.find({ collection: 'team-members', locale, sort: 'displayOrder', limit: 20 }),
    ])

  const home = homePage as any
  const site = settings as any
  const transferSettings = transfers as any
  const partnerSettings = partners as any
  const contact = contactSettings as any
  const siteName = site?.siteName || 'Montenegro Travel'

  // Hero display mode
  const heroDisplayMode: 'collage' | 'single_photo' | 'none' = home?.heroDisplayMode || 'collage'
  const heroImage = mediaValue(home?.heroImage)
  const collage = (home?.heroCollage || [])
    .map((item: any) => mediaValue(item.image))
    .filter(Boolean) as Array<{ url: string; alt: string }>

  // Gallery scroll mode
  const galleryScrollMode: 'auto' | 'manual' | 'user_choice' = home?.galleryScrollMode || 'user_choice'

  const tours = toursResult.docs.map((tour: any) => ({
    id: String(tour.id),
    title: tour.title,
    category: tour.category,
    duration: tour.duration,
    difficulty: tour.difficulty,
    shortDescription: tour.shortDescription,
    routePoints: tour.routePoints,
    priceNote: tour.priceNote,
    image: mediaValue(tour.coverImage),
    gallery: (tour.gallery || [])
      .map((g: any) => {
        const img = mediaValue(g.image)
        return img ? { image: img } : null
      })
      .filter(Boolean),
  }))

  const phone = site?.whatsappNumber || site?.phone
  const tourOptions = tours.map((tour) => ({ value: tour.id, label: tour.title }))
  const toursSubtitle = cleanDisplayText(home?.toursSubtitle)
  const servicesSubtitle = cleanDisplayText(home?.servicesSubtitle)
  const scheduleSubtitle = cleanDisplayText(home?.scheduleSubtitle)
  const teamSubtitle = cleanDisplayText(home?.teamSubtitle)
  const contactText = cleanDisplayText(contact?.inquiryText) || cleanDisplayText(site?.tagline)
  const transferRoutes = (transferSettings?.routes || [])
    .map((route: any) => ({
      origin: cleanDisplayText(route?.origin),
      details: cleanDisplayText(route?.details),
    }))
    .filter((route: { origin: string; details: string }) => route.origin || route.details)
  const partnerItems = (partnerSettings?.partners || [])
    .map((partner: any) => ({
      name: cleanDisplayText(partner?.name),
      kind: cleanDisplayText(partner?.kind),
      note: cleanDisplayText(partner?.note),
    }))
    .filter((partner: { name: string; kind: string; note: string }) => partner.name || partner.kind || partner.note)
  const primaryHeroImageUrl =
    heroDisplayMode === 'single_photo'
      ? heroImage?.url || collage[0]?.url || ''
      : heroDisplayMode === 'collage'
        ? collage[0]?.url || heroImage?.url || ''
        : ''
  const accentHeroImageUrl =
    heroDisplayMode === 'collage'
      ? collage[1]?.url || heroImage?.url || null
      : null

  return (
    <div className="page-glow">
      {/* ============================================
           Hero Section
           ============================================ */}
      <section className="relative min-h-[88vh] overflow-hidden">
        {primaryHeroImageUrl ? (
          <HeroBackground
            primaryImageUrl={primaryHeroImageUrl}
            accentImageUrl={accentHeroImageUrl}
            mode={heroDisplayMode === 'collage' ? 'collage' : 'single_photo'}
          />
        ) : heroDisplayMode === 'none' ? (
          <div className="absolute inset-0 bg-[linear-gradient(145deg,#112018_0%,#244638_42%,#8f654f_100%)]" />
        ) : null}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,14,12,0.24),rgba(9,14,12,0.68))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.1),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,rgba(7,12,10,0.58))]" />

        <div className="container-shell relative flex min-h-[88vh] items-center justify-center px-4 py-16 text-white lg:py-20">
          <div className="mx-auto flex w-full max-w-[58rem] flex-col items-center self-center text-center">
            <ScrollReveal duration={900}>
              <div className="inline-flex rounded-full border border-white/22 bg-black/12 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
                Montenegro Private Travel
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120} duration={900}>
              <h1 className="mt-6 max-w-[12ch] text-5xl font-black leading-[0.92] tracking-[-0.035em] text-white md:text-7xl">
                {home?.heroTitle}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={240} duration={900}>
              <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-white/[0.98] md:text-[1.12rem]">
                {home?.heroSubtitle}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={360}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
                <a
                  href="#tours-heading"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-[#173328] transition hover:bg-[#f2e1d2]"
                >
                  {home?.heroPrimaryCta || copy.hero.chooseTour}
                </a>
                <a
                  href="#contact-heading"
                  className="inline-flex items-center justify-center rounded-full border border-white/24 bg-black/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-black/18"
                >
                  {copy.header.contact}
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={520}>
              <div className="mt-10 w-full max-w-[56rem] rounded-[2rem] border border-white/14 bg-black/14 px-5 py-5 backdrop-blur-md">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="text-sm uppercase tracking-[0.22em] text-white/84">
                    {home?.heroContactLabel || copy.hero.contactLabel}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={whatsappLink(site?.whatsappNumber || site?.phone, copy.messengerTemplates.general())}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-w-[9.75rem] items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-center font-semibold text-white shadow-card transition hover:scale-[1.02]"
                    >
                      WhatsApp
                    </a>
                    {site?.viberNumber || site?.phone ? (
                      <a
                        href={viberLink(site?.viberNumber || site?.phone, copy.messengerTemplates.general())}
                        className="inline-flex min-w-[9.75rem] items-center justify-center rounded-full bg-[#7360f2] px-6 py-3 text-center font-semibold text-white shadow-card transition hover:scale-[1.02]"
                      >
                        Viber
                      </a>
                    ) : null}
                    {site?.telegramUrl ? (
                      <a
                        href={formatTelegramUrl(site.telegramUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-w-[9.75rem] items-center justify-center rounded-full bg-[#0088cc] px-6 py-3 text-center font-semibold text-white shadow-card transition hover:scale-[1.02]"
                      >
                        Telegram
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================
           Tours Section
           ============================================ */}
      <section id="tours" className="section-shell relative">
        <div className="container-shell">
          <ScrollReveal distance={0}>
            <h2 id="tours-heading" className="anchor-target section-heading text-center text-4xl text-[#244636] md:text-5xl">
              {home?.toursTitle || copy.nav.tours}
            </h2>
          </ScrollReveal>
          {toursSubtitle ? (
            <ScrollReveal delay={150}>
              <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-black/80">
                {toursSubtitle}
              </p>
            </ScrollReveal>
          ) : null}

          <ScrollReveal delay={300}>
            <div className="mt-10">
              <ToursCatalog
                locale={locale}
                phone={phone}
                tours={tours as any}
                galleryScrollMode={galleryScrollMode}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================
           Services Section (Transfers & Partners)
           ============================================ */}
      <section id="services" className="section-shell bg-[linear-gradient(180deg,#efe5d8_0%,#f7f2ea_100%)]">
        <div className="container-shell">
          <ScrollReveal distance={0}>
            <h2 id="services-heading" className="anchor-target section-heading text-center text-4xl text-[#244636] md:text-5xl">
              {home?.servicesTitle || `${copy.nav.transfers} & ${copy.nav.partners}`}
            </h2>
          </ScrollReveal>
          {servicesSubtitle ? (
            <ScrollReveal delay={150}>
              <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-black/80">
                {servicesSubtitle}
              </p>
            </ScrollReveal>
          ) : null}

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <ScrollReveal staggerIndex={0} direction="left">
              <article className="premium-panel overflow-hidden">
                <div className="relative h-72">
                  {mediaValue(transferSettings?.coverImage)?.url ? (
                    <Image
                      src={mediaValue(transferSettings.coverImage)!.url}
                      alt={mediaValue(transferSettings.coverImage)!.alt || transferSettings?.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-6 md:p-7">
                  <div className="eyebrow">Transfer Concierge</div>
                  <h3 className="mt-3 text-3xl font-extrabold text-[#264737]">{transferSettings?.title || copy.nav.transfers}</h3>
                  <p className="mt-4 text-sm leading-7 text-black/82">{transferSettings?.description}</p>
                  {transferRoutes.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {transferRoutes.map((route: { origin: string; details: string }, index: number) => (
                        <div key={`${route.origin}-${index}`} className="rounded-[1.3rem] border border-black/10 bg-[#fcfbf8] px-4 py-3">
                          {route.origin ? <div className="font-semibold text-emerald">{route.origin}</div> : null}
                          {route.details ? <div className="text-sm text-black/72">{route.details}</div> : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <a
                    href={whatsappLink(phone, copy.messengerTemplates.transfer(transferSettings?.title || copy.nav.transfers))}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-dark"
                  >
                    {copy.buttons.details}
                  </a>
                </div>
              </article>
            </ScrollReveal>

            <ScrollReveal staggerIndex={1} direction="right">
              <article className="premium-panel overflow-hidden">
                <div className="relative h-72">
                  {mediaValue(partnerSettings?.coverImage)?.url ? (
                    <Image
                      src={mediaValue(partnerSettings.coverImage)!.url}
                      alt={mediaValue(partnerSettings.coverImage)!.alt || partnerSettings?.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-6 md:p-7">
                  <div className="eyebrow">Partner Network</div>
                  <h3 className="mt-3 text-3xl font-extrabold text-[#264737]">{partnerSettings?.title || copy.nav.partners}</h3>
                  <p className="mt-4 text-sm leading-7 text-black/82">{partnerSettings?.description}</p>
                  {partnerItems.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {partnerItems.map((partner: { name: string; kind: string; note: string }, index: number) => (
                        <div key={`${partner.name}-${index}`} className="rounded-[1.3rem] border border-black/10 bg-[#fcfbf8] px-4 py-3">
                          {partner.name ? <div className="font-semibold text-emerald">{partner.name}</div> : null}
                          {partner.kind ? <div className="text-sm font-medium text-terracotta">{partner.kind}</div> : null}
                          {partner.note ? <div className="text-sm text-black/72">{partner.note}</div> : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <a
                    href="#contact-heading"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-dark"
                  >
                    {copy.buttons.details}
                  </a>
                </div>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================
           Schedule Section
           ============================================ */}
      <section id="schedule" className="section-shell">
        <div className="container-shell">
          <ScrollReveal distance={0}>
            <h2 id="schedule-heading" className="anchor-target section-heading text-center text-4xl text-[#244636] md:text-5xl">
              {home?.scheduleTitle || copy.nav.schedule}
            </h2>
          </ScrollReveal>
          {scheduleSubtitle ? (
            <ScrollReveal delay={150}>
              <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-black/80">
                {scheduleSubtitle}
              </p>
            </ScrollReveal>
          ) : null}

          <div className="mx-auto mt-10 max-w-4xl space-y-4">
            {scheduleResult.docs.map((item: any, idx: number) => {
              const tour = typeof item.tour === 'object' ? item.tour : null
              const dateParts = formatScheduleDate(item.tripDate, locale as AppLocale)
              const bookingLabel = `${tour?.title || item.label} ${item.tripDate}`
              return (
                <ScrollReveal key={item.id} staggerIndex={idx} staggerStep={80}>
                  <article className="grid gap-4 rounded-[18px] bg-white p-5 shadow-card md:grid-cols-[96px_1fr_auto_auto] md:items-center md:p-6">
                    <div className="rounded-2xl bg-[linear-gradient(135deg,#2d5f4c,#1f4435)] px-4 py-4 text-center text-white">
                      <div className="text-3xl font-bold leading-none">{dateParts.day}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.2em]">{dateParts.month}</div>
                    </div>

                    <div>
                      <h3 className="text-2xl text-emerald">{tour?.title || item.label}</h3>
                      <p className="mt-2 text-sm text-black/72">
                        {item.startTime}
                        {item.endTime ? ` - ${item.endTime}` : ''}
                        {item.meetingPoint ? ` · ${item.meetingPoint}` : ''}
                      </p>
                    </div>

                    <div>
                      <span className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                        item.status === 'open'
                          ? 'bg-emerald/10 text-emerald'
                          : item.status === 'last'
                            ? 'bg-[#ff9800]/10 text-[#c77700]'
                            : 'bg-red-500/10 text-red-600'
                      }`}>
                        {copy.schedule[item.status as keyof typeof copy.schedule]}
                      </span>
                    </div>

                    {item.status !== 'soldout' ? (
                      <a
                        href={whatsappLink(phone, copy.messengerTemplates.schedule(bookingLabel))}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-light"
                      >
                        {copy.buttons.bookTrip}
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-black/5 px-5 py-3 text-sm font-semibold text-black/40">
                        {copy.buttons.noSeats}
                      </span>
                    )}
                  </article>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================
           Team Section
           ============================================ */}
      <section id="team" className="section-shell">
        <div className="container-shell">
          <ScrollReveal distance={0}>
            <h2 id="team-heading" className="anchor-target section-heading text-center text-4xl text-[#244636] md:text-5xl">
              {home?.teamTitle || copy.nav.team}
            </h2>
          </ScrollReveal>
          {teamSubtitle ? (
            <ScrollReveal delay={150}>
              <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-black/80">
                {teamSubtitle}
              </p>
            </ScrollReveal>
          ) : null}

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teamResult.docs.map((member: any, idx: number) => {
              const photo = mediaValue(member.photo)
              return (
                <ScrollReveal key={member.id} staggerIndex={idx} className="h-full">
                  <article className="flex h-full flex-col rounded-[18px] bg-white p-6 text-center shadow-card">
                    <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-sand">
                      {photo?.url ? (
                        <Image
                          src={photo.url}
                          alt={photo.alt || member.name}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <h3 className="mt-5 text-2xl font-extrabold text-[#264737]">{member.name}</h3>
                    <p className="mt-2 min-h-[3rem] text-sm font-semibold text-terracotta">{member.role}</p>
                    <p className="mt-3 flex-1 text-sm leading-7 text-black/78">{member.bio}</p>
                    <div className="mt-4 flex min-h-[2.25rem] flex-wrap justify-center gap-2">
                      {(member.languages || []).map((lang: string) => (
                        <span key={lang} className="rounded-full bg-sand px-3 py-1 text-xs font-semibold">
                          {lang}
                        </span>
                      ))}
                    </div>
                    {member.vehicle ? <p className="mt-4 text-sm italic text-black/68">{member.vehicle}</p> : null}
                  </article>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================
           Contact Section
           ============================================ */}
      <section id="contact" className="section-shell bg-[linear-gradient(180deg,#f6efe7_0%,#efe2d4_100%)]">
        <div className="container-shell grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <ScrollReveal direction="left" distance={0}>
            <div>
              <div className="eyebrow">Private Request</div>
              <h2 id="contact-heading" className="anchor-target mt-3 text-4xl text-[#244636] md:text-5xl">
                {contact?.inquiryTitle || copy.nav.contact}
              </h2>
              {contactText ? (
                <p className="mt-5 max-w-xl text-base leading-8 text-black/80">
                  {contactText}
                </p>
              ) : null}

              <div className="mt-8 space-y-4">
                {site?.phone ? (
                  <a href={`tel:${sanitizePhone(site.phone)}`} className="block rounded-[1.6rem] border border-white/60 bg-white/88 px-5 py-4 shadow-soft">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                      {copy.form.contacts.phone}
                    </div>
                    <div className="mt-2 text-lg text-emerald">{site.phone}</div>
                  </a>
                ) : null}

                {site?.email ? (
                  <a href={`mailto:${site.email}`} className="block rounded-[1.6rem] border border-white/60 bg-white/88 px-5 py-4 shadow-soft">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                      Email
                    </div>
                    <div className="mt-2 text-lg text-emerald">{site.email}</div>
                  </a>
                ) : null}

                {site?.telegramUrl ? (
                  <a href={formatTelegramUrl(site.telegramUrl)} target="_blank" rel="noreferrer" className="block rounded-[1.6rem] border border-white/60 bg-white/88 px-5 py-4 shadow-soft">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                      Telegram
                    </div>
                    <div className="mt-2 text-lg text-emerald">{site.telegramUrl}</div>
                  </a>
                ) : null}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            <InquiryForm locale={locale} tours={tourOptions} privacyText={contact?.privacyText} />
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
