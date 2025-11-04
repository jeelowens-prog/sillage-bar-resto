// js/paiement_whatsapp.js

// Configuration CallMeBot
const WHATSAPP_API_URL = 'https://api.callmebot.com/whatsapp.php';
const PHONE_NUMBER = '50933970083';
const API_KEY = '8841723';

// Fonction pour formater le message WhatsApp
function formatWhatsAppMessage(formData, paymentProofInfo = null) {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    // Calculer le total à partir du contenu du panier (pour éviter de dépendre d'une clé cartTotal qui peut ne pas exister)
    const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0) || 0;
    
    let message = `🍕 *NOUVELLE COMMANDE LE SILLAGE* 🍕\n\n`;
    message += `👤 *INFORMATIONS CLIENT:*\n`;
    message += `• Nom: ${formData.name}\n`;
    message += `• Téléphone: ${formData.phone}\n`;
    message += `• Email: ${formData.email || 'Non fourni'}\n`;
    message += `• Adresse: ${formData.address || 'Non fournie'}\n`;
    message += `• Notes: ${formData.notes || 'Aucune'}\n\n`;
    
    message += `🛒 *DÉTAILS DE LA COMMANDE:*\n`;
    if (cartItems.length === 0) {
        message += `• Panier vide\n`;
    } else {
        cartItems.forEach((item, index) => {
            message += `• ${item.name} x${item.quantity} - ${item.price} HTG\n`;
            if (item.toppings && item.toppings.length > 0) {
                message += `  Suppléments: ${item.toppings.join(', ')}\n`;
            }
        });
    }
    
    message += `\n💰 *TOTAL: ${total} HTG*\n\n`;
    
    // Ajouter info preuve de paiement (si fournie, inclure lien signé)
    if (paymentProofInfo && paymentProofInfo.url) {
        message += `📎 *PREUVE DE PAIEMENT:* ${paymentProofInfo.name} - ${paymentProofInfo.url}\n\n`;
    } else if (paymentProofInfo && paymentProofInfo.name) {
        // Fallback: nom du fichier seulement
        message += `📎 *PREUVE DE PAIEMENT:* Fichier uploadé (${paymentProofInfo.name})\n\n`;
    }
    
    message += `🕒 *DATE: ${new Date().toLocaleString('fr-FR')}*`;
    
    return encodeURIComponent(message);
}

// Fonction pour envoyer le message WhatsApp
async function sendWhatsAppMessage(message) {
    try {
        const url = `${WHATSAPP_API_URL}?phone=${PHONE_NUMBER}&text=${message}&apikey=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du message WhatsApp');
        }
        
        return true;
    } catch (error) {
        console.error('Erreur envoi WhatsApp:', error);
        throw error;
    }
}

// Fonction pour gérer la soumission du formulaire
async function handleOrderFormSubmit(event) {
    event.preventDefault();
    
    // Afficher un indicateur de chargement
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Envoi en cours...
    `;
    submitButton.disabled = true;
    
    try {
        // Récupérer les données du formulaire
        const formData = {
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            email: document.getElementById('customer-email').value,
            address: document.getElementById('delivery-address').value,
            notes: document.getElementById('order-notes').value
        };
        
        // Vérifier les champs requis
        if (!formData.name || !formData.phone) {
            throw new Error('Veuillez remplir tous les champs obligatoires');
        }
        
        // Vérifier le panier
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cartItems.length === 0) {
            throw new Error('Votre panier est vide');
        }
        
        // Vérifier la preuve de paiement
        const paymentProof = document.getElementById('payment-proof').files[0];
        if (!paymentProof) {
            throw new Error('Veuillez uploader une preuve de paiement MonCash');
        }

        // Upload de la preuve vers Supabase et génération d'un lien signé
        const supabase = (typeof window.getSupabaseClient === 'function') ? window.getSupabaseClient() : (window.supabaseClient || null);
        if (!supabase) {
            throw new Error('Supabase non configuré ou non initialisé. Impossible d\'uploader la preuve.');
        }

        const bucket = (window.Config && window.Config.Upload && window.Config.Upload.paymentProofBucket) ? window.Config.Upload.paymentProofBucket : 'payment-proofs';
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = fileName;

        // Uploader le fichier
        const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(filePath, paymentProof);
        if (uploadError) {
            console.error('Erreur upload preuve:', uploadError);
            throw new Error('Erreur lors de l\'upload de la preuve de paiement: ' + (uploadError.message || uploadError.message));
        }

        // Générer une URL signée (ex: 24h)
        const expiresIn = 60 * 60 * 24; // 24 heures
        const { data: urlData, error: urlError } = await supabase.storage.from(bucket).createSignedUrl(filePath, expiresIn);
        if (urlError) {
            console.error('Erreur création signed URL:', urlError);
            throw new Error('Erreur lors de la génération du lien sécurisé pour la preuve de paiement: ' + (urlError.message || urlError.message));
        }

        // Récupère la clé attendue du retour (signedURL / signedUrl)
        const signedUrl = urlData?.signedURL ?? urlData?.signedUrl ?? urlData?.signed_url ?? null;
        if (!signedUrl) {
            console.warn('Aucun signedUrl retourné par Supabase, tentative d\'utiliser une URL publique');
        }

        // Formater et envoyer le message WhatsApp avec le lien
        const paymentProofInfo = { name: paymentProof.name, url: signedUrl };
        const message = formatWhatsAppMessage(formData, paymentProofInfo);
        await sendWhatsAppMessage(message);
        
        // Succès
        showNotification('Commande envoyée avec succès! Nous vous contacterons bientôt.', 'success');
        
        // Réinitialiser le formulaire et le panier
        event.target.reset();
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTotal');
        updateCartSummary();
        document.getElementById('payment-proof-preview').classList.add('hidden');
        
    } catch (error) {
        console.error('Erreur:', error);
        showNotification(`Erreur: ${error.message}`, 'error');
    } finally {
        // Restaurer le bouton
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Fonction pour mettre à jour le résumé du panier
function updateCartSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    // Calculer le total dynamiquement
    const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0) || 0;
    const summaryElement = document.getElementById('cart-items-summary');
    const totalElement = document.getElementById('cart-total');
    
    if (cartItems.length === 0) {
        summaryElement.innerHTML = '<p class="text-gray-500 text-center py-4">Panier vide - <a href="interactive_menu.html" class="text-secondary hover:underline">Voir le menu</a></p>';
    } else {
        summaryElement.innerHTML = cartItems.map(item => `
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-medium text-gray-800">${item.name} x${item.quantity}</p>
                    ${item.toppings && item.toppings.length > 0 ? 
                        `<p class="text-xs text-gray-600">${item.toppings.join(', ')}</p>` : ''}
                </div>
                <span class="font-medium text-gray-800">${item.price} HTG</span>
            </div>
        `).join('');
    }
    
    totalElement.textContent = `${total} HTG`;
}

// Gestion de la prévisualisation de l'image
function initImagePreview() {
    const fileInput = document.getElementById('payment-proof');
    const preview = document.getElementById('payment-proof-preview');
    const previewImage = document.getElementById('payment-proof-image');
    const removeButton = document.getElementById('remove-payment-proof');
    
    if (fileInput && preview && previewImage && removeButton) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    preview.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            }
        });
        
        removeButton.addEventListener('click', function() {
            fileInput.value = '';
            preview.classList.add('hidden');
            previewImage.src = '';
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderFormSubmit);
        updateCartSummary();
        initImagePreview();
    }
});