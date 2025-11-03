# 🎉 Le Sillage - Système Dynamique avec Supabase

## ✅ Configuration Complétée

Votre site Le Sillage est maintenant complètement dynamique et connecté à Supabase!

## 📋 Ce qui a été implémenté

### Phase 1: Infrastructure Supabase
- ✅ Schéma de base de données complet
- ✅ Configuration Supabase
- ✅ Authentification admin sécurisée
- ✅ Row Level Security (RLS)

### Phase 2: Portail Admin
- ✅ Tableau de bord avec statistiques
- ✅ Gestion du menu (CRUD complet)
- ✅ Gestion de la galerie (CRUD complet)
- ✅ Gestion des commandes
- ✅ Gestion des réservations
- ✅ Upload d'images vers Supabase Storage

### Phase 3: Frontend Dynamique
- ✅ Menu interactif chargé depuis Supabase
- ✅ Galerie dynamique depuis Supabase
- ✅ Système de commande fonctionnel
- ✅ Système de réservation fonctionnel
- ✅ Panier d'achat avec localStorage

## 🚀 Comment Démarrer

### 1. Configuration Supabase (À faire une seule fois)

#### Étape 1: Créer un projet Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Notez votre **Project URL** et **anon/public key**

#### Étape 2: Exécuter le schéma SQL
1. Dans Supabase, allez dans **SQL Editor**
2. Ouvrez le fichier `/app/supabase-schema.sql`
3. Copiez tout le contenu
4. Collez dans l'éditeur SQL
5. Cliquez sur **Run**

#### Étape 3: Créer le bucket de stockage
1. Allez dans **Storage**
2. Cliquez sur **New bucket**
3. Nom: `restaurant-images`
4. **Cochez "Public bucket"** ✅ (Important!)
5. Cliquez sur **Create bucket**

#### Étape 4: Créer un utilisateur admin
1. Allez dans **Authentication** > **Users**
2. Cliquez sur **Add user**
3. Email: `admin@lesillage.ht` (ou votre email)
4. Password: Choisissez un mot de passe sécurisé
5. Confirmez l'email automatiquement

6. Ensuite, dans **SQL Editor**, exécutez:
```sql
INSERT INTO admin_users (email, full_name, role) 
VALUES ('admin@lesillage.ht', 'Votre Nom', 'super_admin');
```
(Remplacez par votre email)

#### Étape 5: Configurer le site
1. Ouvrez `supabase-config.html` dans votre navigateur
2. Entrez votre **Supabase URL**
3. Entrez votre **Anon Key**
4. Cliquez sur **Enregistrer**

### 2. Accéder au Portail Admin

1. Allez sur `/pages/admin_login.html`
2. Connectez-vous avec vos identifiants
3. Vous êtes maintenant dans le portail admin! 🎉

### 3. Ajouter du Contenu

#### Ajouter des Plats au Menu
1. Dans le portail admin, cliquez sur **Menu**
2. Cliquez sur **Ajouter un Plat**
3. Remplissez les informations:
   - Nom du plat
   - Description
   - Prix (en HTG)
   - Catégorie (Entrées, Plats, Desserts, Boissons)
   - Image (upload depuis votre ordinateur)
   - Histoire culturelle (optionnel)
   - Ingrédients
   - Options diététiques
4. Cliquez sur **Enregistrer**

#### Ajouter des Images à la Galerie
1. Cliquez sur **Galerie**
2. Cliquez sur **Ajouter une Image**
3. Remplissez:
   - Titre
   - Description
   - Catégorie (Food, Atmosphère, Événements)
   - Téléchargez l'image
4. Cliquez sur **Enregistrer**

### 4. Tester le Site Frontend

1. Allez sur `/pages/homepage.html`
2. Naviguez vers le **Menu Interactif**
3. Vous verrez maintenant les plats que vous avez ajoutés!
4. Testez d'ajouter des plats au panier
5. Testez le système de commande
6. Testez la galerie dynamique
7. Testez le système de réservation

## 📂 Structure des Fichiers

```
/app/
├── supabase-schema.sql          # Schéma de base de données
├── supabase-config.html         # Page de configuration
├── SUPABASE_SETUP.md           # Guide détaillé
├── js/
│   ├── supabase.js             # API client Supabase
│   ├── supabase-init.js        # Initialisation automatique
│   ├── frontend-menu.js        # Menu dynamique
│   ├── frontend-gallery.js     # Galerie dynamique
│   ├── order-system.js         # Système de commande
│   └── reservation-system.js   # Système de réservation
└── pages/
    ├── admin_login.html        # Page de connexion admin
    ├── admin_portal.html       # Portail admin complet
    ├── homepage.html           # Page d'accueil (+ scripts)
    ├── interactive_menu.html   # Menu dynamique
    ├── gallery.html            # Galerie dynamique
    └── contact.html            # Contact + réservations
```

## 🔐 Sécurité

- ✅ Authentification requise pour le portail admin
- ✅ Vérification du rôle admin
- ✅ Row Level Security (RLS) activé
- ✅ Clés Supabase stockées dans localStorage (côté client)
- ✅ Policies Supabase pour contrôler l'accès aux données

## 🎨 Fonctionnalités du Portail Admin

### Tableau de Bord
- Statistiques en temps réel
- Vue des commandes récentes
- Navigation intuitive

### Gestion du Menu
- ✅ Ajouter, modifier, supprimer des plats
- ✅ Upload d'images
- ✅ Gestion de la disponibilité
- ✅ Catégorisation automatique
- ✅ Badges (signature, populaire)
- ✅ Informations nutritionnelles

### Gestion de la Galerie
- ✅ Upload d'images vers Supabase Storage
- ✅ Catégorisation (food, atmosphere, events)
- ✅ Aperçu en grille
- ✅ Activation/désactivation

### Gestion des Commandes
- ✅ Voir toutes les commandes
- ✅ Mettre à jour le statut
- ✅ Voir les détails complets
- ✅ Supprimer des commandes

### Gestion des Réservations
- ✅ Voir toutes les réservations
- ✅ Confirmer/annuler
- ✅ Voir les détails (date, heure, nombre de personnes)

## 🌐 Fonctionnalités Frontend

### Menu Interactif
- Chargement dynamique depuis Supabase
- Filtres par catégorie
- Recherche
- Ajout au panier
- Badges visuels (signature, épicé, etc.)

### Galerie
- Affichage dynamique des images
- Filtres par catégorie
- Modal de visualisation
- Chargement lazy

### Système de Commande
- Panier persistant (localStorage)
- Formulaire de commande
- Envoi vers Supabase
- Confirmation automatique

### Système de Réservation
- Formulaire de réservation
- Validation des dates
- Envoi vers Supabase
- Notifications de succès/erreur

## 🔧 Personnalisation

### Modifier les Catégories
Éditez dans `/app/supabase-schema.sql`:
```sql
-- Pour le menu
category VARCHAR(50) NOT NULL, -- entrees, plats, desserts, boissons

-- Pour la galerie
category VARCHAR(50) NOT NULL, -- food, atmosphere, events
```

### Ajouter des Champs
1. Modifiez le schéma SQL dans Supabase
2. Mettez à jour les formulaires dans `admin_portal.html`
3. Mettez à jour l'affichage dans les scripts frontend

## 📊 Données de Test

Pour ajouter des données de test, exécutez ce SQL dans Supabase:

```sql
-- Exemple de plat
INSERT INTO menu_items (name, description, price, category, image_url, is_signature) VALUES
('Griot Traditionnel', 'Porc mariné aux épices créoles, riz collé et bananes plantains', 850, 'plats', 'URL_IMAGE', true);

-- Exemple d'image galerie
INSERT INTO gallery_images (title, description, image_url, category) VALUES
('Griot Signature', 'Notre plat vedette', 'URL_IMAGE', 'food');
```

## 🆘 Résolution de Problèmes

### "Configuration Supabase manquante"
➡️ Allez sur `supabase-config.html` et configurez vos clés

### "Accès non autorisé"
➡️ Vérifiez que l'utilisateur existe dans la table `admin_users`

### Images non affichées
➡️ Vérifiez que le bucket `restaurant-images` est **public**

### Données non chargées
➡️ Ouvrez la console du navigateur (F12) pour voir les erreurs
➡️ Vérifiez que le schéma SQL a été exécuté

## 📱 Support

Pour plus d'aide:
- [Documentation Supabase](https://supabase.com/docs)
- Ouvrez un issue sur GitHub
- Contactez le support

## 🎯 Prochaines Étapes

1. ✅ Configurez Supabase
2. ✅ Créez votre compte admin
3. ✅ Ajoutez vos plats et images
4. 🚀 Lancez votre site!

---

**Félicitations! Votre restaurant est maintenant en ligne avec un système de gestion complet!** 🎉
