// Reviews Manager - Gestion des avis clients
(function() {
    'use strict';

    // Configuration
    const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop';
    const MAX_REVIEWS_DISPLAY = 6;

    class ReviewsManager {
        constructor() {
            this.supabase = null;
            this.reviewsContainer = null;
            this.init();
        }

        async init() {
            // Attendre que Supabase soit initialisé
            await this.waitForSupabase();
            
            // Charger les avis au chargement de la page
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.loadReviews());
            } else {
                this.loadReviews();
            }

            // Initialiser le formulaire
            this.initForm();
        }

        async waitForSupabase() {
            let attempts = 0;
            const maxAttempts = 50;
            
            // Attendre que la bibliothèque Supabase et la configuration soient chargées
            while ((!window.supabase || !window.getSupabaseClient) && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (window.getSupabaseClient) {
                // Utiliser la fonction helper pour créer le client
                this.supabase = window.getSupabaseClient();
                if (this.supabase) {
                    console.log('ReviewsManager: Supabase connecté');
                } else {
                    console.error('ReviewsManager: Impossible de créer le client Supabase');
                }
            } else {
                console.error('ReviewsManager: Fonction getSupabaseClient non trouvée');
            }
        }

        async loadReviews() {
            if (!this.supabase) {
                console.error('ReviewsManager: Supabase non initialisé');
                return;
            }

            this.reviewsContainer = document.getElementById('reviews-container');
            if (!this.reviewsContainer) {
                console.error('ReviewsManager: Conteneur reviews-container introuvable');
                return;
            }

            try {
                // Afficher un loader
                this.reviewsContainer.innerHTML = this.getLoaderHTML();

                // Récupérer les avis depuis Supabase
                const { data: reviews, error } = await this.supabase
                    .from('reviews')
                    .select('*')
                    .eq('is_approved', true)
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(MAX_REVIEWS_DISPLAY);

                if (error) {
                    console.error('Erreur lors du chargement des avis:', error);
                    this.reviewsContainer.innerHTML = this.getErrorHTML();
                    return;
                }

                // Afficher les avis
                if (reviews && reviews.length > 0) {
                    this.displayReviews(reviews);
                } else {
                    this.reviewsContainer.innerHTML = this.getNoReviewsHTML();
                }

            } catch (error) {
                console.error('Erreur:', error);
                this.reviewsContainer.innerHTML = this.getErrorHTML();
            }
        }

        displayReviews(reviews) {
            const reviewsHTML = reviews.map(review => this.getReviewCardHTML(review)).join('');
            this.reviewsContainer.innerHTML = reviewsHTML;
        }

        getReviewCardHTML(review) {
            const stars = this.getStarsHTML(review.rating);
            const profileImage = review.profile_image_url || DEFAULT_AVATAR;
            
            return `
                <div class="bg-primary-800 rounded-2xl p-6 shadow-card" data-review-id="${review.id}">
                    <div class="flex items-center mb-4">
                        <div class="flex text-accent">
                            ${stars}
                        </div>
                    </div>
                    <p class="text-primary-100 mb-4">
                        "${review.comment}"
                    </p>
                    <div class="flex items-center">
                        <img src="${profileImage}" 
                             alt="Photo de profil de ${review.customer_name}" 
                             class="w-10 h-10 rounded-full mr-3 object-cover"
                             onerror="this.src='${DEFAULT_AVATAR}'">
                        <div>
                            <div class="font-medium">${review.customer_name}</div>
                            <div class="text-sm text-primary-300">${review.customer_role || 'Client'}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        getStarsHTML(rating) {
            const starIcon = `<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>`;
            
            let starsHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < rating) {
                    starsHTML += `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">${starIcon}</svg>`;
                } else {
                    starsHTML += `<svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">${starIcon}</svg>`;
                }
            }
            return starsHTML;
        }

        getLoaderHTML() {
            return `
                <div class="col-span-full flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            `;
        }

        getErrorHTML() {
            return `
                <div class="col-span-full text-center py-12">
                    <p class="text-primary-300">Erreur lors du chargement des avis. Veuillez réessayer.</p>
                </div>
            `;
        }

        getNoReviewsHTML() {
            return `
                <div class="col-span-full text-center py-12">
                    <p class="text-primary-200 text-lg mb-4">Aucun avis pour le moment.</p>
                    <p class="text-primary-300">Soyez le premier à partager votre expérience !</p>
                </div>
            `;
        }

        initForm() {
            // Ouvrir la modal
            const openModalBtn = document.getElementById('open-review-modal');
            if (openModalBtn) {
                openModalBtn.addEventListener('click', () => this.openModal());
            }

            // Fermer la modal
            const closeModalBtn = document.getElementById('close-review-modal');
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => this.closeModal());
            }

            // Fermer en cliquant en dehors
            const modal = document.getElementById('review-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeModal();
                    }
                });
            }

            // Gérer le formulaire
            const form = document.getElementById('review-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleSubmit(e));
            }

            // Gérer la sélection des étoiles
            this.initStarRating();
        }

        initStarRating() {
            const stars = document.querySelectorAll('.rating-star');
            const ratingInput = document.getElementById('rating');
            
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const rating = index + 1;
                    ratingInput.value = rating;
                    
                    // Mettre à jour l'affichage des étoiles
                    stars.forEach((s, i) => {
                        if (i < rating) {
                            s.classList.add('active');
                            s.classList.remove('text-gray-400');
                            s.classList.add('text-accent');
                        } else {
                            s.classList.remove('active');
                            s.classList.remove('text-accent');
                            s.classList.add('text-gray-400');
                        }
                    });
                });

                // Hover effect
                star.addEventListener('mouseenter', () => {
                    const rating = index + 1;
                    stars.forEach((s, i) => {
                        if (i < rating) {
                            s.classList.add('text-accent');
                            s.classList.remove('text-gray-400');
                        }
                    });
                });

                star.addEventListener('mouseleave', () => {
                    const currentRating = parseInt(ratingInput.value) || 0;
                    stars.forEach((s, i) => {
                        if (i < currentRating) {
                            s.classList.add('text-accent');
                            s.classList.remove('text-gray-400');
                        } else {
                            s.classList.remove('text-accent');
                            s.classList.add('text-gray-400');
                        }
                    });
                });
            });
        }

        openModal() {
            const modal = document.getElementById('review-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden';
                // Scroll vers le haut du modal
                modal.scrollTop = 0;
                const form = document.getElementById('review-form');
                if (form) form.scrollTop = 0;
            }
        }

        closeModal() {
            const modal = document.getElementById('review-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
                
                // Réinitialiser le formulaire
                const form = document.getElementById('review-form');
                if (form) form.reset();
                
                // Réinitialiser les étoiles
                const stars = document.querySelectorAll('.rating-star');
                stars.forEach(star => {
                    star.classList.remove('active', 'text-accent');
                    star.classList.add('text-gray-400');
                });
            }
        }

        async handleSubmit(e) {
            e.preventDefault();

            if (!this.supabase) {
                alert('Erreur: Connexion à la base de données non établie');
                return;
            }

            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            try {
                // Désactiver le bouton
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="flex items-center space-x-2"><svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Envoi en cours...</span></span>';

                // Récupérer les données du formulaire
                const formData = new FormData(form);
                const reviewData = {
                    customer_name: formData.get('customer_name'),
                    customer_role: formData.get('customer_role') || 'Client',
                    rating: parseInt(formData.get('rating')),
                    comment: formData.get('comment'),
                    profile_image_url: formData.get('profile_image_url') || null,
                    is_approved: true,
                    is_active: true
                };

                // Validation
                if (!reviewData.customer_name || !reviewData.comment || !reviewData.rating) {
                    alert('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                if (reviewData.rating < 1 || reviewData.rating > 5) {
                    alert('Veuillez sélectionner une note de 1 à 5 étoiles');
                    return;
                }

                // Insérer dans Supabase
                const { data, error } = await this.supabase
                    .from('reviews')
                    .insert([reviewData])
                    .select();

                if (error) {
                    console.error('Erreur lors de l\'ajout de l\'avis:', error);
                    alert('Erreur lors de l\'envoi de votre avis. Veuillez réessayer.');
                    return;
                }

                // Succès
                console.log('Avis ajouté avec succès:', data);
                
                // Afficher un message de succès
                this.showSuccessMessage();
                
                // Fermer la modal
                this.closeModal();
                
                // Recharger les avis
                setTimeout(() => {
                    this.loadReviews();
                }, 500);

            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            } finally {
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }

        showSuccessMessage() {
            // Créer un message de succès temporaire
            const message = document.createElement('div');
            message.className = 'fixed top-4 right-4 bg-success text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
            message.innerHTML = `
                <div class="flex items-center space-x-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Merci pour votre avis !</span>
                </div>
            `;
            document.body.appendChild(message);

            // Supprimer après 3 secondes
            setTimeout(() => {
                message.remove();
            }, 3000);
        }
    }

    // Initialiser le gestionnaire d'avis
    window.ReviewsManager = new ReviewsManager();

})();
