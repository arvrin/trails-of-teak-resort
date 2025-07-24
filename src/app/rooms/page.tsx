'use client';

import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Room } from "@/lib/supabase";

const rooms: Room[] = [
  {
    id: "1",
    name: "Forest Villa",
    type: "Villa",
    description: "Elevated among ancient trees, this spacious villa offers panoramic forest views with handcrafted teak interiors and a private meditation deck.",
    price_per_night: 18500,
    image: "/images/room-bed.jpg",
    amenities: ["Private Deck", "Forest View", "Teak Interiors", "King Bed", "Meditation Space"],
    size: "65 sqm",
    status: "available"
  },
  {
    id: "2",
    name: "Canopy Suite",
    type: "Suite",
    description: "Suspended within the forest canopy, experience luxury living among the treetops with floor-to-ceiling windows and artisan stone bathrooms.",
    price_per_night: 22800,
    image: "/images/room-bed-table.jpg",
    amenities: ["Canopy Views", "Stone Bath", "Floor-to-ceiling Windows", "Premium Bedding", "Mini Bar"],
    size: "80 sqm",
    status: "available"
  },
  {
    id: "3",
    name: "Sanctuary Loft",
    type: "Loft",
    description: "Our signature accommodation featuring a two-story design with private terrace, outdoor rainfall shower, and curated nature experiences.",
    price_per_night: 28900,
    image: "/images/room-chairs.jpg",
    amenities: ["Two-story", "Private Terrace", "Outdoor Shower", "Nature Guide", "Premium Service"],
    size: "120 sqm",
    status: "available"
  }
];

export default function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  const handleBookNow = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const filteredRooms = rooms.filter(room => {
    if (priceFilter === 'all') return true;
    if (priceFilter === 'low') return room.price_per_night < 20000;
    if (priceFilter === 'mid') return room.price_per_night >= 20000 && room.price_per_night < 25000;
    if (priceFilter === 'high') return room.price_per_night >= 25000;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/2.jpg"
            alt="Resort Rooms"
            fill
            className="object-cover scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 luxury-gradient"></div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="fade-in-up stagger-1">
              <span className="text-accent text-sm tracking-widest uppercase font-medium mb-4 block">Accommodations</span>
              <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-white text-shadow-luxury">
                Luxury Sanctuaries
              </h1>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto">
                Each room is a masterpiece of design, where comfort meets conservation in perfect harmony with nature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Filters */}
      <section className="py-8 bg-white border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-heading text-lg text-primary">Filter by Price Range</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPriceFilter('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover-lift ${
                  priceFilter === 'all'
                    ? 'bg-accent text-white'
                    : 'bg-background text-text hover:bg-accent/10'
                }`}
              >
                All Rooms
              </button>
              <button
                onClick={() => setPriceFilter('low')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover-lift ${
                  priceFilter === 'low'
                    ? 'bg-accent text-white'
                    : 'bg-background text-text hover:bg-accent/10'
                }`}
              >
                Under ₹20,000
              </button>
              <button
                onClick={() => setPriceFilter('mid')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover-lift ${
                  priceFilter === 'mid'
                    ? 'bg-accent text-white'
                    : 'bg-background text-text hover:bg-accent/10'
                }`}
              >
                ₹20,000 - ₹25,000
              </button>
              <button
                onClick={() => setPriceFilter('high')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover-lift ${
                  priceFilter === 'high'
                    ? 'bg-accent text-white'
                    : 'bg-background text-text hover:bg-accent/10'
                }`}
              >
                Above ₹25,000
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16">
            {filteredRooms.map((room, index) => (
              <div key={room.id} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-cols-2' : ''}`}>
                <div className={`relative h-96 lg:h-[500px] rounded-3xl overflow-hidden hover-lift group ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 glass-effect rounded-full px-4 py-2">
                    <span className="text-white text-sm font-medium">{room.size}</span>
                  </div>
                </div>
                
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div>
                    <span className="text-accent text-sm tracking-widest uppercase font-medium">Suite</span>
                    <h2 className="font-heading text-4xl md:text-5xl text-primary mt-2 mb-4">
                      {room.name}
                    </h2>
                    <div className="w-16 h-px bg-accent mb-6"></div>
                    <p className="text-text text-lg leading-relaxed mb-6">
                      {room.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-text text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-divider">
                    <div>
                      <span className="text-text text-sm">Starting from</span>
                      <div className="font-heading text-3xl text-primary">₹{room.price_per_night.toLocaleString()}</div>
                      <span className="text-text text-sm">per night</span>
                    </div>
                    <div className="space-x-4">
                      <button className="glass-effect text-primary px-6 py-3 rounded-full font-medium hover-lift border border-primary/20">
                        Virtual Tour
                      </button>
                      <button 
                        onClick={() => handleBookNow(room)}
                        className="luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary px-8 py-3 rounded-full font-semibold hover-lift hover:scale-105 transition-all duration-300"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="luxury-border rounded-3xl p-12 bg-gradient-to-r from-primary to-green-700 text-white">
            <h2 className="font-heading text-4xl md:text-5xl mb-6">
              Reserve Your Sanctuary
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Experience the perfect blend of luxury and nature. Each booking includes guided forest walks, 
              artisan breakfast, and access to our exclusive meditation gardens.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-3xl font-heading text-accent mb-2">24/7</div>
                <div className="text-sm">Concierge Service</div>
              </div>
              <div>
                <div className="text-3xl font-heading text-accent mb-2">100%</div>
                <div className="text-sm">Eco-Certified</div>
              </div>
              <div>
                <div className="text-3xl font-heading text-accent mb-2">5★</div>
                <div className="text-sm">Guest Rating</div>
              </div>
            </div>
            <button className="luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary px-12 py-4 rounded-full text-xl font-semibold hover-lift hover:scale-105 transition-all duration-300">
              Check Availability
            </button>
          </div>
        </div>
      </section>

      <Footer />
      
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        room={selectedRoom}
      />
    </div>
  );
}