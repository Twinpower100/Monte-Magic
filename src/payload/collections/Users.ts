import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  labels: {
    singular: 'Администратор',
    plural: 'Администраторы',
  },
  auth: true,
  fields: [
    // Email added by default
  ],
}
