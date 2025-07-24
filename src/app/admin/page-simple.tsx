'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simple timeout to test if basic page loads
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text">Loading admin test...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-4xl text-primary mb-2">Admin Test Page</h1>
            <p className="text-text">This is a simple test page to check if admin routing works</p>
          </div>

          <div className="luxury-border rounded-2xl p-8 bg-white text-center">
            <h3 className="font-heading text-2xl text-primary mb-4">Test Successful!</h3>
            <p className="text-text">If you can see this page, the admin routing is working.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}