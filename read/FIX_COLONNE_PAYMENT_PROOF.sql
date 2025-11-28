-- ============================================
-- 🔧 CORRECTION: Ajouter la colonne payment_proof_url
-- ============================================
-- Erreur: "Could not find the 'payment_proof_url' column"
-- Solution: Ajouter cette colonne à la table orders
-- ============================================

-- Ajouter la colonne payment_proof_url si elle n'existe pas
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

-- Vérifier toutes les colonnes nécessaires
-- Si d'autres colonnes manquent, elles seront ajoutées

-- Colonne pour l'email du client (peut être NULL)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- Colonne pour l'adresse de livraison (peut être NULL)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- Colonne pour les notes (peut être NULL)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Colonne pour la méthode de paiement
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'moncash';

-- Colonne pour les items (JSONB pour stocker le panier)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Colonne pour le montant total
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0;

-- Colonne pour le statut
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'preparing', 'delivery', 'completed', 'cancelled', 'payment_pending'));

-- Colonnes de base (si elles n'existent pas)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL DEFAULT 'Unknown';

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_phone TEXT NOT NULL DEFAULT '';

-- Colonnes de timestamp
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());

-- Afficher un message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Colonne payment_proof_url ajoutée avec succès!';
    RAISE NOTICE 'Toutes les colonnes nécessaires ont été vérifiées et ajoutées si manquantes.';
END $$;

-- ============================================
-- ✅ SCRIPT TERMINÉ!
-- ============================================
-- La colonne payment_proof_url existe maintenant
-- Vous pouvez maintenant soumettre des commandes avec preuves de paiement
-- ============================================

-- OPTIONNEL: Vérifier les colonnes de la table orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
