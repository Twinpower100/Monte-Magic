import type { GlobalConfig } from 'payload'

export const PartnersSettings: GlobalConfig = {
  slug: 'partners-settings',
  label: 'Партнёры',
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
      name: 'partners',
      label: 'Подборка партнёров',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Название',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'kind',
          label: 'Тип',
          type: 'text',
          localized: true,
        },
        {
          name: 'note',
          label: 'Короткое описание',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
