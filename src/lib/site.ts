export const locales = ['ru', 'en', 'de', 'me'] as const
export type AppLocale = (typeof locales)[number]
export const defaultLocale: AppLocale = 'ru'

export const localeMeta: Record<AppLocale, { bcp47: string; label: string; shortLabel: string; flag: string }> = {
  ru: { bcp47: 'ru-RU', label: 'Русский', shortLabel: 'RU', flag: '🇷🇺' },
  en: { bcp47: 'en-US', label: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  de: { bcp47: 'de-DE', label: 'Deutsch', shortLabel: 'DE', flag: '🇩🇪' },
  me: { bcp47: 'sr-Latn-ME', label: 'Crnogorski', shortLabel: 'ME', flag: '🇲🇪' },
}

export const siteCopy = {
  ru: {
    nav: {
      tours: 'Экскурсии',
      transfers: 'Трансферы',
      partners: 'Партнёры',
      schedule: 'Расписание',
      team: 'Наша команда',
      contact: 'Контакты',
    },
    header: {
      contact: 'Связаться',
      menu: 'Меню',
    },
    hero: {
      chooseTour: 'Выбрать экскурсию',
      contactLabel: 'Свяжитесь с нами:',
    },
    filters: {
      all: 'Все',
      coast: 'Побережье',
      north: 'Север',
      monastery: 'Монастыри',
      custom: 'Индивидуально',
    },
    difficulty: {
      easy: 'Лёгкая',
      medium: 'Средняя',
      active: 'Активная',
      custom: 'По запросу',
    },
    buttons: {
      details: 'Узнать подробности',
      bookTrip: 'Забронировать',
      noSeats: 'Нет мест',
      send: 'Отправить запрос',
      sending: 'Отправка...',
      toForm: 'Оставить заявку',
    },
    schedule: {
      open: 'Есть места',
      last: 'Мало мест',
      soldout: 'Мест нет',
    },
    form: {
      name: 'Имя',
      email: 'Email',
      phone: 'Телефон',
      preferred: 'Предпочитаемый способ связи',
      service: 'Что интересует',
      tour: 'Экскурсия',
      travelers: 'Количество гостей',
      language: 'Предпочитаемый язык',
      description: 'Что хотите увидеть или уточнить',
      consent: 'Я согласен на обработку персональных данных',
      successTitle: 'Спасибо за заявку',
      successText: 'Мы свяжемся с вами в ближайшее время.',
      errors: {
        general: 'Не удалось отправить форму. Попробуйте ещё раз.',
        name: 'Пожалуйста, введите корректное имя.',
        email: 'Пожалуйста, введите корректный email.',
        phone: 'Пожалуйста, введите корректный телефон.',
        consent: 'Необходимо ваше согласие на обработку данных.',
        consentToPersonalDataProcessing: 'Необходимо ваше согласие на обработку данных.',
      },
      rateLimit: 'Слишком много запросов. Попробуйте немного позже.',
      tourPlaceholder: 'Если уже выбрали маршрут',
      descriptionPlaceholder: 'Например: нужен трансфер из Тивата, семейная поездка на север или индивидуальный маршрут на день.',
      services: {
        tour: 'Экскурсия',
        transfer: 'Трансфер',
        private: 'Индивидуальная поездка',
        partners: 'Партнёрский запрос',
      },
      contacts: {
        whatsapp: 'WhatsApp',
        telegram: 'Telegram',
        viber: 'Viber',
        phone: 'Телефон',
      },
    },
    footer: {
      quickLinks: 'Быстрые ссылки',
      followUs: 'Мы в соцсетях',
      rights: 'Все права защищены.',
    },
    messengerTemplates: {
      tour: (value: string) => `Здравствуйте, интересует экскурсия: ${value}`,
      transfer: (value: string) => `Здравствуйте, интересует трансфер: ${value}`,
      schedule: (value: string) => `Здравствуйте, хочу забронировать поездку: ${value}`,
      general: () => 'Здравствуйте, хочу узнать подробности по экскурсиям в Черногории.',
    },
  },
  en: {
    nav: {
      tours: 'Tours',
      transfers: 'Transfers',
      partners: 'Partners',
      schedule: 'Schedule',
      team: 'Our Team',
      contact: 'Contact',
    },
    header: {
      contact: 'Contact',
      menu: 'Menu',
    },
    hero: {
      chooseTour: 'Choose a Tour',
      contactLabel: 'Contact us:',
    },
    filters: {
      all: 'All',
      coast: 'Coast',
      north: 'North',
      monastery: 'Monasteries',
      custom: 'Custom',
    },
    difficulty: {
      easy: 'Easy',
      medium: 'Moderate',
      active: 'Active',
      custom: 'On request',
    },
    buttons: {
      details: 'Learn More',
      bookTrip: 'Book Now',
      noSeats: 'Sold out',
      send: 'Send Request',
      sending: 'Sending...',
      toForm: 'Send Request',
    },
    schedule: {
      open: 'Seats available',
      last: 'Few seats left',
      soldout: 'Sold out',
    },
    form: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      preferred: 'Preferred contact method',
      service: 'What are you interested in',
      tour: 'Tour',
      travelers: 'Guests',
      language: 'Preferred language',
      description: 'What would you like to see or ask about',
      consent: 'I agree to the processing of personal data',
      successTitle: 'Thank you for your request',
      successText: 'We will get back to you shortly.',
      errors: {
        general: 'Form submission failed. Please try again.',
        name: 'Please enter a valid name.',
        email: 'Please enter a valid email.',
        phone: 'Please enter a valid phone number.',
        consent: 'Data processing consent is required.',
        consentToPersonalDataProcessing: 'Data processing consent is required.',
      },
      rateLimit: 'Too many requests. Please try again later.',
      tourPlaceholder: 'If you already have a route in mind',
      descriptionPlaceholder: 'For example: airport transfer from Tivat, a family coastal day, or a private northern route.',
      services: {
        tour: 'Tour',
        transfer: 'Transfer',
        private: 'Private trip',
        partners: 'Partner inquiry',
      },
      contacts: {
        whatsapp: 'WhatsApp',
        telegram: 'Telegram',
        viber: 'Viber',
        phone: 'Phone',
      },
    },
    footer: {
      quickLinks: 'Quick links',
      followUs: 'Follow us',
      rights: 'All rights reserved.',
    },
    messengerTemplates: {
      tour: (value: string) => `Hello, I am interested in the tour: ${value}`,
      transfer: (value: string) => `Hello, I am interested in the transfer: ${value}`,
      schedule: (value: string) => `Hello, I would like to book: ${value}`,
      general: () => 'Hello, I would like to learn more about Montenegro tours.',
    },
  },
  de: {
    nav: {
      tours: 'Touren',
      transfers: 'Transfers',
      partners: 'Partner',
      schedule: 'Termine',
      team: 'Unser Team',
      contact: 'Kontakt',
    },
    header: {
      contact: 'Kontakt',
      menu: 'Menü',
    },
    hero: {
      chooseTour: 'Tour wählen',
      contactLabel: 'Kontaktieren Sie uns:',
    },
    filters: {
      all: 'Alle',
      coast: 'Küste',
      north: 'Norden',
      monastery: 'Klöster',
      custom: 'Individuell',
    },
    difficulty: {
      easy: 'Leicht',
      medium: 'Mittel',
      active: 'Aktiv',
      custom: 'Auf Anfrage',
    },
    buttons: {
      details: 'Mehr erfahren',
      bookTrip: 'Buchen',
      noSeats: 'Ausverkauft',
      send: 'Anfrage senden',
      sending: 'Wird gesendet...',
      toForm: 'Anfrage senden',
    },
    schedule: {
      open: 'Plätze frei',
      last: 'Wenige Plätze',
      soldout: 'Ausverkauft',
    },
    form: {
      name: 'Name',
      email: 'Email',
      phone: 'Telefon',
      preferred: 'Bevorzugter Kontaktweg',
      service: 'Wofür interessieren Sie sich',
      tour: 'Tour',
      travelers: 'Anzahl Gäste',
      language: 'Bevorzugte Sprache',
      description: 'Was möchten Sie sehen oder erfragen',
      consent: 'Ich stimme der Verarbeitung personenbezogener Daten zu',
      successTitle: 'Vielen Dank für Ihre Anfrage',
      successText: 'Wir melden uns in Kürze.',
      errors: {
        general: 'Das Formular konnte nicht gesendet werden.',
        name: 'Bitte geben Sie einen gültigen Namen ein.',
        email: 'Bitte geben Sie eine gültige E-Mail ein.',
        phone: 'Bitte geben Sie eine gültige Telefonnummer ein.',
        consent: 'Ihre Zustimmung zur Datenverarbeitung ist erforderlich.',
        consentToPersonalDataProcessing: 'Ihre Zustimmung zur Datenverarbeitung ist erforderlich.',
      },
      rateLimit: 'Zu viele Anfragen. Bitte später erneut versuchen.',
      tourPlaceholder: 'Falls Sie schon eine Route gewählt haben',
      descriptionPlaceholder: 'Zum Beispiel: Flughafentransfer ab Tivat, Familientag an der Küste oder individuelle Nordroute.',
      services: {
        tour: 'Tour',
        transfer: 'Transfer',
        private: 'Privatreise',
        partners: 'Partneranfrage',
      },
      contacts: {
        whatsapp: 'WhatsApp',
        telegram: 'Telegram',
        viber: 'Viber',
        phone: 'Telefon',
      },
    },
    footer: {
      quickLinks: 'Schnellzugriff',
      followUs: 'Soziale Netzwerke',
      rights: 'Alle Rechte vorbehalten.',
    },
    messengerTemplates: {
      tour: (value: string) => `Hallo, ich interessiere mich für die Tour: ${value}`,
      transfer: (value: string) => `Hallo, ich interessiere mich für den Transfer: ${value}`,
      schedule: (value: string) => `Hallo, ich möchte buchen: ${value}`,
      general: () => 'Hallo, ich möchte mehr über Montenegro-Touren erfahren.',
    },
  },
  me: {
    nav: {
      tours: 'Ture',
      transfers: 'Transferi',
      partners: 'Partneri',
      schedule: 'Raspored',
      team: 'Naš tim',
      contact: 'Kontakt',
    },
    header: {
      contact: 'Kontakt',
      menu: 'Meni',
    },
    hero: {
      chooseTour: 'Izaberi turu',
      contactLabel: 'Kontaktirajte nas:',
    },
    filters: {
      all: 'Sve',
      coast: 'Primorje',
      north: 'Sjever',
      monastery: 'Manastiri',
      custom: 'Po dogovoru',
    },
    difficulty: {
      easy: 'Lako',
      medium: 'Srednje',
      active: 'Aktivno',
      custom: 'Po upitu',
    },
    buttons: {
      details: 'Saznaj više',
      bookTrip: 'Rezerviši',
      noSeats: 'Popunjeno',
      send: 'Pošalji upit',
      sending: 'Slanje...',
      toForm: 'Pošalji upit',
    },
    schedule: {
      open: 'Ima mjesta',
      last: 'Još malo mjesta',
      soldout: 'Nema mjesta',
    },
    form: {
      name: 'Ime',
      email: 'Email',
      phone: 'Telefon',
      preferred: 'Poželjni kanal kontakta',
      service: 'Šta vas zanima',
      tour: 'Tura',
      travelers: 'Broj gostiju',
      language: 'Preferirani jezik',
      description: 'Šta želite da vidite ili pitate',
      consent: 'Saglasan sam sa obradom ličnih podataka',
      successTitle: 'Hvala na upitu',
      successText: 'Javićemo vam se uskoro.',
      errors: {
        general: 'Forma nije poslata. Pokušajte ponovo.',
        name: 'Molimo unesite ispravno ime.',
        email: 'Molimo unesite ispravan email.',
        phone: 'Molimo unesite ispravan broj telefona.',
        consent: 'Potrebna je vaša saglasnost za obradu podataka.',
        consentToPersonalDataProcessing: 'Potrebna je vaša saglasnost za obradu podataka.',
      },
      rateLimit: 'Previše zahtjeva. Pokušajte kasnije.',
      tourPlaceholder: 'Ako već imate rutu na umu',
      descriptionPlaceholder: 'Na primjer: transfer iz Tivta, porodični dan na obali ili privatna sjeverna ruta.',
      services: {
        tour: 'Tura',
        transfer: 'Transfer',
        private: 'Privatni izlet',
        partners: 'Partnerski upit',
      },
      contacts: {
        whatsapp: 'WhatsApp',
        telegram: 'Telegram',
        viber: 'Viber',
        phone: 'Telefon',
      },
    },
    footer: {
      quickLinks: 'Brzi linkovi',
      followUs: 'Društvene mreže',
      rights: 'Sva prava zadržana.',
    },
    messengerTemplates: {
      tour: (value: string) => `Zdravo, zanima me tura: ${value}`,
      transfer: (value: string) => `Zdravo, zanima me transfer: ${value}`,
      schedule: (value: string) => `Zdravo, želim da rezervišem: ${value}`,
      general: () => 'Zdravo, želim više informacija o turama po Crnoj Gori.',
    },
  },
} as const

export function getLocale(input: string): AppLocale {
  return locales.includes(input as AppLocale) ? (input as AppLocale) : defaultLocale
}

export function getCopy(locale: string) {
  return siteCopy[getLocale(locale)]
}

export function formatScheduleDate(dateValue: string, locale: AppLocale) {
  const formatter = new Intl.DateTimeFormat(localeMeta[locale].bcp47, {
    day: '2-digit',
    month: 'short',
  })
  const parts = formatter.formatToParts(new Date(dateValue))
  return {
    day: parts.find((part) => part.type === 'day')?.value ?? '',
    month: (parts.find((part) => part.type === 'month')?.value ?? '').replace('.', ''),
  }
}

export function sanitizePhone(phone?: string | null) {
  return (phone || '').replace(/[^0-9]/g, '')
}

export function formatTelegramUrl(input?: string | null) {
  if (!input) return ''
  const trimmed = input.trim()
  if (trimmed.startsWith('http')) return trimmed
  if (trimmed.startsWith('@')) return `https://t.me/${trimmed.substring(1)}`
  // Если строка содержит только цифры, плюсы, минусы, скобки и пробелы - считаем это номером телефона
  if (/^[\d\s\+\-()]+$/.test(trimmed)) {
    return `https://t.me/+${trimmed.replace(/[^0-9]/g, '')}`
  }
  return `https://t.me/${trimmed}`
}

const placeholderMarketingCopy = new Set([
  'Каталог уже наполнен основными направлениями на четырёх языках.',
  'Оба блока объединены одной секцией и одним якорем в шапке.',
  'Ближайшие даты вынесены в отдельную коллекцию.',
  'Команда управляется из админки отдельной сущностью.',
  'Форма подходит и для экскурсий, и для трансферов.',
  'Русифицированная админка Payload и 4 языка контента.',
  'The catalog is already filled with key routes in four languages.',
  'Both cards now share one section and one header anchor.',
  'Upcoming dates are managed in a dedicated collection.',
  'The team is editable from the admin.',
  'The form works for tours and transfers alike.',
  'Russian Payload admin with four content languages.',
  'Der Katalog ist bereits mit Hauptzielen in vier Sprachen gefüllt.',
  'Beide Karten teilen sich jetzt eine Sektion und einen Anker.',
  'Künftige Termine werden in einer eigenen Sammlung gepflegt.',
  'Das Team ist im Admin bearbeitbar.',
  'Das Formular eignet sich für Touren und Transfers.',
  'Russische Payload-Adminoberfläche mit vier Inhaltssprachen.',
  'Katalog je već popunjen glavnim pravcima na četiri jezika.',
  'Obje kartice sada dijele jednu sekciju i jedno sidro.',
  'Datumi se vode u posebnoj kolekciji.',
  'Tim se uređuje iz administracije.',
  'Forma je pogodna i za ture i za transfere.',
  'Ruski Payload admin i četiri jezika sadržaja.',
])

export function cleanDisplayText(value?: string | null) {
  const trimmed = value?.trim()
  if (!trimmed || placeholderMarketingCopy.has(trimmed)) {
    return ''
  }
  return trimmed
}
