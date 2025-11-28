// Enregistrer le Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré:', registration.scope);
            })
            .catch((error) => {
                console.error('❌ Erreur Service Worker:', error);
            });
    });
}
