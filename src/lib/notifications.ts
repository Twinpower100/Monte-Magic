import nodemailer from 'nodemailer'

interface InquiryData {
  name: string
  email: string
  phone?: string
  serviceType?: string
  preferredContactMethod?: string
  tourInterest?: string
  travelersCount?: number
  shortRequestDescription: string
  locale?: string
}

const serviceLabels: Record<string, string> = {
  tour: 'Экскурсия',
  transfer: 'Трансфер',
  private: 'Индивидуальная поездка',
  partners: 'Партнёрский запрос',
}

export async function sendEmailNotification(data: InquiryData): Promise<void> {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, NOTIFICATION_EMAIL } = process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 20px;">
      <h2 style="color: #1f4435; border-bottom: 2px solid #c67b5c; padding-bottom: 12px;">
        Новая заявка с Monte Magic
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 8px 0; width: 220px; color: #666;">Имя</td><td style="padding: 8px 0;">${data.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
        ${data.phone ? `<tr><td style="padding: 8px 0; color: #666;">Телефон</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ''}
        ${data.preferredContactMethod ? `<tr><td style="padding: 8px 0; color: #666;">Предпочтительный контакт</td><td style="padding: 8px 0;">${data.preferredContactMethod}</td></tr>` : ''}
        ${data.serviceType ? `<tr><td style="padding: 8px 0; color: #666;">Тип запроса</td><td style="padding: 8px 0;">${serviceLabels[data.serviceType] || data.serviceType}</td></tr>` : ''}
        ${data.tourInterest ? `<tr><td style="padding: 8px 0; color: #666;">Интересует</td><td style="padding: 8px 0;">${data.tourInterest}</td></tr>` : ''}
        ${data.travelersCount ? `<tr><td style="padding: 8px 0; color: #666;">Количество гостей</td><td style="padding: 8px 0;">${data.travelersCount}</td></tr>` : ''}
        ${data.locale ? `<tr><td style="padding: 8px 0; color: #666;">Язык формы</td><td style="padding: 8px 0;">${data.locale}</td></tr>` : ''}
        <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Комментарий</td><td style="padding: 8px 0;">${data.shortRequestDescription}</td></tr>
      </table>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Monte Magic" <${SMTP_USER}>`,
      to: NOTIFICATION_EMAIL || SMTP_USER,
      subject: `Новая заявка от ${data.name}`,
      html,
    })
  } catch (error) {
    console.error('[Notification] Email send failed:', error)
  }
}

export async function sendTelegramNotification(data: InquiryData): Promise<void> {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return

  const lines = [
    `<b>Новая заявка с Monte Magic</b>`,
    ``,
    `<b>Имя:</b> ${escapeHtml(data.name)}`,
    `<b>Email:</b> ${escapeHtml(data.email)}`,
  ]

  if (data.phone) lines.push(`<b>Телефон:</b> ${escapeHtml(data.phone)}`)
  if (data.preferredContactMethod) lines.push(`<b>Контакт:</b> ${escapeHtml(data.preferredContactMethod)}`)
  if (data.serviceType) lines.push(`<b>Тип:</b> ${escapeHtml(serviceLabels[data.serviceType] || data.serviceType)}`)
  if (data.tourInterest) lines.push(`<b>Интересует:</b> ${escapeHtml(data.tourInterest)}`)
  if (data.travelersCount) lines.push(`<b>Гостей:</b> ${data.travelersCount}`)
  if (data.locale) lines.push(`<b>Язык:</b> ${escapeHtml(data.locale)}`)
  lines.push(``, `<b>Комментарий:</b>`, escapeHtml(data.shortRequestDescription))

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: lines.join('\n'),
        parse_mode: 'HTML',
      }),
    })
  } catch (error) {
    console.error('[Notification] Telegram send failed:', error)
  }
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
