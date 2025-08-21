// /api/send-mail.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export default async (req, res) => {
  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { name, email, ordered, lang, to, admin } = req.body;
    if (!name || !email || !ordered || !lang || !to || !admin) {
      console.error('Missing fields:', req.body);
      return res.status(400).json({ error: 'Missing fields' });
    }
    const total = ordered.reduce((sum, o) => sum + (+o.preis) * (+o.menge), 0);
    const texts = {
      de: {
        subject: "Deine Bestellung bei EHCB Sponser",
        intro: "Vielen Dank für deine Bestellung!",
        outro: "Herzlichen Dank für deine Bestellung - dein EHCB-Sponser-Team<br>Sportliche Grüsse<br>Noël Guyaz"
      },
      fr: {
        subject: "Votre commande chez EHCB Sponser",
        intro: "Merci pour votre commande !",
        outro: "Merci beaucoup pour votre commande - votre équipe EHCB-Sponser<br>Sportives salutations<br>Noël Guyaz"
      },
      en: {
        subject: "Your Order at EHCB Sponser",
        intro: "Thank you for your order!",
        outro: "Thank you very much for your order - your EHCB-Sponser team<br>Best regards<br>Noël Guyaz"
      }
    };
    const t = texts[lang] || texts.de;
    const list = ordered.map(o =>
      `<li>${o.produkt} (${o.geschmack || ""}) x${o.menge} – CHF ${o.preis}</li>`
    ).join('');
    const htmlBody = `
      <b>${t.intro}</b><br><br>
      <b>Folgende Produkte hast du bestellt:</b><br>
      <ul>${list}</ul>
      <br><b>Total: CHF ${total.toFixed(2)}</b>
      <br><br>${t.outro}
    `;
    const response = await resend.emails.send({
    from: 'onboarding@resend.dev',
      to: [to, admin],
      subject: t.subject,
      html: htmlBody
    });
    console.log('Resend response:', response);
    if (response.error) {
      console.error('Resend error:', response.error);
      return res.status(500).json({ error: response.error });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};