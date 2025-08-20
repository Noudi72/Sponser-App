// api/send-order.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, email, products } = req.body;
  if (!name || !email || !products) return res.status(400).json({ error: 'Missing fields' });

  // API-Key aus Environment (Vercel Dashboard)
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
    await resend.emails.send({
      from: 'onboarding@resend.dev', // oder eigene Domain, wenn freigeschaltet
      to: 'n.guyaz@icloud.com',
      subject: `Neue Bestellung von ${name}`,
      html
    });

    // Mail an Besteller (Kopie)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Deine Bestellung beim EHCB Sponser-Shop',
      html: `<p>Vielen Dank für deine Bestellung, ${name}!<br>Hier deine Übersicht:</p>` + html
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}