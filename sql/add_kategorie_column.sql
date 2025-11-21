-- SQL-Befehl zum Hinzufügen der Kategorie-Spalte zur produkte-Tabelle in Supabase
-- 
-- Anleitung:
-- 1. Öffne Supabase Dashboard
-- 2. Gehe zu "SQL Editor"
-- 3. Füge diesen Code ein und führe ihn aus

-- ============================================
-- 1. Spalte hinzufügen
-- ============================================
ALTER TABLE produkte 
ADD COLUMN IF NOT EXISTS kategorie TEXT;

-- ============================================
-- 2. Index für bessere Performance erstellen
-- ============================================
CREATE INDEX IF NOT EXISTS idx_produkte_kategorie ON produkte(kategorie);

-- ============================================
-- 3. Vordefinierte Kategorien zuweisen
-- ============================================
-- Standard-Kategorie für alle bestehenden Produkte ohne Kategorie
UPDATE produkte 
SET kategorie = 'Sonstiges' 
WHERE kategorie IS NULL;

-- Automatische Kategorisierung basierend auf Produktnamen (optional, anpassbar)
-- Diese Statements können angepasst werden, um bestimmte Produkte automatisch zu kategorisieren

-- Beispiel: Produkte mit "Recovery" im Namen → Recovery
UPDATE produkte 
SET kategorie = 'Recovery' 
WHERE LOWER(produkt) LIKE '%recovery%' 
  AND (kategorie IS NULL OR kategorie = 'Sonstiges');

-- Beispiel: Produkte mit "Protein" im Namen → Protein
UPDATE produkte 
SET kategorie = 'Protein' 
WHERE LOWER(produkt) LIKE '%protein%' 
  AND (kategorie IS NULL OR kategorie = 'Sonstiges');

-- Beispiel: Produkte mit "Isotonic", "Electrolyte", "Drink" → Getränke
UPDATE produkte 
SET kategorie = 'Getränke' 
WHERE (LOWER(produkt) LIKE '%isotonic%' 
    OR LOWER(produkt) LIKE '%electrolyte%' 
    OR LOWER(produkt) LIKE '%drink%'
    OR LOWER(produkt) LIKE '%getränk%')
  AND (kategorie IS NULL OR kategorie = 'Sonstiges');

-- Beispiel: Produkte mit "Energy", "Energie" → Energie
UPDATE produkte 
SET kategorie = 'Energie' 
WHERE (LOWER(produkt) LIKE '%energy%' 
    OR LOWER(produkt) LIKE '%energie%')
  AND (kategorie IS NULL OR kategorie = 'Sonstiges');

-- Beispiel: Produkte mit "Shake" → Recovery (oder Nahrungsergänzung)
UPDATE produkte 
SET kategorie = 'Recovery' 
WHERE LOWER(produkt) LIKE '%shake%' 
  AND (kategorie IS NULL OR kategorie = 'Sonstiges');

-- ============================================
-- 4. Überprüfung: Zeige alle vorhandenen Kategorien
-- ============================================
-- Führe diese Abfrage aus, um zu sehen, wie die Produkte kategorisiert wurden:
-- SELECT DISTINCT kategorie, COUNT(*) as anzahl 
-- FROM produkte 
-- GROUP BY kategorie 
-- ORDER BY kategorie;

-- ============================================
-- Vordefinierte Kategorien in der App:
-- ============================================
-- - Getränke
-- - Nahrungsergänzung
-- - Recovery
-- - Energie
-- - Protein
-- - Sonstiges
--
-- Diese Kategorien sind in admin-products.html vordefiniert
-- und können auch manuell über die Admin-Oberfläche zugewiesen werden.

