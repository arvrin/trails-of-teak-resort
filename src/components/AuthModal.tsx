'use client';

import { useState } from 'react';
import { authHelpers } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    full_name: '',
    phone_number: '',
    role: 'guest' as const
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Auth attempt:', { mode, email: formData.email });
      
      if (mode === 'login') {
        console.log('Attempting login...');
        const { data, error } = await authHelpers.signIn(formData.email, formData.password);
        console.log('Login result:', { data: !!data, error: error?.message });
        
        if (error) {
          console.error('Login error:', error);
          throw error;
        }
        
        if (!data.user) {
          throw new Error('No user returned from authentication');
        }
        
        console.log('Login successful');
      } else {
        if (formData.password !== formData.passwordConfirm) {
          throw new Error('Passwords do not match');
        }
        console.log('Attempting signup...');
        const { data, error } = await authHelpers.signUp(formData.email, formData.password, {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          role: formData.role
        });
        console.log('Signup result:', { data: !!data, error: error?.message });
        if (error) throw error;
      }
      
      onClose();
      window.location.reload(); // Simple refresh to update auth state
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      const errorMessage = (err as Error)?.message || 'Authentication failed';
      console.error('Error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="luxury-border rounded-3xl p-8 bg-white shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading text-3xl text-primary">
            {mode === 'login' ? 'Welcome Back' : 'Join Us'}
          </h2>
          <button
            onClick={onClose}
            className="text-text hover:text-primary transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-text font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-text font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </>
          )}

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
            <label className="block text-text font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
              placeholder="Enter your password"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-text font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary py-4 rounded-full text-lg font-semibold hover-lift hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
              className="text-accent hover:text-primary font-medium transition-colors duration-300"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}