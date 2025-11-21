# Development Setup

## Lokaler Dev-Server

Um die App lokal zu testen:

```bash
npm run dev
```

Oder manuell:
```bash
cd public
python3 -m http.server 8000
```

Dann öffne im Browser: `http://localhost:8000`

## Admin-Bereiche

1. **Bestellübersicht**: `/admin.html`
   - Passwort: `Coach_Sponser_72`
   - Bestellungen anzeigen, löschen, PDF/Excel Export

2. **Produktverwaltung**: `/admin-products.html`
   - Passwort: `Coach_Sponser_72`
   - Produkte hinzufügen, bearbeiten, löschen
   - Alle Felder: Name, Preis, Beschreibungen (DE/FR/EN), Varianten, Bild-URL, Sortierung

3. **Artikel sortieren**: `/admin-sort/`
   - Drag & Drop Sortierung der Produkte

## Neue Features

### Produktverwaltung
- ✅ Produkte direkt in der Web-App hinzufügen
- ✅ Produkte bearbeiten
- ✅ Produkte löschen
- ✅ Mehrsprachige Beschreibungen (DE/FR/EN)
- ✅ Varianten/Geschmacksrichtungen verwalten
- ✅ Bild-URLs hinzufügen
- ✅ Sortierreihenfolge setzen

## Verbesserungspotential

### Kurzfristig
1. **Bild-Upload**: Statt URL direkt Bilder hochladen (z.B. zu Supabase Storage)
2. **Produkt-Vorschau**: Vorschau wie das Produkt im Shop aussieht
3. **Bulk-Import**: CSV/Excel Import für mehrere Produkte
4. **Validierung**: Bessere Validierung der Eingaben (z.B. Preis > 0)

### Mittelfristig
1. **Bestellstatus**: Status-Tracking für Bestellungen (z.B. "Versendet", "Abgeschlossen")
2. **Statistiken**: Dashboard mit Verkaufsstatistiken
3. **Produktkategorien**: Kategorien für Produkte einführen
4. **Lagerbestand**: Lagerbestand verwalten und anzeigen

### Langfristig
1. **Benutzerverwaltung**: Mehrere Admin-Accounts mit Rollen
2. **API**: REST API für externe Integrationen
3. **Mobile App**: Native Mobile App
4. **Zahlungsintegration**: Direkte Zahlungsabwicklung im Shop

