import type { CollectionConfig } from 'payload'

export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project_type', 'slug', 'is_published', 'display_order'],
  },
  labels: {
    singular: 'Проект портфолио',
    plural: 'Проекты портфолио',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Основная информация',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'title',
          label: 'Название проекта',
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
          name: 'project_type',
          label: 'Формат проекта',
          type: 'select',
          defaultValue: 'gallery',
          options: [
            {
              label: 'Фотогалерея',
              value: 'gallery',
            },
            {
              label: 'Видео-кейс',
              value: 'video',
            },
            {
              label: 'Смешанный кейс',
              value: 'mixed',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'is_published',
              label: 'Опубликован',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'show_on_homepage',
              label: 'Показывать на главной',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'display_order',
              label: 'Порядок вывода',
              type: 'number',
              defaultValue: 0,
            },
          ],
        },
        {
          name: 'short_description',
          label: 'Краткое описание',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'full_description',
          label: 'Полное описание',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'cover_image',
          label: 'Обложка проекта',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Галерея',
      fields: [
        {
          name: 'gallery_images',
          label: 'Изображения галереи',
          type: 'array',
          labels: {
            singular: 'Кадр',
            plural: 'Кадры',
          },
          fields: [
            {
              name: 'image',
              label: 'Изображение',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'enable_autoscroll',
              label: 'Автопрокрутка',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'autoscroll_speed',
              label: 'Скорость автопрокрутки',
              type: 'number',
              defaultValue: 50,
              admin: {
                condition: (_, siblingData) => Boolean(siblingData.enable_autoscroll),
              },
            },
            {
              name: 'enable_manual_navigation',
              label: 'Ручная навигация',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Видео',
      fields: [
        {
          name: 'source_type',
          label: 'Источник видео',
          type: 'select',
          options: [
            { label: 'Без видео', value: 'none' },
            { label: 'Загруженный файл', value: 'uploaded_file' },
            { label: 'Внешний URL', value: 'external_url' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'video_file',
          label: 'Видеофайл',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData.source_type === 'uploaded_file',
          },
        },
        {
          name: 'external_video_url',
          label: 'Внешняя ссылка на видео',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData.source_type === 'external_url',
          },
        },
        {
          name: 'poster_image',
          label: 'Постер видео',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData.source_type !== 'none',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'autoplay_enabled',
              label: 'Автовоспроизведение',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                condition: (_, siblingData) => siblingData.source_type !== 'none',
              },
            },
            {
              name: 'muted',
              label: 'Без звука',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                condition: (_, siblingData) => siblingData.source_type !== 'none',
              },
            },
            {
              name: 'loop',
              label: 'Зациклить',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                condition: (_, siblingData) => siblingData.source_type !== 'none',
              },
            },
            {
              name: 'controls',
              label: 'Показывать контролы',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                condition: (_, siblingData) => siblingData.source_type !== 'none',
              },
            },
            {
              name: 'playsinline',
              label: 'Inline на мобильных',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                condition: (_, siblingData) => siblingData.source_type !== 'none',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'SEO',
      fields: [
        {
          name: 'seo_title',
          label: 'SEO title',
          type: 'text',
          localized: true,
        },
        {
          name: 'seo_description',
          label: 'SEO description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
