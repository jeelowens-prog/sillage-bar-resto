// Cart Manager - Gestion complète du panier
(function() {
    'use strict';

    // État du panier
    let cart = [];

    // Initialiser au chargement
    document.addEventListener('DOMContentLoaded', function() {
        loadCartFromStorage();
        setupCartUI();
        updateCartDisplay();
        updateCartCount();
    });

    // Charger le panier depuis localStorage
    function loadCartFromStorage() {
        const stored = localStorage.getItem('cart');
        if (stored) {
            try {
                cart = JSON.parse(stored);
            } catch (e) {
                console.error('Erreur lors du chargement du panier:', e);
                cart = [];
            }
        }
    }

    // Sauvegarder le panier dans localStorage
    function saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Configuration de l'interface du panier
    function setupCartUI() {
        // Boutons pour ouvrir le panier
        const cartBtns = document.querySelectorAll('#cart-btn, #mobile-cart-btn');
        cartBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', openCart);
            }
        });

        // Bouton pour fermer le panier
        const closeBtn = document.getElementById('close-cart');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeCart);
        }

        // Overlay pour fermer le panier
        const overlay = document.getElementById('cart-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeCart);
        }

        // Bouton checkout
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', proceedToCheckout);
        }

        // Boutons "Ajouter au panier" sur la page
        setupAddToCartButtons();

        // Menu mobile toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // Configuration des boutons "Ajouter au panier"
    function setupAddToCartButtons() {
        const addBtns = document.querySelectorAll('.add-to-cart');
        addBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const item = {
                    id: this.dataset.id || `item-${Date.now()}`,
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    image: this.dataset.image || ''
                };
                addToCart(item);
            });
        });
    }

    // Ajouter un article au panier
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id || cartItem.name === item.name);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }

        saveCartToStorage();
        updateCartDisplay();
        updateCartCount();
        showNotification(`${item.name} ajouté au panier!`, 'success');
        
        // Ouvrir le panier automatiquement
        openCart();
    }

    // Mettre à jour l'affichage du panier
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartFooter = document.getElementById('cart-footer');
        const cartTotal = document.getElementById('cart-total');

        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartFooter) cartFooter.style.display = 'none';
            cartItemsContainer.innerHTML = '';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'block';

        let total = 0;
        const itemsHTML = cart.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            return `
                <div class="cart-item border-b border-gray-200 pb-4 mb-4">
                    <div class="flex items-start gap-3">
                        ${item.image ? `
                            <img src="${item.image}" 
                                 alt="${item.name}" 
                                 class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                 onerror="this.style.display='none'">
                        ` : ''}
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold text-gray-800 truncate">${item.name}</h4>
                            <p class="text-sm text-gray-600">${item.price} HTG</p>
                            <div class="flex items-center gap-3 mt-2">
                                <div class="flex items-center border border-gray-300 rounded-lg">
                                    <button onclick="CartManager.decreaseQuantity(${index})" 
                                            class="px-3 py-1 hover:bg-gray-100 transition-colors">
                                        −
                                    </button>
                                    <span class="px-3 py-1 border-x border-gray-300 font-medium">${item.quantity}</span>
                                    <button onclick="CartManager.increaseQuantity(${index})" 
                                            class="px-3 py-1 hover:bg-gray-100 transition-colors">
                                        +
                                    </button>
                                </div>
                                <button onclick="CartManager.removeItem(${index})" 
                                        class="text-red-500 hover:text-red-700 text-sm font-medium">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                        <div class="text-right flex-shrink-0">
                            <p class="font-bold text-gray-800">${itemTotal.toFixed(2)} HTG</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        cartItemsContainer.innerHTML = itemsHTML;
        if (cartTotal) {
            cartTotal.textContent = `${total.toFixed(2)} HTG`;
        }
    }

    // Mettre à jour le compteur du panier
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountElements = document.querySelectorAll('#cart-count, #mobile-cart-count');
        cartCountElements.forEach(el => {
            if (el) el.textContent = totalItems;
        });
    }

    // Augmenter la quantité
    function increaseQuantity(index) {
        if (cart[index]) {
            cart[index].quantity++;
            saveCartToStorage();
            updateCartDisplay();
            updateCartCount();
        }
    }

    // Diminuer la quantité
    function decreaseQuantity(index) {
        if (cart[index]) {
            cart[index].quantity--;
            if (cart[index].quantity <= 0) {
                removeItem(index);
            } else {
                saveCartToStorage();
                updateCartDisplay();
                updateCartCount();
            }
        }
    }

    // Supprimer un article
    function removeItem(index) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartDisplay();
        updateCartCount();
        showNotification('Article supprimé du panier', 'info');
    }

    // Vider le panier
    function clearCart() {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        updateCartCount();
    }

    // Ouvrir le panier
    function openCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (sidebar) {
            sidebar.classList.remove('translate-x-full');
        }
        if (overlay) {
            overlay.classList.remove('hidden');
        }
        
        // Désactiver le scroll du body
        document.body.style.overflow = 'hidden';
    }

    // Fermer le panier
    function closeCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (sidebar) {
            sidebar.classList.add('translate-x-full');
        }
        if (overlay) {
            overlay.classList.add('hidden');
        }
        
        // Réactiver le scroll du body
        document.body.style.overflow = '';
    }

    // Procéder au checkout
    function proceedToCheckout() {
        if (cart.length === 0) {
            showNotification('Votre panier est vide', 'warning');
            return;
        }

        // Rediriger vers la page de commande ou ouvrir un modal
        // Pour l'instant, on scroll vers le formulaire de commande s'il existe
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            closeCart();
            orderForm.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Sinon, rediriger vers la page de contact/commande
            window.location.href = 'contact.html#order';
        }
    }

    // Obtenir le panier
    function getCart() {
        return cart;
    }

    // Obtenir le total
    function getTotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Afficher une notification
    function showNotification(message, type = 'success') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
        notification.textContent = message;
        notification.style.transform = 'translateX(400px)';
        
        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Animation de sortie et suppression
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Exporter les fonctions publiques
    window.CartManager = {
        addToCart,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCart,
        getTotal,
        openCart,
        closeCart,
        updateCartDisplay,
        setupAddToCartButtons
    };

})();
