// Order System - Handle cart and order submission with MonCash payment proof
(function() {
    'use strict';

    let supabaseClient = null;
    let cart = [];
    let paymentProofFile = null;

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initSupabase();
        setupOrderForm();
        displayCart();
        setupPaymentProofUpload();
        loadCartFromManager();
    });

    function initSupabase() {
        // Utiliser Config.js
        if (typeof window.Config !== 'undefined' && window.Config.Supabase) {
            const config = window.Config.Supabase.get();
            if (!config.url || !config.anonKey) {
                console.warn('Supabase not configured');
                return;
            }

            if (typeof window.supabase === 'undefined') {
                console.error('Supabase library not loaded');
                return;
            }

            try {
                supabaseClient = window.supabase.createClient(config.url, config.anonKey);
            } catch (error) {
                console.error('Error initializing Supabase:', error);
            }
        }
    }

    // Charger le panier depuis CartManager
    function loadCartFromManager() {
        if (window.CartManager) {
            cart = window.CartManager.getCart();
            displayCart();
        } else {
            // Fallback vers localStorage
            cart = JSON.parse(localStorage.getItem('cart')) || [];
        }
    }

    function displayCart() {
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!cartContainer) return;

        // Utiliser CartManager si disponible
        if (window.CartManager) {
            window.CartManager.updateCartDisplay();
            return;
        }

        // Fallback: affichage basique
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Votre panier est vide</p>';
            if (cartTotal) cartTotal.textContent = '0 HTG';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        let total = 0;
        cartContainer.innerHTML = cart.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            return `
                <div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">` : ''}
                    <div class="flex-1">
                        <h4 class="font-bold text-primary">${item.name}</h4>
                        <p class="text-sm text-gray-600">${item.price} HTG</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="updateQuantity(${index}, -1)" class="bg-gray-200 px-2 py-1 rounded">-</button>
                        <span class="px-4">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="bg-gray-200 px-2 py-1 rounded">+</button>
                    </div>
                    <div class="text-right">
                        <div class="font-bold">${itemTotal} HTG</div>
                        <button onclick="removeFromCart(${index})" class="text-red-500 text-sm">Supprimer</button>
                    </div>
                </div>
            `;
        }).join('');

        if (cartTotal) cartTotal.textContent = `${total.toFixed(2)} HTG`;
        if (checkoutBtn) checkoutBtn.disabled = false;
    }

    // Setup payment proof upload
    function setupPaymentProofUpload() {
        const paymentProofInput = document.getElementById('payment-proof');
        const paymentProofPreview = document.getElementById('payment-proof-preview');
        const paymentProofImage = document.getElementById('payment-proof-image');
        const removeProofBtn = document.getElementById('remove-payment-proof');

        if (paymentProofInput) {
            paymentProofInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;

                // Vérifier le type de fichier
                if (!file.type.startsWith('image/')) {
                    alert('Veuillez sélectionner une image valide');
                    return;
                }

                // Vérifier la taille (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('L\'image est trop grande. Maximum 5MB.');
                    return;
                }

                paymentProofFile = file;

                // Afficher la prévisualisation
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (paymentProofImage) {
                        paymentProofImage.src = e.target.result;
                    }
                    if (paymentProofPreview) {
                        paymentProofPreview.classList.remove('hidden');
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        if (removeProofBtn) {
            removeProofBtn.addEventListener('click', function() {
                paymentProofFile = null;
                if (paymentProofInput) paymentProofInput.value = '';
                if (paymentProofPreview) paymentProofPreview.classList.add('hidden');
                if (paymentProofImage) paymentProofImage.src = '';
            });
        }
    }

    // Upload payment proof to Supabase Storage
    async function uploadPaymentProof(orderId) {
        if (!paymentProofFile || !supabaseClient) return null;

        try {
            const fileExt = paymentProofFile.name.split('.').pop();
            const fileName = `payment-${orderId}-${Date.now()}.${fileExt}`;
            const filePath = `proofs/${fileName}`;

            // Créer le bucket s'il n'existe pas
            const { data: buckets } = await supabaseClient.storage.listBuckets();
            const paymentBucket = buckets?.find(b => b.name === 'payment-proofs');
            
            if (!paymentBucket) {
                await supabaseClient.storage.createBucket('payment-proofs', {
                    public: false // Privé pour la sécurité
                });
            }

            // Upload le fichier
            const { data, error } = await supabaseClient.storage
                .from('payment-proofs')
                .upload(filePath, paymentProofFile);

            if (error) throw error;

            // Obtenir l'URL
            const { data: urlData } = supabaseClient.storage
                .from('payment-proofs')
                .getPublicUrl(filePath);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Error uploading payment proof:', error);
            return null;
        }
    }

    window.updateQuantity = function(index, change) {
        if (cart[index]) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        }
    };

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    };

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cart-count, #mobile-cart-count');
        cartCountElements.forEach(el => {
            if (el) el.textContent = totalItems;
        });
    }

    function setupOrderForm() {
        const orderForm = document.getElementById('order-form');
        if (!orderForm) return;

        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!supabaseClient) {
                alert('Configuration Supabase manquante. Veuillez configurer Supabase d\\'abord.');
                return;
            }

            if (cart.length === 0) {
                alert('Votre panier est vide');
                return;
            }

            const formData = {
                customer_name: document.getElementById('customer-name').value,
                customer_email: document.getElementById('customer-email').value || null,
                customer_phone: document.getElementById('customer-phone').value,
                delivery_address: document.getElementById('delivery-address').value || null,
                notes: document.getElementById('order-notes').value || null,
                items: cart,
                total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                status: 'pending',
                payment_method: document.getElementById('payment-method').value || 'moncash'
            };

            try {
                const submitBtn = orderForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi en cours...';

                const { data, error } = await supabaseClient
                    .from('orders')
                    .insert([formData])
                    .select();

                if (error) throw error;

                // Clear cart
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Show success message
                alert('Commande envoyée avec succès! Nous vous contacterons bientôt.');
                
                // Reset form
                orderForm.reset();
                displayCart();
                updateCartCount();

                submitBtn.disabled = false;
                submitBtn.textContent = 'Commander';

            } catch (error) {
                console.error('Error submitting order:', error);
                alert('Erreur lors de l\\'envoi de la commande. Veuillez réessayer.');
                
                const submitBtn = orderForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Commander';
            }
        });
    }

    // Export functions
    window.orderSystem = {
        displayCart,
        cart
    };

})();
