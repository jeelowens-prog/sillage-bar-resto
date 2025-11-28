-- ============================================
-- SCHÉMA COMPLET SUPABASE POUR LE SILLAGE RESTAURANT
-- ============================================
-- Ce fichier contient:
-- 1. Création des tables
-- 2. Configuration des politiques RLS (Row Level Security)
-- 3. Configuration des buckets de stockage
-- ============================================

-- ============================================
-- ÉTAPE 1: CRÉATION DES TABLES
-- ============================================

-- Table: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table: menu_items
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('entrees', 'plats', 'desserts', 'boissons')),
    image_url TEXT,
    dietary TEXT DEFAULT '' CHECK (dietary IN ('', 'vegetarian', 'vegan', 'gluten-free')),
    spice_level TEXT DEFAULT 'mild' CHECK (spice_level IN ('mild', 'medium', 'hot')),
    allergens TEXT[] DEFAULT '{}',
    cultural_story TEXT,
    ingredients TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    is_signature BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    nutritional_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table: gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('food', 'atmosphere', 'events')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table: orders
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

-- Table: reservations
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
    special_requests TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- ÉTAPE 2: ACTIVER ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ÉTAPE 3: SUPPRIMER LES ANCIENNES POLITIQUES (SI ELLES EXISTENT)
-- ============================================

DROP POLICY IF EXISTS "Public can view active menu items" ON menu_items;
DROP POLICY IF EXISTS "Public can view all menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;

DROP POLICY IF EXISTS "Public can view active gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Public can view all gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON gallery_images;

DROP POLICY IF EXISTS "Public can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;

DROP POLICY IF EXISTS "Public can create reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated users can view all reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated users can update reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated users can delete reservations" ON reservations;

DROP POLICY IF EXISTS "Authenticated admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated admins can update admin users" ON admin_users;

-- ============================================
-- ÉTAPE 4: CRÉER LES NOUVELLES POLITIQUES RLS
-- ============================================

-- ============================================
-- POLITIQUES POUR: admin_users
-- ============================================

-- Les utilisateurs authentifiés peuvent voir les admins
CREATE POLICY "Authenticated users can view admin users"
ON admin_users FOR SELECT
TO authenticated
USING (true);

-- Les utilisateurs authentifiés peuvent insérer des admins
CREATE POLICY "Authenticated users can insert admin users"
ON admin_users FOR INSERT
TO authenticated
WITH CHECK (true);

-- Les utilisateurs authentifiés peuvent mettre à jour des admins
CREATE POLICY "Authenticated users can update admin users"
ON admin_users FOR UPDATE
TO authenticated
USING (true);

-- ============================================
-- POLITIQUES POUR: menu_items
-- ============================================

-- Tout le monde peut voir tous les plats du menu (pas seulement les actifs)
CREATE POLICY "Public can view all menu items"
ON menu_items FOR SELECT
TO public
USING (true);

-- Les utilisateurs authentifiés peuvent insérer des plats
CREATE POLICY "Authenticated users can insert menu items"
ON menu_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- Les utilisateurs authentifiés peuvent mettre à jour des plats
CREATE POLICY "Authenticated users can update menu items"
ON menu_items FOR UPDATE
TO authenticated
USING (true);

-- Les utilisateurs authentifiés peuvent supprimer des plats
CREATE POLICY "Authenticated users can delete menu items"
ON menu_items FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- POLITIQUES POUR: gallery_images
-- ============================================

-- Tout le monde peut voir toutes les images de la galerie (pas seulement les actives)
CREATE POLICY "Public can view all gallery images"
ON gallery_images FOR SELECT
TO public
USING (true);

-- Les utilisateurs authentifiés peuvent insérer des images
CREATE POLICY "Authenticated users can insert gallery images"
ON gallery_images FOR INSERT
TO authenticated
WITH CHECK (true);

-- Les utilisateurs authentifiés peuvent mettre à jour des images
CREATE POLICY "Authenticated users can update gallery images"
ON gallery_images FOR UPDATE
TO authenticated
USING (true);

-- Les utilisateurs authentifiés peuvent supprimer des images
CREATE POLICY "Authenticated users can delete gallery images"
ON gallery_images FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- POLITIQUES POUR: orders (COMMANDES)
-- ============================================

-- Tout le monde peut créer des commandes (PUBLIC)
CREATE POLICY "Public can create orders"
ON orders FOR INSERT
TO public
WITH CHECK (true);

-- Les utilisateurs authentifiés peuvent voir toutes les commandes
CREATE POLICY "Authenticated users can view all orders"
ON orders FOR SELECT
TO authenticated
USING (true);

-- Les utilisateurs authentifiés peuvent mettre à jour les commandes
CREATE POLICY "Authenticated users can update orders"
ON orders FOR UPDATE
TO authenticated
USING (true);

-- Les utilisateurs authentifiés peuvent supprimer des commandes
CREATE POLICY "Authenticated users can delete orders"
ON orders FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- POLITIQUES POUR: reservations (RÉSERVATIONS)
-- ============================================

-- Tout le monde peut créer des réservations (PUBLIC)
CREATE POLICY "Public can create reservations"
ON reservations FOR INSERT
TO public
WITH CHECK (true);

-- Les utilisateurs authentifiés peuvent voir toutes les réservations
CREATE POLICY "Authenticated users can view all reservations"
ON reservations FOR SELECT
TO authenticated
USING (true);

-- Les utilisateurs authentifiés peuvent mettre à jour les réservations
CREATE POLICY "Authenticated users can update reservations"
ON reservations FOR UPDATE
TO authenticated
USING (true);

-- Les utilisateurs authentifiés peuvent supprimer des réservations
CREATE POLICY "Authenticated users can delete reservations"
ON reservations FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- ÉTAPE 5: CRÉER LES INDEX POUR LA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- ============================================
-- ÉTAPE 6: CRÉER LES FONCTIONS DE MISE À JOUR AUTOMATIQUE
-- ============================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON gallery_images;
CREATE TRIGGER update_gallery_images_updated_at
    BEFORE UPDATE ON gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ÉTAPE 7: CONFIGURATION DES BUCKETS DE STOCKAGE
-- ============================================

-- NOTE: Les buckets doivent être créés manuellement dans l'interface Supabase
-- ou via le dashboard. Voici les politiques de stockage à appliquer:

-- Pour le bucket 'restaurant-images':
-- 1. Créer le bucket (public = true)
-- 2. Appliquer les politiques suivantes via SQL Editor:

-- POLITIQUE: Tout le monde peut uploader des images dans restaurant-images
CREATE POLICY "Public can upload images to restaurant-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'restaurant-images');

-- POLITIQUE: Tout le monde peut voir les images dans restaurant-images
CREATE POLICY "Public can view images in restaurant-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'restaurant-images');

-- POLITIQUE: Les utilisateurs authentifiés peuvent supprimer des images
CREATE POLICY "Authenticated users can delete images from restaurant-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'restaurant-images');

-- Pour le bucket 'payment-proofs':
-- 1. Créer le bucket (public = false pour la sécurité)
-- 2. Appliquer les politiques suivantes:

-- POLITIQUE: Tout le monde peut uploader des preuves de paiement
CREATE POLICY "Public can upload payment proofs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-proofs');

-- POLITIQUE: Seuls les admins authentifiés peuvent voir les preuves de paiement
CREATE POLICY "Authenticated users can view payment proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs');

-- POLITIQUE: Seuls les admins authentifiés peuvent supprimer des preuves
CREATE POLICY "Authenticated users can delete payment proofs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs');

-- ============================================
-- ÉTAPE 8: DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Exemples de plats (décommenter pour insérer)
/*
INSERT INTO menu_items (name, description, price, category, image_url, dietary, spice_level, is_signature, cultural_story, ingredients) VALUES
('Griot Traditionnel', 'Porc mariné aux épices créoles, riz collé, bananes plantains', 850, 'plats', 'https://images.unsplash.com/photo-1734771771447-d943e2b5f4d5', '', 'medium', true, 'Plat national haïtien, le griot représente l''art de la marinade créole transmis de génération en génération.', ARRAY['Porc', 'Épices créoles', 'Riz', 'Bananes plantains']),
('Poisson Rouge Grillé', 'Poisson frais grillé, épices caribéennes, légumes de saison', 950, 'plats', 'https://images.unsplash.com/photo-1552901695-cfa7432e6bbe', '', 'mild', false, 'Pêché dans les eaux cristallines des Caraïbes', ARRAY['Poisson rouge', 'Épices', 'Légumes']),
('Soupe Joumou', 'Soupe traditionnelle au giraumon, symbole de liberté', 650, 'entrees', 'https://images.unsplash.com/photo-1534596382981-1974b10d4e1a', '', 'medium', true, 'Interdite aux esclaves, cette soupe est devenue le symbole de la liberté haïtienne', ARRAY['Giraumon', 'Bœuf', 'Légumes', 'Épices']);
*/

-- ============================================
-- FIN DU SCHÉMA
-- ============================================

-- INSTRUCTIONS D'UTILISATION:
-- 1. Copiez tout ce fichier SQL
-- 2. Allez dans Supabase Dashboard > SQL Editor
-- 3. Collez le contenu et exécutez (Run)
-- 4. Vérifiez que toutes les tables et politiques sont créées
-- 5. Créez les buckets storage 'restaurant-images' et 'payment-proofs' dans Storage
-- 6. Les politiques de storage seront automatiquement appliquées
