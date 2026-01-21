// Test-Skript für E-Mail-Versand
// Führt einen Test-E-Mail-Versand durch

import nodemailer from 'nodemailer';

// Lade Umgebungsvariablen (falls vorhanden)
try {
  const dotenv = await import('dotenv');
  dotenv.default.config();
} catch (e) {
  // dotenv nicht installiert - Umgebungsvariablen müssen direkt gesetzt sein
  console.log('Hinweis: dotenv nicht gefunden. Verwende Umgebungsvariablen direkt.');
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.error('SMTP-Konfiguration fehlt! Bitte setze:');
    console.error('  SMTP_HOST');
    console.error('  SMTP_PORT (optional, Standard: 587)');
    console.error('  SMTP_USER');
    console.error('  SMTP_PASS');
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    pool: true
  });
}

async function testEmail() {
  const transporter = createTransporter();
  if (!transporter) {
    console.error('Transporter konnte nicht erstellt werden.');
    process.exit(1);
  }

  const testEmail = process.env.TEST_EMAIL || 'n.guyaz@icloud.com';
  const fromAddr = process.env.SMTP_FROM || 'no-reply@team-app-spirit.ch';

  console.log('Sende Test-E-Mail an:', testEmail);
  console.log('Von:', fromAddr);

  try {
    const info = await transporter.sendMail({
      from: fromAddr,
      to: testEmail,
      subject: 'Test-E-Mail von Sponser App',
      html: `
        <h2>Test-E-Mail</h2>
        <p>Dies ist eine Test-E-Mail von der Sponser App.</p>
        <p>Wenn du diese E-Mail erhältst, funktioniert der E-Mail-Versand korrekt.</p>
        <p><strong>Zeitpunkt:</strong> ${new Date().toLocaleString('de-CH')}</p>
      `
    });
    
    console.log('✅ E-Mail erfolgreich gesendet!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('❌ Fehler beim Senden der E-Mail:');
    console.error(error);
    process.exit(1);
  }
}

testEmail();
