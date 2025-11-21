# SQL-Skripte für Supabase

## Kategorie-Spalte hinzufügen

### Schritt-für-Schritt Anleitung:

1. **Öffne Supabase Dashboard**
   - Gehe zu deinem Supabase-Projekt
   - Klicke auf "SQL Editor" in der linken Seitenleiste

2. **Führe das SQL-Skript aus**
   - Öffne die Datei `add_kategorie_column.sql`
   - Kopiere den SQL-Code
   - Füge ihn in den SQL Editor ein
   - Klicke auf "Run" oder drücke `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

3. **Überprüfung (optional)**
   - Führe die auskommentierte SELECT-Abfrage am Ende aus, um zu sehen, welche Kategorien vorhanden sind

### Wichtige Hinweise:

- **IF NOT EXISTS**: Verhindert Fehler, falls die Spalte bereits existiert
- **TEXT**: Flexibler Datentyp für Kategorienamen
- **NULL**: Bestehende Produkte haben zunächst keine Kategorie (kann später über die Admin-Oberfläche gesetzt werden)
- **Index**: Verbessert die Performance bei Kategorien-Filterungen

### Nach dem Ausführen:

- Alle neuen Produkte können direkt eine Kategorie erhalten
- Bestehende Produkte können über `/admin-products.html` bearbeitet und Kategorien zugewiesen werden
- Der Shop zeigt automatisch Kategorien-Filter an, sobald Produkte Kategorien haben

