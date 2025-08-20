// /api/send-mail.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, ordered, lang, to, admin } = req.body;
  const total = ordered.reduce((sum, o) => sum + (+o.preis) * (+o.menge), 0);

  // Mailtext in Deutsch/Französisch/Englisch
  const texts = {
    de: {
      subject: "Deine Bestellung bei EHCB Sponser",
      intro: "Vielen Dank für deine Bestellung!",
      outro: "Wir danken dir herzlich – dein EHCB-Team"
    },
    fr: {
      subject: "Votre commande chez EHCB Sponser",
      intro: "Merci pour votre commande !",
      outro: "Merci beaucoup – votre équipe EHCB"
    },
    en: {
      subject: "Your Order at EHCB Sponser",
      intro: "Thank you for your order!",
      outro: "Best regards – your EHCB team"
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

  // Kunde + Admin bekommen gleiche Mail
  await resend.emails.send({
    from: 'nguyaz@ehcb.ch',
    to: [to, admin],
    subject: t.subject,
    html: htmlBody
  });

  res.status(200).json({success:true});
};