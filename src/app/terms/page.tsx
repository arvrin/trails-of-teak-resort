import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/2.jpg"
            alt="Terms of Service"
            fill
            className="object-cover scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 luxury-gradient"></div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <div className="fade-in-up stagger-1">
              <span className="text-accent text-sm tracking-widest uppercase font-medium mb-4 block">Legal</span>
              <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-white text-shadow-luxury">
                Terms of Service
              </h1>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto">
                Please read these terms carefully before using our services or making a reservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            <div className="mb-12">
              <p className="text-lg text-text leading-relaxed">
                <strong>Effective Date:</strong> January 1, 2024
              </p>
              <p className="text-lg text-text leading-relaxed">
                <strong>Last Updated:</strong> January 1, 2024
              </p>
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">1. Acceptance of Terms</h2>
                <p className="text-text leading-relaxed mb-4">
                  Welcome to Trails of Teak Resort. These Terms of Service ("Terms") govern your use of our website, services, and facilities. By making a reservation, using our website, or staying at our resort, you agree to be bound by these Terms.
                </p>
                <p className="text-text leading-relaxed">
                  If you do not agree to these Terms, please do not use our services or make reservations.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">2. Reservations and Bookings</h2>
                
                <h3 className="font-heading text-xl text-primary mb-4">2.1 Booking Process</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li>All reservations are subject to availability and confirmation</li>
                  <li>A valid credit card and government-issued ID are required</li>
                  <li>Guests must be 18 years or older to make a reservation</li>
                  <li>Special requests are subject to availability and cannot be guaranteed</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">2.2 Payment Terms</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li>30% advance payment required to confirm booking</li>
                  <li>Remaining balance due at check-in or check-out</li>
                  <li>All rates are subject to applicable taxes and fees</li>
                  <li>Prices may change without notice for future bookings</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">2.3 Group Bookings</h3>
                <p className="text-text leading-relaxed">
                  Group bookings (5+ rooms) are subject to separate terms and conditions. Special group rates and policies may apply.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">3. Cancellation and Modification Policy</h2>
                
                <h3 className="font-heading text-xl text-primary mb-4">3.1 Standard Cancellations</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li><strong>48+ hours before check-in:</strong> Free cancellation, full refund</li>
                  <li><strong>24-48 hours before check-in:</strong> One night charge applies</li>
                  <li><strong>Less than 24 hours or no-show:</strong> Full booking charge</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">3.2 Peak Season and Special Events</h3>
                <p className="text-text leading-relaxed mb-4">
                  Different cancellation policies may apply during peak seasons, festivals, and special events. These will be clearly communicated at the time of booking.
                </p>

                <h3 className="font-heading text-xl text-primary mb-4">3.3 Modifications</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2">
                  <li>Date changes subject to availability and rate differences</li>
                  <li>Modifications more than 48 hours before check-in are free</li>
                  <li>Last-minute changes may incur additional charges</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">4. Check-in and Check-out</h2>
                
                <h3 className="font-heading text-xl text-primary mb-4">4.1 Standard Times</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li><strong>Check-in:</strong> 2:00 PM onwards</li>
                  <li><strong>Check-out:</strong> Until 11:00 AM</li>
                  <li>Early check-in and late check-out subject to availability and fees</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">4.2 Required Documentation</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li>Valid government-issued photo identification</li>
                  <li>Credit card used for booking (if applicable)</li>
                  <li>Confirmation details and booking reference</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">4.3 Extended Stays</h3>
                <p className="text-text leading-relaxed">
                  Stays exceeding the maximum occupancy or extending beyond check-out time without authorization may result in additional charges.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">5. Resort Rules and Conduct</h2>
                
                <h3 className="font-heading text-xl text-primary mb-4">5.1 General Conduct</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li>Respectful behavior towards staff, guests, and property is required</li>
                  <li>Disruptive or inappropriate behavior may result in eviction without refund</li>
                  <li>Guests are responsible for their personal belongings</li>
                  <li>Any damage to property will be charged to the guest</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">5.2 Environmental Responsibility</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li>Trails of Teak is a smoke-free property</li>
                  <li>Respect for local wildlife and natural environment is mandatory</li>
                  <li>Littering or environmental damage is strictly prohibited</li>
                  <li>Water and energy conservation practices are encouraged</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">5.3 Quiet Hours</h3>
                <p className="text-text leading-relaxed mb-6">
                  Quiet hours are from 10:00 PM to 7:00 AM daily. Guests are expected to maintain reasonable noise levels during these times.
                </p>

                <h3 className="font-heading text-xl text-primary mb-4">5.4 Pet Policy</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2">
                  <li>Pets are welcome with prior notification and additional fees</li>
                  <li>Pets must be leashed in common areas</li>
                  <li>Pet owners are responsible for any damage or disturbance</li>
                  <li>Pets cannot be left unattended in rooms</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">6. Liability and Insurance</h2>
                
                <h3 className="font-heading text-xl text-primary mb-4">6.1 Limitation of Liability</h3>
                <p className="text-text leading-relaxed mb-4">
                  Trails of Teak Resort shall not be liable for any indirect, incidental, special, or consequential damages arising from your stay or use of our services. Our total liability shall not exceed the amount paid for your reservation.
                </p>

                <h3 className="font-heading text-xl text-primary mb-4">6.2 Guest Responsibility</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li>Guests participate in activities at their own risk</li>
                  <li>We recommend comprehensive travel insurance</li>
                  <li>Guests are responsible for securing their personal belongings</li>
                  <li>Any injuries or accidents should be reported immediately</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">6.3 Force Majeure</h3>
                <p className="text-text leading-relaxed">
                  We are not liable for any failure to perform our obligations due to events beyond our reasonable control, including natural disasters, government actions, or other force majeure events.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">7. Privacy and Data Protection</h2>
                <p className="text-text leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using our services, you consent to our privacy practices as outlined in our Privacy Policy.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">8. Intellectual Property</h2>
                <p className="text-text leading-relaxed mb-4">
                  All content on our website and materials, including text, images, logos, and designs, are owned by Trails of Teak Resort and are protected by copyright and trademark laws. You may not use, reproduce, or distribute our content without written permission.
                </p>
                <p className="text-text leading-relaxed">
                  Guests may take photographs for personal use but cannot use them for commercial purposes without permission.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">9. Website Terms</h2>
                
                <h3 className="font-heading text-xl text-primary mb-4">9.1 Acceptable Use</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li>Use our website only for lawful purposes</li>
                  <li>Do not attempt to gain unauthorized access to our systems</li>
                  <li>Do not upload malicious content or viruses</li>
                  <li>Respect the privacy of other users</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">9.2 Third-Party Links</h3>
                <p className="text-text leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of these external sites.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">10. Dispute Resolution</h2>
                <p className="text-text leading-relaxed mb-4">
                  Any disputes arising from these Terms or your stay shall be resolved through binding arbitration in accordance with the laws of India. The arbitration shall take place in the jurisdiction where our resort is located.
                </p>
                <p className="text-text leading-relaxed">
                  Before initiating formal proceedings, we encourage guests to contact our management team to resolve any concerns amicably.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">11. Governing Law</h2>
                <p className="text-text leading-relaxed">
                  These Terms are governed by and construed in accordance with the laws of India. Any legal action must be brought in the courts of India.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">12. Severability</h2>
                <p className="text-text leading-relaxed">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect. The unenforceable provision shall be replaced with an enforceable provision that most closely reflects the original intent.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">13. Changes to Terms</h2>
                <p className="text-text leading-relaxed">
                  We reserve the right to modify these Terms at any time. Updated Terms will be posted on our website with the revised date. Your continued use of our services after changes constitutes acceptance of the new Terms.
                </p>
              </div>

              <div className="luxury-border rounded-2xl p-8 bg-background">
                <h2 className="font-heading text-3xl text-primary mb-6">14. Contact Information</h2>
                <p className="text-text leading-relaxed mb-6">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-primary">Email:</span>
                    <a href="mailto:legal@trailsofteak.com" className="text-accent hover:underline">
                      legal@trailsofteak.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-primary">Phone:</span>
                    <a href="tel:+919876543210" className="text-accent hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-primary">WhatsApp:</span>
                    <a 
                      href="https://wa.me/919876543210" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold text-primary">Address:</span>
                    <div className="text-text">
                      Trails of Teak Resort<br />
                      Forest Conservation Area<br />
                      Eco-Tourism Zone<br />
                      India
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}