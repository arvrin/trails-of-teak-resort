'use client';

import { useState } from 'react';
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, Phone, MessageCircle, Mail } from 'lucide-react';

const faqCategories = [
  {
    id: 'booking',
    title: 'Booking & Reservations',
    faqs: [
      {
        question: 'How can I make a reservation?',
        answer: 'You can make a reservation through our website by selecting your desired room and dates, or by calling us directly at +91 98765 43210. You can also WhatsApp us for instant assistance.'
      },
      {
        question: 'What is your cancellation policy?',
        answer: 'Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a one-night charge. No-shows will be charged the full amount.'
      },
      {
        question: 'Do I need to pay in advance?',
        answer: 'We require a 30% advance payment to confirm your booking. The remaining amount can be paid at the time of check-in or check-out.'
      },
      {
        question: 'Can I modify my booking dates?',
        answer: 'Yes, you can modify your booking dates subject to availability. Changes made more than 48 hours before check-in are free. Changes within 48 hours may incur charges.'
      },
      {
        question: 'Do you offer group booking discounts?',
        answer: 'Yes, we offer special rates for groups of 5 or more rooms. Please contact us directly for customized group packages and pricing.'
      }
    ]
  },
  {
    id: 'rooms',
    title: 'Rooms & Amenities',
    faqs: [
      {
        question: 'What amenities are included in each room?',
        answer: 'All our rooms include complimentary Wi-Fi, air conditioning, tea/coffee making facilities, minibar, premium bedding, and stunning forest views. Specific amenities vary by room type.'
      },
      {
        question: 'Are the rooms eco-friendly?',
        answer: 'Absolutely! Our rooms are built with sustainable materials, feature energy-efficient systems, and use eco-friendly amenities. We are committed to minimizing our environmental impact.'
      },
      {
        question: 'Can I request specific room preferences?',
        answer: 'Yes, you can make special requests such as higher floor, specific view, or room location. While we cannot guarantee specific room assignments, we will do our best to accommodate your preferences.'
      },
      {
        question: 'Is room service available?',
        answer: 'Yes, we offer 24/7 room service with a curated menu featuring local and international cuisine, prepared with organic ingredients sourced locally.'
      }
    ]
  },
  {
    id: 'checkin',
    title: 'Check-in & Check-out',
    faqs: [
      {
        question: 'What are your check-in and check-out times?',
        answer: 'Check-in is from 2:00 PM and check-out is until 11:00 AM. Early check-in and late check-out are subject to availability and may incur additional charges.'
      },
      {
        question: 'What documents do I need for check-in?',
        answer: 'You will need a valid government-issued photo ID (passport, driver\'s license, or Aadhar card) and the credit card used for booking (if applicable).'
      },
      {
        question: 'Can I store my luggage after check-out?',
        answer: 'Yes, we offer complimentary luggage storage for guests who want to explore the area after check-out. Our concierge will be happy to assist you.'
      },
      {
        question: 'Do you provide airport/station transfers?',
        answer: 'Yes, we offer transfer services from nearby airports and railway stations. Please contact us in advance to arrange transportation at competitive rates.'
      }
    ]
  },
  {
    id: 'facilities',
    title: 'Resort Facilities',
    faqs: [
      {
        question: 'What recreational activities do you offer?',
        answer: 'We offer guided nature walks, bird watching, meditation sessions, yoga classes, organic farming experiences, spa treatments, and cultural programs with local artisans.'
      },
      {
        question: 'Do you have a spa?',
        answer: 'Yes, our spa offers traditional Ayurvedic treatments, therapeutic massages, and wellness therapies using natural, locally-sourced ingredients in a serene forest setting.'
      },
      {
        question: 'Is there a restaurant on-site?',
        answer: 'Yes, our restaurant serves farm-to-table cuisine featuring organic ingredients from our own garden and local suppliers. We cater to various dietary requirements including vegan and gluten-free options.'
      },
      {
        question: 'Do you have facilities for events or meetings?',
        answer: 'Yes, we offer intimate spaces for small conferences, workshops, and special events. Our team can help you plan everything from corporate retreats to wedding celebrations.'
      }
    ]
  },
  {
    id: 'policies',
    title: 'Policies & Guidelines',
    faqs: [
      {
        question: 'Is smoking allowed on the property?',
        answer: 'Trails of Teak is a completely smoke-free property. Smoking is not permitted anywhere on the premises to maintain our pristine natural environment.'
      },
      {
        question: 'What is your pet policy?',
        answer: 'We welcome well-behaved pets with prior notification. A pet fee applies, and we ask that pets are kept leashed in common areas and not left unattended in rooms.'
      },
      {
        question: 'Do you have age restrictions?',
        answer: 'We welcome guests of all ages. Children under 12 stay free when sharing with parents. We provide special amenities and activities for younger guests.'
      },
      {
        question: 'What safety measures do you have in place?',
        answer: 'We have 24/7 security, CCTV monitoring, first aid facilities, and trained staff. All COVID-19 safety protocols are strictly followed for guest and staff safety.'
      }
    ]
  },
  {
    id: 'local',
    title: 'Local Area & Transportation',
    faqs: [
      {
        question: 'What attractions are nearby?',
        answer: 'We are surrounded by pristine forests, ancient temples, local artisan villages, waterfalls, and hiking trails. Our concierge can arrange guided tours to explore the rich cultural and natural heritage of the region.'
      },
      {
        question: 'How do I reach the resort?',
        answer: 'We are easily accessible by road from major cities. The nearest railway station is 45 minutes away, and the nearest airport is 2 hours. We provide detailed directions and can arrange transfers.'
      },
      {
        question: 'Is parking available?',
        answer: 'Yes, we provide complimentary parking for all guests. Our parking area is secure and well-lit, surrounded by beautiful landscaping.'
      },
      {
        question: 'Can you arrange local sightseeing?',
        answer: 'Absolutely! Our concierge team can arrange customized tours, local guide services, and transportation to explore temples, villages, nature spots, and cultural sites in the region.'
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('booking');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const activeCategoryData = faqCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/4.jpg"
            alt="FAQ"
            fill
            className="object-cover scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 luxury-gradient"></div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="fade-in-up stagger-1">
              <span className="text-accent text-sm tracking-widest uppercase font-medium mb-4 block">Support</span>
              <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-white text-shadow-luxury">
                Frequently Asked Questions
              </h1>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto">
                Find answers to common questions about your stay at Trails of Teak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="font-heading text-xl text-primary mb-6">Categories</h3>
                <nav className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeCategory === category.id
                          ? 'bg-accent text-white shadow-lg'
                          : 'text-text hover:bg-accent/10 hover:text-accent'
                      }`}
                    >
                      {category.title}
                    </button>
                  ))}
                </nav>

                {/* Contact Support */}
                <div className="mt-8 p-6 bg-primary rounded-2xl text-white">
                  <h4 className="font-heading text-lg mb-4">Still have questions?</h4>
                  <p className="text-sm mb-4 opacity-90">
                    Our team is here to help you 24/7
                  </p>
                  <div className="space-y-3">
                    <a 
                      href="https://wa.me/919876543210" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm hover:text-accent transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Us</span>
                    </a>
                    <a 
                      href="tel:+919876543210"
                      className="flex items-center space-x-2 text-sm hover:text-accent transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>+91 98765 43210</span>
                    </a>
                    <a 
                      href="mailto:info@trailsofteak.com"
                      className="flex items-center space-x-2 text-sm hover:text-accent transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email Support</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              {activeCategoryData && (
                <>
                  <div className="mb-8">
                    <h2 className="font-heading text-3xl text-primary mb-4">
                      {activeCategoryData.title}
                    </h2>
                    <div className="w-16 h-px bg-accent"></div>
                  </div>

                  <div className="space-y-4">
                    {activeCategoryData.faqs.map((faq, index) => (
                      <div 
                        key={index}
                        className="border border-divider rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                      >
                        <button
                          onClick={() => toggleFAQ(index)}
                          className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-background transition-colors duration-300"
                        >
                          <h3 className="font-medium text-primary text-lg pr-4">
                            {faq.question}
                          </h3>
                          {openFAQ === index ? (
                            <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-text flex-shrink-0" />
                          )}
                        </button>
                        
                        {openFAQ === index && (
                          <div className="px-6 pb-6">
                            <div className="h-px bg-divider mb-4"></div>
                            <p className="text-text leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl mb-6">
            Ready to Experience Trails of Teak?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your sustainable luxury getaway today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/rooms"
              className="luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary px-8 py-4 rounded-full text-lg font-semibold hover-lift hover:scale-105 transition-all duration-300"
            >
              View Rooms & Book
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300"
            >
              Chat with Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}