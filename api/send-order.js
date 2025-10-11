// api/send-order.js
import nodemailer from 'nodemailer';

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    pool: true
  });
}

export default async function handler(req, res) {
  console.log('[/api/send-order] called, method=', req.method);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, email, products } = req.body || {};
  console.log('[/api/send-order] body sample:', { name, email, productsLength: products && products.length });
  if (!name || !email || !products) return res.status(400).json({ error: 'Missing fields' });

  // E-Mail-HTML bauen
  const orderRows = products.map(p => `
    <tr>
      <td>${p.produkt || ''}</td>
      <td>${p.geschmack || ''}</td>
      <td>${p.menge}</td>
      <td>CHF ${p.preis}</td>
    </tr>
  `).join('');
  const html = `
    <h3>Neue Bestellung von <b>${name}</b> (${email})</h3>
    <table border="1" cellpadding="5" style="border-collapse:collapse;">
      <tr>
        <th>Produkt</th>
        <th>Geschmack</th>
        <th>Menge</th>
        <th>Preis</th>
      </tr>
      ${orderRows}
    </table>
    <br>
    <small>Diese Nachricht wurde automatisch gesendet.</small>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    console.error('[/api/send-order] SMTP config missing (SMTP_HOST/USER/PASS)');
    return res.status(500).json({ error: 'Mail service not configured (SMTP missing)' });
  }

  try {
    const fromAddr = process.env.SMTP_FROM || 'no-reply@team-app-spirit.ch';
    console.log('[/api/send-order] using from address:', fromAddr);
    // Mail an Admin (dich)
    const adminInfo = await transporter.sendMail({
      from: fromAddr,
      to: 'n.guyaz@team-app-spirit.ch',
      subject: `Neue Bestellung von ${name}`,
      html
    });
    console.log('[/api/send-order] adminInfo:', adminInfo);

    // Mail an Besteller (Kopie)
    const customerInfo = await transporter.sendMail({
      from: fromAddr,
      to: email,
      subject: 'Deine Bestellung beim EHCB Sponser-Shop',
      html: `<p>Vielen Dank für deine Bestellung, ${name}!<br>Hier deine Übersicht:</p>` + html
    });
    console.log('[/api/send-order] customerInfo:', customerInfo);

    return res.status(200).json({ success: true, adminInfo, customerInfo });
  } catch (e) {
    console.error('[/api/send-order] send error:', e);
    return res.status(500).json({ error: e.message });
  }
}