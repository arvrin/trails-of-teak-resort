import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

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

      {/* Real-time Availability Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent text-sm tracking-widest uppercase font-medium block mb-4">Real-Time Availability</span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6">
              Check Availability & Book
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-text max-w-3xl mx-auto leading-relaxed">
              Select your preferred dates to see real-time availability across all our luxury accommodations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <AvailabilityCalendar />
            </div>
            
            <div className="space-y-6">
              <div className="luxury-border rounded-2xl p-8 bg-background">
                <h3 className="font-heading text-2xl text-primary mb-6">Quick Booking Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-accent rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Instant Confirmation</h4>
                      <p className="text-text text-sm">Get immediate booking confirmation with real-time availability</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-accent rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Best Rate Guarantee</h4>
                      <p className="text-text text-sm">Book direct for the lowest rates and exclusive perks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-accent rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Flexible Cancellation</h4>
                      <p className="text-text text-sm">Free cancellation up to 48 hours before arrival</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-accent rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">24/7 Support</h4>
                      <p className="text-text text-sm">Round-the-clock assistance via WhatsApp or phone</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-divider">
                  <Link href="/rooms">
                    <button className="w-full luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary py-4 rounded-full text-lg font-semibold hover-lift hover:scale-105 transition-all duration-300">
                      View All Rooms & Suites
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="luxury-border rounded-2xl p-6 bg-primary text-white text-center">
                <h4 className="font-heading text-lg mb-2">Need Help Choosing?</h4>
                <p className="text-sm opacity-90 mb-4">
                  Speak with our luxury travel concierge
                </p>
                <a 
                  href="https://wa.me/919876543210?text=Hi! I'd like help choosing the perfect room for my stay at Trails of Teak."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-accent hover:text-white transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.704"/>
                  </svg>
                  <span>Chat Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews Section */}
      <section className="py-24 bg-gradient-to-r from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent text-sm tracking-widest uppercase font-medium block mb-4">Guest Reviews</span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6">
              What Our Guests Say
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-text max-w-3xl mx-auto leading-relaxed">
              Discover why travelers from around the world choose Trails of Teak for their luxury eco-retreat experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="luxury-border rounded-3xl p-8 bg-white shadow-xl hover-lift">
              <div className="flex items-center mb-6">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-text">5.0 Rating</span>
              </div>
              <blockquote className="text-text mb-6 leading-relaxed">
                "An absolutely magical experience! The perfect blend of luxury and nature. The staff went above and beyond to make our anniversary special. We can't wait to return!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-primary">Ananya & Rajesh</div>
                  <div className="text-sm text-text">Mumbai • Anniversary Trip</div>
                </div>
              </div>
            </div>

            <div className="luxury-border rounded-3xl p-8 bg-white shadow-xl hover-lift">
              <div className="flex items-center mb-6">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-text">5.0 Rating</span>
              </div>
              <blockquote className="text-text mb-6 leading-relaxed">
                "The sustainability practices here are incredible! Beautiful eco-architecture, organic food, and genuine commitment to preserving the environment. Highly recommended!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                  M
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-primary">Michael Johnson</div>
                  <div className="text-sm text-text">California • Solo Retreat</div>
                </div>
              </div>
            </div>

            <div className="luxury-border rounded-3xl p-8 bg-white shadow-xl hover-lift">
              <div className="flex items-center mb-6">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-text">5.0 Rating</span>
              </div>
              <blockquote className="text-text mb-6 leading-relaxed">
                "Perfect family getaway! Kids loved the nature activities while adults enjoyed the spa and peaceful environment. Excellent service and attention to detail."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                  P
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-primary">Priya & Family</div>
                  <div className="text-sm text-text">Bangalore • Family Vacation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Quote */}
          <div className="luxury-border rounded-3xl p-12 bg-white shadow-2xl text-center">
            <div className="text-6xl text-accent mb-8">&ldquo;</div>
            <blockquote className="font-heading text-3xl md:text-4xl text-primary mb-8 leading-relaxed">
              A sanctuary where time stands still and the soul finds its rhythm with nature
            </blockquote>
            <div className="w-24 h-px bg-accent mx-auto mb-6"></div>
            <cite className="text-text text-lg">— Travel & Leisure Magazine</cite>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent mb-2">4.9/5</div>
              <div className="text-sm text-text">Guest Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-sm text-text">Happy Guests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">98%</div>
              <div className="text-sm text-text">Return Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">100%</div>
              <div className="text-sm text-text">Eco-Certified</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
