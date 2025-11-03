// Supabase Initialization Script
// This script should be loaded after config.js to initialize Supabase

(function() {
    'use strict';
    
    // Vérifier si la configuration est chargée
    if (typeof window.Config === 'undefined' || !window.Config.Supabase) {
        console.error('❌ Configuration Supabase non trouvée. Assurez-vous que config.js est chargé avant ce script.');
        return;
    }
    
    // Initialiser la configuration
    window.Config.Supabase.init();
    
    // Vérifier si la configuration est valide
    if (window.Config.Supabase.isConfigured()) {
        const config = window.Config.Supabase.get();
        window.SUPABASE_URL = config.url;
        window.SUPABASE_ANON_KEY = config.anonKey;
        console.log('✅ Configuration Supabase chargée depuis config.js');
    } else {
        console.error('❌ Configuration Supabase manquante dans config.js');
        
        // Ne pas rediriger si nous sommes déjà sur la page de connexion
        const currentPath = window.location.pathname;
        if (!currentPath.includes('admin_login') && !currentPath.includes('index.html')) {
            console.warn('Redirection vers la page de connexion...');
            // La redirection sera gérée par la page de connexion
        }
    }
    
    // Helper function to check if Supabase is properly initialized
    window.isSupabaseConfigured = function() {
        return !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY);
    };
    
    // Helper function to get Supabase client
    window.getSupabaseClient = function() {
        if (!window.isSupabaseConfigured()) {
            console.error('Supabase not configured');
            return null;
        }
        
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase library not loaded');
            return null;
        }
        
        try {
            return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        } catch (error) {
            console.error('Error creating Supabase client:', error);
            return null;
        }
    };
    
})();
