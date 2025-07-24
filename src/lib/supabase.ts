import { createClient } from '@supabase/supabase-js';

// For now, using placeholder values - you'll replace with your Supabase project details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript interfaces for our database
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: 'guest' | 'admin' | 'staff' | 'housekeeping' | 'pos';
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  price_per_night: number;
  status: 'available' | 'occupied' | 'maintenance';
  description?: string;
  amenities?: string[];
  image?: string;
  size?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guest_count: number;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
  room?: Room;
}

export interface Invoice {
  id: string;
  booking_id: string;
  guest_id: string;
  total_amount: number;
  tax_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

export interface HousekeepingTask {
  id: string;
  room_id: string;
  assigned_to: string;
  status: 'pending' | 'in_progress' | 'completed';
  task_type: 'cleaning' | 'maintenance' | 'inspection';
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  guest_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
  status: 'pending' | 'published' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface POSOrder {
  id: string;
  booking_id?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total_price: number;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface GalleryMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  tags?: string[];
  title?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  property_name: string;
  contact_number: string;
  email: string;
  address?: string;
  tax_percentage: number;
  created_at: string;
  updated_at: string;
}

// Authentication helpers
export const authHelpers = {
  async signUp(email: string, password: string, userData: Partial<User>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
};

// Database helpers
export const database = {
  // Users
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Rooms
  async getRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'available');
    return { data, error };
  },

  async getRoom(id: string) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Bookings
  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    return { data, error };
  },

  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        user:users(*),
        room:rooms(*)
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateBookingStatus(id: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Settings
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    return { data, error };
  }
};