// Supabase Configuration
(function() {
    'use strict';

    // Set your Supabase URL and anon key here
    const SUPABASE_URL ='https://yayoxqzxmijzipryevcr.supabase.co'
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheW94cXp4bWlqemlwcnlldmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzY5ODIsImV4cCI6MjA3Nzc1Mjk4Mn0.WUT4oCXU_vbanm2sQPjBWxXfcPcllyKju2F_P3K1qqI';

    // Save to localStorage
    localStorage.setItem('SUPABASE_URL', SUPABASE_URL);
    localStorage.setItem('SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);

    console.log('Supabase configuration saved to localStorage');
})();
