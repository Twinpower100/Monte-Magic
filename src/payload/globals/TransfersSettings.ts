import type { GlobalConfig } from 'payload'

export const TransfersSettings: GlobalConfig = {
  slug: 'transfers-settings',
  label: 'Трансферы',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'coverImage',
      label: 'Обложка',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'routes',
      label: 'Основные направления',
      type: 'array',
      fields: [
        {
          name: 'origin',
          label: 'Откуда',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'details',
          label: 'Описание',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
  ],
}
