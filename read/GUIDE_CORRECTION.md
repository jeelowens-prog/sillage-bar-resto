# 🔧 GUIDE DE CORRECTION DES ERREURS - Le Sillage Restaurant

## 🎯 Problèmes Identifiés

1. ❌ **Upload d'images**: "Viole les politiques" 
2. ❌ **Soumission de commandes**: Erreur lors de l'enregistrement
3. ❌ **Rien n'est sauvegardé dans Supabase**

## 💡 Cause Principale

Les **politiques RLS (Row Level Security)** de Supabase bloquent les opérations d'insertion et d'upload. Par défaut, Supabase protège toutes les tables et les buckets de stockage.

---

## 📋 SOLUTION COMPLÈTE - Étapes à suivre

### ÉTAPE 1: Appliquer le Schéma SQL avec les Politiques RLS

1. **Ouvrez votre projet Supabase** (https://supabase.com)
2. Allez dans **SQL Editor** (dans le menu de gauche)
3. Cliquez sur **New Query**
4. **Ouvrez le fichier** `/app/supabase-schema.sql` 
5. **Copiez TOUT le contenu** du fichier
6. **Collez-le** dans l'éditeur SQL de Supabase
7. Cliquez sur **Run** (ou Ctrl+Enter)
8. ✅ Attendez que toutes les requêtes s'exécutent (cela peut prendre 10-30 secondes)

**Ce que ce script fait:**
- ✅ Crée toutes les tables nécessaires (si elles n'existent pas)
- ✅ Active la sécurité RLS sur toutes les tables
- ✅ Crée les politiques qui permettent:
  - Au **public** de créer des commandes et réservations
  - Au **public** d'uploader des images dans les buckets
  - Aux **admins authentifiés** de tout gérer
- ✅ Configure les politiques de stockage pour les buckets

---

### ÉTAPE 2: Vérifier les Buckets de Stockage

1. Dans Supabase, allez dans **Storage** (menu de gauche)
2. Vérifiez que vous avez ces 2 buckets:
   - ✅ `restaurant-images` (public)
   - ✅ `payment-proofs` (privé)

#### Si le bucket `restaurant-images` n'existe pas:
1. Cliquez sur **New bucket**
2. Nom: `restaurant-images`
3. **Cochez** "Public bucket"
4. Cliquez sur **Create bucket**

#### Si le bucket `payment-proofs` n'existe pas:
1. Cliquez sur **New bucket**
2. Nom: `payment-proofs`
3. **NE PAS cocher** "Public bucket" (pour la sécurité)
4. Cliquez sur **Create bucket**

#### Configuration des Politiques de Stockage:

Les politiques de stockage ont déjà été créées par le script SQL à l'ÉTAPE 1.

**MAIS** si vous avez des erreurs, vous pouvez les créer manuellement:

1. Cliquez sur le bucket `restaurant-images`
2. Allez dans l'onglet **Policies**
3. Cliquez sur **New Policy**
4. Créez ces 3 politiques:

**Politique 1: Upload public**
```sql
Policy name: Public can upload images
Operation: INSERT
Policy definition: WITH CHECK (bucket_id = 'restaurant-images')
Target roles: public
```

**Politique 2: Lecture publique**
```sql
Policy name: Public can view images
Operation: SELECT
Policy definition: USING (bucket_id = 'restaurant-images')
Target roles: public
```

**Politique 3: Suppression pour admins**
```sql
Policy name: Authenticated can delete images
Operation: DELETE
Policy definition: USING (bucket_id = 'restaurant-images')
Target roles: authenticated
```

---

### ÉTAPE 3: Vérifier les Tables et Politiques

1. Dans Supabase, allez dans **Table Editor**
2. Vérifiez que ces tables existent:
   - ✅ `admin_users`
   - ✅ `menu_items`
   - ✅ `gallery_images`
   - ✅ `orders`
   - ✅ `reservations`

3. Pour chaque table, cliquez dessus et vérifiez:
   - En haut de la table, vous devriez voir **"RLS enabled"**
   - Cliquez sur le bouton **"View policies"** pour voir les politiques

**Politiques attendues pour `orders`:**
- ✅ Public can create orders (INSERT)
- ✅ Authenticated users can view all orders (SELECT)
- ✅ Authenticated users can update orders (UPDATE)
- ✅ Authenticated users can delete orders (DELETE)

**Politiques attendues pour `menu_items`:**
- ✅ Public can view all menu items (SELECT)
- ✅ Authenticated users can insert menu items (INSERT)
- ✅ Authenticated users can update menu items (UPDATE)
- ✅ Authenticated users can delete menu items (DELETE)

**Politiques attendues pour `gallery_images`:**
- ✅ Public can view all gallery images (SELECT)
- ✅ Authenticated users can insert gallery images (INSERT)
- ✅ Authenticated users can update gallery images (UPDATE)
- ✅ Authenticated users can delete gallery images (DELETE)

---

### ÉTAPE 4: Vérifier la Configuration dans le Code

Votre configuration dans `/app/js/config.js` est déjà correcte:

```javascript
url: 'https://yayoxqzxmijzipryevcr.supabase.co'
anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheW94cXp4bWlqemlwcnlldmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzY5ODIsImV4cCI6MjA3Nzc1Mjk4Mn0.WUT4oCXU_vbanm2sQPjBWxXfcPcllyKju2F_P3K1qqI'
```

✅ **Aucune modification nécessaire**

---

### ÉTAPE 5: Créer un Utilisateur Admin

1. Dans Supabase, allez dans **Authentication** > **Users**
2. Cliquez sur **Add user** > **Create new user**
3. Remplissez:
   - Email: `admin@lesillage.ht` (ou votre email)
   - Password: Choisissez un mot de passe fort
   - ✅ **Cochez** "Auto Confirm User"
4. Cliquez sur **Create user**

5. Ensuite, allez dans **SQL Editor** et exécutez:

```sql
INSERT INTO admin_users (email, full_name, role) 
VALUES ('admin@lesillage.ht', 'Jean-Claude Moïse', 'super_admin');
```

(Remplacez l'email par celui que vous avez créé)

---

### ÉTAPE 6: Tester les Fonctionnalités

#### Test 1: Upload d'Images dans la Galerie

1. Ouvrez votre site: `/pages/admin_login.html`
2. Connectez-vous avec vos identifiants admin
3. Allez dans **Galerie**
4. Cliquez sur **Ajouter une Image**
5. Remplissez le formulaire et sélectionnez une image
6. Cliquez sur **Enregistrer**

**Résultat attendu:** ✅ L'image est uploadée et apparaît dans la galerie

**Si erreur:** Ouvrez la console du navigateur (F12) et partagez l'erreur

---

#### Test 2: Upload d'Images pour le Menu

1. Dans l'admin, allez dans **Menu**
2. Cliquez sur **Ajouter un Plat**
3. Remplissez le formulaire et sélectionnez une image
4. Cliquez sur **Enregistrer**

**Résultat attendu:** ✅ Le plat est créé avec l'image

---

#### Test 3: Soumission de Commande

1. Allez sur la page publique du menu interactif
2. Ajoutez des plats au panier
3. Allez à la page de commande
4. Remplissez le formulaire
5. Uploadez une preuve de paiement MonCash (optionnel)
6. Cliquez sur **Soumettre la commande**

**Résultat attendu:** ✅ Message "Commande envoyée avec succès!"

**Vérification:** 
- Allez dans Supabase > Table Editor > `orders`
- Vous devriez voir la nouvelle commande
- Dans l'admin, allez dans **Commandes** et vérifiez qu'elle apparaît

---

## 🔍 DÉBOGAGE - Si ça ne fonctionne toujours pas

### Vérifier les Erreurs JavaScript

1. Ouvrez votre site
2. Appuyez sur **F12** pour ouvrir les DevTools
3. Allez dans l'onglet **Console**
4. Tentez une action (upload ou commande)
5. Regardez les erreurs rouges

**Erreurs courantes et solutions:**

#### Erreur: "new row violates row-level security policy"
→ **Solution:** Les politiques RLS ne sont pas correctement configurées
   - Retournez à l'ÉTAPE 1 et réexécutez le script SQL

#### Erreur: "Bucket not found" ou "storage/bucket-not-found"
→ **Solution:** Le bucket n'existe pas
   - Retournez à l'ÉTAPE 2 et créez les buckets

#### Erreur: "permission denied for bucket"
→ **Solution:** Les politiques de storage ne sont pas configurées
   - Retournez à l'ÉTAPE 2 et configurez les politiques manuellement

#### Erreur: "JWT expired" ou "invalid token"
→ **Solution:** Token d'authentification expiré
   - Déconnectez-vous et reconnectez-vous

---

## 📊 VÉRIFICATION FINALE

Après avoir suivi toutes les étapes, vérifiez:

- [ ] Le script SQL a été exécuté sans erreurs
- [ ] Les 2 buckets existent (`restaurant-images` et `payment-proofs`)
- [ ] Les politiques RLS sont actives sur toutes les tables
- [ ] Un utilisateur admin existe dans Authentication et dans `admin_users`
- [ ] Vous pouvez vous connecter à l'admin portal
- [ ] L'upload d'images fonctionne (menu et galerie)
- [ ] La soumission de commandes fonctionne
- [ ] Les données apparaissent dans Supabase

---

## 🆘 BESOIN D'AIDE ?

Si après avoir suivi toutes les étapes, vous avez encore des problèmes:

1. Ouvrez la console du navigateur (F12)
2. Tentez l'action qui ne fonctionne pas
3. Copiez **TOUTES** les erreurs rouges
4. Partagez-les avec moi

Je pourrai alors identifier le problème spécifique et le corriger.

---

## ✅ RÉSUMÉ RAPIDE

```bash
# Étapes essentielles:
1. Exécuter supabase-schema.sql dans SQL Editor
2. Vérifier que les buckets existent et sont publics
3. Créer un utilisateur admin
4. Tester les uploads et commandes
5. Vérifier les données dans Supabase
```

**Temps estimé:** 10-15 minutes

Bonne chance ! 🚀
