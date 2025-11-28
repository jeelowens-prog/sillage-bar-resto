# 🚀 Commandes SQL Rapides - Le Sillage Restaurant

## 📌 Pour Corriger Rapidement les Erreurs

Si vous avez des erreurs spécifiques, voici les commandes SQL à exécuter directement dans Supabase SQL Editor.

---

## 🔧 1. CORRIGER: "viole les politiques" sur UPLOAD D'IMAGES

### Étape 1: Supprimer les anciennes politiques (si elles existent)

```sql
DROP POLICY IF EXISTS "Public can upload images to restaurant-images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images in restaurant-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images from restaurant-images" ON storage.objects;
```

### Étape 2: Créer les nouvelles politiques

```sql
-- Permettre au public d'uploader des images
CREATE POLICY "Public can upload images to restaurant-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'restaurant-images');

-- Permettre au public de voir les images
CREATE POLICY "Public can view images in restaurant-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'restaurant-images');

-- Permettre aux admins authentifiés de supprimer
CREATE POLICY "Authenticated users can delete images from restaurant-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'restaurant-images');
```

---

## 🛒 2. CORRIGER: Erreur lors de la SOUMISSION DE COMMANDES

### Étape 1: Activer RLS sur la table orders

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

### Étape 2: Supprimer les anciennes politiques

```sql
DROP POLICY IF EXISTS "Public can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;
```

### Étape 3: Créer les nouvelles politiques

```sql
-- Permettre au PUBLIC de créer des commandes (IMPORTANT!)
CREATE POLICY "Public can create orders"
ON orders FOR INSERT
TO public
WITH CHECK (true);

-- Permettre aux admins authentifiés de voir toutes les commandes
CREATE POLICY "Authenticated users can view all orders"
ON orders FOR SELECT
TO authenticated
USING (true);

-- Permettre aux admins de mettre à jour les commandes
CREATE POLICY "Authenticated users can update orders"
ON orders FOR UPDATE
TO authenticated
USING (true);

-- Permettre aux admins de supprimer les commandes
CREATE POLICY "Authenticated users can delete orders"
ON orders FOR DELETE
TO authenticated
USING (true);
```

---

## 📸 3. CORRIGER: Erreur sur GALERIE (gallery_images)

### Politiques pour la galerie

```sql
-- Activer RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes
DROP POLICY IF EXISTS "Public can view all gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON gallery_images;

-- Créer les nouvelles
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
```

---

## 🍽️ 4. CORRIGER: Erreur sur MENU (menu_items)

### Politiques pour le menu

```sql
-- Activer RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes
DROP POLICY IF EXISTS "Public can view all menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;

-- Créer les nouvelles
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
```

---

## 📅 5. CORRIGER: Erreur sur RÉSERVATIONS

### Politiques pour les réservations

```sql
-- Activer RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes
DROP POLICY IF EXISTS "Public can create reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated users can view all reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated users can update reservations" ON reservations;
DROP POLICY IF EXISTS "Authenticated users can delete reservations" ON reservations;

-- Créer les nouvelles
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
```

---

## 🔑 6. CRÉER un Utilisateur Admin

### Étape 1: Créer dans Authentication

1. Allez dans **Authentication** > **Users**
2. Cliquez sur **Add user**
3. Email: `admin@lesillage.ht`
4. Password: votre mot de passe
5. ✅ Cochez "Auto Confirm User"
6. Cliquez sur **Create**

### Étape 2: Ajouter dans la table admin_users

```sql
-- Remplacez l'email par celui que vous avez créé
INSERT INTO admin_users (email, full_name, role) 
VALUES ('admin@lesillage.ht', 'Jean-Claude Moïse', 'super_admin');
```

---

## 🗑️ 7. NETTOYER: Supprimer les Données de Test

### Supprimer toutes les commandes de test

```sql
DELETE FROM orders WHERE customer_name = 'Test User' OR customer_name = 'Client Test';
```

### Supprimer les images de test dans le bucket

```sql
-- Via l'interface Supabase Storage, allez dans le bucket et supprimez manuellement
-- OU utilisez cette requête pour lister les fichiers
SELECT * FROM storage.objects WHERE bucket_id = 'restaurant-images';
```

---

## 📊 8. VÉRIFIER: État des Politiques

### Voir toutes les politiques sur une table

```sql
-- Pour la table orders
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'orders';
```

### Voir toutes les politiques de storage

```sql
SELECT 
    policyname,
    bucket_id,
    operation,
    check_expression
FROM storage.policies;
```

---

## 🔍 9. DIAGNOSTIC: Vérifier les Tables

### Vérifier si une table existe

```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'orders'
);
```

### Compter les enregistrements

```sql
SELECT 
    'menu_items' as table_name, COUNT(*) as count FROM menu_items
UNION ALL
SELECT 'gallery_images', COUNT(*) FROM gallery_images
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'reservations', COUNT(*) FROM reservations
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users;
```

---

## 🆘 10. TOUT RÉINITIALISER (ATTENTION: DESTRUCTIF!)

### ⚠️ ATTENTION: Ceci supprime TOUTES les données!

**À utiliser uniquement en dernier recours**

```sql
-- Supprimer toutes les politiques
DROP POLICY IF EXISTS "Public can view all menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;

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

-- Supprimer les tables (ATTENTION!)
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;

-- Ensuite, exécutez supabase-schema.sql pour tout recréer
```

---

## 📋 ORDRE RECOMMANDÉ D'EXÉCUTION

Pour corriger tous les problèmes d'un coup:

1. **Exécutez TOUT le fichier `supabase-schema.sql`**
   - C'est la solution la plus simple et la plus sûre
   - Il contient toutes les commandes ci-dessus

2. Si vous voulez corriger un problème spécifique:
   - Commandes de la section 1 (upload images)
   - Commandes de la section 2 (commandes)
   - Commandes de la section 3 (galerie)
   - Commandes de la section 4 (menu)

3. **Créez un admin** (section 6)

4. **Testez** avec `test-supabase.html`

---

## 💡 ASTUCE: Copier-Coller Rapide

Pour exécuter rapidement:

1. Copiez la section entière qui vous intéresse
2. Allez dans Supabase → SQL Editor
3. Collez
4. Cliquez sur Run (ou Ctrl+Enter)

✅ Les commandes sont dans le bon ordre et peuvent être exécutées en bloc.

---

## 🎯 COMMANDE UNIQUE POUR TOUT CORRIGER

Si vous voulez tout corriger d'un coup, copiez et exécutez ceci:

```sql
-- SCRIPT DE CORRECTION RAPIDE

-- 1. Activer RLS sur toutes les tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Politiques pour ORDERS (permet au public de créer des commandes)
DROP POLICY IF EXISTS "Public can create orders" ON orders;
CREATE POLICY "Public can create orders" ON orders FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
CREATE POLICY "Authenticated users can view all orders" ON orders FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
CREATE POLICY "Authenticated users can update orders" ON orders FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;
CREATE POLICY "Authenticated users can delete orders" ON orders FOR DELETE TO authenticated USING (true);

-- 3. Politiques pour STORAGE (permet l'upload public)
DROP POLICY IF EXISTS "Public can upload images to restaurant-images" ON storage.objects;
CREATE POLICY "Public can upload images to restaurant-images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'restaurant-images');

DROP POLICY IF EXISTS "Public can view images in restaurant-images" ON storage.objects;
CREATE POLICY "Public can view images in restaurant-images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'restaurant-images');

DROP POLICY IF EXISTS "Authenticated users can delete images from restaurant-images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images from restaurant-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'restaurant-images');

-- 4. Politiques pour GALLERY_IMAGES
DROP POLICY IF EXISTS "Public can view all gallery images" ON gallery_images;
CREATE POLICY "Public can view all gallery images" ON gallery_images FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert gallery images" ON gallery_images;
CREATE POLICY "Authenticated users can insert gallery images" ON gallery_images FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON gallery_images;
CREATE POLICY "Authenticated users can update gallery images" ON gallery_images FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON gallery_images;
CREATE POLICY "Authenticated users can delete gallery images" ON gallery_images FOR DELETE TO authenticated USING (true);

-- 5. Politiques pour MENU_ITEMS
DROP POLICY IF EXISTS "Public can view all menu items" ON menu_items;
CREATE POLICY "Public can view all menu items" ON menu_items FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
CREATE POLICY "Authenticated users can insert menu items" ON menu_items FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;
CREATE POLICY "Authenticated users can update menu items" ON menu_items FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;
CREATE POLICY "Authenticated users can delete menu items" ON menu_items FOR DELETE TO authenticated USING (true);

-- 6. Politiques pour RESERVATIONS
DROP POLICY IF EXISTS "Public can create reservations" ON reservations;
CREATE POLICY "Public can create reservations" ON reservations FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view all reservations" ON reservations;
CREATE POLICY "Authenticated users can view all reservations" ON reservations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can update reservations" ON reservations;
CREATE POLICY "Authenticated users can update reservations" ON reservations FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete reservations" ON reservations;
CREATE POLICY "Authenticated users can delete reservations" ON reservations FOR DELETE TO authenticated USING (true);

-- FIN - Toutes les politiques sont maintenant configurées!
```

**Copiez ce bloc complet et exécutez-le dans Supabase SQL Editor.**

✅ Cela corrigera tous les problèmes de politiques RLS!

---

**Date:** 2025
**Utilisation:** Copier-coller dans Supabase SQL Editor
