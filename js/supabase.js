// Configuration Supabase
const supabaseUrl = 'VOTRE_URL_SUPABASE'
const supabaseKey = 'VOTRE_CLE_API_PUBLIQUE'

// Création du client Supabase
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

// Fonctions d'interaction avec la base de données
export async function getMenu() {
    const { data, error } = await supabase
        .from('menu')
        .select('*')
    return { data, error }
}

export async function createOrder(orderDetails) {
    const { data, error } = await supabase
        .from('orders')
        .insert([orderDetails])
    return { data, error }
}

export async function getGalleryImages() {
    const { data, error } = await supabase
        .from('gallery')
        .select('*')
    return { data, error }
}

// Autres fonctions selon vos besoins...