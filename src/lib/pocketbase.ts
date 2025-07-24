import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// TypeScript interfaces based on our ER diagram
export interface User {
  id?: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: 'guest' | 'admin' | 'staff' | 'housekeeping' | 'pos';
  created?: string;
  updated?: string;
}

export interface Room {
  id?: string;
  name: string;
  type: string;
  price_per_night: number;
  status: 'available' | 'occupied' | 'maintenance';
  description?: string;
  amenities?: string[];
  image?: string;
  size?: string;
  created?: string;
  updated?: string;
}

export interface Booking {
  id?: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_amount?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guest_count?: number;
  special_requests?: string;
  created?: string;
  updated?: string;
}

export interface Invoice {
  id?: string;
  booking_id: string;
  guest_id: string;
  total_amount: number;
  tax_amount?: number;
  status: 'pending' | 'paid' | 'cancelled';
  payment_method?: string;
  created?: string;
  updated?: string;
}

export interface HousekeepingTask {
  id?: string;
  room_id: string;
  assigned_to: string;
  status: 'pending' | 'in_progress' | 'completed';
  task_type: 'cleaning' | 'maintenance' | 'inspection';
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created?: string;
  updated?: string;
}

export interface Review {
  id?: string;
  guest_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
  status: 'pending' | 'published' | 'rejected';
  created?: string;
  updated?: string;
}

export interface POSOrder {
  id?: string;
  booking_id?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total_price: number;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  created?: string;
  updated?: string;
}

export interface GalleryMedia {
  id?: string;
  type: 'image' | 'video';
  url: string;
  tags?: string[];
  title?: string;
  category?: string;
  created?: string;
  updated?: string;
}

export interface Settings {
  id?: string;
  property_name: string;
  contact_number: string;
  email: string;
  address?: string;
  tax_percentage: number;
  created?: string;
  updated?: string;
}

// Authentication helpers
export const authHelpers = {
  async login(email: string, password: string) {
    return await pb.collection('users').authWithPassword(email, password);
  },

  async register(userData: Omit<User, 'id'> & { password: string; passwordConfirm: string }) {
    return await pb.collection('users').create(userData);
  },

  logout() {
    pb.authStore.clear();
  },

  getCurrentUser() {
    return pb.authStore.model as User | null;
  },

  isAuthenticated() {
    return pb.authStore.isValid;
  }
};

// Collection helpers
export const collections = {
  users: pb.collection('users'),
  rooms: pb.collection('rooms'),
  bookings: pb.collection('bookings'),
  invoices: pb.collection('invoices'),
  housekeeping_tasks: pb.collection('housekeeping_tasks'),
  reviews: pb.collection('reviews'),
  pos_orders: pb.collection('pos_orders'),
  gallery_media: pb.collection('gallery_media'),
  settings: pb.collection('settings')
};