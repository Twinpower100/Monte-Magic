import http from 'node:http'
import next from 'next'
import { parse } from 'node:url'

const dev = process.env.NODE_ENV === 'development'
const hostname = '0.0.0.0'
const port = Number.parseInt(process.env.PORT || '3006', 10)

function sanitizeLinkHeader(value) {
  const entries = Array.isArray(value)
    ? value.flatMap((item) => String(item).split(','))
    : String(value).split(',')

  const sanitized = entries
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => {
      const normalized = entry.toLowerCase()
      return !(
        normalized.includes('/_next/static/css/') &&
        normalized.includes('rel=preload') &&
        normalized.includes('as="style"')
      )
    })

  return sanitized.length > 0 ? sanitized.join(', ') : null
}

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

await app.prepare()

http
  .createServer((req, res) => {
    const originalSetHeader = res.setHeader.bind(res)
    const originalWriteHead = res.writeHead.bind(res)
    const originalRemoveHeader = res.removeHeader.bind(res)

    res.setHeader = (name, value) => {
      if (String(name).toLowerCase() === 'link') {
        const sanitized = sanitizeLinkHeader(value)
        if (!sanitized) {
          originalRemoveHeader('Link')
          return res
        }
        return originalSetHeader(name, sanitized)
      }

      return originalSetHeader(name, value)
    }

    res.writeHead = (...args) => {
      const currentLinkHeader = res.getHeader('Link')
      if (currentLinkHeader) {
        const sanitized = sanitizeLinkHeader(currentLinkHeader)
        if (sanitized) {
          originalSetHeader('Link', sanitized)
        } else {
          originalRemoveHeader('Link')
        }
      }

      return originalWriteHead(...args)
    }

    return handle(req, res, parse(req.url || '/', true))
  })
  .listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
