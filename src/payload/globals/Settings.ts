import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      label: 'Название сайта',
      type: 'text',
      localized: true,
      defaultValue: 'Montenegro Travel',
      required: true,
    },
    {
      name: 'tagline',
      label: 'Подзаголовок',
      type: 'text',
      localized: true,
    },
    {
      name: 'logo',
      label: 'Логотип',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'text',
    },
    {
      name: 'whatsappNumber',
      label: 'WhatsApp',
      type: 'text',
    },
    {
      name: 'viberNumber',
      label: 'Viber',
      type: 'text',
    },
    {
      name: 'telegramUrl',
      label: 'Telegram (URL, @username или номер)',
      type: 'text',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
    },
    {
      name: 'seoDefaults',
      label: 'SEO по умолчанию',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
