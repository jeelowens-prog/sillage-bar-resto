// Reservation System - Handle reservation form submission
(function() {
    'use strict';

    let supabaseClient = null;

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initSupabase();
        setupReservationForm();
    });

    function initSupabase() {
        const SUPABASE_URL = localStorage.getItem('SUPABASE_URL');
        const SUPABASE_ANON_KEY = localStorage.getItem('SUPABASE_ANON_KEY');

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.warn('Supabase not configured');
            return;
        }

        if (typeof window.supabase === 'undefined') {
            console.error('Supabase library not loaded');
            return;
        }

        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (error) {
            console.error('Error initializing Supabase:', error);
        }
    }

    function setupReservationForm() {
        const reservationForm = document.getElementById('reservation-form');
        if (!reservationForm) return;

        // Set minimum date to today
        const dateInput = document.getElementById('reservation-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        reservationForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!supabaseClient) {
                alert('Configuration Supabase manquante. Veuillez nous contacter directement par téléphone.');
                return;
            }

            const formData = {
                customer_name: document.getElementById('reservation-name').value,
                customer_email: document.getElementById('reservation-email').value || null,
                customer_phone: document.getElementById('reservation-phone').value,
                reservation_date: document.getElementById('reservation-date').value,
                reservation_time: document.getElementById('reservation-time').value,
                number_of_guests: parseInt(document.getElementById('number-guests').value),
                special_requests: document.getElementById('special-requests').value || null,
                status: 'pending'
            };

            try {
                const submitBtn = reservationForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi en cours...';

                const { data, error } = await supabaseClient
                    .from('reservations')
                    .insert([formData])
                    .select();

                if (error) throw error;

                // Show success message
                showSuccessMessage(
                    'Réservation envoyée!',
                    'Votre demande de réservation a été envoyée avec succès. Nous vous confirmerons par téléphone ou email dans les plus brefs délais.'
                );
                
                // Reset form
                reservationForm.reset();

                submitBtn.disabled = false;
                submitBtn.textContent = 'Réserver';

            } catch (error) {
                console.error('Error submitting reservation:', error);
                showErrorMessage(
                    'Erreur',
                    'Une erreur est survenue lors de l\'envoi de votre réservation. Veuillez réessayer ou nous contacter directement.'
                );
                
                const submitBtn = reservationForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Réserver';
            }
        });
    }

    function showSuccessMessage(title, message) {
        const modal = createMessageModal(title, message, 'success');
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.remove();
        }, 5000);
    }

    function showErrorMessage(title, message) {
        const modal = createMessageModal(title, message, 'error');
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.remove();
        }, 5000);
    }

    function createMessageModal(title, message, type) {
        const modal = document.createElement('div');
        modal.className = 'fixed top-20 right-4 z-50 max-w-md';
        
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        
        modal.innerHTML = `
            <div class="${bgColor} text-white px-6 py-4 rounded-lg shadow-lg">
                <h3 class="font-bold text-lg mb-2">${title}</h3>
                <p>${message}</p>
            </div>
        `;
        
        return modal;
    }

    // Export functions
    window.reservationSystem = {
        setupReservationForm
    };

})();
