import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { AppLocale } from './lib/site.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '..', '.env')

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) return
    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()
    process.env[key] = value.replace(/^["']|["']$/g, '')
  })
}

const { getPayload } = await import('payload')
const configModule = await import('./payload.config.ts')
const configPromise = configModule.default
const locales: AppLocale[] = ['ru', 'en', 'de', 'me']

const images = {
  durmitor1: { file: 'durmitor-1.jpg', alts: { ru: 'Дурмитор', en: 'Durmitor', de: 'Durmitor', me: 'Durmitor' } },
  durmitor2: { file: 'durmitor-2.jpg', alts: { ru: 'Озеро Дурмитора', en: 'Durmitor lake', de: 'Durmitor-See', me: 'Jezero Durmitora' } },
  peak: { file: 'durmitor-peak.jpg', alts: { ru: 'Горный пик', en: 'Mountain peak', de: 'Berggipfel', me: 'Planinski vrh' } },
  sunset: { file: 'adriatic-sunset.jpg', alts: { ru: 'Закат на Адриатике', en: 'Adriatic sunset', de: 'Adria-Sonnenuntergang', me: 'Jadranski zalazak' } },
  coast: { file: 'coast-evening.jpg', alts: { ru: 'Побережье', en: 'Coast', de: 'Küste', me: 'Obala' } },
} as const

async function uploadLocal(payload: any, key: keyof typeof images) {
  const image = images[key]
  const buffer = fs.readFileSync(path.resolve(__dirname, 'assets', 'seed', image.file))
  const created = await payload.create({
    collection: 'media',
    data: { alt: image.alts.ru },
    file: { data: buffer, mimetype: 'image/jpeg', name: image.file, size: buffer.length },
  })
  for (const locale of locales.slice(1)) {
    await payload.update({ collection: 'media', id: created.id, locale, data: { alt: image.alts[locale] } })
  }
  return created.id
}

async function clearCollection(payload: any, collection: string) {
  const docs = await payload.find({ collection, limit: 200, depth: 0 })
  for (const doc of docs.docs) {
    await payload.delete({ collection, id: doc.id })
  }
}

async function createLocalizedDoc(payload: any, collection: string, shared: Record<string, unknown>, localized: Record<AppLocale, Record<string, unknown>>) {
  const created = await payload.create({ collection, locale: 'ru', data: { ...shared, ...localized.ru } })
  for (const locale of locales.slice(1)) {
    await payload.update({ collection, id: created.id, locale, data: localized[locale] })
  }
  return created
}

async function updateLocalizedGlobal(payload: any, slug: string, shared: Record<string, unknown>, localized: Record<AppLocale, Record<string, unknown>>) {
  await payload.updateGlobal({ slug, locale: 'ru', data: { ...shared, ...localized.ru } })
  for (const locale of locales.slice(1)) {
    await payload.updateGlobal({ slug, locale, data: localized[locale] })
  }
}

async function seed() {
  console.log('\nMonte Magic: seeding content...\n')
  const payload = await getPayload({ config: configPromise })

  await payload.updateGlobal({ slug: 'home-page', locale: 'ru', data: { heroCollage: [] } })
  await payload.updateGlobal({ slug: 'site-settings', locale: 'ru', data: { logo: null } })
  await payload.updateGlobal({ slug: 'transfers-settings', locale: 'ru', data: { coverImage: null, routes: [] } })
  await payload.updateGlobal({ slug: 'partners-settings', locale: 'ru', data: { coverImage: null, partners: [] } })

  await clearCollection(payload, 'schedule-items')
  await clearCollection(payload, 'team-members')
  await clearCollection(payload, 'tours')
  await clearCollection(payload, 'media')

  const media: Record<string, number> = {}
  for (const key of Object.keys(images) as Array<keyof typeof images>) {
    media[key] = await uploadLocal(payload, key)
  }

  await updateLocalizedGlobal(
    payload,
    'site-settings',
    {
      phone: '+382 69 738 599',
      whatsappNumber: '+382 69 738 599',
      viberNumber: '+382 69 738 599',
      telegramUrl: 'https://t.me/montenegrotravel',
      email: 'hello@montemagic.local',
    },
    {
      ru: { siteName: 'Montenegro Travel', tagline: 'Экскурсии, трансферы и маршруты по Черногории', seoDefaults: { title: 'Montenegro Travel', description: 'Экскурсии по Черногории на 4 языках.' } },
      en: { siteName: 'Montenegro Travel', tagline: 'Tours, transfers and routes across Montenegro', seoDefaults: { title: 'Montenegro Travel', description: 'Tours across Montenegro in four languages.' } },
      de: { siteName: 'Montenegro Travel', tagline: 'Touren, Transfers und Routen durch Montenegro', seoDefaults: { title: 'Montenegro Travel', description: 'Ausflüge durch Montenegro in vier Sprachen.' } },
      me: { siteName: 'Montenegro Travel', tagline: 'Ture, transferi i rute kroz Crnu Goru', seoDefaults: { title: 'Montenegro Travel', description: 'Ture kroz Crnu Goru na četiri jezika.' } },
    },
  )

  await updateLocalizedGlobal(
    payload,
    'home-page',
    {},
    {
      ru: {
        heroTitle: 'Откройте Черногорию с нами',
        heroSubtitle: 'Незабываемые экскурсии по побережью, горам и монастырям. Профессиональные гиды и комфортный транспорт.',
        heroPrimaryCta: 'Выбрать экскурсию',
        heroContactLabel: 'Свяжитесь с нами:',
        heroCollage: [{ image: media.durmitor1 }, { image: media.coast }, { image: media.sunset }, { image: media.durmitor2 }, { image: media.peak }, { image: media.coast }],
        toursTitle: 'Наши экскурсии',
        toursSubtitle: '',
        servicesTitle: 'Трансферы и партнёры',
        servicesSubtitle: '',
        scheduleTitle: 'Ближайшие поездки',
        scheduleSubtitle: '',
        teamTitle: 'Наша команда',
        teamSubtitle: '',
        footerTagline: '',
      },
      en: {
        heroTitle: 'Discover Montenegro with Us',
        heroSubtitle: 'Unforgettable tours across the coast, mountains and monasteries with comfortable transport.',
        heroPrimaryCta: 'Choose a Tour',
        heroContactLabel: 'Contact us:',
        toursTitle: 'Our Tours',
        toursSubtitle: '',
        servicesTitle: 'Transfers and Partners',
        servicesSubtitle: '',
        scheduleTitle: 'Upcoming Trips',
        scheduleSubtitle: '',
        teamTitle: 'Our Team',
        teamSubtitle: '',
        footerTagline: '',
      },
      de: {
        heroTitle: 'Entdecken Sie Montenegro mit uns',
        heroSubtitle: 'Unvergessliche Touren entlang der Küste, in den Bergen und zu Klöstern mit komfortablem Transport.',
        heroPrimaryCta: 'Tour wählen',
        heroContactLabel: 'Kontaktieren Sie uns:',
        toursTitle: 'Unsere Touren',
        toursSubtitle: '',
        servicesTitle: 'Transfers und Partner',
        servicesSubtitle: '',
        scheduleTitle: 'Kommende Reisen',
        scheduleSubtitle: '',
        teamTitle: 'Unser Team',
        teamSubtitle: '',
        footerTagline: '',
      },
      me: {
        heroTitle: 'Otkrijte Crnu Goru sa nama',
        heroSubtitle: 'Nezaboravne ture po obali, planinama i manastirima uz udoban prevoz.',
        heroPrimaryCta: 'Izaberi turu',
        heroContactLabel: 'Kontaktirajte nas:',
        toursTitle: 'Naše ture',
        toursSubtitle: '',
        servicesTitle: 'Transferi i partneri',
        servicesSubtitle: '',
        scheduleTitle: 'Predstojeća putovanja',
        scheduleSubtitle: '',
        teamTitle: 'Naš tim',
        teamSubtitle: '',
        footerTagline: '',
      },
    },
  )

  await updateLocalizedGlobal(payload, 'transfers-settings', { coverImage: media.sunset }, {
    ru: { title: 'Трансферы', description: 'Тиват, Подгорица, Дубровник и любые курорты Черногории.', routes: [{ origin: 'Тиват', details: 'Будва, Котор, Пераст, Луштица' }, { origin: 'Подгорица', details: 'Побережье, Острог, север' }, { origin: 'Дубровник', details: 'Герцег-Нови, Тиват, Будва' }] },
    en: { title: 'Transfers', description: 'Tivat, Podgorica, Dubrovnik and any resort in Montenegro.', routes: [{ origin: 'Tivat', details: 'Budva, Kotor, Perast, Lustica' }, { origin: 'Podgorica', details: 'Coast, Ostrog, north' }, { origin: 'Dubrovnik', details: 'Herceg Novi, Tivat, Budva' }] },
    de: { title: 'Transfers', description: 'Tivat, Podgorica, Dubrovnik und alle Küstenorte Montenegros.', routes: [{ origin: 'Tivat', details: 'Budva, Kotor, Perast, Lustica' }, { origin: 'Podgorica', details: 'Küste, Ostrog, Norden' }, { origin: 'Dubrovnik', details: 'Herceg Novi, Tivat, Budva' }] },
    me: { title: 'Transferi', description: 'Tivat, Podgorica, Dubrovnik i bilo koji grad ili hotel u Crnoj Gori.', routes: [{ origin: 'Tivat', details: 'Budva, Kotor, Perast, Luštica' }, { origin: 'Podgorica', details: 'Obala, Ostrog, sjever' }, { origin: 'Dubrovnik', details: 'Herceg Novi, Tivat, Budva' }] },
  })

  await updateLocalizedGlobal(payload, 'partners-settings', { coverImage: media.coast }, {
    ru: { title: 'Партнёры', description: 'Рестораны, отели и места, которые удобно встраивать в маршрут.', partners: [{ name: 'Conte Perast', kind: 'Бутик-отель', note: 'Хорошая остановка в Перасте' }, { name: 'Lazure Marina', kind: 'Марина и отель', note: 'Подходит для маршрутов через Герцег-Нови' }, { name: 'Luštica Bay', kind: 'Променад', note: 'Для пляжных и индивидуальных дней' }] },
    en: { title: 'Partners', description: 'Restaurants, hotels and stops that fit the route naturally.', partners: [{ name: 'Conte Perast', kind: 'Boutique hotel', note: 'A good Perast stop' }, { name: 'Lazure Marina', kind: 'Marina and hotel', note: 'Fits Herceg Novi routes' }, { name: 'Lustica Bay', kind: 'Promenade', note: 'For beach and private days' }] },
    de: { title: 'Partner', description: 'Restaurants, Hotels und Stopps, die gut in die Route passen.', partners: [{ name: 'Conte Perast', kind: 'Boutique-Hotel', note: 'Guter Halt in Perast' }, { name: 'Lazure Marina', kind: 'Marina und Hotel', note: 'Passt zu Herceg-Novi-Routen' }, { name: 'Lustica Bay', kind: 'Promenade', note: 'Für Strandtage und private Fahrten' }] },
    me: { title: 'Partneri', description: 'Restorani, hoteli i stanice koje se prirodno uklapaju u rutu.', partners: [{ name: 'Conte Perast', kind: 'Butik hotel', note: 'Dobra pauza u Perastu' }, { name: 'Lazure Marina', kind: 'Marina i hotel', note: 'Za rute kroz Herceg Novi' }, { name: 'Luštica Bay', kind: 'Šetalište', note: 'Za plažni ili privatni dan' }] },
  })

  await updateLocalizedGlobal(payload, 'contact-settings', {}, {
    ru: { inquiryTitle: 'Связаться с нами', inquiryText: 'Опишите даты, состав группы и желаемый формат отдыха. Мы предложим маршрут, трансфер или индивидуальный сценарий без лишней переписки.', privacyText: 'Я согласен на обработку персональных данных.', messageTemplates: { emailSubject: 'Запрос по Montenegro Travel', emailBody: 'Здравствуйте! Интересует поездка по Черногории.', telegramText: 'Здравствуйте! Интересует поездка по Черногории.', whatsappText: 'Здравствуйте! Интересует поездка по Черногории.', viberText: 'Здравствуйте! Интересует поездка по Черногории.' } },
    en: { inquiryTitle: 'Contact Us', inquiryText: 'Tell us your dates, group size and preferred travel style. We will suggest the right route, transfer or private day plan without unnecessary back-and-forth.', privacyText: 'I agree to the processing of personal data.', messageTemplates: { emailSubject: 'Montenegro Travel inquiry', emailBody: 'Hello! I am interested in a trip around Montenegro.', telegramText: 'Hello! I am interested in a trip around Montenegro.', whatsappText: 'Hello! I am interested in a trip around Montenegro.', viberText: 'Hello! I am interested in a trip around Montenegro.' } },
    de: { inquiryTitle: 'Kontakt', inquiryText: 'Nennen Sie uns Ihre Reisedaten, Gruppengröße und den gewünschten Stil. Wir schlagen die passende Route, den Transfer oder einen privaten Tagesplan vor.', privacyText: 'Ich stimme der Verarbeitung personenbezogener Daten zu.', messageTemplates: { emailSubject: 'Anfrage zu Montenegro Travel', emailBody: 'Hallo! Ich interessiere mich für eine Reise durch Montenegro.', telegramText: 'Hallo! Ich interessiere mich für eine Reise durch Montenegro.', whatsappText: 'Hallo! Ich interessiere mich für eine Reise durch Montenegro.', viberText: 'Hallo! Ich interessiere mich für eine Reise durch Montenegro.' } },
    me: { inquiryTitle: 'Kontakt', inquiryText: 'Pošaljite datume, broj gostiju i stil putovanja koji želite. Predložićemo odgovarajuću turu, transfer ili privatni plan dana.', privacyText: 'Saglasan sam sa obradom ličnih podataka.', messageTemplates: { emailSubject: 'Upit za Montenegro Travel', emailBody: 'Zdravo! Zanima me izlet kroz Crnu Goru.', telegramText: 'Zdravo! Zanima me izlet kroz Crnu Goru.', whatsappText: 'Zdravo! Zanima me izlet kroz Crnu Goru.', viberText: 'Zdravo! Zanima me izlet kroz Crnu Goru.' } },
  })

  await payload.updateGlobal({ slug: 'social-links', data: { instagramUrl: 'https://instagram.com/montenegrotravel', telegramUrl: 'https://t.me/montenegrotravel', facebookUrl: 'https://facebook.com/montenegrotravel', youtubeUrl: 'https://youtube.com/@montenegrotravel' } })

  const tours = [
    { slug: 'durmitor-djurdjevica-piva', category: 'north', difficulty: 'medium', coverImage: media.durmitor1, gallery: [{ image: media.durmitor1 }, { image: media.durmitor2 }, { image: media.peak }], displayOrder: 1, l: { ru: { title: 'Дурмитор, мост Джуржевича, Пивское озеро', duration: '12 часов', shortDescription: 'Большой северный маршрут с каньонами и озёрами.', routePoints: 'Жабляк, Чёрное озеро, мост Джуржевича, Пивское озеро' }, en: { title: 'Durmitor, Djurdjevica Bridge, Piva Lake', duration: '12 hours', shortDescription: 'A northern route with canyons and lakes.', routePoints: 'Zabljak, Black Lake, Djurdjevica Bridge, Piva Lake' }, de: { title: 'Durmitor, Djurdjevica-Brücke, Piva-See', duration: '12 Stunden', shortDescription: 'Nordroute mit Schluchten und Seen.', routePoints: 'Žabljak, Schwarzer See, Djurdjevica-Brücke, Piva-See' }, me: { title: 'Durmitor, most Đurđevića Tara, Pivsko jezero', duration: '12 sati', shortDescription: 'Sjeverna ruta sa kanjonima i jezerima.', routePoints: 'Žabljak, Crno jezero, most Đurđevića Tara, Pivsko jezero' } } },
    { slug: 'kotor-perast', category: 'coast', difficulty: 'easy', coverImage: media.coast, gallery: [{ image: media.coast }, { image: media.sunset }], displayOrder: 2, l: { ru: { title: 'Котор, Пераст', duration: '8 часов', shortDescription: 'Старые города Боки и красивые остановки у воды.', routePoints: 'Котор, Пераст, панорамы залива' }, en: { title: 'Kotor, Perast', duration: '8 hours', shortDescription: 'Historic towns of the bay and scenic waterfront stops.', routePoints: 'Kotor, Perast, bay viewpoints' }, de: { title: 'Kotor, Perast', duration: '8 Stunden', shortDescription: 'Historische Orte der Bucht und schöne Stopps am Wasser.', routePoints: 'Kotor, Perast, Aussichtspunkte' }, me: { title: 'Kotor, Perast', duration: '8 sati', shortDescription: 'Stari gradovi Boke i lijepe stanice uz more.', routePoints: 'Kotor, Perast, vidikovci zaliva' } } },
    { slug: 'tivat-herceg-novi', category: 'coast', difficulty: 'easy', coverImage: media.sunset, gallery: [{ image: media.sunset }, { image: media.coast }], displayOrder: 3, l: { ru: { title: 'Тиват, Херцег-Нови', duration: '8 часов', shortDescription: 'Марина, старый город и спокойный маршрут по заливу.', routePoints: 'Порто Монтенегро, Херцег-Нови' }, en: { title: 'Tivat, Herceg Novi', duration: '8 hours', shortDescription: 'Marina views and a relaxed route through the bay.', routePoints: 'Porto Montenegro, Herceg Novi' }, de: { title: 'Tivat, Herceg Novi', duration: '8 Stunden', shortDescription: 'Marina und entspannte Route entlang der Bucht.', routePoints: 'Porto Montenegro, Herceg Novi' }, me: { title: 'Tivat, Herceg Novi', duration: '8 sati', shortDescription: 'Marina i mirna ruta kroz zaliv.', routePoints: 'Porto Montenegro, Herceg Novi' } } },
    { slug: 'budva-petrovac-sveti-stefan', category: 'coast', difficulty: 'easy', coverImage: media.sunset, gallery: [{ image: media.sunset }, { image: media.coast }], displayOrder: 4, l: { ru: { title: 'Будва, Петровац, Свети-Стефан', duration: '8 часов', shortDescription: 'Классическая ривьера с лучшими видами побережья.', routePoints: 'Будва, Свети-Стефан, Петровац' }, en: { title: 'Budva, Petrovac, Sveti Stefan', duration: '8 hours', shortDescription: 'A classic riviera day with the best coastal views.', routePoints: 'Budva, Sveti Stefan, Petrovac' }, de: { title: 'Budva, Petrovac, Sveti Stefan', duration: '8 Stunden', shortDescription: 'Klassische Riviera mit den besten Küstenblicken.', routePoints: 'Budva, Sveti Stefan, Petrovac' }, me: { title: 'Budva, Petrovac, Sveti Stefan', duration: '8 sati', shortDescription: 'Klasična rivijera sa najljepšim pogledima.', routePoints: 'Budva, Sveti Stefan, Petrovac' } } },
    { slug: 'ostrog-monastery', category: 'monastery', difficulty: 'easy', coverImage: media.peak, gallery: [{ image: media.peak }, { image: media.durmitor1 }], displayOrder: 5, l: { ru: { title: 'Монастырь Острог', duration: '6 часов', shortDescription: 'Главный духовный маршрут Черногории.', routePoints: 'Нижний и верхний монастырь' }, en: { title: 'Ostrog Monastery', duration: '6 hours', shortDescription: 'A key spiritual route in Montenegro.', routePoints: 'Lower and upper monastery' }, de: { title: 'Kloster Ostrog', duration: '6 Stunden', shortDescription: 'Eine der wichtigsten spirituellen Routen.', routePoints: 'Unteres und oberes Kloster' }, me: { title: 'Manastir Ostrog', duration: '6 sati', shortDescription: 'Jedna od glavnih duhovnih ruta.', routePoints: 'Donji i gornji manastir' } } },
    { slug: 'lustica', category: 'coast', difficulty: 'medium', coverImage: media.coast, gallery: [{ image: media.coast }, { image: media.sunset }], displayOrder: 6, l: { ru: { title: 'Луштица', duration: '7 часов', shortDescription: 'Полуостров с пляжами, видами и летним ритмом.', routePoints: 'Розе, Luštica Bay, пляжные остановки' }, en: { title: 'Lustica', duration: '7 hours', shortDescription: 'A peninsula with beaches, views and a summer pace.', routePoints: 'Rose, Lustica Bay, beach stops' }, de: { title: 'Lustica', duration: '7 Stunden', shortDescription: 'Halbinsel mit Stränden, Ausblicken und Sommerstimmung.', routePoints: 'Rose, Lustica Bay, Strandstopps' }, me: { title: 'Luštica', duration: '7 sati', shortDescription: 'Poluostrvo sa plažama, pogledima i ljetnjim ritmom.', routePoints: 'Rose, Luštica Bay, pauze na plaži' } } },
    { slug: 'on-request', category: 'custom', difficulty: 'custom', coverImage: media.sunset, gallery: [{ image: media.sunset }, { image: media.durmitor2 }], displayOrder: 7, l: { ru: { title: 'По запросу', duration: 'Индивидуально', shortDescription: 'Для гостей, которым нужен свой темп и собственный маршрут.', routePoints: 'Любые города, пляжи, винодельни и видовые точки', priceNote: 'Сценарий собирается под группу.' }, en: { title: 'On Request', duration: 'Flexible', shortDescription: 'For guests who want their own pace and custom route.', routePoints: 'Any cities, beaches, wineries and viewpoints', priceNote: 'Tailored to the group.' }, de: { title: 'Auf Anfrage', duration: 'Flexibel', shortDescription: 'Für Gäste mit eigenem Tempo und eigener Route.', routePoints: 'Beliebige Städte, Strände, Weingüter und Aussichtspunkte', priceNote: 'Individuell für die Gruppe.' }, me: { title: 'Po upitu', duration: 'Fleksibilno', shortDescription: 'Za goste kojima treba svoj tempo i posebna ruta.', routePoints: 'Bilo koji gradovi, plaže, vinarije i vidikovci', priceNote: 'Pravi se po mjeri grupe.' } } },
  ] as const

  const createdTours: Record<string, number> = {}
  for (const tour of tours) {
    const created = await createLocalizedDoc(payload, 'tours', { slug: tour.slug, category: tour.category, difficulty: tour.difficulty, coverImage: tour.coverImage, gallery: tour.gallery, displayOrder: tour.displayOrder }, tour.l as any)
    createdTours[tour.slug] = created.id
  }

  for (const row of [
    { label: 'Durmitor', slug: 'durmitor-djurdjevica-piva', tripDate: '2026-04-18', startTime: '07:00', endTime: '19:30', status: 'open' },
    { label: 'Kotor', slug: 'kotor-perast', tripDate: '2026-04-20', startTime: '09:00', endTime: '17:00', status: 'last' },
    { label: 'Budva', slug: 'budva-petrovac-sveti-stefan', tripDate: '2026-04-24', startTime: '09:30', endTime: '17:30', status: 'open' },
    { label: 'Ostrog', slug: 'ostrog-monastery', tripDate: '2026-04-27', startTime: '08:30', endTime: '14:30', status: 'open' },
    { label: 'Lustica', slug: 'lustica', tripDate: '2026-05-02', startTime: '10:00', endTime: '17:00', status: 'open' },
  ]) {
    await createLocalizedDoc(payload, 'schedule-items', { label: row.label, tour: createdTours[row.slug], tripDate: row.tripDate, startTime: row.startTime, endTime: row.endTime, status: row.status }, {
      ru: { meetingPoint: 'Подтверждается после бронирования' },
      en: { meetingPoint: 'Confirmed after booking' },
      de: { meetingPoint: 'Wird nach der Buchung bestätigt' },
      me: { meetingPoint: 'Potvrda nakon rezervacije' },
    })
  }

  const team = [
    { name: 'Марко Петрович', photo: media.durmitor1, languages: ['RU', 'EN', 'ME'], vehicle: 'Mercedes V-Class', displayOrder: 1, l: { ru: { role: 'Гид по северу и монастырям', bio: 'Спокойный темп и длинные северные маршруты.' }, en: { role: 'Northern and monastery guide', bio: 'Calm pacing and longer northern routes.' }, de: { role: 'Guide für Norden und Klöster', bio: 'Ruhiges Tempo und längere Nordrouten.' }, me: { role: 'Vodič za sjever i manastire', bio: 'Miran tempo i duže sjeverne rute.' } } },
    { name: 'Анна Вучич', photo: media.coast, languages: ['RU', 'EN', 'DE', 'ME'], vehicle: 'Coastal format', displayOrder: 2, l: { ru: { role: 'Гид по побережью', bio: 'Побережье, прогулки и красивые остановки у воды.' }, en: { role: 'Coastal guide', bio: 'Coastal routes, walks and scenic stops.' }, de: { role: 'Guide für die Küste', bio: 'Küstenrouten, Spaziergänge und schöne Stopps.' }, me: { role: 'Vodič za primorje', bio: 'Obala, šetnje i lijepa stajanja.' } } },
    { name: 'Никола Радович', photo: media.sunset, languages: ['EN', 'DE', 'ME'], vehicle: 'Airport transfers', displayOrder: 3, l: { ru: { role: 'Координатор трансферов', bio: 'Аэропорты, тайминг и логистика между курортами.' }, en: { role: 'Transfer coordinator', bio: 'Airports, timing and resort logistics.' }, de: { role: 'Transfer-Koordinator', bio: 'Flughäfen, Zeitplanung und Logistik.' }, me: { role: 'Koordinator transfera', bio: 'Aerodromi, satnica i logistika između gradova.' } } },
  ] as const

  for (const member of team) {
    await createLocalizedDoc(payload, 'team-members', { name: member.name, photo: member.photo, languages: member.languages, vehicle: member.vehicle, displayOrder: member.displayOrder }, member.l as any)
  }

  console.log('\nSeed complete. Visit http://localhost:3006/ru\n')
  await payload.destroy()
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
