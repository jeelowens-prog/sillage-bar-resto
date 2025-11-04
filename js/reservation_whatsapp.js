// js/reservation_whatsapp.js

// Configuration CallMeBot
const WHATSAPP_API_URL = 'https://api.callmebot.com/whatsapp.php';
const PHONE_NUMBER = '50933970083';
const API_KEY = '8841723';

// Fonction pour formater le message WhatsApp pour les réservations
function formatReservationMessage(formData) {
    let message = `📅 *NOUVELLE RÉSERVATION LE SILLAGE* 📅\n\n`;
    
    message += `👤 *INFORMATIONS CLIENT:*\n`;
    message += `• Nom complet: ${formData.name}\n`;
    message += `• Téléphone: ${formData.phone}\n`;
    message += `• Email: ${formData.email || 'Non fourni'}\n\n`;
    
    message += `📋 *DÉTAILS DE LA RÉSERVATION:*\n`;
    message += `• Date: ${formData.date}\n`;
    message += `• Heure: ${formData.time}\n`;
    message += `• Nombre de personnes: ${formData.guests}\n`;
    message += `• Occasion: ${formData.occasion || 'Non spécifiée'}\n\n`;
    
    if (formData.specialRequests) {
        message += `💬 *DEMANDES SPÉCIALES:*\n`;
        message += `${formData.specialRequests}\n\n`;
    }
    
    message += `💰 *ACOMPTE MONCASH:* 500 HTG requis\n\n`;
    message += `🕒 *DATE DE SOUMISSION: ${new Date().toLocaleString('fr-FR')}*`;
    
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

// Fonction pour valider le numéro de téléphone
function validatePhoneNumber(phone) {
    // Enlever tous les caractères non numériques
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Vérifier la longueur minimale (au moins 8 chiffres)
    if (cleanPhone.length < 8) {
        return false;
    }
    
    return true;
}

// Fonction pour gérer la soumission du formulaire de réservation
async function handleReservationFormSubmit(event) {
    event.preventDefault();
    
    // Afficher un indicateur de chargement
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Envoi de la réservation...
    `;
    submitButton.disabled = true;
    
    try {
        // Récupérer les données du formulaire avec les bons IDs
        const formData = {
            name: document.getElementById('reservation-name').value,
            phone: document.getElementById('reservation-phone').value,
            email: document.getElementById('reservation-email').value,
            date: document.getElementById('reservation-date').value,
            time: document.getElementById('reservation-time').value,
            guests: document.getElementById('number-guests').value,
            occasion: document.getElementById('occasion').value,
            specialRequests: document.getElementById('special-requests').value
        };
        
        // Vérifier les champs requis
        if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.guests) {
            throw new Error('Veuillez remplir tous les champs obligatoires');
        }
        
        // Valider le numéro de téléphone
        if (!validatePhoneNumber(formData.phone)) {
            throw new Error('Veuillez entrer un numéro de téléphone valide (au moins 8 chiffres)');
        }
        
        // Vérifier l'acceptation de l'acompte
        const depositAgreement = document.getElementById('deposit-agreement').checked;
        if (!depositAgreement) {
            throw new Error('Veuillez accepter les conditions d\'acompte');
        }
        
        // Formater et envoyer le message WhatsApp
        const message = formatReservationMessage(formData);
        await sendWhatsAppMessage(message);
        
        // Succès
        showReservationNotification('Réservation envoyée avec succès! Vous recevrez un SMS avec les instructions de paiement MonCash.', 'success');
        
        // Réinitialiser le formulaire
        event.target.reset();
        
        // Remettre la date du jour par défaut et les valeurs par défaut
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reservation-date').value = today;
        document.getElementById('number-guests').value = '2';
        
    } catch (error) {
        console.error('Erreur:', error);
        showReservationNotification(`Erreur: ${error.message}`, 'error');
    } finally {
        // Restaurer le bouton
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Fonction pour afficher les notifications de réservation
function showReservationNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.reservation-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `reservation-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
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
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Fonction pour formater le numéro de téléphone (optionnel)
function formatPhoneNumber() {
    const phoneInput = document.getElementById('reservation-phone');
    if (phoneInput) {
        // Retirer les attributs de validation stricts
        phoneInput.removeAttribute('pattern');
        phoneInput.removeAttribute('title');
        
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limiter à 8 chiffres maximum
            value = value.substring(0, 8);
            
            // Format optionnel: 1234-5678
            if (value.length >= 4) {
                value = value.substring(0, 4) + '-' + value.substring(4, 8);
            }
            e.target.value = value;
        });
    }
}

// Fonction pour initialiser la date minimale (aujourd'hui)
function initDateMin() {
    const dateInput = document.getElementById('reservation-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }
}

// Fonction pour initialiser les valeurs par défaut
function initDefaultValues() {
    const guestsSelect = document.getElementById('number-guests');
    if (guestsSelect) {
        guestsSelect.value = '2';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservation-form');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationFormSubmit);
        initDateMin();
        initDefaultValues();
        formatPhoneNumber();
        
        // Ajouter la validation en temps réel
        const requiredFields = reservationForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.classList.add('border-red-500');
                    this.classList.remove('border-primary-200');
                } else {
                    this.classList.remove('border-red-500');
                    this.classList.add('border-primary-200');
                }
            });
        });
        
        // Validation spécifique pour le téléphone
        const phoneInput = document.getElementById('reservation-phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', function() {
                if (!validatePhoneNumber(this.value)) {
                    this.classList.add('border-red-500');
                    this.classList.remove('border-primary-200');
                } else {
                    this.classList.remove('border-red-500');
                    this.classList.add('border-primary-200');
                }
            });
        }
    }
});