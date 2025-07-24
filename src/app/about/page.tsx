import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/4.jpg"
            alt="About Trails of Teak"
            fill
            className="object-cover scale-105 parallax-slow"
            priority
          />
        </div>
        <div className="absolute inset-0 luxury-gradient"></div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-6xl mx-auto">
            <div className="fade-in-up stagger-1">
              <span className="text-accent text-sm tracking-widest uppercase font-medium mb-4 block">Our Story</span>
              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold mb-8 text-white text-shadow-luxury tracking-wide">
                ABOUT US
              </h1>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-4xl mx-auto">
                Where ancient wisdom meets modern luxury, creating an extraordinary sanctuary 
                that honors both nature and the discerning traveler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent text-sm tracking-widest uppercase font-medium block mb-4">Heritage</span>
              <h2 className="font-heading text-4xl md:text-5xl text-primary mb-8">
                Born from a Vision of Harmony
              </h2>
              <div className="w-16 h-px bg-accent mb-8"></div>
              
              <div className="space-y-6 text-text leading-relaxed">
                <p>
                  Trails of Teak was born from a profound vision: to create a sanctuary where luxury and sustainability coexist in perfect harmony. Founded by environmental conservationists and hospitality pioneers, our resort represents more than just a destination—it's a testament to what's possible when human comfort aligns with nature's wisdom.
                </p>
                <p>
                  Nestled within pristine forest conservation areas, every aspect of our resort has been carefully crafted to minimize our environmental footprint while maximizing your connection to the natural world. From our renewable energy systems to our organic gardens, we prove that luxury and responsibility can flourish together.
                </p>
                <p>
                  Our name reflects our commitment: Trails that wind through ancient forests, and Teak—the noble wood that represents strength, beauty, and enduring value. Like the mighty teak trees that surround us, we stand as guardians of the forest while providing shelter and comfort to those who seek refuge in nature's embrace.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden">
                <Image
                  src="/images/room-bed.jpg"
                  alt="Our Heritage"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary rounded-full opacity-15"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-r from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent text-sm tracking-widest uppercase font-medium block mb-4">Our Values</span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary mb-8">
              What Defines Us
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-text max-w-3xl mx-auto leading-relaxed">
              Our core values guide every decision, from the design of our spaces to the experiences we create for our guests.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="luxury-border rounded-3xl p-8 bg-white shadow-xl hover-lift text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-primary mb-4">Environmental Stewardship</h3>
              <p className="text-text leading-relaxed">
                We are guardians of the pristine ecosystems that surround us, ensuring that our presence enhances rather than diminishes the natural world.
              </p>
            </div>

            <div className="luxury-border rounded-3xl p-8 bg-white shadow-xl hover-lift text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-primary mb-4">Authentic Experiences</h3>
              <p className="text-text leading-relaxed">
                Every experience is crafted to be genuine and meaningful, connecting guests with local culture, traditions, and the natural environment.
              </p>
            </div>

            <div className="luxury-border rounded-3xl p-8 bg-white shadow-xl hover-lift text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-primary mb-4">Continuous Learning</h3>
              <p className="text-text leading-relaxed">
                We believe in constant growth and improvement, learning from our guests, our environment, and each other to create ever-better experiences.
              </p>
            </div>

            <div className="luxury-border rounded-3xl p-8 bg-white shadow-xl hover-lift text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-primary mb-4">Community Partnership</h3>
              <p className="text-text leading-relaxed">
                We work hand-in-hand with local communities, supporting local artisans, farmers, and businesses while preserving cultural heritage.
              </p>
            </div>

            <div className="luxury-border rounded-3xl p-8 bg-white shadow-xl hover-lift text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-primary mb-4">Uncompromising Quality</h3>
              <p className="text-text leading-relaxed">
                From our sustainable architecture to our personalized service, we maintain the highest standards in everything we do.
              </p>
            </div>

            <div className="luxury-border rounded-3xl p-8 bg-white shadow-xl hover-lift text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-primary mb-4">Holistic Wellness</h3>
              <p className="text-text leading-relaxed">
                We nurture the complete well-being of our guests through spaces and experiences that restore mind, body, and spirit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent text-sm tracking-widest uppercase font-medium block mb-4">Sustainability</span>
              <h2 className="font-heading text-4xl md:text-5xl mb-8">
                Our Commitment to Tomorrow
              </h2>
              <div className="w-16 h-px bg-accent mb-8"></div>
              
              <div className="space-y-6 leading-relaxed">
                <p>
                  Sustainability isn't just a practice at Trails of Teak—it's our foundation. Every decision we make is guided by our commitment to preserving the natural world for future generations while providing unparalleled luxury experiences today.
                </p>
                <p>
                  Our resort operates entirely on renewable energy, sources food from our organic gardens and local farmers, and maintains a zero-waste policy. Water conservation systems ensure we protect this precious resource, while our building materials are sourced responsibly and locally.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">100%</div>
                  <div className="text-sm opacity-90">Renewable Energy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">Zero</div>
                  <div className="text-sm opacity-90">Waste to Landfill</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">50%</div>
                  <div className="text-sm opacity-90">Water Recycled</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">95%</div>
                  <div className="text-sm opacity-90">Local Sourcing</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden">
                <Image
                  src="/images/3.jpg"
                  alt="Sustainability"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards and Recognition */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent text-sm tracking-widest uppercase font-medium block mb-4">Recognition</span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary mb-8">
              Awards & Certifications
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-text max-w-3xl mx-auto leading-relaxed">
              Our commitment to excellence and sustainability has been recognized by leading organizations worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-primary mb-2">EarthCheck Gold</h3>
              <p className="text-text text-sm">Certified for environmental responsibility and sustainable operations</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-primary mb-2">Travel + Leisure</h3>
              <p className="text-text text-sm">Best Eco-Resort in Asia 2023</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-primary mb-2">Green Key</h3>
              <p className="text-text text-sm">Leading environmental certification for hospitality</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-primary mb-2">TripAdvisor</h3>
              <p className="text-text text-sm">Travelers' Choice Best of the Best 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-accent to-yellow-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6">
            Experience Our Story
          </h2>
          <p className="text-xl text-primary/80 mb-8 leading-relaxed">
            Join us in creating memories that honor both luxury and legacy. 
            Discover what it means to stay where every moment matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/rooms"
              className="luxury-border bg-primary text-white px-12 py-4 rounded-full text-lg font-semibold hover-lift hover:scale-105 transition-all duration-300"
            >
              Explore Our Suites
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hi! I'd like to learn more about Trails of Teak and plan my stay."
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-primary text-primary px-12 py-4 rounded-full text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300"
            >
              Plan Your Visit
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}