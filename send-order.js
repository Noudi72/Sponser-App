// /api/send-order.js

import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { name, email, products } = req.body;

  if (!name || !email || !products) return res.status(400).json({ error: 'Missing data' });

  // API-Key aus Environment (im Vercel Dashboard hinterlegen!)
  const resend = new Resend(process.env.RESEND_API_KEY);

  // E-Mail-HTML bauen
  const orderRows = products.map(p => `
    <tr>
      <td>${p.produkt}</td>
      <td>${p.geschmack || ''}</td>
      <td>${p.menge}</td>
      <td>CHF ${p.preis}</td>
    </tr>
  `).join('');
  const html = `
    <p>Neue Bestellung von <b>${name}</b> (${email}):</p>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr>
        <th>Produkt</th><th>Geschmack</th><th>Menge</th><th>Preis</th>
      </tr>
      ${orderRows}
    </table>
    <br>
    <b>Herzlichen Dank für die Bestellung!</b><br>
    Dein EHCB-Team
  `;

  // Mail an dich + Besteller
  const ADMIN = 'n.guyaz@icloud.com';
  const ABSENDER = 'nguyaz@ehcb.ch';

  try {
    await resend.emails.send({
      from: ABSENDER,
      to: [ADMIN, email],
      subject: 'Deine Bestellung bei EHCB Sponser',
      html
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
