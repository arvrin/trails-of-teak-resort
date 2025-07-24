-- Insert sample rooms into existing table
-- Using JSONB format for amenities column
INSERT INTO rooms (name, type, price_per_night, status, description, size, amenities, image)
VALUES 
  (
    'Forest Villa',
    'Villa',
    18500,
    'available',
    'Elevated among ancient trees, this spacious villa offers panoramic forest views with handcrafted teak interiors and a private meditation deck.',
    '65 sqm',
    '["Private Deck", "Forest View", "Teak Interiors", "King Bed", "Meditation Space"]'::jsonb,
    '/images/room-bed.jpg'
  ),
  (
    'Canopy Suite',
    'Suite',
    22800,
    'available',
    'Suspended within the forest canopy, experience luxury living among the treetops with floor-to-ceiling windows and artisan stone bathrooms.',
    '80 sqm',
    '["Canopy Views", "Stone Bath", "Floor-to-ceiling Windows", "Premium Bedding", "Mini Bar"]'::jsonb,
    '/images/room-bed-table.jpg'
  ),
  (
    'Sanctuary Loft',
    'Loft',
    28900,
    'available',
    'Our signature accommodation featuring a two-story design with private terrace, outdoor rainfall shower, and curated nature experiences.',
    '120 sqm',
    '["Two-story", "Private Terrace", "Outdoor Shower", "Nature Guide", "Premium Service"]'::jsonb,
    '/images/room-chairs.jpg'
  )
ON CONFLICT (id) DO NOTHING;