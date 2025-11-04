// Configuration WhatsApp
const WHATSAPP_API_KEY = '8841723';
const WHATSAPP_PHONE = '50933970083';

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Formatage du message pour WhatsApp
            const whatsappMessage = `Nouveau message de contact:
Nom: ${name}
Email: ${email}
Message: ${message}`;

            // Encodage du message pour l'URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            try {
                // Envoi à l'API WhatsApp
                const response = await fetch(`https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodedMessage}&apikey=${WHATSAPP_API_KEY}`);
                
                if (response.ok) {
                    alert('Votre message a été envoyé avec succès!');
                    contactForm.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi du message');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
            }
        });
    }
});