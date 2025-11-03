# 🔍 VÉRIFICATION ET CORRECTION DES BUCKETS SUPABASE

## Problème Détecté

Le test affiche que les buckets n'existent pas, **MAIS VOUS DITES QU'ILS EXISTENT**.

Cela signifie probablement que:
1. ✅ Les buckets existent physiquement
2. ❌ Mais les **politiques de lecture** ne sont pas configurées
3. ❌ Donc le code ne peut pas **lire la liste des buckets**

---

## 🚀 Solution en 3 Étapes

### ÉTAPE 1: Exécuter le Script SQL

1. Ouvrez Supabase Dashboard
2. Allez dans **SQL Editor**
3. Copiez **TOUT** le contenu de **`FIX_RLS_RAPIDE.sql`**
4. Collez et cliquez sur **Run**

✅ Ce script configure toutes les politiques, y compris celles des buckets

---

### ÉTAPE 2: Vérifier les Politiques des Buckets

#### Pour le bucket `restaurant-images`:

1. Dans Supabase, allez dans **Storage**
2. Cliquez sur le bucket **`restaurant-images`**
3. Cliquez sur l'onglet **Policies** (ou "Configuration")
4. Vous devez voir **3 politiques:**

   **✅ Policy 1: Public can upload images to restaurant-images**
   - Operation: INSERT
   - Target roles: public
   
   **✅ Policy 2: Public can view images in restaurant-images**
   - Operation: SELECT
   - Target roles: public
   
   **✅ Policy 3: Authenticated users can delete images from restaurant-images**
   - Operation: DELETE
   - Target roles: authenticated

#### Si les politiques n'apparaissent pas:

Exécutez **manuellement** dans SQL Editor:

```sql
-- Politiques pour restaurant-images
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
```

---

### ÉTAPE 3: Vérifier que le Bucket est PUBLIC

1. Dans **Storage**, cliquez sur `restaurant-images`
2. Regardez en haut - il devrait y avoir un badge **"Public"**
3. Si ce n'est pas le cas:
   - Cliquez sur les **3 points** (⋮) à côté du nom du bucket
   - Cliquez sur **Edit bucket**
   - **Cochez "Public bucket"**
   - Sauvegardez

---

## 🧪 Test Manuel des Buckets

Ouvrez la console du navigateur sur votre site et exécutez:

```javascript
// Test 1: Lister les buckets
const { data: buckets, error } = await supabaseClient.storage.listBuckets();
console.log('Buckets:', buckets, 'Error:', error);

// Test 2: Tester l'upload
const testFile = new Blob(['test'], { type: 'text/plain' });
const fileName = `test-${Date.now()}.txt`;

const { data, error: uploadError } = await supabaseClient.storage
  .from('restaurant-images')
  .upload(fileName, testFile);

console.log('Upload result:', data, 'Error:', uploadError);

// Test 3: Supprimer le fichier de test
await supabaseClient.storage
  .from('restaurant-images')
  .remove([fileName]);
```

---

## 📊 Diagnostic Détaillé

### Si le test dit "Bucket not found" mais le bucket existe:

**Problème:** Les politiques RLS de storage bloquent la **lecture de la liste des buckets**

**Cause possible:**
- La méthode `listBuckets()` nécessite des permissions spéciales
- Ce n'est pas un vrai problème si l'upload fonctionne

**Solution:**
1. Ignorez l'erreur "Bucket not found" dans le test
2. Testez directement l'**upload** d'une image via l'admin
3. Si l'upload fonctionne = ✅ Bucket OK

---

### Tester Directement l'Upload

1. Connectez-vous à l'admin: `/pages/admin_login.html`
2. Allez dans **Galerie**
3. Cliquez sur **Ajouter une Image**
4. Sélectionnez une image
5. Cliquez sur **Enregistrer**

**Résultat attendu:**
- ✅ Message: "Image ajoutée à la galerie avec succès!"
- ✅ L'image apparaît dans la galerie
- ✅ Dans Supabase Storage, vous voyez le fichier uploadé

**Si erreur:**
- Ouvrez F12 (Console)
- Regardez le message d'erreur détaillé
- Il vous dira exactement quel est le problème

---

## 🔧 Correction Manuelle des Buckets

Si après tout, les buckets ne fonctionnent toujours pas:

### Option 1: Recréer les Buckets

1. Supprimez les buckets existants (sauvegardez d'abord les images!)
2. Recréez-les:

**Bucket 1: restaurant-images**
- Nom: `restaurant-images`
- ✅ **Cochez "Public bucket"**
- Cliquez sur "Create bucket"

**Bucket 2: payment-proofs**
- Nom: `payment-proofs`
- ❌ **NE PAS cocher "Public bucket"** (pour la sécurité)
- Cliquez sur "Create bucket"

3. Exécutez le script SQL `FIX_RLS_RAPIDE.sql`

---

### Option 2: Vérifier les Permissions de l'Anon Key

Votre `anon key` doit avoir les bonnes permissions:

1. Dans Supabase, allez dans **Settings** > **API**
2. Vérifiez que votre **anon key** est correcte
3. Elle doit commencer par: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Si ce n'est pas le cas, copiez la bonne clé et mettez à jour `/app/js/config.js`

---

## ✅ Checklist de Vérification

- [ ] Script `FIX_RLS_RAPIDE.sql` exécuté sans erreur
- [ ] Bucket `restaurant-images` existe
- [ ] Bucket `restaurant-images` est **PUBLIC** ✅
- [ ] Bucket `payment-proofs` existe (privé)
- [ ] Politiques visibles dans l'onglet "Policies" du bucket
- [ ] Test d'upload manuel fonctionne (via admin)
- [ ] Image uploadée apparaît dans Supabase Storage

---

## 🎯 Test Final

Après avoir tout configuré:

1. Ouvrez `test-supabase.html`
2. Cliquez sur "📤 Tester l'upload d'images"
3. Si ça dit ✅ "Upload réussi!" = Tout est bon!
4. Si ça dit encore "Bucket not found" MAIS que l'upload via l'admin fonctionne = C'est normal, ignorez cette erreur du test

---

## 💡 Note Importante

Le test `listBuckets()` peut échouer même si les buckets fonctionnent correctement pour l'upload et la lecture d'images. C'est une limitation de Supabase.

**Ce qui compte vraiment:**
- ✅ Pouvoir uploader des images via l'admin
- ✅ Voir les images uploadées dans l'application
- ✅ Voir les fichiers dans Supabase Storage

Si ces 3 choses fonctionnent, ignorez l'erreur "Bucket not found" du test.

---

## 🆘 Besoin d'Aide?

Si après avoir suivi toutes ces étapes, l'upload ne fonctionne toujours pas:

1. Ouvrez l'admin: `/pages/admin_login.html`
2. Connectez-vous
3. Essayez d'uploader une image
4. Ouvrez F12 → Console
5. Copiez **TOUTE** l'erreur rouge
6. L'erreur contiendra maintenant des détails précis sur le problème

Le code a été amélioré pour afficher:
- Le nom du fichier uploadé
- L'URL de l'image générée
- Les données exactes envoyées à Supabase
- Le message d'erreur détaillé de Supabase

---

**Date:** 2025
**Fichier:** VERIFICATION_BUCKETS.md
