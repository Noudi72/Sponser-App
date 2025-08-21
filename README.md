# Sponser-App – Bestell-Backend mit Resend-Mail

## Funktion
API-Endpoint zum E-Mail-Versand von Bestellungen (an Admin + Kunde).

## Deployment
1. Repo auf GitHub anlegen und diesen Code hochladen:
   - `/api/send-order.js` (siehe oben)
2. Mit [Vercel](https://vercel.com/) verbinden (Deploy-Button)
3. In den Projekt-Settings:
   - **Environment Variable** setzen:  
     Name: `RESEND_API_KEY`  
     Value: Dein API-Key von Resend

## Anfragen senden
POST an `/api/send-order` mit JSON-Body:
```json
{
  "name": "Max Muster",
  "email": "max@beispiel.ch",
  "products": [
    { "produkt": "Recovery Shake", "geschmack": "Vanille", "menge": 2, "preis": 29.90 }
  ]
}
