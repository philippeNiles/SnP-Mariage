// À coller dans Google Sheets → Extensions → Apps Script (voir LISEZ-MOI.md).
// Chaque réponse RSVP devient une nouvelle ligne dans l'onglet « RSVP ».
// Si un même nom répond plus d'une fois, un courriel d'alerte est envoyé aux mariés.

const SHEET_NAME = "RSVP";
const ALERT_EMAILS = "philippe.niles@gmail.com,sroymolgat@gmail.com";
const HEADERS = [
  "Date", "Nom", "Courriel", "Présence", "Nombre de personnes",
  "Restrictions", "Accompagnateur", "Restrictions accompagnateur", "Message",
];

function doPost(e) {
  const p = e.parameter;

  // Piège à robots : un humain ne remplit jamais ce champ.
  if (p.website) return ContentService.createTextOutput("ok");

  const row = [
    new Date(),
    clean(p.nom),
    clean(p.courriel),
    clean(p.presence),
    Number(p.nombre) || 0,
    clean(p.restrictions),
    clean(p.accompagnateur),
    clean(p.restrictionsAccompagnateur),
    clean(p.message),
  ];

  let previous = [];
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
    if (sheet.getLastRow() > 1) {
      const key = normalize(row[1]);
      previous = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues()
        .filter((r) => normalize(r[1]) === key);
    }
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  // La réponse est déjà enregistrée : un échec d'envoi du courriel ne doit pas la perdre.
  if (previous.length) {
    try {
      sendDuplicateAlert(row, previous);
    } catch (err) {
      console.error("Courriel d'alerte non envoyé : " + err);
    }
  }
  return ContentService.createTextOutput("ok");
}

function sendDuplicateAlert(row, previous) {
  const all = previous.concat([row]);
  const emails = [...new Set(all.map((r) => String(r[2]).trim().toLowerCase()).filter(String))];
  const tz = Session.getScriptTimeZone();

  const lines = all.map((r, i) => {
    const date = Utilities.formatDate(new Date(r[0]), tz, "yyyy-MM-dd HH:mm");
    const plusOne = r[6] ? `, accompagné(e) de ${r[6]}` : "";
    return `${i + 1}. ${date} — ${r[2]} — Présence : ${r[3]} (${r[4]} pers.)${plusOne}`;
  });

  MailApp.sendEmail({
    to: ALERT_EMAILS,
    subject: `RSVP en double : ${row[1]} (${all.length} réponses)`,
    body:
      `« ${row[1]} » a envoyé une nouvelle réponse au RSVP.\n\n` +
      `Courriels associés à ce nom :\n${emails.map((m) => "• " + m).join("\n")}\n\n` +
      `Toutes les réponses (la plus récente en dernier) :\n${lines.join("\n")}\n\n` +
      `Voir le Google Sheet : ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
  });
}

// « Marie-Ève  Tremblay » et « marie-eve tremblay » sont considérés comme le même nom.
function normalize(name) {
  return String(name || "")
    .replace(/^'/, "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/\s+/g, " ").trim();
}

// Empêche qu'un texte commençant par =, +, - ou @ soit interprété comme une formule.
function clean(value) {
  const s = String(value || "").slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
