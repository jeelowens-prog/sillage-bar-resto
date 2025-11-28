# 🔧 CORRECTION: Erreur "payment_proof_url column not found"

## 🚨 Erreur Détectée

```
Could not find the 'payment_proof_url' column of 'orders' in the schema cache
```

## 💡 Cause

La table `orders` existe, MAIS il lui manque la colonne `payment_proof_url` nécessaire pour sauvegarder les preuves de paiement MonCash.

---

## ⚡ Solution Rapide (2 minutes)

### OPTION A: Ajouter juste la colonne manquante (Recommandé)

1. Ouvrez Supabase → **SQL Editor**
2. Copiez **TOUT** le contenu de **`FIX_COLONNE_PAYMENT_PROOF.sql`**
3. Collez et cliquez sur **Run**
4. Attendez "Success"

✅ **Cette option ajoute uniquement les colonnes manquantes sans toucher aux données existantes**

---

### OPTION B: Recréer la table complète (Si Option A ne fonctionne pas)

1. Ouvrez Supabase → **SQL Editor**
2. Copiez **TOUT** le contenu de **`FIX_TABLE_ORDERS_COMPLET.sql`**
3. Collez et cliquez sur **Run**
4. Attendez "Success"

✅ **Cette option crée ou met à jour la table avec TOUTES les colonnes nécessaires**

---

## 🧪 Tester la Correction

1. Allez sur la page publique du site
2. Ajoutez des plats au panier
3. Allez à la page de commande
4. Remplissez le formulaire
5. **Optionnel:** Uploadez une preuve de paiement MonCash
6. Cliquez sur **Soumettre la commande**

### Résultat Attendu:
✅ Message: "Commande envoyée avec succès!"
✅ La commande apparaît dans l'admin
✅ La commande est visible dans Supabase → Table Editor → orders

---

## 📋 Colonnes de la Table Orders

Après correction, votre table `orders` doit avoir ces colonnes:

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique |
| `customer_name` | TEXT | Nom du client (requis) |
| `customer_email` | TEXT | Email du client (optionnel) |
| `customer_phone` | TEXT | Téléphone du client (requis) |
| `items` | JSONB | Panier d'achat (requis) |
| `total_amount` | NUMERIC | Montant total (requis) |
| `delivery_address` | TEXT | Adresse de livraison (optionnel) |
| `status` | TEXT | Statut de la commande (pending, preparing, etc.) |
| `payment_method` | TEXT | Méthode de paiement (moncash) |
| **`payment_proof_url`** | TEXT | 🔴 **URL de la preuve de paiement** |
| `notes` | TEXT | Notes du client (optionnel) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

---

## 🔍 Vérifier que la Colonne Existe

Pour vérifier manuellement:

1. Allez dans Supabase → **Table Editor**
2. Cliquez sur la table **`orders`**
3. Regardez la liste des colonnes
4. Vérifiez que **`payment_proof_url`** est présente

**OU** exécutez dans SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name = 'payment_proof_url';
```

Si le résultat est vide → La colonne n'existe pas → Exécutez le script de correction

Si le résultat montre `payment_proof_url | text` → ✅ La colonne existe

---

## 🆘 Si l'Erreur Persiste

### 1. Vérifier que le script s'est bien exécuté

Dans SQL Editor, exécutez:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
```

Vérifiez que `payment_proof_url` apparaît dans la liste.

### 2. Rafraîchir le cache de Supabase

Parfois Supabase met en cache l'ancien schéma. Pour forcer le rafraîchissement:

1. Dans votre site, ouvrez F12 (Console)
2. Exécutez:
```javascript
// Recréer le client Supabase pour forcer le refresh du schéma
location.reload();
```

### 3. Vérifier les politiques RLS

Exécutez dans SQL Editor:
```sql
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

Vous devez voir au minimum:
- `Public can create orders` (INSERT, public)

---

## ✅ Checklist de Vérification

- [ ] Script SQL exécuté → "Success" affiché
- [ ] Colonne `payment_proof_url` visible dans Table Editor
- [ ] Test de soumission de commande réussi
- [ ] Commande visible dans l'admin
- [ ] Commande visible dans Supabase Table Editor

---

## 💡 Pourquoi Cette Erreur?

**Cause probable:** 
- Vous avez créé la table `orders` manuellement dans Supabase
- OU vous avez exécuté un script SQL incomplet
- OU la table existait avant mais sans certaines colonnes

**Solution:**
Les scripts fournis (`FIX_COLONNE_PAYMENT_PROOF.sql` et `FIX_TABLE_ORDERS_COMPLET.sql`) ajoutent toutes les colonnes nécessaires sans supprimer les données existantes.

---

## 🎯 Après la Correction

Une fois la colonne ajoutée:

✅ **Les commandes avec preuve de paiement fonctionnent**
✅ **Les commandes sans preuve fonctionnent aussi**
✅ **Tout est sauvegardé dans Supabase**

Les clients peuvent:
1. Passer commande sans preuve de paiement
2. Passer commande avec preuve de paiement uploadée
3. Voir leur commande confirmée

Les admins peuvent:
1. Voir toutes les commandes
2. Voir les preuves de paiement uploadées
3. Changer le statut des commandes

---

**Temps de correction: 2 minutes**

**Prochaine étape:** Exécutez `FIX_COLONNE_PAYMENT_PROOF.sql` maintenant!
