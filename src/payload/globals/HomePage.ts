import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Главная страница',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroTitle',
      label: 'Hero: заголовок',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'heroSubtitle',
      label: 'Hero: подзаголовок',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'heroPrimaryCta',
      label: 'Hero: главная кнопка',
      type: 'text',
      localized: true,
    },
    {
      name: 'heroContactLabel',
      label: 'Hero: подпись над мессенджерами',
      type: 'text',
      localized: true,
    },
    {
      name: 'heroDisplayMode',
      label: 'Hero: режим отображения',
      type: 'select',
      defaultValue: 'collage',
      options: [
        { label: 'Коллаж (6 фото)', value: 'collage' },
        { label: 'Одно фото на экран', value: 'single_photo' },
        { label: 'Без фона', value: 'none' },
      ],
      admin: {
        description: 'Выберите как отображать фон секции Hero.',
      },
    },
    {
      name: 'heroImage',
      label: 'Hero: одно фото (для режима «Одно фото»)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data: any) => data?.heroDisplayMode === 'single_photo',
        description: 'Это фото будет отображаться на весь экран. Рекомендуемый размер: 1920×1080.',
      },
    },
    {
      name: 'heroCollage',
      label: 'Hero: коллаж',
      type: 'array',
      minRows: 6,
      maxRows: 6,
      admin: {
        condition: (data: any) => data?.heroDisplayMode === 'collage',
      },
      fields: [
        {
          name: 'image',
          label: 'Изображение',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'galleryScrollMode',
      label: 'Галереи экскурсий: режим прокрутки',
      type: 'select',
      defaultValue: 'user_choice',
      options: [
        { label: 'Автоматическая прокрутка', value: 'auto' },
        { label: 'Ручная (стрелки и свайп)', value: 'manual' },
        { label: 'Пользовательская (обе опции)', value: 'user_choice' },
      ],
      admin: {
        description: 'Настройка поведения галерей фото в карточках экскурсий.',
      },
    },
    {
      name: 'toursTitle',
      label: 'Экскурсии: заголовок',
      type: 'text',
      localized: true,
    },
    {
      name: 'toursSubtitle',
      label: 'Экскурсии: текст',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'servicesTitle',
      label: 'Трансферы и партнёры: заголовок',
      type: 'text',
      localized: true,
    },
    {
      name: 'servicesSubtitle',
      label: 'Трансферы и партнёры: текст',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'scheduleTitle',
      label: 'Расписание: заголовок',
      type: 'text',
      localized: true,
    },
    {
      name: 'scheduleSubtitle',
      label: 'Расписание: текст',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'teamTitle',
      label: 'Команда: заголовок',
      type: 'text',
      localized: true,
    },
    {
      name: 'teamSubtitle',
      label: 'Команда: текст',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'footerTagline',
      label: 'Футер: подзаголовок',
      type: 'textarea',
      localized: true,
    },
  ],
}
