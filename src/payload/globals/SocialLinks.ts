import type { GlobalConfig } from 'payload'

export const SocialLinks: GlobalConfig = {
  slug: 'social-links',
  label: 'Социальные сети',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'facebookUrl',
      label: 'Facebook URL',
      type: 'text',
    },
    {
      name: 'instagramUrl',
      label: 'Instagram URL',
      type: 'text',
    },
    {
      name: 'telegramUrl',
      label: 'Telegram (URL, @username или номер)',
      type: 'text',
    },
    {
      name: 'youtubeUrl',
      label: 'YouTube URL',
      type: 'text',
    },
  ],
}
