'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // Simulate newsletter subscription
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribeSuccess(true);
      setEmail('');
      setTimeout(() => setSubscribeSuccess(false), 3000);
    }, 1000);
  };

  return (
    <footer className="relative bg-primary overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-accent via-yellow-400 to-accent"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] repeat"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <Image
                    src="/images/logo.png"
                    alt="Trails of Teak Resort"
                    width={48}
                    height={48}
                    className="h-12 w-12 brightness-0 invert object-contain"
                    priority
                  />
                </div>
                <div>
                  <h3 className="font-heading text-2xl text-white font-bold">TRAILS OF TEAK</h3>
                  <p className="text-accent text-sm tracking-[0.2em] uppercase font-medium">LUXURY ECO RESORT</p>
                </div>
              </div>
              
              <p className="text-white/90 text-base leading-relaxed">
                Where ancient forests meet modern luxury. Experience sustainable hospitality in harmony with nature&apos;s splendor.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/trailsofteak" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Follow us on Facebook"
                  className="group bg-white/10 backdrop-blur-sm hover:bg-accent rounded-full p-3 border border-white/20 hover:border-accent transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-white group-hover:text-primary transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com/trailsofteak" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Follow us on Twitter"
                  className="group bg-white/10 backdrop-blur-sm hover:bg-accent rounded-full p-3 border border-white/20 hover:border-accent transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-white group-hover:text-primary transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/trailsofteak" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Follow us on Instagram"
                  className="group bg-white/10 backdrop-blur-sm hover:bg-accent rounded-full p-3 border border-white/20 hover:border-accent transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-white group-hover:text-primary transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://pinterest.com/trailsofteak" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Follow us on Pinterest"
                  className="group bg-white/10 backdrop-blur-sm hover:bg-accent rounded-full p-3 border border-white/20 hover:border-accent transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-white group-hover:text-primary transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017 0z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-8">
              <div>
                <h4 className="font-heading text-lg text-white font-bold uppercase tracking-wider mb-4 relative">
                  EXPLORE
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent"></div>
                </h4>
                <nav className="space-y-3">
                  <Link href="/rooms" className="block text-white/80 hover:text-accent transition-colors duration-300 text-sm">
                    Luxury Accommodations
                  </Link>
                  <Link href="/gallery" className="block text-white/80 hover:text-accent transition-colors duration-300 text-sm">
                    Resort Gallery
                  </Link>
                  <Link href="/contact" className="block text-white/80 hover:text-accent transition-colors duration-300 text-sm">
                    Contact & Location
                  </Link>
                  <Link href="/admin" className="block text-white/80 hover:text-accent transition-colors duration-300 text-sm">
                    Guest Services
                  </Link>
                </nav>
              </div>
            </div>

            {/* Experiences */}
            <div className="space-y-8">
              <div>
                <h4 className="font-heading text-lg text-white font-bold uppercase tracking-wider mb-4 relative">
                  EXPERIENCES
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent"></div>
                </h4>
                <div className="space-y-3">
                  <div className="text-white/80 text-sm">Forest Meditation</div>
                  <div className="text-white/80 text-sm">Canopy Walks</div>
                  <div className="text-white/80 text-sm">Artisan Breakfast</div>
                  <div className="text-white/80 text-sm">Nature Photography</div>
                  <div className="text-white/80 text-sm">Wellness Spa</div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h4 className="font-heading text-lg text-white font-bold uppercase tracking-wider mb-4 relative">
                  CONNECT
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent"></div>
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-white font-medium text-sm mb-1">Reservations</div>
                    <div className="text-white/80 text-sm">reservations@trailsofteak.com</div>
                    <div className="text-white/80 text-sm">+91 98765 43210</div>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm mb-1">Location</div>
                    <div className="text-white/80 text-sm">Forest Reserve, Western Ghats</div>
                    <div className="text-white/80 text-sm">Karnataka, India</div>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm mb-1">Hours</div>
                    <div className="text-white/80 text-sm">Check-in: 2:00 PM</div>
                    <div className="text-white/80 text-sm">Concierge: 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 pt-12 border-t border-white/20">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="font-heading text-2xl text-white font-bold mb-2">STAY CONNECTED</h3>
              <p className="text-white/80 text-base mb-8">Subscribe for exclusive offers and forest meditation guides</p>
              
              {subscribeSuccess && (
                <div className="mb-6 bg-accent/20 border border-accent/40 rounded-lg py-3 px-4">
                  <p className="text-white text-sm font-medium">✓ Thank you for subscribing to our newsletter!</p>
                </div>
              )}
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isSubscribing}
                  className="flex-1 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-accent focus:bg-white/20 transition-all duration-300 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isSubscribing || !email}
                  className="bg-gradient-to-r from-accent to-yellow-400 text-primary px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-accent/50"
                >
                  {isSubscribing ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <p className="text-white/60 text-xs">
                  © 2025 Trails of Teak Resort. All rights reserved.
                </p>
                <div className="flex space-x-4 text-xs">
                  <Link href="/privacy" className="text-white/60 hover:text-accent transition-colors duration-300">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-white/60 hover:text-accent transition-colors duration-300">
                    Terms of Service
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-xs font-medium">100% ECO-CERTIFIED RESORT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}