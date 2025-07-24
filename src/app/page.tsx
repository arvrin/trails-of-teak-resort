import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Full Screen Luxury */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/2.jpg"
            alt="Trails of Teak Resort"
            fill
            className="object-cover scale-105 parallax-slow"
            priority
          />
        </div>
        <div className="absolute inset-0 luxury-gradient"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 glass-effect rounded-full p-4 floating-animation hidden lg:block">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
        </div>
        <div className="absolute bottom-32 left-16 glass-effect rounded-full p-6 floating-animation hidden lg:block" style={{animationDelay: '2s'}}>
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-6xl mx-auto">
            <div className="fade-in-up stagger-1">
              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold mb-8 text-white text-shadow-luxury tracking-wide">
                TRAILS OF TEAK
              </h1>
            </div>
            <div className="fade-in-up stagger-2">
              <div className="flex items-center justify-center mb-8">
                <div className="h-px bg-accent w-20"></div>
                <p className="text-2xl md:text-3xl mx-6 text-accent font-light tracking-wider">
                  STAY | BREATHE | WANDER
                </p>
                <div className="h-px bg-accent w-20"></div>
              </div>
            </div>
            <div className="fade-in-up stagger-3">
              <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-white font-light leading-relaxed">
                Where ancient forests whisper tales of serenity and modern luxury embraces the soul of nature. 
                Discover your sanctuary in the heart of pristine wilderness.
              </p>
            </div>
            <div className="fade-in-up stagger-3">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/rooms">
                  <button className="luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary px-12 py-4 rounded-full text-lg font-semibold hover-lift transform transition-all duration-300 hover:scale-105">
                    Discover Luxury
                  </button>
                </Link>
                <Link href="/gallery">
                  <button className="glass-effect text-white px-12 py-4 rounded-full text-lg font-medium hover-lift border border-white/30">
                    Virtual Tour
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70">
          <div className="flex flex-col items-center">
            <span className="text-sm tracking-wider mb-2">EXPLORE</span>
            <div className="w-px h-8 bg-white animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Luxury Experience Section */}
      <section className="py-24 bg-gradient-to-b from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-accent text-sm tracking-widest uppercase font-medium">Experience</span>
            <h2 className="font-heading text-5xl md:text-6xl text-primary mb-6 mt-4">
              Unparalleled Luxury
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            <p className="text-text text-xl max-w-4xl mx-auto leading-relaxed">
              Every moment at Trails of Teak is crafted to transcend the ordinary. 
              From the whisper of wind through ancient trees to the warmth of handcrafted teak interiors.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12 mb-20">
            <div className="text-center group hover-lift">
              <div className="luxury-border rounded-2xl p-8 bg-white shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h3 className="font-heading text-2xl text-primary mb-4">Forest Sanctuary</h3>
                <p className="text-text leading-relaxed">Awaken to symphonies of nature in rooms that float among treetops, where luxury meets the wild heart of the forest.</p>
              </div>
            </div>
            <div className="text-center group hover-lift">
              <div className="luxury-border rounded-2xl p-8 bg-white shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h3 className="font-heading text-2xl text-primary mb-4">Artisan Crafted</h3>
                <p className="text-text leading-relaxed">Every surface tells a story, from handcrafted teak furnishings to stone basins carved by master artisans.</p>
              </div>
            </div>
            <div className="text-center group hover-lift">
              <div className="luxury-border rounded-2xl p-8 bg-white shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h3 className="font-heading text-2xl text-primary mb-4">Sustainable Elegance</h3>
                <p className="text-text leading-relaxed">Luxury that honors the earth, with eco-conscious practices that preserve paradise for generations to come.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Immersive Gallery Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent text-sm tracking-widest uppercase font-medium">Gallery</span>
            <h2 className="font-heading text-5xl md:text-6xl text-white mb-6 mt-4">
              Moments of Magic
            </h2>
            <div className="w-24 h-px bg-accent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden hover-lift group">
              <Image
                src="/images/room-bed.jpg"
                alt="Luxury Suite"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-heading text-lg">Forest Suite</h4>
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden hover-lift group">
              <Image
                src="/images/2.jpg"
                alt="Resort Architecture"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-heading text-lg">Architecture</h4>
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden hover-lift group">
              <Image
                src="/images/3.jpg"
                alt="Natural Setting"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-heading text-lg">Natural Beauty</h4>
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden hover-lift group">
              <Image
                src="/images/4.jpg"
                alt="Evening Ambiance"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-heading text-lg">Evening Magic</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-gradient-to-r from-background to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="luxury-border rounded-3xl p-12 bg-white shadow-2xl">
            <div className="text-6xl text-accent mb-8">"</div>
            <blockquote className="font-heading text-3xl md:text-4xl text-primary mb-8 leading-relaxed">
              A sanctuary where time stands still and the soul finds its rhythm with nature
            </blockquote>
            <div className="w-24 h-px bg-accent mx-auto mb-6"></div>
            <cite className="text-text text-lg">— Travel & Leisure Magazine</cite>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
