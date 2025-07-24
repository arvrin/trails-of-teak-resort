'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Simple interface for testing
interface SimpleUser {
  id: string;
  role: string;
  full_name: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Import Supabase helpers dynamically to catch any import errors
        const { authHelpers, database } = await import('@/lib/supabase');
        
        console.log('Checking current user...');
        const currentUser = await authHelpers.getCurrentUser();
        
        if (!currentUser) {
          console.log('No current user, redirecting to home');
          router.push('/');
          return;
        }
        
        console.log('Current user found:', currentUser.id);
        
        // Get user profile from database
        const { data: userProfile, error: userError } = await database.getUser(currentUser.id);
        
        if (userError) {
          console.error('Error fetching user profile:', userError);
          setError(`Failed to load user profile: ${userError.message}`);
          setLoading(false);
          return;
        }
        
        if (!userProfile) {
          console.log('No user profile found');
          setError('User profile not found');
          setLoading(false);
          return;
        }
        
        console.log('User profile:', userProfile);
        
        if (userProfile.role !== 'admin') {
          console.log('User is not admin:', userProfile.role);
          router.push('/');
          return;
        }
        
        setUser({
          id: userProfile.id,
          role: userProfile.role,
          full_name: userProfile.full_name
        });
        
      } catch (err) {
        console.error('Error in checkUser:', err);
        setError(`Authentication error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="font-heading text-2xl text-primary mb-4">Error</h1>
            <p className="text-text mb-4 break-words">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary px-6 py-3 rounded-full font-semibold hover-lift"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl text-primary mb-4">Access Denied</h1>
            <p className="text-text">Admin access required</p>
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl text-primary mb-2">Admin Dashboard</h1>
            <p className="text-text">Welcome, {user.full_name} - Manage bookings and resort operations</p>
          </div>

          {/* Simple Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="luxury-border rounded-2xl p-6 bg-white text-center">
              <div className="text-3xl font-heading text-accent mb-2">-</div>
              <div className="text-sm text-text">Pending Bookings</div>
            </div>
            <div className="luxury-border rounded-2xl p-6 bg-white text-center">
              <div className="text-3xl font-heading text-green-600 mb-2">-</div>
              <div className="text-sm text-text">Confirmed Bookings</div>
            </div>
            <div className="luxury-border rounded-2xl p-6 bg-white text-center">
              <div className="text-3xl font-heading text-blue-600 mb-2">-</div>
              <div className="text-sm text-text">Completed Bookings</div>
            </div>
            <div className="luxury-border rounded-2xl p-6 bg-white text-center">
              <div className="text-3xl font-heading text-primary mb-2">₹-</div>
              <div className="text-sm text-text">Total Revenue</div>
            </div>
          </div>

          {/* Content Area */}
          <div className="luxury-border rounded-2xl p-8 bg-white text-center">
            <h3 className="font-heading text-2xl text-primary mb-4">Admin Dashboard Loaded Successfully!</h3>
            <p className="text-text mb-4">
              Authentication is working correctly. User role: <strong>{user.role}</strong>
            </p>
            <p className="text-text text-sm opacity-75">
              Booking data loading will be added back once this basic version is confirmed to work.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}