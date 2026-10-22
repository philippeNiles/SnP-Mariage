// À coller dans Google Sheets → Extensions → Apps Script (voir LISEZ-MOI.md).
// Chaque réponse RSVP devient une nouvelle ligne dans l'onglet « RSVP ».

const SHEET_NAME = "RSVP";
const HEADERS = [
  "Date", "Nom", "Courriel", "Présence", "Nombre de personnes",
  "Restrictions", "Accompagnateur", "Restrictions accompagnateur", "Message",
];

function doPost(e) {
  const p = e.parameter;

  // Piège à robots : un humain ne remplit jamais ce champ.
  if (p.website) return ContentService.createTextOutput("ok");

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#f3eef9");
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      clean(p.nom),
      clean(p.courriel),
      clean(p.presence),
      Number(p.nombre) || 0,
      clean(p.restrictions),
      clean(p.accompagnateur),
      clean(p.restrictionsAccompagnateur),
      clean(p.message),
    ]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput("ok");
}

// Empêche qu'un texte commençant par =, +, - ou @ soit interprété comme une formule.
function clean(value) {
  const s = String(value || "").slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
