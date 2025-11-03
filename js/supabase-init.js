// Supabase Initialization Script
// This script should be loaded in every page to initialize Supabase

(function() {
    'use strict';
    
    // Load configuration from localStorage
    const SUPABASE_URL = localStorage.getItem('SUPABASE_URL');
    const SUPABASE_ANON_KEY = localStorage.getItem('SUPABASE_ANON_KEY');
    
    // Set as window variables
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        window.SUPABASE_URL = SUPABASE_URL;
        window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
        console.log('✅ Supabase configuration loaded');
    } else {
        console.warn('⚠️ Supabase configuration missing');
        
        // Don't redirect if we're already on config or login pages
        const currentPath = window.location.pathname;
        if (!currentPath.includes('supabase-config') && 
            !currentPath.includes('admin_login') &&
            !currentPath.includes('index.html')) {
            
            const redirectTimer = setTimeout(() => {
                const shouldRedirect = confirm(
                    'Configuration Supabase manquante. Voulez-vous configurer maintenant?'
                );
                if (shouldRedirect) {
                    window.location.href = '/supabase-config.html';
                }
            }, 2000);
            
            // Store timer ID to allow cancellation
            window.supabaseRedirectTimer = redirectTimer;
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
