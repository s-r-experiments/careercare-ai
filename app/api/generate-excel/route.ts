import { NextRequest, NextResponse } from 'next/server'
import * as ExcelJS from 'exceljs'

const NAVY = '1F4E79'
const WHITE = 'FFFFFF'
const GREEN = 'E8F5E9'
const AMBER = 'FFF8E1'

function headerStyle(row: ExcelJS.Row) {
  row.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + NAVY } }
    cell.font = { color: { argb: 'FF' + WHITE }, bold: true }
    cell.alignment = { vertical: 'middle', wrapText: true }
    cell.border = { bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } } }
  })
}

function altRow(row: ExcelJS.Row, idx: number, color?: string) {
  const bg = color || (idx % 2 === 0 ? 'FFFFFFFF' : 'FFF5F8FC')
  row.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
    cell.alignment = { vertical: 'middle', wrapText: true }
  })
}

interface Strength { strength: string; evidence: string; interview_story: string; relevance: string }
interface Gap { gap: string; impact: string; action: string; timeline: string }
interface ActionItem { phase: string; action: string; category: string; priority: string; target_date: string }

export async function POST(req: NextRequest) {
  try {
    const { synthesis } = await req.json() as {
      synthesis: {
        name: string
        positioning_statement: string
        current_state: Record<string, string>
        target_state: { roles: string[]; sectors: string[]; location: string; salary_min: string; salary_max: string; salary_aspirational: string; timeline: string }
        top_strengths: Strength[]
        key_gaps: Gap[]
        action_plan: ActionItem[]
      }
    }
    const wb = new ExcelJS.Workbook()
    wb.creator = 'CareerCare AI'

    // Sheet 1: Career Snapshot
    const s1 = wb.addWorksheet('Career Snapshot')
    s1.columns = [{ width: 25 }, { width: 55 }]

    const titleRow = s1.addRow(['CareerCare AI – Career Snapshot', ''])
    titleRow.getCell(1).font = { size: 16, bold: true, color: { argb: 'FF' + NAVY } }
    s1.mergeCells('A1:B1')
    s1.addRow([])

    const posLabelRow = s1.addRow(['Positioning Statement', ''])
    posLabelRow.getCell(1).font = { bold: true, color: { argb: 'FF' + NAVY } }
    const posRow = s1.addRow([synthesis.positioning_statement || '', ''])
    s1.mergeCells(`A${posRow.number}:B${posRow.number}`)
    posRow.getCell(1).alignment = { wrapText: true }
    posRow.height = 60
    s1.addRow([])

    const h1 = s1.addRow(['Current State', ''])
    headerStyle(h1)
    const cs = synthesis.current_state || {}
    ;[
      ['Name', synthesis.name],
      ['Role', cs.role],
      ['Company', cs.company],
      ['Experience', cs.experience],
      ['Domain', cs.domain],
      ['Current CTC', cs.ctc_approx],
      ['Notice Period', cs.notice_period],
    ].forEach(([k, v], i) => {
      const r = s1.addRow([k, v])
      altRow(r, i)
    })
    s1.addRow([])

    const h2 = s1.addRow(['Target State', ''])
    headerStyle(h2)
    const ts = synthesis.target_state || {}
    ;[
      ['Target Roles', (ts.roles || []).join(', ')],
      ['Target Sectors', (ts.sectors || []).join(', ')],
      ['Location', ts.location],
      ['Salary Min', ts.salary_min],
      ['Salary Max', ts.salary_max],
      ['Salary Aspirational', ts.salary_aspirational],
      ['Timeline', ts.timeline],
    ].forEach(([k, v], i) => {
      const r = s1.addRow([k, v])
      altRow(r, i)
    })

    // Sheet 2: Strengths & Gaps
    const s2 = wb.addWorksheet('Strengths & Gaps')
    s2.columns = [{ width: 22 }, { width: 32 }, { width: 42 }, { width: 28 }]

    const sh = s2.addRow(['Strength', 'Evidence', 'Interview Story', 'Relevance'])
    headerStyle(sh)
    ;(synthesis.top_strengths || []).forEach((s: Strength, i: number) => {
      const r = s2.addRow([s.strength, s.evidence, s.interview_story, s.relevance])
      altRow(r, i, i % 2 === 0 ? 'FF' + GREEN : 'FFDCEEDD')
      r.height = 50
    })
    s2.addRow([])

    const gh = s2.addRow(['Gap', 'Impact', 'Action', 'Timeline'])
    headerStyle(gh)
    ;(synthesis.key_gaps || []).forEach((g: Gap, i: number) => {
      const r = s2.addRow([g.gap, g.impact, g.action, g.timeline])
      altRow(r, i, i % 2 === 0 ? 'FF' + AMBER : 'FFFFF0CC')
      r.height = 50
    })

    // Sheet 3: Career Journey
    const s3 = wb.addWorksheet('Career Journey')
    s3.columns = [{ width: 22 }, { width: 30 }, { width: 20 }, { width: 32 }, { width: 22 }]
    const jh = s3.addRow(['Company', 'Role', 'Duration', 'Key Achievement', 'Skills Gained'])
    headerStyle(jh)
    const eg = s3.addRow(['(Add your career milestones here)', '', '', '', ''])
    eg.getCell(1).font = { italic: true, color: { argb: 'FF888888' } }
    const note = s3.addRow(['Use this sheet to map your career timeline visually.', '', '', '', ''])
    note.getCell(1).font = { italic: true, color: { argb: 'FF888888' } }

    // Sheet 4: Action Plan
    const s4 = wb.addWorksheet('Action Plan')
    s4.columns = [{ width: 30 }, { width: 42 }, { width: 22 }, { width: 15 }, { width: 20 }, { width: 20 }]
    const ah = s4.addRow(['Phase', 'Action', 'Category', 'Priority', 'Target Date', 'Status'])
    headerStyle(ah)
    const phaseColors: Record<string, string> = {
      'Days 1-15 (Foundation)': 'FFE3F2FD',
      'Days 16-30 (Network + Prep)': 'FFE8EAF6',
      'Days 31-45 (Active Search)': 'FFF3E5F5',
      'Days 46-90 (Offers)': 'FFE8F5E9',
    }
    ;(synthesis.action_plan || []).forEach((item: ActionItem, i: number) => {
      const r = s4.addRow([item.phase, item.action, item.category, item.priority, item.target_date, ''])
      const bg = phaseColors[item.phase] || 'FFFFFFFF'
      altRow(r, i, bg)
      r.height = 35
    })

    const buffer = await wb.xlsx.writeBuffer()
    return new NextResponse(buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="CareerCare-Workbook.xlsx"',
      },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
