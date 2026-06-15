import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json() as { email: string; name?: string }
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('RESEND_API_KEY not set — email not stored')
      return NextResponse.json({ success: true, warning: 'Email not stored (no API key)' })
    }

    const resend = new Resend(apiKey)
    const audienceId = process.env.RESEND_AUDIENCE_ID
    const firstName = name?.split(' ')[0] || ''
    const lastName = name?.split(' ').slice(1).join(' ') || ''

    // Store contact in Resend audience
    if (audienceId) {
      await resend.contacts.create({
        email,
        firstName,
        lastName,
        audienceId,
        unsubscribed: false,
      }).catch(err => console.warn('Contact creation failed:', err.message))
    }

    // Send welcome email
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'CareerCare AI <onboarding@resend.dev>'
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `You're on the CareerCare Premium waitlist${firstName ? `, ${firstName}` : ''}`,
      html: welcomeEmailHtml(firstName || 'there'),
    })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('Waitlist error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

function welcomeEmailHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the CareerCare waitlist</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1F4E79;padding:32px 40px;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">CareerCare AI</p>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">Your personal career intelligence tool</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#111827;font-size:24px;font-weight:700;line-height:1.3;">
                You're on the list, ${firstName}. 🎉
              </p>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Thanks for signing up for <strong style="color:#1F4E79;">CareerCare Premium</strong>. You'll be among the first to access features we're building right now:
              </p>

              <!-- Feature list -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${[
                  ['🏢', 'Specific companies hiring for your target role right now'],
                  ['📋', 'Open roles matched to your profile — updated weekly'],
                  ['🤝', 'Referral tracker with warm contact templates'],
                  ['💬', 'LinkedIn messages and cold email scripts'],
                  ['💰', 'Salary negotiation playbook for your exact target'],
                  ['📞', 'Weekly AI coaching check-ins'],
                ].map(([icon, text]) => `
                <tr>
                  <td style="padding:8px 0;vertical-align:top;width:32px;">
                    <span style="font-size:18px;">${icon}</span>
                  </td>
                  <td style="padding:8px 0 8px 10px;">
                    <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;">${text}</p>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- Pricing teaser -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;color:#1F4E79;font-weight:700;font-size:15px;">Early access pricing</p>
                    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
                      As a waitlist member you'll get <strong>50% off</strong> when we launch. We'll email you the moment it's ready.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                In the meantime, your free career workbook has everything you need to start your search today — strengths, gaps, and a 90-day action plan.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                You're receiving this because you signed up at careercare-ai.vercel.app.<br/>
                To unsubscribe, reply with "unsubscribe" in the subject.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
