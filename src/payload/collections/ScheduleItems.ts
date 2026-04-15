import type { CollectionConfig } from 'payload'

export const ScheduleItems: CollectionConfig = {
  slug: 'schedule-items',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'tripDate', 'status'],
  },
  labels: {
    singular: 'Выезд',
    plural: 'Расписание',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'label',
      label: 'Внутреннее название',
      type: 'text',
      required: true,
    },
    {
      name: 'tour',
      label: 'Экскурсия',
      type: 'relationship',
      relationTo: 'tours',
      required: true,
    },
    {
      name: 'tripDate',
      label: 'Дата',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'startTime',
      label: 'Начало',
      type: 'text',
      required: true,
    },
    {
      name: 'endTime',
      label: 'Окончание',
      type: 'text',
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Есть места', value: 'open' },
        { label: 'Мало мест', value: 'last' },
        { label: 'Мест нет', value: 'soldout' },
      ],
    },
    {
      name: 'meetingPoint',
      label: 'Точка сбора',
      type: 'text',
      localized: true,
    },
  ],
}
