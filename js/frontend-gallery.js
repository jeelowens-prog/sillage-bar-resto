// Frontend Gallery Dynamic Loading
// This script loads gallery images from Supabase and displays them dynamically

(function() {
    'use strict';

    let supabaseClient = null;
    let allGalleryImages = [];

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initSupabase();
    });

    function initSupabase() {
        // Vérifier si la configuration Supabase est disponible
        if (typeof window.Config === 'undefined' || !window.Config.Supabase) {
            console.warn('Configuration Supabase non trouvée - utilisation du contenu statique');
            return;
        }

        // Vérifier si Supabase est correctement configuré
        if (!window.Config.Supabase.isConfigured()) {
            console.warn('Supabase non configuré - utilisation du contenu statique');
            return;
        }

        if (typeof window.supabase === 'undefined') {
            console.error('Bibliothèque Supabase non chargée');
            return;
        }

        try {
            const config = window.Config.Supabase.get();
            supabaseClient = window.supabase.createClient(config.url, config.anonKey);
            loadGalleryImages();
        } catch (error) {
            console.error('Error initializing Supabase:', error);
        }
    }

    async function loadGalleryImages() {
        if (!supabaseClient) return;

        try {
            const { data, error } = await supabaseClient
                .from('gallery_images')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) throw error;

            allGalleryImages = data || [];
            renderGalleryImages(allGalleryImages);
            setupGalleryFilters();
        } catch (error) {
            console.error('Error loading gallery images:', error);
        }
    }

    function renderGalleryImages(images) {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        if (images.length === 0) {
            galleryGrid.innerHTML = '<p class="col-span-full text-center text-gray-500">Aucune image disponible</p>';
            return;
        }

        galleryGrid.innerHTML = images.map(image => createGalleryItem(image)).join('');

        // Add click event listeners to gallery items
        galleryGrid.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                openImageModal(images[index]);
            });
        });
    }

    function createGalleryItem(image) {
        return `
            <div class="gallery-item ${image.category} relative group cursor-pointer overflow-hidden rounded-2xl shadow-card hover:shadow-hover transition-all duration-300" 
                 data-category="${image.category}">
                <div class="aspect-square">
                    <img src="${image.image_url}" 
                         alt="${image.title}" 
                         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                         loading="lazy"
                         onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c';">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="absolute bottom-4 left-4 right-4 text-white">
                        <h3 class="text-lg font-playfair font-bold mb-1">${image.title}</h3>
                        ${image.description ? `<p class="text-sm text-primary-200">${image.description}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    function setupGalleryFilters() {
        const filterButtons = document.querySelectorAll('.gallery-filter');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-accent', 'text-primary');
                    btn.classList.add('bg-primary-800/50', 'text-white');
                });
                
                this.classList.add('active', 'bg-accent', 'text-primary');
                this.classList.remove('bg-primary-800/50', 'text-white');
                
                const filter = this.dataset.filter;
                filterGalleryImages(filter);
            });
        });
    }

    function filterGalleryImages(category) {
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    function openImageModal(image) {
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        
        if (!modal || !modalImage || !modalCaption) return;

        modalImage.src = image.image_url;
        modalImage.alt = image.title;
        
        const captionTitle = modalCaption.querySelector('h3');
        const captionDesc = modalCaption.querySelector('p');
        
        if (captionTitle) captionTitle.textContent = image.title;
        if (captionDesc) captionDesc.textContent = image.description || '';

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Export functions for global use
    window.galleryLoader = {
        loadGalleryImages,
        images: allGalleryImages
    };

})();
