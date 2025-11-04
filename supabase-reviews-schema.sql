-- ============================================
-- SCHÉMA POUR LA TABLE REVIEWS (AVIS CLIENTS)
-- ============================================

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_role TEXT DEFAULT 'Client',
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    profile_image_url TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- ACTIVER ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SUPPRIMER LES ANCIENNES POLITIQUES (SI ELLES EXISTENT)
-- ============================================

DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Public can create reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON reviews;

-- ============================================
-- CRÉER LES NOUVELLES POLITIQUES RLS
-- ============================================

-- Tout le monde peut voir les avis approuvés et actifs
CREATE POLICY "Public can view approved reviews"
ON reviews FOR SELECT
TO public
USING (is_approved = true AND is_active = true);

-- Tout le monde peut créer des avis
CREATE POLICY "Public can create reviews"
ON reviews FOR INSERT
TO public
WITH CHECK (true);

-- Les utilisateurs authentifiés peuvent voir tous les avis
CREATE POLICY "Authenticated users can view all reviews"
ON reviews FOR SELECT
TO authenticated
USING (true);

-- Les utilisateurs authentifiés peuvent mettre à jour les avis
CREATE POLICY "Authenticated users can update reviews"
ON reviews FOR UPDATE
TO authenticated
USING (true);

-- Les utilisateurs authentifiés peuvent supprimer des avis
CREATE POLICY "Authenticated users can delete reviews"
ON reviews FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- CRÉER LES INDEX POUR LA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_active ON reviews(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ============================================
-- TRIGGER POUR METTRE À JOUR updated_at
-- ============================================

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONNÉES DE TEST (OPTIONNEL - AVIS INITIAUX)
-- ============================================

-- Insérer les 3 avis existants comme données initiales
INSERT INTO reviews (customer_name, customer_role, rating, comment, profile_image_url, is_approved, is_active) VALUES
('Marie Dupont', 'Cliente régulière', 5, 'Une expérience culinaire exceptionnelle ! Le griot était parfaitement assaisonné et la livraison via MonCash très pratique.', 'https://images.unsplash.com/photo-1694091758579-479a51c75d84', true, true),
('Jean Baptiste', 'Critique culinaire', 5, 'Authentique cuisine haïtienne avec une présentation moderne. L''ambiance du restaurant est chaleureuse et accueillante.', 'https://images.unsplash.com/photo-1735181094336-7fa757df9622', true, true),
('Claudette Pierre', 'Cliente fidèle', 5, 'Le meilleur restaurant haïtien de Port-au-Prince ! Service impeccable et saveurs authentiques qui me rappellent mon enfance.', 'https://images.unsplash.com/flagged/photo-1576943416237-4ed0ce3416de', true, true);

-- ============================================
-- FIN DU SCHÉMA REVIEWS
-- ============================================


-- ============================================
-- crrer le bucket review-images
-- ============================================

-- 1. Activer l'extension si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Créer le bucket pour les images des avis
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (name) DO NOTHING;

-- 3. Politique pour autoriser le téléversement d'images par les utilisateurs authentifiés
CREATE POLICY "Autoriser le téléversement aux utilisateurs authentifiés"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'review-images' AND
    (storage.foldername(name))[1] = 'reviews' AND
    (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp')) AND
    (storage.extension(name) IS NOT NULL)
);

-- 4. Politique pour autoriser la lecture publique des images
CREATE POLICY "Autoriser la lecture publique des images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'review-images');

-- 5. Politique pour permettre la suppression des images (optionnel, pour les admins)
CREATE POLICY "Autoriser la suppression des images aux admins"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'review-images');