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

    // Store contact in Resend audience (optional — gracefully skipped if no audience ID)
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
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'CareerCare <onboarding@resend.dev>'
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `You're on the list${firstName ? `, ${firstName}` : ''} — what's coming next`,
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
  const features = [
    ['Specific companies hiring for your target role — updated weekly', '#'],
    ['Open roles matched to your background and goals', '#'],
    ['Referral tracker with warm contact message templates', '#'],
    ['Salary negotiation playbook tailored to your target', '#'],
    ['LinkedIn outreach scripts for your specific companies', '#'],
    ['Ongoing check-ins as your search evolves', '#'],
  ]

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the CareerCare waitlist</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:48px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:#0A1F35;padding:36px 44px 32px;">
              <!-- Logo mark row -->
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#F59E0B;border-radius:8px;width:28px;height:28px;text-align:center;vertical-align:middle;">
                          <span style="color:#0A1F35;font-size:15px;font-weight:900;line-height:28px;">↗</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">CareerCare</span>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;color:rgba(255,255,255,0.5);font-size:13px;line-height:1.5;">
                Career clarity for people who want more.
              </p>
            </td>
          </tr>

          <!-- Amber accent bar -->
          <tr>
            <td style="background:#F59E0B;height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 44px 32px;">

              <p style="margin:0 0 8px;color:#0A1F35;font-size:26px;font-weight:800;line-height:1.25;letter-spacing:-0.5px;">
                You're on the list, ${firstName}.
              </p>
              <p style="margin:0 0 28px;color:#6B7280;font-size:15px;line-height:1.65;">
                Thanks for completing your career session. Your workbook is ready — and you've just joined a small group of early members who'll get first access to CareerCare Premium when it opens.
              </p>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="border-top:1px solid #F3F4F6;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <p style="margin:0 0 16px;color:#0A1F35;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">
                What Premium unlocks
              </p>

              <!-- Feature list -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${features.map(([text]) => `
                <tr>
                  <td style="padding:7px 0;vertical-align:top;width:20px;">
                    <div style="width:6px;height:6px;background:#F59E0B;border-radius:50%;margin-top:5px;"></div>
                  </td>
                  <td style="padding:7px 0 7px 12px;">
                    <p style="margin:0;color:#374151;font-size:14px;line-height:1.55;">${text}</p>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- Early access callout -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                <tr>
                  <td style="background:#FEF3C7;border-radius:12px;padding:20px 24px;border-left:4px solid #F59E0B;">
                    <p style="margin:0 0 4px;color:#92400E;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Early access</p>
                    <p style="margin:0;color:#78350F;font-size:14px;line-height:1.55;">
                      As a waitlist member you'll get <strong>50% off</strong> when we launch — and we'll email you the moment the doors open. No action needed on your end.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#9CA3AF;font-size:14px;line-height:1.65;">
                In the meantime, your free career workbook has everything you need to start: a positioning statement, your top strengths with interview stories, and a 90-day action plan.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;padding:24px 44px;border-top:1px solid #F3F4F6;">
              <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.7;">
                You're receiving this because you signed up at <a href="https://careercare-ai.vercel.app" style="color:#6B7280;text-decoration:underline;">careercare-ai.vercel.app</a>.<br/>
                To unsubscribe, reply with "unsubscribe" in the subject line.
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
