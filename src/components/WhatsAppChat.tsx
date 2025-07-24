'use client';

import { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

interface WhatsAppChatProps {
  phoneNumber?: string;
}

export default function WhatsAppChat({ phoneNumber = "919876543210" }: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsApp = (message: string = '') => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const quickMessages = [
    {
      title: "Check Availability",
      message: "Hi! I'd like to check room availability for my dates. Can you help me?"
    },
    {
      title: "Get Room Pricing",
      message: "Hello! Could you please share the current room rates and packages?"
    },
    {
      title: "Book a Room",
      message: "Hi! I'm interested in making a reservation. Can you assist me with the booking process?"
    },
    {
      title: "Ask About Amenities",
      message: "Hello! I'd like to know more about the resort amenities and services available."
    },
    {
      title: "Special Requests",
      message: "Hi! I have some special requirements for my stay. Can we discuss the details?"
    }
  ];

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center space-x-2 group"
            aria-label="Open WhatsApp Chat"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="hidden group-hover:block whitespace-nowrap text-sm font-medium pr-2">
              Chat with us
            </span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-w-sm">
            {/* Header */}
            <div className="bg-[#25D366] text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-semibold">Trails of Teak</h3>
                  <p className="text-xs opacity-90">Usually replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Messages */}
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">
                How can we help you today? Choose a quick option or start typing:
              </p>
              
              <div className="space-y-2 mb-4">
                {quickMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => openWhatsApp(msg.message)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-[#D3A24F]/10 rounded-lg transition-colors text-sm border border-gray-200 hover:border-[#D3A24F]/30"
                  >
                    {msg.title}
                  </button>
                ))}
              </div>

              {/* Direct Chat Button */}
              <button
                onClick={() => openWhatsApp()}
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white p-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start Chat</span>
              </button>

              {/* Call Option */}
              <button
                onClick={() => window.open(`tel:+${phoneNumber}`, '_self')}
                className="w-full mt-2 bg-[#1E3D34] hover:bg-[#2D5247] text-white p-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                We typically respond within minutes during business hours (9 AM - 9 PM IST)
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}