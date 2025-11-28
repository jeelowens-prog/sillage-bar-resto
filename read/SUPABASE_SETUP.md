# Guide de Configuration Supabase - Le Sillage Restaurant

## Étape 1: Créer un Compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Notez votre **Project URL** et **anon/public key**

## Étape 2: Exécuter le Schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Ouvrez le fichier `/app/supabase-schema.sql`
3. Copiez tout le contenu
4. Collez-le dans l'éditeur SQL Supabase
5. Cliquez sur **Run**

## Étape 3: Créer le Bucket de Stockage

1. Allez dans **Storage** dans Supabase
2. Cliquez sur **New bucket**
3. Nom du bucket: `restaurant-images`
4. Rendez-le **public** pour que les images soient accessibles
5. Cliquez sur **Create bucket**

## Étape 4: Créer un Utilisateur Admin

1. Allez dans **Authentication** > **Users**
2. Cliquez sur **Add user**
3. Créez un utilisateur avec:
   - Email: `admin@lesillage.ht` (ou votre email)
   - Password: Choisissez un mot de passe sécurisé
   - Confirmez l'email automatiquement
4. Ensuite, allez dans **SQL Editor** et exécutez:

```sql
INSERT INTO admin_users (email, full_name, role) 
VALUES ('admin@lesillage.ht', 'Jean-Claude Moïse', 'super_admin');
```

(Remplacez l'email par celui que vous avez créé)

## Étape 5: Configurer l'Application

### Option A: Configuration via Interface Web
1. Ouvrez `supabase-config.html` dans votre navigateur
2. Entrez votre **Supabase URL** et **Anon Key**
3. Cliquez sur **Enregistrer**

### Option B: Configuration Manuelle
Ouvrez la console du navigateur sur votre site et exécutez:
```javascript
localStorage.setItem('SUPABASE_URL', 'YOUR_SUPABASE_URL');
localStorage.setItem('SUPABASE_ANON_KEY', 'YOUR_SUPABASE_ANON_KEY');
```

## Étape 6: Tester la Connexion

1. Allez sur `/pages/admin_login.html`
2. Connectez-vous avec vos identifiants admin
3. Vous devriez être redirigé vers le portail admin

## Étape 7: Ajouter des Données de Démonstration (Optionnel)

Exécutez ce SQL pour ajouter des données de test:

```sql
-- Exemples de plats
INSERT INTO menu_items (name, description, price, category, image_url, dietary, spice_level, is_signature, cultural_story, ingredients) VALUES
('Griot Traditionnel', 'Porc mariné aux épices créoles, riz collé, bananes plantains', 850, 'plats', 'https://images.unsplash.com/photo-1734771771447-d943e2b5f4d5', '', 'medium', true, 'Plat national haïtien, le griot représente l''art de la marinade créole transmis de génération en génération.', ARRAY['Porc', 'Épices créoles', 'Riz', 'Bananes plantains']),
('Poisson Rouge Grillé', 'Poisson frais grillé, épices caribéennes, légumes de saison', 950, 'plats', 'https://images.unsplash.com/photo-1552901695-cfa7432e6bbe', '', 'mild', false, 'Pêché dans les eaux cristallines des Caraïbes', ARRAY['Poisson rouge', 'Épices', 'Légumes']),
('Soupe Joumou', 'Soupe traditionnelle au giraumon, symbole de liberté', 650, 'entrees', 'https://images.unsplash.com/photo-1534596382981-1974b10d4e1a', '', 'medium', true, 'Interdite aux esclaves, cette soupe est devenue le symbole de la liberté haïtienne', ARRAY['Giraumon', 'Bœuf', 'Légumes', 'Épices']);

-- Exemples d'images de galerie
INSERT INTO gallery_images (title, description, image_url, category, display_order) VALUES
('Griot Traditionnel', 'Notre plat signature aux épices créoles', 'https://images.unsplash.com/photo-1665334217407-6688e6941a47', 'food', 1),
('Salle Principale', 'Ambiance chaleureuse et sophistiquée', 'https://images.unsplash.com/photo-1717319440350-44548affe27d', 'atmosphere', 2),
('Événements Privés', 'Célébrations mémorables', 'https://images.unsplash.com/photo-1698833280997-1869bfa2adb0', 'events', 3);
```

## Structure des Tables

### admin_users
- id (UUID)
- email
- full_name
- role
- created_at, updated_at

### menu_items
- id (UUID)
- name
- description
- price
- category (entrees, plats, desserts, boissons)
- image_url
- dietary (vegetarian, vegan, gluten-free)
- spice_level (mild, medium, hot)
- allergens (array)
- cultural_story
- ingredients (array)
- is_available
- is_signature
- is_popular
- nutritional_info (JSON)
- created_at, updated_at

### gallery_images
- id (UUID)
- title
- description
- image_url
- category (food, atmosphere, events)
- display_order
- is_active
- created_at, updated_at

### orders
- id (UUID)
- customer_name
- customer_email
- customer_phone
- items (JSON)
- total_amount
- delivery_address
- status (pending, preparing, delivery, completed, cancelled)
- payment_method
- notes
- created_at, updated_at

### reservations
- id (UUID)
- customer_name
- customer_email
- customer_phone
- reservation_date
- reservation_time
- number_of_guests
- special_requests
- status (pending, confirmed, cancelled, completed)
- created_at, updated_at

## Sécurité

- Les policies RLS (Row Level Security) sont activées
- Le public peut seulement lire les menus et galeries actifs
- Les utilisateurs authentifiés (admins) ont accès complet
- Le public peut créer des commandes et réservations

## Problèmes Courants

### Erreur "Configuration Supabase manquante"
- Vérifiez que vous avez bien configuré les clés dans localStorage
- Allez sur `supabase-config.html` pour reconfigurer

### Erreur "Accès non autorisé"
- Vérifiez que l'utilisateur existe dans la table `admin_users`
- Exécutez l'INSERT SQL pour ajouter l'utilisateur

### Images non affichées
- Vérifiez que le bucket `restaurant-images` est public
- Vérifiez l'URL de l'image dans Supabase Storage

## Support

Pour plus d'aide, consultez la documentation Supabase:
- [Documentation Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
