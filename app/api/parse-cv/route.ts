/* eslint-disable @typescript-eslint/no-require-imports */
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const name = file.name.toLowerCase()
    let text = ''

    if (name.endsWith('.docx') || name.endsWith('.doc')) {
      const mammoth = await import('mammoth')
      const result = await (mammoth.default || mammoth).extractRawText({ buffer })
      text = result.value
    } else if (name.endsWith('.pdf')) {
      const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>
      const result = await pdfParse(buffer)
      text = result.text
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const recordId = randomUUID().slice(0, 8).toUpperCase()

    // Fire-and-forget: save CV to Google Drive via Apps Script
    const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cv',
          recordId,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          fileBase64: buffer.toString('base64'),
        }),
        redirect: 'manual',
      }).catch(() => {})
    }

    return NextResponse.json({ text, recordId })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
