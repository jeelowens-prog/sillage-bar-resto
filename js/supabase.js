// Supabase Configuration and API Functions
// Make sure to set your environment variables before using

// Get Supabase credentials from environment or use placeholders
const SUPABASE_URL = typeof window !== 'undefined' && window.SUPABASE_URL 
    ? window.SUPABASE_URL 
    : 'YOUR_SUPABASE_URL_HERE';

const SUPABASE_ANON_KEY = typeof window !== 'undefined' && window.SUPABASE_ANON_KEY 
    ? window.SUPABASE_ANON_KEY 
    : 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize Supabase client
let supabaseClient = null;

if (typeof window !== 'undefined' && window.supabase) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully');
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
    }
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Sign in with email and password
export async function signInAdmin(email, password) {
    if (!supabaseClient) return { error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });
    
    if (error) return { error: error.message };
    
    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabaseClient
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();
    
    if (adminError || !adminData) {
        await supabaseClient.auth.signOut();
        return { error: 'Accès non autorisé. Vous n\'êtes pas un administrateur.' };
    }
    
    return { data: { user: data.user, admin: adminData }, error: null };
}

// Sign out
export async function signOut() {
    if (!supabaseClient) return { error: 'Supabase not initialized' };
    const { error } = await supabaseClient.auth.signOut();
    return { error };
}

// Get current session
export async function getSession() {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    const { data, error } = await supabaseClient.auth.getSession();
    return { data, error };
}

// Check if user is authenticated admin
export async function isAuthenticatedAdmin() {
    const { data } = await getSession();
    if (!data?.session) return false;
    
    const { data: adminData } = await supabaseClient
        .from('admin_users')
        .select('*')
        .eq('email', data.session.user.email)
        .single();
    
    return !!adminData;
}

// ============================================
// MENU ITEMS FUNCTIONS
// ============================================

// Get all menu items (public)
export async function getMenuItems(category = null) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    let query = supabaseClient
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });
    
    if (category && category !== 'all') {
        query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    return { data, error };
}

// Get all menu items (admin - includes unavailable)
export async function getAllMenuItems() {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });
    
    return { data, error };
}

// Create menu item
export async function createMenuItem(item) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('menu_items')
        .insert([item])
        .select();
    
    return { data, error };
}

// Update menu item
export async function updateMenuItem(id, updates) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select();
    
    return { data, error };
}

// Delete menu item
export async function deleteMenuItem(id) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('menu_items')
        .delete()
        .eq('id', id);
    
    return { data, error };
}

// ============================================
// GALLERY FUNCTIONS
// ============================================

// Get gallery images (public)
export async function getGalleryImages(category = null) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    let query = supabaseClient
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
    
    if (category && category !== 'all') {
        query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    return { data, error };
}

// Get all gallery images (admin)
export async function getAllGalleryImages() {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });
    
    return { data, error };
}

// Create gallery image
export async function createGalleryImage(image) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('gallery_images')
        .insert([image])
        .select();
    
    return { data, error };
}

// Update gallery image
export async function updateGalleryImage(id, updates) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('gallery_images')
        .update(updates)
        .eq('id', id)
        .select();
    
    return { data, error };
}

// Delete gallery image
export async function deleteGalleryImage(id) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('gallery_images')
        .delete()
        .eq('id', id);
    
    return { data, error };
}

// ============================================
// ORDERS FUNCTIONS
// ============================================

// Create order
export async function createOrder(order) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('orders')
        .insert([order])
        .select();
    
    return { data, error };
}

// Get all orders (admin)
export async function getAllOrders() {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
    
    return { data, error };
}

// Update order status
export async function updateOrderStatus(id, status) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();
    
    return { data, error };
}

// Delete order
export async function deleteOrder(id) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('orders')
        .delete()
        .eq('id', id);
    
    return { data, error };
}

// ============================================
// RESERVATIONS FUNCTIONS
// ============================================

// Create reservation
export async function createReservation(reservation) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('reservations')
        .insert([reservation])
        .select();
    
    return { data, error };
}

// Get all reservations (admin)
export async function getAllReservations() {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: true });
    
    return { data, error };
}

// Update reservation status
export async function updateReservationStatus(id, status) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select();
    
    return { data, error };
}

// Delete reservation
export async function deleteReservation(id) {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient
        .from('reservations')
        .delete()
        .eq('id', id);
    
    return { data, error };
}

// ============================================
// FILE UPLOAD FUNCTIONS (Supabase Storage)
// ============================================

// Upload image to Supabase Storage
export async function uploadImage(file, bucket = 'restaurant-images') {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(filePath, file);
    
    if (error) return { data: null, error };
    
    // Get public URL
    const { data: urlData } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(filePath);
    
    return { data: { path: filePath, url: urlData.publicUrl }, error: null };
}

// Delete image from Supabase Storage
export async function deleteImage(filePath, bucket = 'restaurant-images') {
    if (!supabaseClient) return { data: null, error: 'Supabase not initialized' };
    
    const { data, error } = await supabaseClient.storage
        .from(bucket)
        .remove([filePath]);
    
    return { data, error };
}

// Export supabase client for direct use if needed
export { supabaseClient };