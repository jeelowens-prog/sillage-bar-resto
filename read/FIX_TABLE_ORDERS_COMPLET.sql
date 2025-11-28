-- ============================================
-- 🔧 SCRIPT COMPLET: Table ORDERS
-- ============================================
-- Ce script crée ou met à jour la table orders avec TOUTES les colonnes
-- ============================================

-- Option 1: Si la table existe, ajouter les colonnes manquantes
-- Option 2: Si la table n'existe pas, la créer

-- Créer la table orders si elle n'existe pas
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    delivery_address TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'delivery', 'completed', 'cancelled', 'payment_pending')),
    payment_method TEXT DEFAULT 'moncash',
    payment_proof_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Si la table existe déjà, ajouter les colonnes manquantes
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'moncash';

-- Activer RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Public can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;

-- Créer les politiques RLS
CREATE POLICY "Public can create orders"
ON orders FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
ON orders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update orders"
ON orders FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete orders"
ON orders FOR DELETE
TO authenticated
USING (true);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Créer un trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

-- ============================================
-- ✅ SCRIPT TERMINÉ!
-- ============================================
-- La table orders est maintenant complète avec:
-- - Toutes les colonnes nécessaires
-- - Les politiques RLS configurées
-- - Les index pour la performance
-- - Le trigger pour updated_at
-- ============================================

-- Vérifier les colonnes de la table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
