import type { CollectionConfig } from 'payload'

export const InquiryRequests: CollectionConfig = {
  slug: 'inquiry-requests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'serviceType', 'tourInterest', 'createdAt'],
  },
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'text',
      required: true,
    },
    {
      name: 'preferredContactMethod',
      label: 'Предпочтительный способ связи',
      type: 'select',
      defaultValue: 'whatsapp',
      options: [
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Telegram', value: 'telegram' },
        { label: 'Viber', value: 'viber' },
        { label: 'Телефон', value: 'phone' },
        { label: 'Email', value: 'email' },
      ],
    },
    {
      name: 'serviceType',
      label: 'Тип запроса',
      type: 'select',
      required: true,
      options: [
        { label: 'Экскурсия', value: 'tour' },
        { label: 'Трансфер', value: 'transfer' },
        { label: 'Индивидуальная поездка', value: 'private' },
        { label: 'Партнёрский запрос', value: 'partners' },
      ],
    },
    {
      name: 'tourInterest',
      label: 'Интересующая экскурсия / тема',
      type: 'text',
    },
    {
      name: 'travelersCount',
      label: 'Количество гостей',
      type: 'number',
      min: 1,
    },
    {
      name: 'shortRequestDescription',
      label: 'Комментарий',
      type: 'textarea',
    },
    {
      name: 'locale',
      label: 'Язык формы',
      type: 'select',
      defaultValue: 'ru',
      options: [
        { label: 'Русский', value: 'ru' },
        { label: 'English', value: 'en' },
        { label: 'Deutsch', value: 'de' },
        { label: 'Crnogorski', value: 'me' },
      ],
    },
    {
      name: 'consentToPersonalDataProcessing',
      label: 'Согласие на обработку персональных данных',
      type: 'checkbox',
      required: true,
      defaultValue: true,
    },
  ],
}
