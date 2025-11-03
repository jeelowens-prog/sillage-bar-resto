-- Supabase Database Schema for Le Sillage Restaurant
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL, -- entrees, plats, desserts, boissons
    image_url TEXT,
    dietary VARCHAR(100), -- vegetarian, vegan, gluten-free
    spice_level VARCHAR(20), -- mild, medium, hot
    allergens TEXT[], -- array of allergens
    cultural_story TEXT,
    ingredients TEXT[],
    is_available BOOLEAN DEFAULT true,
    is_signature BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    nutritional_info JSONB, -- {protein: 35, carbs: 45, calories: 650}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- food, atmosphere, events
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    items JSONB NOT NULL, -- [{name: 'Griot', price: 850, quantity: 1}]
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_address TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, preparing, delivery, completed, cancelled, payment_pending
    payment_method VARCHAR(50) DEFAULT 'moncash',
    payment_proof_url TEXT, -- URL of payment screenshot
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INTEGER NOT NULL,
    special_requests TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_gallery_category ON gallery_images(category);
CREATE INDEX idx_gallery_active ON gallery_images(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (menu and gallery)
CREATE POLICY "Public can view available menu items" ON menu_items
FOR SELECT USING (is_available = true);

CREATE POLICY "Public can view active gallery images" ON gallery_images
FOR SELECT USING (is_active = true);

-- Create policies for authenticated admin users (full access)
CREATE POLICY "Authenticated users can do everything on menu_items" ON menu_items
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on gallery_images" ON gallery_images
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on orders" ON orders
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on reservations" ON reservations
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view admin_users" ON admin_users
FOR SELECT USING (auth.role() = 'authenticated');

-- Public can create orders and reservations
CREATE POLICY "Public can create orders" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create reservations" ON reservations
FOR INSERT WITH CHECK (true);

-- Insert sample admin user (you'll need to create this user in Supabase Auth first)
-- Then link them here
-- INSERT INTO admin_users (email, full_name, role) VALUES 
-- ('admin@lesillage.ht', 'Jean-Claude Moïse', 'super_admin');

-- Storage bucket for images (run this after creating the schema)
-- You'll need to create a storage bucket called 'restaurant-images' in Supabase Storage
-- Then set it to public read access