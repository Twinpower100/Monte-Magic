import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-white)',
        foreground: 'var(--color-dark)',
        emerald: {
          DEFAULT: '#2d5f4c',
          dark: '#1f4435',
          soft: '#3b7b63',
        },
        terracotta: {
          DEFAULT: '#c67b5c',
          light: '#d89a7f',
        },
        sand: {
          DEFAULT: '#f5f5f5',
          warm: '#efe8e1',
          deep: '#ddd1c5',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(0, 0, 0, 0.12)',
        soft: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

export default config
