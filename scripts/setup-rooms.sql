-- First, ensure the rooms table exists with proper structure
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price_per_night NUMERIC NOT NULL,
  status TEXT DEFAULT 'available',
  description TEXT,
  size TEXT,
  amenities TEXT[],
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms table
-- Allow anyone to view rooms
CREATE POLICY "Rooms are viewable by everyone" ON rooms
  FOR SELECT USING (true);

-- Allow authenticated users to insert rooms (for admin)
CREATE POLICY "Authenticated users can insert rooms" ON rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update rooms
CREATE POLICY "Authenticated users can update rooms" ON rooms
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample rooms
INSERT INTO rooms (name, type, price_per_night, status, description, size, amenities, image)
VALUES 
  (
    'Forest Villa',
    'Villa',
    18500,
    'available',
    'Elevated among ancient trees, this spacious villa offers panoramic forest views with handcrafted teak interiors and a private meditation deck.',
    '65 sqm',
    ARRAY['Private Deck', 'Forest View', 'Teak Interiors', 'King Bed', 'Meditation Space'],
    '/images/room-bed.jpg'
  ),
  (
    'Canopy Suite',
    'Suite',
    22800,
    'available',
    'Suspended within the forest canopy, experience luxury living among the treetops with floor-to-ceiling windows and artisan stone bathrooms.',
    '80 sqm',
    ARRAY['Canopy Views', 'Stone Bath', 'Floor-to-ceiling Windows', 'Premium Bedding', 'Mini Bar'],
    '/images/room-bed-table.jpg'
  ),
  (
    'Sanctuary Loft',
    'Loft',
    28900,
    'available',
    'Our signature accommodation featuring a two-story design with private terrace, outdoor rainfall shower, and curated nature experiences.',
    '120 sqm',
    ARRAY['Two-story', 'Private Terrace', 'Outdoor Shower', 'Nature Guide', 'Premium Service'],
    '/images/room-chairs.jpg'
  )
ON CONFLICT (id) DO NOTHING;