'use client';

import { useState, useEffect } from 'react';
import { database, authHelpers, Room } from '@/lib/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

export default function BookingModal({ isOpen, onClose, room }: BookingModalProps) {
  // ALL HOOKS MUST BE DECLARED AT THE TOP - NO CONDITIONAL HOOKS
  const [formData, setFormData] = useState({
    check_in_date: '',
    check_out_date: '',
    guest_count: 2,
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<{id: string} | null>(null);
  
  // ALL useEffect HOOKS MUST ALSO BE AT THE TOP
  useEffect(() => {
    authHelpers.getCurrentUser().then(setUser);
  }, []);

  // CONDITIONAL RETURNS ONLY AFTER ALL HOOKS
  if (!isOpen || !room) {
    return null;
  }

  const calculateTotal = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 0;
    
    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    const subtotal = nights * room.price_per_night;
    const tax = subtotal * 0.18; // 18% tax
    return subtotal + tax;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to make a booking');
      return;
    }

    if (!formData.check_in_date || !formData.check_out_date) {
      setError('Please select check-in and check-out dates');
      return;
    }

    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    
    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        user_id: user.id!,
        room_id: room.id!,
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        guest_count: formData.guest_count,
        special_requests: formData.special_requests,
        total_amount: calculateTotal(),
        status: 'pending' as const
      };

      await database.createBooking(bookingData);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          check_in_date: '',
          check_out_date: '',
          guest_count: 2,
          special_requests: ''
        });
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guest_count' ? parseInt(value) : value
    }));
  };

  // SUCCESS STATE RENDERING
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="luxury-border rounded-3xl p-8 bg-white shadow-2xl max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl text-primary mb-4">Booking Confirmed!</h2>
          <p className="text-text mb-6">
            Your reservation for {room.name} has been submitted successfully. 
            You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-text opacity-75">
            Redirecting in a moment...
          </p>
        </div>
      </div>
    );
  }

  // MAIN MODAL RENDERING
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="luxury-border rounded-3xl p-8 bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-heading text-3xl text-primary">Reserve Your Stay</h2>
            <p className="text-text mt-2">{room.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text hover:text-primary transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!user && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
            <p className="text-accent text-sm">
              Please <button className="underline font-medium">login</button> to complete your booking.
            </p>
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
              <label className="block text-text font-medium mb-2">Check-in Date</label>
              <input
                type="date"
                name="check_in_date"
                value={formData.check_in_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-text font-medium mb-2">Check-out Date</label>
              <input
                type="date"
                name="check_out_date"
                value={formData.check_out_date}
                onChange={handleInputChange}
                min={formData.check_in_date || new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-text font-medium mb-2">Number of Guests</label>
            <select
              name="guest_count"
              value={formData.guest_count}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
            </select>
          </div>

          <div>
            <label className="block text-text font-medium mb-2">Special Requests</label>
            <textarea
              name="special_requests"
              value={formData.special_requests}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-divider focus:border-accent focus:outline-none transition-colors duration-300 resize-none"
              placeholder="Any special requirements or preferences..."
            />
          </div>

          {/* Booking Summary */}
          {formData.check_in_date && formData.check_out_date && (
            <div className="luxury-border rounded-2xl p-6 bg-background">
              <h3 className="font-heading text-xl text-primary mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text">Room:</span>
                  <span className="font-medium">{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">Dates:</span>
                  <span className="font-medium">
                    {new Date(formData.check_in_date).toLocaleDateString()} - {new Date(formData.check_out_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">Nights:</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(formData.check_out_date).getTime() - new Date(formData.check_in_date).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">Guests:</span>
                  <span className="font-medium">{formData.guest_count}</span>
                </div>
                <div className="border-t border-divider pt-3">
                  <div className="flex justify-between">
                    <span className="text-text">Subtotal:</span>
                    <span className="font-medium">₹{(calculateTotal() / 1.18).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text">Tax (18%):</span>
                    <span className="font-medium">₹{(calculateTotal() - calculateTotal() / 1.18).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-primary">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !user}
            className="w-full luxury-border bg-gradient-to-r from-accent to-yellow-400 text-primary py-4 rounded-full text-lg font-semibold hover-lift hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}