// Configuration centrale pour l'application Le Sillage
// Ce fichier centralise toutes les clés API et configurations

(function() {
    'use strict';

    // Configuration Supabase
    const SupabaseConfig = {
        url: null,
        anonKey: null,
        
        // Initialiser depuis localStorage
        init: function() {
            this.url = 'https://yayoxqzxmijzipryevcr.supabase.co'
            this.anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheW94cXp4bWlqemlwcnlldmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzY5ODIsImV4cCI6MjA3Nzc1Mjk4Mn0.WUT4oCXU_vbanm2sQPjBWxXfcPcllyKju2F_P3K1qqI';
            
            // Si pas configuré, rediriger vers la page de configuration
            if (!this.url || !this.anonKey) {
                console.warn('Supabase non configuré. Veuillez configurer vos clés.');
                return false;
            }
            return true;
        },
        
        // Sauvegarder la configuration
        save: function(url, anonKey) {
            localStorage.setItem('SUPABASE_URL', url);
            localStorage.setItem('SUPABASE_ANON_KEY', anonKey);
            this.url = url;
            this.anonKey = anonKey;
        },
        
        // Obtenir la configuration
        get: function() {
            return {
                url: this.url,
                anonKey: this.anonKey
            };
        },
        
        // Vérifier si configuré
        isConfigured: function() {
            return !!(this.url && this.anonKey);
        }
    };

    // Configuration MonCash
    const MonCashConfig = {
        enabled: true,
        requireScreenshot: true, // Le client doit uploader un screenshot
        paymentInstructions: {
            number: '3838-8888', // Numéro MonCash du restaurant
            name: 'Le Sillage Restaurant',
            instructions: 'Veuillez envoyer le paiement via MonCash et uploader la preuve de paiement'
        }
    };

    // Configuration des uploads
    const UploadConfig = {
        bucket: 'restaurant-images',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        paymentProofBucket: 'payment-proofs' // Bucket pour les preuves de paiement
    };

    // Configuration de l'application
    const AppConfig = {
        restaurantName: 'Le Sillage Bar Restaurant',
        currency: 'HTG',
        freeDeliveryThreshold: 1000, // Livraison gratuite au-dessus de 1000 HTG
        deliveryFee: 100,
        phoneNumber: '+509 2222-3333',
        email: 'contact@lesillage.ht',
        address: '123 Rue Lamarre, Port-au-Prince, Haïti'
    };

    // Initialiser la configuration Supabase au chargement
    SupabaseConfig.init();

    // Exporter les configurations
    window.Config = {
        Supabase: SupabaseConfig,
        MonCash: MonCashConfig,
        Upload: UploadConfig,
        App: AppConfig
    };

    // Log pour debugging
    console.log('Configuration chargée:', {
        supabaseConfigured: SupabaseConfig.isConfigured(),
        monCashEnabled: MonCashConfig.enabled
    });

})();
