import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'vehicle', 'displayOrder'],
  },
  labels: {
    singular: 'Сотрудник',
    plural: 'Команда',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Роль',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'bio',
      label: 'Краткое описание',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'languages',
      label: 'Языки',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'RU', value: 'RU' },
        { label: 'EN', value: 'EN' },
        { label: 'DE', value: 'DE' },
        { label: 'ME', value: 'ME' },
      ],
    },
    {
      name: 'vehicle',
      label: 'Транспорт / специализация',
      type: 'text',
    },
    {
      name: 'photo',
      label: 'Фото',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'displayOrder',
      label: 'Порядок',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
