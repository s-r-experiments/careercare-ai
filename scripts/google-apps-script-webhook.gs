/*
 GOOGLE APPS SCRIPT — Midcourse feedback / sessions / CV webhook

 SETUP:
 1. Open the Google Sheet this should write to (e.g. "Midcourse - Feedback").
 2. Extensions → Apps Script → delete any existing code → paste everything below.
 3. Deploy → Manage deployments → click the pencil on the existing deployment
    → Version: "New version" → Deploy.
    (Use "New version" on the EXISTING deployment, not "New deployment" —
    a new deployment gets a new URL and would require updating
    FEEDBACK_WEBHOOK_URL in .env.local and Vercel.)
 4. Re-run a test submission and confirm a "CVs" / "Sessions" / "Feedback"
    tab appears in the Sheet, and a "Midcourse CVs" folder appears in Drive.

 This single doPost handles three actions sent by the Next.js app:
   - action: 'cv'      → app/api/parse-cv/route.ts      (saves file to Drive + logs a row)
   - action: 'session' → app/api/synthesise/route.ts    (logs interview Q&A)
   - (no action field) → app/api/feedback/route.ts      (logs feedback form submissions)
 Each action writes to its own sheet tab, auto-created on first use.
*/

const CV_FOLDER_NAME = 'Midcourse CVs'

function doPost(e) {
  const d = JSON.parse(e.postData.contents)
  const action = d.action || 'feedback'

  if (action === 'cv') {
    saveCv(d)
  } else if (action === 'session') {
    saveSession(d)
  } else {
    saveFeedback(d)
  }

  return ContentService.createTextOutput('ok')
}

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(name)
  if (!sheet) {
    sheet = ss.insertSheet(name)
    sheet.appendRow(headers)
  }
  return sheet
}

function getOrCreateFolder(name) {
  const folders = DriveApp.getFoldersByName(name)
  if (folders.hasNext()) return folders.next()
  return DriveApp.createFolder(name)
}

function saveFeedback(d) {
  const sheet = getOrCreateSheet('Feedback', [
    'Timestamp', 'Rating', 'What Worked (tags)', 'What Worked (text)', 'Improvement', 'Name', 'Email', 'CV User',
  ])
  sheet.appendRow([
    new Date(),
    d.rating || '',
    (d.workedWhat || []).join(', '),
    d.workedText || '',
    d.improvement || '',
    d.name || '',
    d.email || '',
    d.userName || '',
  ])
}

function saveSession(d) {
  const sheet = getOrCreateSheet('Sessions', [
    'Timestamp', 'Record ID', 'Mode', 'Name', 'Q&A',
  ])
  const qaText = (d.qa || []).map(item => `Q: ${item.q}\nA: ${item.a}`).join('\n\n')
  sheet.appendRow([
    new Date(),
    d.recordId || '',
    d.mode || '',
    d.name || '',
    qaText,
  ])
}

function saveCv(d) {
  const folder = getOrCreateFolder(CV_FOLDER_NAME)
  const bytes = Utilities.base64Decode(d.fileBase64)
  const blob = Utilities.newBlob(bytes, d.mimeType || 'application/octet-stream', `${d.recordId || 'NOID'}_${d.fileName || 'cv'}`)
  const file = folder.createFile(blob)

  const sheet = getOrCreateSheet('CVs', [
    'Timestamp', 'Record ID', 'File Name', 'Drive Link',
  ])
  sheet.appendRow([
    new Date(),
    d.recordId || '',
    d.fileName || '',
    file.getUrl(),
  ])
}
