import { withPayload } from '@payloadcms/next/withPayload'

/** Публичные URL медиа (Payload) должны совпадать с patterns — иначе next/image падает с 500 в RSC */
function buildImageRemotePatterns() {
  const patterns = [
    { protocol: 'http', hostname: 'localhost', port: '3006', pathname: '/**' },
    { protocol: 'http', hostname: '127.0.0.1', port: '3006', pathname: '/**' },
    { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    { protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
  ]

  const raw = process.env.NEXT_PUBLIC_SERVER_URL
  if (raw) {
    try {
      const u = new URL(raw)
      const proto = u.protocol.replace(':', '') || 'http'
      const entry = {
        protocol: proto,
        hostname: u.hostname,
        pathname: '/**',
        ...(u.port ? { port: u.port } : {}),
      }
      patterns.push(entry)
    } catch {
      /* ignore invalid URL */
    }
  }
  patterns.push(
    { protocol: 'http', hostname: '**', pathname: '/api/media/**' },
    { protocol: 'https', hostname: '**', pathname: '/api/media/**' },
  )

  return patterns
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: buildImageRemotePatterns(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

export default withPayload(nextConfig)
