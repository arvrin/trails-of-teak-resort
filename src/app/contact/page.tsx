'use client';

import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: 'Room Reservation',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // Simulate form submission with more realistic delay
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        inquiryType: 'Room Reservation',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/4.jpg"
            alt="Contact Us"
            fill
            className="object-cover scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 luxury-gradient"></div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="fade-in-up stagger-1">
              <span className="text-accent text-sm tracking-widest uppercase font-medium mb-4 block">Get in Touch</span>
              <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-white text-shadow-luxury">
                Contact Us
              </h1>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto">
                Begin your journey to tranquility. Our concierge team is ready to craft your perfect forest retreat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <span className="text-accent text-sm tracking-widest uppercase font-medium">Information</span>
                <h2 className="font-heading text-4xl md:text-5xl text-primary mt-2 mb-8">
                  Connect With Us
                </h2>
                <div className="w-16 h-px bg-accent mb-8"></div>
                <p className="text-text text-lg leading-relaxed">
                  Whether planning a romantic getaway, corporate retreat, or soul-searching journey, 
                  our dedicated team ensures every detail exceeds your expectations.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="luxury-border rounded-full p-4 bg-white">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-primary mb-2">Location</h3>
                    <p className="text-text">
                      Forest Reserve Road<br />
                      Pristine Wilderness, Western Ghats<br />
                      Karnataka 576101, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="luxury-border rounded-full p-4 bg-white">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-primary mb-2">Phone</h3>
                    <p className="text-text">
                      Reservations: +91 98765 43210<br />
                      Concierge: +91 98765 43211<br />
                      WhatsApp: +91 98765 43212
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="luxury-border rounded-full p-4 bg-white">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-primary mb-2">Email</h3>
                    <p className="text-text">
                      Reservations: book@trailsofteak.com<br />
                      General: info@trailsofteak.com<br />
                      Events: events@trailsofteak.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="luxury-border rounded-full p-4 bg-white">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-primary mb-2">Hours</h3>
                    <p className="text-text">
                      Check-in: 2:00 PM<br />
                      Check-out: 12:00 PM<br />
                      Concierge: 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="luxury-border rounded-3xl p-8 bg-white shadow-2xl">
              <div className="mb-8">
                <h3 className="font-heading text-3xl text-primary mb-4">Send us a Message</h3>
                <div className="w-16 h-px bg-accent mb-4"></div>
                <p className="text-text">Share your dreams with us, and we'll help bring them to life in nature's embrace.</p>
              </div>

{success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-600 text-sm">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text font-medium mb-2">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-text font-medium mb-2">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-text font-medium mb-2">Email Address</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-text font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-text font-medium mb-2">Inquiry Type</label>
                  <select 
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
                  >
                    <option>Room Reservation</option>
                    <option>Event Planning</option>
                    <option>General Information</option>
                    <option>Corporate Retreat</option>
                    <option>Special Occasion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text font-medium mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Tell us about your ideal forest retreat experience..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary py-4 rounded-full text-lg font-semibold hover-lift hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent text-sm tracking-widest uppercase font-medium">Location</span>
            <h2 className="font-heading text-5xl md:text-6xl text-white mb-6 mt-4">
              Find Your Way to Paradise
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            <p className="text-white text-xl max-w-3xl mx-auto opacity-90">
              Nestled deep within pristine forests, yet accessible by scenic mountain roads. 
              The journey to tranquility begins the moment you start traveling to us.
            </p>
          </div>
          
          <div className="luxury-border rounded-3xl overflow-hidden bg-white shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl text-primary mb-2">Interactive Map Coming Soon</h3>
                <p className="text-text">Detailed directions and landmarks will be provided upon reservation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}