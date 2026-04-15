import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './payload/collections/Users.ts'
import { Media } from './payload/collections/Media.ts'
import { Tours } from './payload/collections/Tours.ts'
import { ScheduleItems } from './payload/collections/ScheduleItems.ts'
import { TeamMembers } from './payload/collections/TeamMembers.ts'
import { InquiryRequests } from './payload/collections/InquiryRequests.ts'
import { Settings } from './payload/globals/Settings.ts'
import { HomePage } from './payload/globals/HomePage.ts'
import { TransfersSettings } from './payload/globals/TransfersSettings.ts'
import { PartnersSettings } from './payload/globals/PartnersSettings.ts'
import { ContactSettings } from './payload/globals/ContactSettings.ts'
import { SocialLinks } from './payload/globals/SocialLinks.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tours, ScheduleItems, TeamMembers, InquiryRequests],
  globals: [
    Settings,
    HomePage,
    TransfersSettings,
    PartnersSettings,
    ContactSettings,
    SocialLinks,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: true,
  }),
  localization: {
    locales: [
      {
        label: 'Русский',
        code: 'ru',
      },
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Deutsch',
        code: 'de',
      },
      {
        label: 'Crnogorski',
        code: 'me',
      },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
  i18n: {
    fallbackLanguage: 'ru',
    supportedLanguages: {
      ru,
    },
  },
})
