// Frontend Menu Dynamic Loading
// This script loads menu items from Supabase and displays them dynamically

(function() {
    'use strict';

    let supabaseClient = null;
    let allMenuItems = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initSupabase();
        updateCartCount();
    });

    function initSupabase() {
        const SUPABASE_URL = localStorage.getItem('SUPABASE_URL');
        const SUPABASE_ANON_KEY = localStorage.getItem('SUPABASE_ANON_KEY');

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.warn('Supabase not configured - using static content');
            return;
        }

        if (typeof window.supabase === 'undefined') {
            console.error('Supabase library not loaded');
            return;
        }

        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            loadMenuItems();
        } catch (error) {
            console.error('Error initializing Supabase:', error);
        }
    }

    async function loadMenuItems() {
        if (!supabaseClient) return;

        try {
            const { data, error } = await supabaseClient
                .from('menu_items')
                .select('*')
                .eq('is_available', true)
                .order('category', { ascending: true });

            if (error) throw error;

            allMenuItems = data || [];
            renderMenuItems(allMenuItems);
            setupFilters();
            setupSearch();
        } catch (error) {
            console.error('Error loading menu items:', error);
        }
    }

    function renderMenuItems(items) {
        // Group by category
        const categories = {
            entrees: [],
            plats: [],
            desserts: [],
            boissons: []
        };

        items.forEach(item => {
            if (categories[item.category]) {
                categories[item.category].push(item);
            }
        });

        // Render each category
        renderCategory('entrees', categories.entrees, 'Entrées Traditionnelles');
        renderCategory('plats', categories.plats, 'Plats Principaux');
        renderCategory('desserts', categories.desserts, 'Desserts Créoles');
        renderCategory('boissons', categories.boissons, 'Boissons Tropicales');
    }

    function renderCategory(categoryId, items, title) {
        const categorySection = document.querySelector(`[data-category="${categoryId}"]`);
        if (!categorySection) return;

        const gridContainer = categorySection.querySelector('.grid');
        if (!gridContainer) return;

        if (items.length === 0) {
            gridContainer.innerHTML = '<p class="col-span-full text-center text-gray-500">Aucun plat disponible dans cette catégorie</p>';
            return;
        }

        gridContainer.innerHTML = items.map(item => createMenuItemCard(item)).join('');

        // Add event listeners to add-to-cart buttons
        gridContainer.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const itemData = {
                    id: this.dataset.id,
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    image: this.dataset.image
                };
                addToCart(itemData);
            });
        });
    }

    function createMenuItemCard(item) {
        const badges = [];
        if (item.is_signature) {
            badges.push('<div class="absolute top-4 left-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium">Signature</div>');
        }
        if (item.is_popular) {
            badges.push('<div class="absolute top-4 left-4 bg-error text-white px-3 py-1 rounded-full text-sm font-medium">Populaire</div>');
        }

        const spiceIcons = {
            'mild': '🌶️ Doux',
            'medium': '🌶️🌶️ Moyen',
            'hot': '🌶️🌶️🌶️ Épicé'
        };

        const spiceBadge = item.spice_level ? 
            `<div class="absolute top-4 right-4 bg-${item.spice_level === 'hot' ? 'error' : item.spice_level === 'medium' ? 'warning' : 'accent'} text-white px-3 py-1 rounded-full text-sm font-medium">${spiceIcons[item.spice_level] || ''}</div>` 
            : '';

        const dietaryBadge = item.dietary ? 
            `<div class="absolute top-4 left-4 bg-success text-white px-3 py-1 rounded-full text-sm font-medium">${getDietaryLabel(item.dietary)}</div>`
            : '';

        const culturalStory = item.cultural_story ? 
            `<div class="mb-4 p-3 bg-accent-50 rounded-lg">
                <p class="text-sm text-text-secondary italic">"${item.cultural_story}"</p>
            </div>` 
            : '';

        const ingredients = item.ingredients && item.ingredients.length > 0 ? 
            `<div class="mb-4">
                <h4 class="font-medium text-text-primary mb-2">Ingrédients:</h4>
                <div class="flex flex-wrap gap-1">
                    ${item.ingredients.map(ing => `<span class="bg-primary-100 text-primary px-2 py-1 rounded-full text-xs">${ing}</span>`).join('')}
                </div>
            </div>`
            : '';

        return `
            <div class="menu-item bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2" 
                 data-category="${item.category}" 
                 data-dietary="${item.dietary || ''}" 
                 data-spice="${item.spice_level || ''}" 
                 data-price="${getPriceRange(item.price)}">
                <div class="relative overflow-hidden h-64">
                    <img src="${item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}" 
                         alt="${item.name}" 
                         class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                         onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c';">
                    ${badges.join('')}
                    ${dietaryBadge}
                    ${spiceBadge}
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-playfair font-bold text-primary mb-2">${item.name}</h3>
                    <p class="text-text-secondary mb-4">${item.description}</p>
                    
                    ${culturalStory}
                    ${ingredients}

                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-secondary">${item.price} HTG</span>
                        <button class="add-to-cart bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-600 transition-colors"
                                data-id="${item.id}"
                                data-name="${item.name}" 
                                data-price="${item.price}" 
                                data-image="${item.image_url || ''}">
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function getDietaryLabel(dietary) {
        const labels = {
            'vegetarian': 'Végétarien',
            'vegan': 'Végétalien',
            'gluten-free': 'Sans Gluten'
        };
        return labels[dietary] || dietary;
    }

    function getPriceRange(price) {
        if (price < 500) return 'low';
        if (price <= 1000) return 'medium';
        return 'high';
    }

    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const advancedFiltersBtn = document.getElementById('advanced-filters-btn');
        const advancedFilters = document.getElementById('advanced-filters');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-primary-50', 'text-primary');
                    btn.classList.add('border-primary-200', 'text-text-secondary');
                });
                
                this.classList.add('active', 'bg-primary-50', 'text-primary');
                this.classList.remove('border-primary-200', 'text-text-secondary');
                
                const filter = this.dataset.filter;
                filterMenuItems(filter);
            });
        });

        if (advancedFiltersBtn && advancedFilters) {
            advancedFiltersBtn.addEventListener('click', function() {
                advancedFilters.classList.toggle('hidden');
            });

            // Advanced filter checkboxes
            advancedFilters.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', applyAdvancedFilters);
            });
        }
    }

    function filterMenuItems(category) {
        const items = document.querySelectorAll('.menu-item');
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function applyAdvancedFilters() {
        const dietaryFilters = Array.from(document.querySelectorAll('.dietary-filter:checked')).map(cb => cb.dataset.dietary);
        const spiceFilters = Array.from(document.querySelectorAll('.spice-filter:checked')).map(cb => cb.dataset.spice);
        const priceFilters = Array.from(document.querySelectorAll('.price-filter:checked')).map(cb => cb.dataset.price);

        const items = document.querySelectorAll('.menu-item');
        items.forEach(item => {
            let show = true;

            if (dietaryFilters.length > 0 && !dietaryFilters.includes(item.dataset.dietary)) {
                show = false;
            }

            if (spiceFilters.length > 0 && !spiceFilters.includes(item.dataset.spice)) {
                show = false;
            }

            if (priceFilters.length > 0 && !priceFilters.includes(item.dataset.price)) {
                show = false;
            }

            item.style.display = show ? 'block' : 'none';
        });
    }

    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const items = document.querySelectorAll('.menu-item');

            items.forEach(item => {
                const name = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();

                if (name.includes(query) || description.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Cart functions
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showCartNotification(item.name);
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountElements = document.querySelectorAll('#cart-count, #mobile-cart-count');
        cartCountElements.forEach(el => {
            if (el) el.textContent = totalItems;
        });
    }

    function showCartNotification(itemName) {
        // Simple notification - you can enhance this
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = `${itemName} ajouté au panier`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Export functions for global use
    window.menuLoader = {
        loadMenuItems,
        addToCart,
        cart
    };

})();
