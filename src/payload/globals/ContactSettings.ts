import type { GlobalConfig } from 'payload'

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'Форма и контакты',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'inquiryTitle',
      label: 'Заголовок формы',
      type: 'text',
      localized: true,
    },
    {
      name: 'inquiryText',
      label: 'Текст формы',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'privacyText',
      label: 'Подпись о персональных данных',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'messageTemplates',
      label: 'Шаблоны сообщений',
      type: 'group',
      fields: [
        {
          name: 'emailSubject',
          label: 'Тема email',
          type: 'text',
          localized: true,
        },
        {
          name: 'emailBody',
          label: 'Текст email',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'telegramText',
          label: 'Текст для Telegram',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'whatsappText',
          label: 'Текст для WhatsApp',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'viberText',
          label: 'Текст для Viber',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
