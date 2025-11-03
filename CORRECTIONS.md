# Corrections et Améliorations - Le Sillage Restaurant

## 📋 Problèmes Résolus

### ✅ 1. Système de Panier Fonctionnel
- **Problème**: Le panier ne fonctionnait pas, les articles ajoutés ne s'affichaient pas
- **Solution**: 
  - Créé un nouveau fichier `/app/js/cart-manager.js` avec gestion complète du panier
  - Affichage dynamique dans le sidebar avec quantités et total
  - Synchronisation avec localStorage
  - Notifications visuelles lors de l'ajout d'articles
  - Sidebar glissant avec overlay

### ✅ 2. Upload de Screenshot MonCash
- **Problème**: Besoin d'un système pour que les clients uploadent une preuve de paiement
- **Solution**:
  - Ajout d'un champ d'upload dans le formulaire de commande (`/app/pages/contact.html`)
  - Prévisualisation de l'image avant envoi
  - Upload vers Supabase Storage (bucket `payment-proofs`)
  - Stockage de l'URL dans la table `orders`
  - Instructions claires pour le paiement MonCash

### ✅ 3. Centralisation des Clés API
- **Problème**: Les clés API étaient directement accédées via localStorage dans chaque fichier
- **Solution**:
  - Créé `/app/js/config.js` pour centraliser toutes les configurations
  - Gestion Supabase, MonCash, Upload et App
  - Un seul fichier à maintenir pour toutes les clés
  - Meilleure sécurité et organisation du code

### ✅ 4. Upload de Produits Admin
- **Problème**: Erreurs lors de l'upload de produits via le portail admin
- **Solution**:
  - Vérification et correction du système d'upload dans `admin_portal.html`
  - Gestion des erreurs améliorée
  - Support pour le bucket `restaurant-images` (doit être public)
  - Messages d'erreur explicites

## 📁 Fichiers Créés/Modifiés

### Nouveaux Fichiers
1. `/app/js/config.js` - Configuration centralisée
2. `/app/js/cart-manager.js` - Gestion complète du panier
3. `/app/CORRECTIONS.md` - Ce fichier

### Fichiers Modifiés
1. `/app/js/order-system.js` - Ajout upload screenshot MonCash
2. `/app/js/frontend-menu.js` - Utilisation de config.js et cart-manager
3. `/app/pages/interactive_menu.html` - Intégration des nouveaux scripts
4. `/app/pages/contact.html` - Section de commande avec upload
5. `/app/pages/homepage.html` - Intégration des nouveaux scripts
6. `/app/pages/admin_portal.html` - Utilisation de config.js
7. `/app/supabase-schema.sql` - Ajout champ `payment_proof_url`

## 🔧 Configuration Requise

### 1. Supabase Storage Buckets

#### Bucket `restaurant-images` (PUBLIC)
```sql
-- Dans Supabase Dashboard > Storage > New Bucket
Nom: restaurant-images
Public: ✅ OUI
```

#### Bucket `payment-proofs` (PRIVÉ)
```sql
-- Dans Supabase Dashboard > Storage > New Bucket
Nom: payment-proofs
Public: ❌ NON (pour sécurité)
```

### 2. Mise à Jour du Schéma SQL

Si la table `orders` existe déjà, ajoutez la colonne:
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'payment_pending';
```

### 3. Configuration des Clés

Les clés sont gérées via:
- `localStorage` (pour Supabase)
- `/app/js/config.js` (centralisation)

Configuration MonCash par défaut:
- Numéro: **3838-8888**
- Nom: **Le Sillage Restaurant**

Pour modifier, éditez `/app/js/config.js`:
```javascript
const MonCashConfig = {
    paymentInstructions: {
        number: 'VOTRE-NUMERO',
        name: 'VOTRE-NOM',
        instructions: 'VOS-INSTRUCTIONS'
    }
};
```

## 🚀 Fonctionnalités Ajoutées

### Système de Panier
- ✅ Ajout d'articles depuis le menu
- ✅ Modification des quantités (+/-)
- ✅ Suppression d'articles
- ✅ Affichage du total
- ✅ Persistance dans localStorage
- ✅ Sidebar animé
- ✅ Notifications visuelles

### Système de Commande
- ✅ Formulaire complet (nom, téléphone, email, adresse)
- ✅ Upload de screenshot de paiement MonCash
- ✅ Prévisualisation de l'image
- ✅ Instructions de paiement claires
- ✅ Résumé de la commande
- ✅ Statut `payment_pending` vs `pending`

### Admin Portal
- ✅ Upload d'images pour produits
- ✅ Visualisation des preuves de paiement
- ✅ Gestion des commandes avec statut paiement
- ✅ Meilleure gestion des erreurs

## 📱 Utilisation

### Pour les Clients

1. **Parcourir le Menu**
   - Aller sur `interactive_menu.html`
   - Filtrer par catégorie (Entrées, Plats, Desserts, Boissons)
   - Rechercher des plats

2. **Ajouter au Panier**
   - Cliquer sur "Ajouter" sur un plat
   - Le panier s'ouvre automatiquement
   - Modifier les quantités si besoin

3. **Commander**
   - Aller sur la page Contact ou cliquer sur "Commander"
   - Remplir le formulaire
   - Effectuer le paiement MonCash au numéro **3838-8888**
   - Prendre un screenshot de la confirmation
   - Uploader le screenshot dans le formulaire
   - Soumettre la commande

### Pour l'Admin

1. **Ajouter des Produits**
   - Se connecter au portail admin
   - Aller dans "Menu" > "Ajouter un Plat"
   - Remplir les informations
   - Uploader une image (max 5MB)
   - Enregistrer

2. **Gérer les Commandes**
   - Voir toutes les commandes dans "Commandes"
   - Vérifier les preuves de paiement
   - Mettre à jour le statut
   - Contacter le client

## 🐛 Débogage

### Le Panier ne Sauvegarde Pas
- Vérifier la console du navigateur (F12)
- Vérifier que localStorage est activé
- Vider le cache et recharger

### Upload d'Image Échoue
- Vérifier que les buckets existent dans Supabase
- Vérifier que `restaurant-images` est PUBLIC
- Vérifier la taille de l'image (max 5MB)
- Vérifier les permissions Supabase

### Configuration Manquante
- Aller sur `/supabase-config.html`
- Entrer URL: `https://yayoxqzxmijzipryevcr.supabase.co`
- Entrer la clé ANON KEY
- Sauvegarder

## 📊 Statuts de Commande

- `payment_pending` - En attente de preuve de paiement
- `pending` - Paiement reçu, en attente de traitement
- `preparing` - En préparation
- `delivery` - En livraison
- `completed` - Terminée
- `cancelled` - Annulée

## 🔐 Sécurité

- Les preuves de paiement sont stockées dans un bucket PRIVÉ
- Les URL sont signées pour l'accès admin uniquement
- Les clés API restent côté client (jamais exposées publiquement)
- Validation des uploads (type, taille)

## 📞 Support

Pour toute question ou problème:
- Vérifier la console du navigateur (F12) pour les erreurs
- Vérifier la configuration Supabase
- Vérifier que les buckets existent et ont les bonnes permissions

---

**Dernière mise à jour**: 2025-01-20
**Version**: 2.0.0
