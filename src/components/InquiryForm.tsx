'use client'

import { useEffect, useRef, useState } from 'react'
import { getCopy, localeMeta, type AppLocale } from '@/lib/site'

type InquiryFormProps = {
  locale: AppLocale
  tours: Array<{ value: string; label: string }>
  privacyText?: string
}

const inputClass =
  'w-full rounded-[1.35rem] border border-black/10 bg-[#fffdfa] px-4 py-2.5 text-[0.97rem] outline-none transition focus:border-emerald focus:bg-white'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[+0-9\s()\-]{7,20}$/

function normalizeErrorKey(value: string) {
  if (value === 'consent') return 'consentToPersonalDataProcessing'
  return value
}

export function InquiryForm({ locale, tours, privacyText }: InquiryFormProps) {
  const copy = getCopy(locale)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate_limited'>('idle')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState<string>('')
  const formRenderedAt = useRef(Date.now())

  useEffect(() => {
    formRenderedAt.current = Date.now()
  }, [])

  function validateClientData(data: Record<string, string | boolean>) {
    const nextErrors: Record<string, string> = {}

    if (typeof data.name !== 'string' || data.name.trim().length < 2) {
      nextErrors.name = copy.form.errors.name
    }
    if (typeof data.email !== 'string' || !emailRegex.test(data.email.trim())) {
      nextErrors.email = copy.form.errors.email
    }
    if (typeof data.phone !== 'string' || !phoneRegex.test(data.phone.trim())) {
      nextErrors.phone = copy.form.errors.phone
    }
    if (data.consentToPersonalDataProcessing !== true) {
      nextErrors.consentToPersonalDataProcessing = copy.form.errors.consentToPersonalDataProcessing
    }

    return nextErrors
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setErrorMessage('')
    setFieldErrors({})

    const formData = new FormData(form)
    const data: Record<string, string | boolean> = {}
    formData.forEach((value, key) => {
      data[key] = typeof value === 'string' ? value.trim() : String(value)
    })

    data._form_rendered_at = String(formRenderedAt.current)
    data.consentToPersonalDataProcessing = formData.has('consentToPersonalDataProcessing')

    const nextErrors = validateClientData(data)
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setStatus('idle')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.status === 429) {
        setStatus('rate_limited')
        return
      }

      setStatus(response.ok ? 'success' : 'error')
      if (response.ok) {
        form.reset()
        formRenderedAt.current = Date.now()
      } else {
        try {
          const errorData = await response.json()
          if (errorData.errors && Array.isArray(errorData.errors)) {
            const newFieldErrors: Record<string, string> = {}
            for (const rawField of errorData.errors) {
              const field = normalizeErrorKey(String(rawField))
              const localizedError = copy.form.errors[field as keyof typeof copy.form.errors]
              if (localizedError) {
                newFieldErrors[field] = localizedError
              }
            }
            if (Object.keys(newFieldErrors).length > 0) {
              setFieldErrors(newFieldErrors)
            } else {
              setErrorMessage(copy.form.errors.general)
            }
          } else {
            setErrorMessage(errorData.error || copy.form.errors.general)
          }
        } catch {
          setErrorMessage(copy.form.errors.general)
        }
      }
    } catch {
      setStatus('error')
      setErrorMessage(copy.form.errors.general)
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-[24px] bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-xl text-white">
          ✓
        </div>
        <h3 className="mt-4 text-3xl text-emerald">{copy.form.successTitle}</h3>
        <p className="mt-3 text-sm leading-7 text-black/65">{copy.form.successText}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="premium-panel space-y-4 p-5 md:p-6">
      <div aria-hidden="true" className="hidden">
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 flex min-h-[1.75rem] items-end text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
            {copy.form.name} *
          </label>
          <input required minLength={2} name="name" className={inputClass} aria-invalid={Boolean(fieldErrors.name)} />
          {fieldErrors.name && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.name}</p>}
        </div>
        <div>
          <label className="mb-1 flex min-h-[1.75rem] items-end text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
            {copy.form.email} *
          </label>
          <input required type="email" name="email" className={inputClass} aria-invalid={Boolean(fieldErrors.email)} />
          {fieldErrors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.email}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 flex min-h-[1.75rem] items-end text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
            {copy.form.phone} *
          </label>
          <input
            required
            name="phone"
            type="tel"
            pattern="^[+0-9\\s()\\-]{7,20}$"
            title="Формат: +382 69 123 456"
            className={inputClass}
            placeholder="+382 6X XXX XXX"
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          {fieldErrors.phone && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.phone}</p>}
        </div>
        <div>
          <label className="mb-1 flex min-h-[1.75rem] items-end text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
            {copy.form.preferred}
          </label>
          <select name="preferredContactMethod" className={inputClass} defaultValue="whatsapp">
            <option value="whatsapp">{copy.form.contacts.whatsapp}</option>
            <option value="telegram">{copy.form.contacts.telegram}</option>
            <option value="viber">{copy.form.contacts.viber}</option>
            <option value="phone">{copy.form.contacts.phone}</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 flex min-h-[1.75rem] items-end text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
            {copy.form.service}
          </label>
          <select name="serviceType" className={inputClass} defaultValue="tour">
            <option value="tour">{copy.form.services.tour}</option>
            <option value="transfer">{copy.form.services.transfer}</option>
            <option value="private">{copy.form.services.private}</option>
            <option value="partners">{copy.form.services.partners}</option>
          </select>
        </div>
        <div>
          <label className="mb-1 flex min-h-[1.75rem] items-end text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
            {copy.form.tour}
          </label>
          <select name="tourInterest" className={inputClass}>
            <option value="">{copy.form.tourPlaceholder}</option>
            {tours.map((tour) => (
              <option key={tour.value} value={tour.label}>
                {tour.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 flex min-h-[1.75rem] items-end text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
            {copy.form.travelers}
          </label>
          <input name="travelersCount" type="number" min={1} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 flex min-h-[1.75rem] items-end text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
            {copy.form.language}
          </label>
          <input readOnly value={localeMeta[locale].label} className={`${inputClass} bg-sand`} />
          <input type="hidden" name="locale" value={locale} />
        </div>
      </div>

      <div>
        <label className="mb-1 flex min-h-[1.75rem] items-end text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
          {copy.form.description}
        </label>
          <textarea
            name="shortRequestDescription"
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder={copy.form.descriptionPlaceholder}
          />
        </div>

      <div className="flex flex-col">
        <label className="flex items-start gap-3 text-sm leading-6 text-black/65">
          <input
            required
            type="checkbox"
            name="consentToPersonalDataProcessing"
            defaultChecked
            className="mt-1 h-4 w-4 accent-[#2d5f4c] shrink-0"
          />
          <span>{privacyText || copy.form.consent} *</span>
        </label>
        {fieldErrors.consentToPersonalDataProcessing ? (
          <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.consentToPersonalDataProcessing}</p>
        ) : null}
      </div>

      {status === 'error' && errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}
      {status === 'rate_limited' ? (
        <p className="text-sm text-amber-600">{copy.form.rateLimit}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-full bg-emerald px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-dark disabled:opacity-60"
      >
        {status === 'loading' ? copy.buttons.sending : copy.buttons.send}
      </button>
    </form>
  )
}
