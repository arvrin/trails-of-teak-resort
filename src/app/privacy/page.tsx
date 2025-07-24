import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/3.jpg"
            alt="Privacy Policy"
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
                Privacy Policy
              </h1>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto">
                Your privacy is important to us. Learn how we protect and handle your personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
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
                <h2 className="font-heading text-3xl text-primary mb-6">1. Introduction</h2>
                <p className="text-text leading-relaxed mb-4">
                  Trails of Teak Resort ("we," "our," or "us") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make reservations, or stay at our resort.
                </p>
                <p className="text-text leading-relaxed">
                  By using our services, you consent to the collection and use of your information in accordance with this Privacy Policy.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">2. Information We Collect</h2>
                
                <h3 className="font-heading text-xl text-primary mb-4">2.1 Personal Information</h3>
                <p className="text-text leading-relaxed mb-4">
                  We may collect the following personal information:
                </p>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li>Name, email address, phone number, and mailing address</li>
                  <li>Payment information (credit card details, billing address)</li>
                  <li>Government-issued identification for check-in purposes</li>
                  <li>Special preferences and dietary requirements</li>
                  <li>Communication preferences and marketing consents</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">2.2 Booking Information</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2 mb-6">
                  <li>Reservation details (check-in/out dates, room preferences)</li>
                  <li>Guest count and special requests</li>
                  <li>Stay history and preferences</li>
                </ul>

                <h3 className="font-heading text-xl text-primary mb-4">2.3 Technical Information</h3>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2">
                  <li>IP address, browser type, and device information</li>
                  <li>Website usage data and cookies</li>
                  <li>Location data (if permitted)</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">3. How We Use Your Information</h2>
                <p className="text-text leading-relaxed mb-4">
                  We use your personal information for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2">
                  <li>Process and manage your reservations and stay</li>
                  <li>Provide customer service and support</li>
                  <li>Process payments and prevent fraud</li>
                  <li>Communicate important information about your booking</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Improve our services and website functionality</li>
                  <li>Comply with legal obligations and safety requirements</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">4. Information Sharing and Disclosure</h2>
                <p className="text-text leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2">
                  <li><strong>Service Providers:</strong> Third-party vendors who assist us in operations (payment processing, email services)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Emergency Situations:</strong> To protect the safety of guests, staff, or the public</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">5. Data Security</h2>
                <p className="text-text leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and firewalls</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Staff training on data protection</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">6. Your Rights</h2>
                <p className="text-text leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2">
                  <li><strong>Access:</strong> Request copies of your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">7. Cookies and Tracking</h2>
                <p className="text-text leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 text-text leading-relaxed space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us analyze website usage</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                </ul>
                <p className="text-text leading-relaxed mt-4">
                  You can manage cookie preferences through your browser settings.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">8. Data Retention</h2>
                <p className="text-text leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Typically, we retain guest information for 7 years after your last stay for accounting and legal purposes.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">9. International Transfers</h2>
                <p className="text-text leading-relaxed">
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your personal information in accordance with applicable data protection laws.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">10. Children's Privacy</h2>
                <p className="text-text leading-relaxed">
                  Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-primary mb-6">11. Changes to This Policy</h2>
                <p className="text-text leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </div>

              <div className="luxury-border rounded-2xl p-8 bg-background">
                <h2 className="font-heading text-3xl text-primary mb-6">12. Contact Us</h2>
                <p className="text-text leading-relaxed mb-6">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-primary">Email:</span>
                    <a href="mailto:privacy@trailsofteak.com" className="text-accent hover:underline">
                      privacy@trailsofteak.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-primary">Phone:</span>
                    <a href="tel:+919876543210" className="text-accent hover:underline">
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