'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Room } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, Star, Wifi, Car, Coffee, Bath, Bed, Home, Trees, Mountain, Sun } from 'lucide-react';

// Room data - in a real app, this would come from an API/database
const roomsData: Record<string, Room & { 
  gallery: string[]; 
  fullDescription: string; 
  roomFeatures: string[];
  nearbyAttractions: { name: string; distance: string; description: string }[];
  experiences: { name: string; description: string; included: boolean }[];
}> = {
  "1": {
    id: "1",
    name: "Forest Villa",
    type: "Villa",
    description: "Elevated among ancient trees, this spacious villa offers panoramic forest views with handcrafted teak interiors and a private meditation deck.",
    fullDescription: "Discover serenity in our Forest Villa, where luxury meets nature in perfect harmony. This elevated sanctuary sits gracefully among centuries-old trees, offering an unparalleled connection to the pristine forest ecosystem. Every detail has been thoughtfully crafted using sustainable materials and traditional techniques, creating a space that honors both comfort and conservation.\n\nThe villa features expansive floor-to-ceiling windows that frame the ever-changing forest canvas, while handcrafted teak furnishings tell stories of local artisanship. Your private meditation deck extends into the canopy, providing the perfect space for reflection and communion with nature. As day turns to night, watch fireflies dance through the trees from your oversized soaking tub, positioned to capture the most spectacular forest views.",
    price_per_night: 18500,
    image: "/images/room-bed.jpg",
    gallery: ["/images/room-bed.jpg", "/images/room-bed-table.jpg", "/images/room-chairs.jpg", "/images/2.jpg", "/images/3.jpg"],
    amenities: ["Private Deck", "Forest View", "Teak Interiors", "King Bed", "Meditation Space"],
    roomFeatures: [
      "650 sq ft of luxury living space",
      "Private forest-facing deck with seating area",
      "Handcrafted teak king-size bed with organic cotton linens",
      "Marble-clad bathroom with forest-view soaking tub",
      "Climate-controlled environment with natural ventilation",
      "Artisan-designed meditation corner with cushions",
      "Mini-bar stocked with organic local beverages",
      "High-speed WiFi and charging stations",
      "Blackout curtains for optimal rest",
      "Rain shower with eco-friendly amenities"
    ],
    size: "65 sqm",
    status: "available",
    nearbyAttractions: [
      {
        name: "Ancient Grove Trail",
        distance: "2 min walk",
        description: "Guided walk through 500-year-old trees with our naturalist"
      },
      {
        name: "Sunrise Meditation Point",
        distance: "5 min walk",
        description: "Elevated platform perfect for morning yoga and reflection"
      },
      {
        name: "Artisan Village",
        distance: "15 min walk",
        description: "Meet local craftspeople and learn traditional techniques"
      },
      {
        name: "Organic Farm",
        distance: "10 min walk",
        description: "Tour our permaculture gardens and harvest fresh ingredients"
      }
    ],
    experiences: [
      { name: "Daily Organic Breakfast", description: "Farm-to-table breakfast served on your private deck", included: true },
      { name: "Evening Turndown Service", description: "Traditional aromatherapy and local treats", included: true },
      { name: "Guided Nature Walk", description: "Expert-led exploration of forest ecosystem", included: true },
      { name: "Private Spa Treatment", description: "In-room massage with organic forest oils", included: false },
      { name: "Candlelit Forest Dinner", description: "Private dining experience under the stars", included: false },
      { name: "Photography Session", description: "Professional photos in the forest setting", included: false }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "2": {
    id: "2",
    name: "Canopy Suite",
    type: "Suite",
    description: "Suspended within the forest canopy, experience luxury living among the treetops with floor-to-ceiling windows and artisan stone bathrooms.",
    fullDescription: "Elevate your perspective in our Canopy Suite, where you'll quite literally live among the treetops. This architectural marvel is suspended within the forest canopy, offering an immersive experience that few accommodations can match. Floor-to-ceiling windows wrap around the living space, creating a transparent barrier between you and the living forest.\n\nEvery morning, wake to birdsong and dappled sunlight filtering through the leaves. The suite features an artisan stone bathroom carved from local materials, where you can soak in luxury while monkeys playfully swing through nearby branches. The canopy location provides natural air conditioning and the most incredible sunset views, as the forest comes alive with the sounds of evening creatures.",
    price_per_night: 22800,
    image: "/images/room-bed-table.jpg",
    gallery: ["/images/room-bed-table.jpg", "/images/room-bed.jpg", "/images/room-chairs.jpg", "/images/4.jpg", "/images/3.jpg"],
    amenities: ["Canopy Views", "Stone Bath", "Floor-to-ceiling Windows", "Premium Bedding", "Mini Bar"],
    roomFeatures: [
      "800 sq ft suspended among treetops",
      "360-degree floor-to-ceiling windows",
      "Artisan-carved stone bathroom with rain shower",
      "Luxury king bed with mosquito netting",
      "Private balcony extending into canopy",
      "Climate control with natural forest ventilation",
      "Premium mini-bar with local delicacies",
      "Reading nook with forest library",
      "Binoculars for wildlife watching",
      "Emergency communication system"
    ],
    size: "80 sqm",
    status: "available",
    nearbyAttractions: [
      {
        name: "Canopy Walkway",
        distance: "Direct access",
        description: "Suspended bridge system connecting tree platforms"
      },
      {
        name: "Bird Watching Platform",
        distance: "3 min walk",
        description: "Prime location for spotting exotic birds and wildlife"
      },
      {
        name: "Sunset Viewing Deck",
        distance: "5 min walk",
        description: "Elevated platform with panoramic forest views"
      },
      {
        name: "Healing Garden",
        distance: "8 min walk",
        description: "Medicinal plant garden with traditional healing practices"
      }
    ],
    experiences: [
      { name: "Sunrise Yoga in Canopy", description: "Private yoga session among the treetops", included: true },
      { name: "Wildlife Breakfast Service", description: "Meal service while observing morning forest activity", included: true },
      { name: "Bird Watching Guide", description: "Expert ornithologist for guided bird spotting", included: true },
      { name: "Treetop Spa Treatment", description: "Massage therapy in open-air canopy pavilion", included: false },
      { name: "Romantic Canopy Dinner", description: "Private dining suspended in the trees", included: false },
      { name: "Night Vision Wildlife Tour", description: "Evening exploration with night vision equipment", included: false }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "3": {
    id: "3",
    name: "Sanctuary Loft",
    type: "Loft",
    description: "Our signature accommodation featuring a two-story design with private terrace, outdoor rainfall shower, and curated nature experiences.",
    fullDescription: "Experience the pinnacle of eco-luxury in our Sanctuary Loft, our most exclusive accommodation that redefines the relationship between architecture and nature. This two-story masterpiece seamlessly integrates with the forest environment while providing every conceivable luxury. The design celebrates both horizontal and vertical space, creating distinct zones for relaxation, work, and communion with nature.\n\nThe ground floor features an open-plan living area with a stone fireplace, while the upper level houses the sleeping quarters with a private roof terrace offering 360-degree forest views. The outdoor rainfall shower, carved from a single piece of local stone, provides the ultimate luxury bathing experience surrounded by living trees. Every element has been designed to minimize environmental impact while maximizing your connection to the natural world.",
    price_per_night: 28900,
    image: "/images/room-chairs.jpg",
    gallery: ["/images/room-chairs.jpg", "/images/room-bed.jpg", "/images/room-bed-table.jpg", "/images/2.jpg", "/images/4.jpg"],
    amenities: ["Two-story", "Private Terrace", "Outdoor Shower", "Nature Guide", "Premium Service"],
    roomFeatures: [
      "1200 sq ft across two levels",
      "Ground floor living area with stone fireplace",
      "Upper level sleeping loft with canopy views",
      "Private rooftop terrace with 360° forest views",
      "Outdoor stone rainfall shower garden",
      "Indoor/outdoor bathroom with soaking tub",
      "Gourmet kitchenette with local provisions",
      "Work area with forest-view desk",
      "Premium sound system with nature audio",
      "Telescope for stargazing from terrace"
    ],
    size: "120 sqm",
    status: "available",
    nearbyAttractions: [
      {
        name: "Private Forest Trail",
        distance: "Direct access",
        description: "Exclusive trail accessible only to Sanctuary Loft guests"
      },
      {
        name: "Meditation Labyrinth",
        distance: "2 min walk",
        description: "Stone labyrinth for contemplative walking meditation"
      },
      {
        name: "Natural Swimming Pool",
        distance: "5 min walk",
        description: "Chemical-free pool filtered by forest plants"
      },
      {
        name: "Observatory Deck",
        distance: "3 min walk",
        description: "Professional telescope setup for astronomy experiences"
      }
    ],
    experiences: [
      { name: "Personal Nature Concierge", description: "Dedicated guide for customized forest experiences", included: true },
      { name: "Gourmet Forest Picnic", description: "Private dining experience in secluded forest clearing", included: true },
      { name: "Stargazing Session", description: "Professional astronomy guide with high-end telescopes", included: true },
      { name: "Sunrise Helicopter Tour", description: "Aerial view of the forest conservation area", included: false },
      { name: "Private Chef Experience", description: "In-loft cooking demonstration and meal preparation", included: false },
      { name: "Forest Bathing Ceremony", description: "Traditional Japanese shinrin-yoku with certified guide", included: false }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
};

export default function RoomDetail() {
  const params = useParams();
  const [room, setRoom] = useState<typeof roomsData[string] | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState<{checkIn: string, checkOut: string}>({
    checkIn: '',
    checkOut: ''
  });

  useEffect(() => {
    const roomId = params.id as string;
    const roomData = roomsData[roomId];
    if (roomData) {
      setRoom(roomData);
    }
  }, [params.id]);

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-primary mb-4">Room Not Found</h1>
          <p className="text-text mb-8">The room you're looking for doesn't exist.</p>
          <Link href="/rooms">
            <button className="luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary px-8 py-4 rounded-full font-semibold hover-lift">
              Back to Rooms
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.gallery.length) % room.gallery.length);
  };

  const handleDateSelect = (checkIn: string, checkOut: string) => {
    setSelectedDates({ checkIn, checkOut });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Gallery Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={room.gallery[currentImageIndex]}
            alt={room.name}
            fill
            className="object-cover transition-all duration-1000"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Gallery Navigation */}
        <button
          onClick={prevImage}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 glass-effect p-3 rounded-full text-white hover:bg-white/20 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 glass-effect p-3 rounded-full text-white hover:bg-white/20 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Gallery Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {room.gallery.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="fade-in-up">
              <div className="flex items-center justify-center mb-4">
                <Link href="/rooms" className="text-accent hover:text-white transition-colors mr-4">
                  <ChevronLeft className="w-5 h-5 inline mr-1" />
                  Back to Rooms
                </Link>
                <span className="text-accent text-sm tracking-widest uppercase font-medium">{room.type}</span>
              </div>
              <h1 className="font-heading text-6xl md:text-8xl font-bold mb-6 text-white text-shadow-luxury">
                {room.name}
              </h1>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto">
                {room.description}
              </p>
              <div className="mt-8 flex items-center justify-center space-x-6 text-white">
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>{room.size}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-current text-accent" />
                  <span>Premium Suite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Details Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Description */}
              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">About This Suite</h2>
                <div className="w-16 h-px bg-accent mb-6"></div>
                <div className="text-text leading-relaxed space-y-4">
                  {room.fullDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Room Features */}
              <div>
                <h3 className="font-heading text-2xl text-primary mb-6">Room Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {room.roomFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-heading text-2xl text-primary mb-6">Premium Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Wifi className="w-6 h-6 text-accent" />
                    <span className="text-text">High-Speed WiFi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bath className="w-6 h-6 text-accent" />
                    <span className="text-text">Luxury Bathroom</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bed className="w-6 h-6 text-accent" />
                    <span className="text-text">Premium Bedding</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Coffee className="w-6 h-6 text-accent" />
                    <span className="text-text">Mini Bar</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Trees className="w-6 h-6 text-accent" />
                    <span className="text-text">Forest Views</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mountain className="w-6 h-6 text-accent" />
                    <span className="text-text">Private Deck</span>
                  </div>
                </div>
              </div>

              {/* Experiences */}
              <div>
                <h3 className="font-heading text-2xl text-primary mb-6">Included Experiences</h3>
                <div className="space-y-4">
                  {room.experiences.map((experience, index) => (
                    <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg ${experience.included ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${experience.included ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {experience.included ? (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-white text-xs">+</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">{experience.name}</h4>
                        <p className="text-text text-sm">{experience.description}</p>
                        {!experience.included && (
                          <span className="text-accent text-xs font-medium">Available for additional cost</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Attractions */}
              <div>
                <h3 className="font-heading text-2xl text-primary mb-6">Nearby Attractions</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {room.nearbyAttractions.map((attraction, index) => (
                    <div key={index} className="luxury-border rounded-2xl p-6 bg-background">
                      <div className="flex items-center space-x-3 mb-3">
                        <Sun className="w-5 h-5 text-accent" />
                        <h4 className="font-heading text-lg text-primary">{attraction.name}</h4>
                      </div>
                      <div className="text-accent text-sm font-medium mb-2">{attraction.distance}</div>
                      <p className="text-text text-sm">{attraction.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Pricing Card */}
                <div className="luxury-border rounded-2xl p-6 bg-white shadow-xl">
                  <div className="text-center mb-6">
                    <div className="font-heading text-4xl text-primary">₹{room.price_per_night.toLocaleString()}</div>
                    <div className="text-text">per night</div>
                  </div>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="w-full luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary py-4 rounded-full text-lg font-semibold hover-lift hover:scale-105 transition-all duration-300"
                    >
                      Book This Suite
                    </button>
                    <div className="text-center">
                      <span className="text-text text-sm">Free cancellation • Best rate guarantee</span>
                    </div>
                  </div>
                </div>

                {/* Availability Calendar */}
                <AvailabilityCalendar 
                  roomId={room.id}
                  onDateSelect={handleDateSelect}
                  selectedCheckIn={selectedDates.checkIn}
                  selectedCheckOut={selectedDates.checkOut}
                />

                {/* Contact Card */}
                <div className="luxury-border rounded-2xl p-6 bg-primary text-white">
                  <h4 className="font-heading text-lg mb-4">Need Assistance?</h4>
                  <p className="text-sm mb-4 opacity-90">
                    Speak with our luxury travel specialists
                  </p>
                  <div className="space-y-3">
                    <a 
                      href="tel:+919876543210"
                      className="flex items-center space-x-2 text-sm hover:text-accent transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>+91 98765 43210</span>
                    </a>
                    <a 
                      href="https://wa.me/919876543210?text=Hi! I'm interested in booking the Forest Villa."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm hover:text-accent transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.704"/>
                      </svg>
                      <span>WhatsApp Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Rooms */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl text-primary mb-4">Other Luxury Suites</h2>
            <div className="w-16 h-px bg-accent mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {Object.values(roomsData)
              .filter(r => r.id !== room.id)
              .slice(0, 2)
              .map((otherRoom) => (
                <div key={otherRoom.id} className="luxury-border rounded-3xl overflow-hidden bg-white shadow-xl hover-lift">
                  <div className="relative h-64">
                    <Image
                      src={otherRoom.image || '/images/default-room.jpg'}
                      alt={otherRoom.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-xl text-primary">{otherRoom.name}</h3>
                      <span className="text-lg font-semibold text-accent">₹{otherRoom.price_per_night.toLocaleString()}</span>
                    </div>
                    <p className="text-text text-sm mb-4">{otherRoom.description}</p>
                    <Link href={`/rooms/${otherRoom.id}`}>
                      <button className="w-full luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary py-3 rounded-full font-semibold hover-lift transition-all duration-300">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
      
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        room={room}
      />
    </div>
  );
}