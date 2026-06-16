/*
 GOOGLE SHEETS SETUP — see scripts/google-apps-script-webhook.gs for the
 Apps Script source (handles this feedback action plus 'cv' and 'session',
 each sent by other routes to the same FEEDBACK_WEBHOOK_URL).
*/

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      rating?: number
      workedWhat?: string[]
      workedText?: string
      improvement?: string
      name?: string
      email?: string
      userName?: string
    }

    const { rating, workedWhat, workedText, improvement, name, email, userName } = body
    const stored: string[] = []

    // 1. Send to Google Sheets via Apps Script webhook
    // Apps Script returns a 302 redirect — we must reissue the POST to the redirect URL
    // (following redirects with fetch changes POST→GET, which breaks doPost)
    const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL
    if (webhookUrl) {
      try {
        const payload = JSON.stringify(body)
        const r1 = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          redirect: 'manual',
        })
        // Apps Script runs doPost() BEFORE returning the 302 redirect to its output page.
        // A 302 (or 200) both mean the script executed successfully.
        if (r1.status === 302 || r1.ok) {
          stored.push('google-sheets')
        }
      } catch {
        // silently continue
      }
    }

    // 2. Email notification via Resend (always fires when key is set)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const resend = new Resend(resendKey)
        const starLine = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Not rated'
        const workedLine = [
          ...(workedWhat ?? []),
          workedText ? `"${workedText}"` : '',
        ].filter(Boolean).join(' · ') || '—'

        await resend.emails.send({
          from: 'Midcourse Feedback <onboarding@resend.dev>',
          to: 'rhitamjeetsaharia@gmail.com',
          subject: `Feedback ${rating ? `${rating}/5` : '(unrated)'}${userName ? ` · ${userName}` : ''}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 560px; color: #1C1917; line-height: 1.6;">
              <div style="background: #1C1917; padding: 20px 24px; border-radius: 12px 12px 0 0;">
                <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 4px;">Midcourse · New Feedback</p>
                ${userName ? `<p style="color: white; font-size: 15px; margin: 0; font-weight: 500;">${userName}'s reflection</p>` : ''}
              </div>
              <div style="background: #FAF8F5; padding: 24px; border: 1px solid #E7E5E4; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; color: #78716C; font-size: 12px; width: 140px; vertical-align: top;">Rating</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-size: 14px;">${starLine}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; color: #78716C; font-size: 12px; vertical-align: top;">What worked</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-size: 14px;">${workedLine}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; color: #78716C; font-size: 12px; vertical-align: top;">Improve</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-size: 14px;">${improvement || '—'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #78716C; font-size: 12px; vertical-align: top;">Contact</td>
                    <td style="padding: 10px 0; font-size: 14px;">
                      ${name ? `<strong>${name}</strong><br/>` : ''}
                      ${email ? `<a href="mailto:${email}" style="color: #1C1917;">${email}</a>` : '<span style="color:#A8A29E;">not provided</span>'}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          `,
        })
        stored.push('email')
      } catch {
        // silently continue
      }
    }

    return NextResponse.json({ ok: true, stored })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
