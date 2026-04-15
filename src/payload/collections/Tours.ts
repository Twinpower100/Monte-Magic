import type { CollectionConfig } from 'payload'

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'duration', 'difficulty', 'displayOrder'],
  },
  labels: {
    singular: 'Экскурсия',
    plural: 'Экскурсии',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Название',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'category',
      label: 'Категория',
      type: 'select',
      required: true,
      options: [
        { label: 'Побережье', value: 'coast' },
        { label: 'Север', value: 'north' },
        { label: 'Монастыри', value: 'monastery' },
        { label: 'Индивидуально', value: 'custom' },
      ],
    },
    {
      name: 'duration',
      label: 'Длительность',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'difficulty',
      label: 'Сложность',
      type: 'select',
      defaultValue: 'easy',
      options: [
        { label: 'Лёгкая', value: 'easy' },
        { label: 'Средняя', value: 'medium' },
        { label: 'Активная', value: 'active' },
        { label: 'По запросу', value: 'custom' },
      ],
    },
    {
      name: 'shortDescription',
      label: 'Краткое описание',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'routePoints',
      label: 'Маршрут / ключевые точки',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'priceNote',
      label: 'Примечание по стоимости',
      type: 'text',
      localized: true,
    },
    {
      name: 'coverImage',
      label: 'Обложка',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      label: 'Галерея',
      type: 'array',
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
      name: 'displayOrder',
      label: 'Порядок',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
