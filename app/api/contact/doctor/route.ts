import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const CONTACT_RECIPIENT = process.env.CONTACT_RECIPIENT || process.env.SMTP_USER

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, birthDate, specialty, crm, notes, email } = body

    if (!name || !birthDate || !specialty || !crm || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_RECIPIENT) {
      console.error('SMTP not configured')
      return new Response(JSON.stringify({ error: 'Email sending not configured on the server' }), { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    const html = `
      <h2>New doctor contact request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Birth date:</strong> ${birthDate}</p>
      <p><strong>Specialty:</strong> ${specialty}</p>
      <p><strong>CRM:</strong> ${crm}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Notes:</strong><br/>${notes ? notes.replace(/\n/g, '<br/>') : '—'}</p>
    `

    await transporter.sendMail({
      from: `${SMTP_USER}`,
      to: CONTACT_RECIPIENT,
      subject: `New doctor contact request from ${name}`,
      html,
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Failed to send doctor contact email:', error)
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 })
  }
}