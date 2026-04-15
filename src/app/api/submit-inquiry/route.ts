import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@/payload.config'
import { checkRateLimit, checkSubmissionTiming } from '@/lib/rate-limiter'
import { sendEmailNotification, sendTelegramNotification } from '@/lib/notifications'

function collectPayloadValidationErrors(error: unknown) {
  const payloadError = error as {
    data?: Array<{ field?: string }>
    errors?: Array<{ path?: string }>
  }

  const fieldNames = [
    ...(payloadError?.data || []).map((item) => item.field).filter(Boolean),
    ...(payloadError?.errors || []).map((item) => item.path).filter(Boolean),
  ]

  return Array.from(new Set(fieldNames))
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (data.website_url) {
      return NextResponse.json({ success: true })
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    if (data._form_rendered_at) {
      const renderedAt = Number(data._form_rendered_at)
      if (!checkSubmissionTiming(renderedAt, 2500)) {
        return NextResponse.json({ success: true })
      }
    }

    const errors: string[] = []
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('name')
    }
    if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('email')
    }
    if (!data.phone || typeof data.phone !== 'string' || !/^[+0-9\s()\-]{7,20}$/.test(data.phone)) {
      errors.push('phone')
    }
    if (data.consentToPersonalDataProcessing !== true && data.consentToPersonalDataProcessing !== 'true') {
      errors.push('consentToPersonalDataProcessing')
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const cleanData = { ...data }
    delete cleanData.website_url
    delete cleanData._form_rendered_at

    cleanData.consentToPersonalDataProcessing =
      cleanData.consentToPersonalDataProcessing === true ||
      cleanData.consentToPersonalDataProcessing === 'true'

    if (cleanData.travelersCount === '') {
      delete cleanData.travelersCount
    } else if (cleanData.travelersCount) {
      cleanData.travelersCount = Number(cleanData.travelersCount)
    }

    const payload = await getPayload({ config: configPromise })
    const doc = await payload.create({
      collection: 'inquiry-requests',
      data: cleanData,
    })

    void Promise.allSettled([
      sendEmailNotification(doc as any),
      sendTelegramNotification(doc as any),
    ])

    return NextResponse.json({ success: true, id: doc.id })
  } catch (error) {
    console.error('[Submit Inquiry] Error:', error)
    const validationErrors = collectPayloadValidationErrors(error)
    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
