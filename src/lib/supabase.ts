import { createClient } from '@supabase/supabase-js';

// Debug environment variables
console.log('Supabase Environment Check:', {
  hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

if (supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  console.error('❌ Supabase environment variables not configured properly!');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

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
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
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
  special_requests?: string | null;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
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
    console.log('🔐 SignUp attempt:', { email, hasPassword: !!password });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      console.log('🔐 SignUp result:', { 
        success: !error, 
        error: error?.message,
        hasUser: !!data?.user,
        userId: data?.user?.id 
      });
      return { data, error };
    } catch (networkError) {
      console.error('🚨 SignUp network error:', networkError);
      return { data: null, error: { message: `Network error: ${String(networkError)}` } as any };
    }
  },

  async signIn(email: string, password: string) {
    console.log('🔐 SignIn attempt:', { email, hasPassword: !!password });
    console.log('🔐 Supabase client check:', { 
      url: supabase.supabaseUrl,
      hasKey: !!supabase.supabaseKey 
    });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.log('🔐 SignIn result:', { 
        success: !error, 
        error: error?.message,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        userId: data?.user?.id 
      });
      return { data, error };
    } catch (networkError) {
      console.error('🚨 SignIn network error:', networkError);
      return { data: null, error: { message: `Network error: ${String(networkError)}` } as any };
    }
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

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Rooms
  async getRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('name');
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

  async updateRoom(id: string, updates: Partial<Room>) {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async createRoom(room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('rooms')
      .insert(room)
      .select()
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

  async getBookingsByDateRange(roomId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('check_in_date, check_out_date')
      .eq('room_id', roomId)
      .neq('status', 'cancelled')
      .or(`and(check_in_date.lte.${endDate},check_out_date.gte.${startDate})`);
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