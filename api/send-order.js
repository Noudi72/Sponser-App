// api/send-order.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  console.log('[/api/send-order] called, method=', req.method);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, email, products } = req.body || {};
  console.log('[/api/send-order] body sample:', { name, email, productsLength: products && products.length });
  if (!name || !email || !products) return res.status(400).json({ error: 'Missing fields' });

  if (!process.env.RESEND_API_KEY) {
    console.error('[/api/send-order] RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Mail service not configured (RESEND_API_KEY missing)' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    // Mail an Admin (dich)
    const fromAddr = process.env.RESEND_FROM || 'onboarding@resend.dev';
    console.log('[/api/send-order] using from address:', fromAddr);
    const adminResp = await resend.emails.send({
      from: fromAddr,
      to: 'n.guyaz@icloud.com',
      subject: `Neue Bestellung von ${name}`,
      html
    });
    console.log('[/api/send-order] adminResp:', adminResp);

    // Mail an Besteller (Kopie)
    const customerResp = await resend.emails.send({
      from: fromAddr,
      to: email,
      subject: 'Deine Bestellung beim EHCB Sponser-Shop',
      html: `<p>Vielen Dank für deine Bestellung, ${name}!<br>Hier deine Übersicht:</p>` + html
    });
    console.log('[/api/send-order] customerResp:', customerResp);

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}