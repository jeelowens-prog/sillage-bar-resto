// Fonction pour charger les avis
async function loadReviews() {
    // Récupérer le client Supabase depuis la portée globale
    const supabase = window.supabaseClient;
    try {
        // Charger les avis en attente
        const { data: pendingReviews, error: pendingError } = await supabase
            .from('reviews')
            .select('*')
            .eq('is_approved', false)
            .order('created_at', { ascending: false });

        if (pendingError) throw pendingError;

        // Afficher les avis en attente
        const pendingContainer = document.getElementById('pending-reviews');
        if (pendingReviews && pendingReviews.length > 0) {
            pendingContainer.innerHTML = pendingReviews.map(review => createReviewCard(review, false)).join('');
        } else {
            pendingContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Aucun avis en attente d\'approbation.</p>';
        }

        // Charger les avis approuvés
        const { data: approvedReviews, error: approvedError } = await supabase
            .from('reviews')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (approvedError) throw approvedError;

        // Afficher les avis approuvés
        const approvedContainer = document.getElementById('approved-reviews');
        if (approvedReviews && approvedReviews.length > 0) {
            approvedContainer.innerHTML = approvedReviews.map(review => createReviewCard(review, true)).join('');
        } else {
            approvedContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Aucun avis approuvé pour le moment.</p>';
        }

        // Ajouter les écouteurs d'événements
        document.querySelectorAll('.approve-review').forEach(button => {
            button.addEventListener('click', handleApproveReview);
        });

        document.querySelectorAll('.delete-review').forEach(button => {
            button.addEventListener('click', handleDeleteReview);
        });

    } catch (error) {
        console.error('Erreur lors du chargement des avis:', error);
        alert('Une erreur est survenue lors du chargement des avis.');
    }
}

// Créer une carte d'avis
function createReviewCard(review, isApproved) {
    return `
        <div class="bg-white rounded-lg shadow p-4 border-l-4 ${isApproved ? 'border-green-500' : 'border-yellow-500'}" data-id="${review.id}">
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-4">
                    ${review.profile_image_url ? 
                        `<img src="${review.profile_image_url}" alt="${review.customer_name}" class="w-12 h-12 rounded-full object-cover">` : 
                        `<div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            ${review.customer_name ? review.customer_name.charAt(0).toUpperCase() : 'A'}
                        </div>`
                    }
                    <div>
                        <div class="flex items-center space-x-2">
                            <h4 class="font-semibold">${review.customer_name || 'Anonyme'}</h4>
                            ${review.customer_role ? `<span class="text-sm text-gray-500">• ${review.customer_role}</span>` : ''}
                        </div>
                        <div class="flex items-center mt-1">
                            ${Array(5).fill('').map((_, i) => 
                                `<svg class="w-5 h-5 ${i < (review.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>`
                            ).join('')}
                        </div>
                        <p class="mt-2 text-gray-700">${review.comment || 'Aucun commentaire'}</p>
                        <p class="text-sm text-gray-500 mt-2">${review.created_at ? new Date(review.created_at).toLocaleDateString('fr-FR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : 'Date inconnue'}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    ${!isApproved ? `
                        <button class="approve-review p-2 text-green-600 hover:text-green-800" data-id="${review.id}" title="Approuver">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </button>
                    ` : ''}
                    <button class="delete-review p-2 text-red-600 hover:text-red-800" data-id="${review.id}" title="Supprimer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Gérer l'approbation d'un avis
async function handleApproveReview(event) {
    // Récupérer le client Supabase depuis la portée globale
    const supabase = window.supabaseClient;
    const reviewId = event.currentTarget.dataset.id;
    if (!confirm('Êtes-vous sûr de vouloir approuver cet avis ?')) return;

    try {
        const { error } = await supabase
            .from('reviews')
            .update({ 
                is_approved: true,
                updated_at: new Date().toISOString()
            })
            .eq('id', reviewId);

        if (error) throw error;

        // Recharger les avis
        loadReviews();
    } catch (error) {
        console.error('Erreur lors de l\'approbation de l\'avis:', error);
        alert('Une erreur est survenue lors de l\'approbation de l\'avis.');
    }
}

// Gérer la suppression d'un avis
async function handleDeleteReview(event) {
    // Récupérer le client Supabase depuis la portée globale
    const supabase = window.supabaseClient;
    const reviewId = event.currentTarget.dataset.id;
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.')) return;

    try {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (error) throw error;

        // Recharger les avis
        loadReviews();
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'avis:', error);
        alert('Une erreur est survenue lors de la suppression de l\'avis.');
    }
}

// Exposer les fonctions au scope global
window.loadReviews = loadReviews;
window.handleApproveReview = handleApproveReview;
window.handleDeleteReview = handleDeleteReview;
