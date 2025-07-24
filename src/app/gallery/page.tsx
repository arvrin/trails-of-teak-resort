import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const galleryImages = [
  {
    src: "/images/2.jpg",
    title: "Resort Architecture",
    category: "Exterior"
  },
  {
    src: "/images/room-bed.jpg",
    title: "Forest Villa",
    category: "Rooms"
  },
  {
    src: "/images/2.jpg",
    title: "Evening Ambiance",
    category: "Exterior"
  },
  {
    src: "/images/3.jpg",
    title: "Natural Setting",
    category: "Nature"
  },
  {
    src: "/images/4.jpg",
    title: "Architectural Detail",
    category: "Exterior"
  },
  {
    src: "/images/7.jpg",
    title: "Forest Views",
    category: "Nature"
  },
  {
    src: "/images/room-bed-table.jpg",
    title: "Suite Interior",
    category: "Rooms"
  },
  {
    src: "/images/room-chairs.jpg",
    title: "Lounge Area",
    category: "Rooms"
  },
  {
    src: "/images/room1.jpg",
    title: "Bathroom Design",
    category: "Rooms"
  },
  {
    src: "/images/14.jpg",
    title: "Garden Path",
    category: "Nature"
  },
  {
    src: "/images/17.jpg",
    title: "Sunset Views",
    category: "Nature"
  }
];

const categories = ["All", "Rooms", "Exterior", "Nature"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/3.jpg"
            alt="Gallery"
            fill
            className="object-cover scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 luxury-gradient"></div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="fade-in-up stagger-1">
              <span className="text-accent text-sm tracking-widest uppercase font-medium mb-4 block">Visual Journey</span>
              <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-white text-shadow-luxury">
                Gallery
              </h1>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto">
                Discover the poetry of our spaces through curated moments of tranquility and luxury.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Filter */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`font-medium transition-all duration-300 py-3 px-6 border-b-2 hover-lift ${
                  activeCategory === category
                    ? 'text-accent border-accent bg-accent/10 rounded-t-lg'
                    : 'text-text hover:text-accent border-transparent hover:border-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden rounded-2xl hover-lift group cursor-pointer ${
                  index % 7 === 0 ? 'md:col-span-2 md:row-span-2 h-96 md:h-full' : 'h-64'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-accent text-xs tracking-widest uppercase font-medium block mb-1">
                      {image.category}
                    </span>
                    <h3 className="font-heading text-lg">{image.title}</h3>
                  </div>
                </div>
                
                {/* Zoom Icon */}
                <div 
                  className="absolute top-4 right-4 glass-effect rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => setSelectedImage(image.src)}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-green-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <span className="text-accent text-sm tracking-widest uppercase font-medium block mb-4">Experience</span>
            <h2 className="font-heading text-4xl md:text-5xl mb-8">
              Beyond Photography
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            <p className="text-xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
              These images capture just a glimpse of the magic that awaits. Come experience the full symphony 
              of sights, sounds, and sensations that make Trails of Teak unforgettable.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="glass-effect rounded-2xl p-8 hover-lift">
                <div className="text-3xl font-heading text-accent mb-4">360°</div>
                <h3 className="font-heading text-xl mb-2">Virtual Tours</h3>
                <p className="text-sm opacity-80">Explore every corner of our resort from anywhere in the world</p>
              </div>
              <div className="glass-effect rounded-2xl p-8 hover-lift">
                <div className="text-3xl font-heading text-accent mb-4">4K</div>
                <h3 className="font-heading text-xl mb-2">Time-lapse Videos</h3>
                <p className="text-sm opacity-80">Watch nature's daily dance of light and shadow</p>
              </div>
              <div className="glass-effect rounded-2xl p-8 hover-lift">
                <div className="text-3xl font-heading text-accent mb-4">∞</div>
                <h3 className="font-heading text-xl mb-2">Live Experiences</h3>
                <p className="text-sm opacity-80">Moments that can only be felt in person</p>
              </div>
            </div>
            
            <button className="luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary px-12 py-4 rounded-full text-xl font-semibold hover-lift hover:scale-105 transition-all duration-300">
              Plan Your Visit
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 glass-effect rounded-full p-3 text-white hover:bg-white/20 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative">
              <Image
                src={selectedImage}
                alt="Gallery Image"
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}