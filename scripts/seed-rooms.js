const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rooms = [
  {
    name: 'Forest Villa',
    type: 'Villa',
    price_per_night: 18500,
    status: 'available',
    description: 'Elevated among ancient trees, this spacious villa offers panoramic forest views with handcrafted teak interiors and a private meditation deck.',
    size: '65 sqm',
    amenities: ['Private Deck', 'Forest View', 'Teak Interiors', 'King Bed', 'Meditation Space'],
    image: '/images/room-bed.jpg'
  },
  {
    name: 'Canopy Suite',
    type: 'Suite',
    price_per_night: 22800,
    status: 'available',
    description: 'Suspended within the forest canopy, experience luxury living among the treetops with floor-to-ceiling windows and artisan stone bathrooms.',
    size: '80 sqm',
    amenities: ['Canopy Views', 'Stone Bath', 'Floor-to-ceiling Windows', 'Premium Bedding', 'Mini Bar'],
    image: '/images/room-bed-table.jpg'
  },
  {
    name: 'Sanctuary Loft',
    type: 'Loft',
    price_per_night: 28900,
    status: 'available',
    description: 'Our signature accommodation featuring a two-story design with private terrace, outdoor rainfall shower, and curated nature experiences.',
    size: '120 sqm',
    amenities: ['Two-story', 'Private Terrace', 'Outdoor Shower', 'Nature Guide', 'Premium Service'],
    image: '/images/room-chairs.jpg'
  }
];

async function seedRooms() {
  console.log('Starting to seed rooms...');
  
  for (const room of rooms) {
    const { data, error } = await supabase
      .from('rooms')
      .insert(room)
      .select()
      .single();
    
    if (error) {
      console.error(`Error inserting room ${room.name}:`, error);
    } else {
      console.log(`Successfully added room: ${room.name}`);
    }
  }
  
  console.log('Room seeding completed!');
}

seedRooms();