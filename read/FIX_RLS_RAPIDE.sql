-- ============================================
-- 🚀 SCRIPT SQL ULTRA-RAPIDE - CORRECTION DES ERREURS
-- ============================================
-- Copiez et collez CE SCRIPT dans Supabase SQL Editor
-- Cliquez sur RUN (ou Ctrl+Enter)
-- ============================================

-- 1. ACTIVER RLS SUR LA TABLE ORDERS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER LES ANCIENNES POLITIQUES (SI ELLES EXISTENT)
DROP POLICY IF EXISTS "Public can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;

-- 3. CRÉER LES NOUVELLES POLITIQUES POUR ORDERS
-- ⭐ CETTE POLITIQUE EST CRITIQUE - ELLE PERMET AU PUBLIC DE CRÉER DES COMMANDES
CREATE POLICY "Public can create orders"
ON orders FOR INSERT
TO public
WITH CHECK (true);

-- Admins peuvent tout voir
CREATE POLICY "Authenticated users can view all orders"
ON orders FOR SELECT
TO authenticated
USING (true);

-- Admins peuvent mettre à jour
CREATE POLICY "Authenticated users can update orders"
ON orders FOR UPDATE
TO authenticated
USING (true);

-- Admins peuvent supprimer
CREATE POLICY "Authenticated users can delete orders"
ON orders FOR DELETE
TO authenticated
USING (true);

-- 4. POLITIQUES POUR LES BUCKETS DE STOCKAGE
-- ⭐ CES POLITIQUES PERMETTENT L'UPLOAD PUBLIC D'IMAGES

-- Supprimer les anciennes politiques de storage
DROP POLICY IF EXISTS "Public can upload images to restaurant-images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images in restaurant-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images from restaurant-images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete payment proofs" ON storage.objects;

-- Créer les nouvelles politiques pour restaurant-images
CREATE POLICY "Public can upload images to restaurant-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'restaurant-images');

CREATE POLICY "Public can view images in restaurant-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'restaurant-images');

CREATE POLICY "Authenticated users can delete images from restaurant-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'restaurant-images');

-- Créer les politiques pour payment-proofs
CREATE POLICY "Public can upload payment proofs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Authenticated users can view payment proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Authenticated users can delete payment proofs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs');

-- 5. POLITIQUES POUR MENU_ITEMS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;

CREATE POLICY "Public can view all menu items"
ON menu_items FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert menu items"
ON menu_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items"
ON menu_items FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete menu items"
ON menu_items FOR DELETE
TO authenticated
USING (true);

-- 6. POLITIQUES POUR GALLERY_IMAGES
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON gallery_images;

CREATE POLICY "Public can view all gallery images"
ON gallery_images FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert gallery images"
ON gallery_images FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery images"
ON gallery_images FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete gallery images"
ON gallery_images FOR DELETE
TO authenticated
USING (true);

-- 7. POLITIQUES POUR RESERVATIONS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can create reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated users can view all reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated users can update reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated users can delete reservations" ON reservations;

CREATE POLICY "Public can create reservations"
ON reservations FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all reservations"
ON reservations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update reservations"
ON reservations FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete reservations"
ON reservations FOR DELETE
TO authenticated
USING (true);

-- 8. POLITIQUES POUR ADMIN_USERS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can update admin users" ON admin_users;

CREATE POLICY "Authenticated users can view admin users"
ON admin_users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert admin users"
ON admin_users FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin users"
ON admin_users FOR UPDATE
TO authenticated
USING (true);

-- ============================================
-- ✅ SCRIPT TERMINÉ!
-- ============================================
-- Toutes les politiques RLS sont maintenant configurées.
-- 
-- PROCHAINES ÉTAPES:
-- 1. Vérifiez que les buckets existent dans Storage
-- 2. Retestez avec test-supabase.html
-- 3. Testez l'upload d'images et les commandes
-- ============================================
