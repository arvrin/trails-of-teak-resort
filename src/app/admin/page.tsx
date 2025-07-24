'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authHelpers, database, Booking, Room, User } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BookingWithDetails extends Booking {
  user?: User;
  room?: Room;
}

interface AdminStats {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  avgBookingValue: number;
  monthlyRevenue: number;
  weeklyBookings: number;
  todayCheckins: number;
  todayCheckouts: number;
}

interface RoomStatus {
  id: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  guest?: string;
  checkOut?: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomStatuses, setRoomStatuses] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    avgBookingValue: 0,
    monthlyRevenue: 0,
    weeklyBookings: 0,
    todayCheckins: 0,
    todayCheckouts: 0
  });
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authHelpers.getCurrentUser();
        if (!currentUser) {
          router.push('/');
          return;
        }
        
        const { data: userProfile, error: userError } = await database.getUser(currentUser.id);
        if (userError) {
          console.error('Error fetching user profile:', userError);
          setError('Failed to load user profile');
          setLoading(false);
          return;
        }
        
        if (!userProfile || userProfile.role !== 'admin') {
          router.push('/');
          return;
        }
        
        setUser(userProfile);
        await loadAllData();
      } catch (err) {
        console.error('Error in checkUser:', err);
        setError('Authentication error');
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  const loadAllData = async () => {
    try {
      console.log('Loading admin data...');
      const [bookingsResult, roomsResult] = await Promise.all([
        database.getBookings(),
        database.getRooms()
      ]);
      
      console.log('Bookings result:', bookingsResult);
      console.log('Rooms result:', roomsResult);
      
      if (bookingsResult.error) {
        console.error('Error loading bookings:', bookingsResult.error);
        setError('Failed to load bookings: ' + bookingsResult.error.message);
        return;
      }
      
      if (roomsResult.error) {
        console.error('Error loading rooms:', roomsResult.error);
      }
      
      const bookingsData = bookingsResult.data || [];
      const roomsData = roomsResult.data || [];
      
      setBookings(bookingsData);
      setRooms(roomsData);
      calculateStats(bookingsData);
      generateRoomStatuses(roomsData, bookingsData);
      
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateRoomStatuses = (roomsData: Room[], bookingsData: BookingWithDetails[]) => {
    const today = new Date();
    const statuses: RoomStatus[] = roomsData.map(room => {
      // Find current booking for this room
      const currentBooking = bookingsData.find(booking => 
        booking.room_id === room.id && 
        booking.status === 'confirmed' &&
        new Date(booking.check_in_date) <= today &&
        new Date(booking.check_out_date) > today
      );
      
      if (currentBooking) {
        return {
          id: room.id!,
          status: 'occupied',
          guest: currentBooking.user?.full_name || 'Guest',
          checkOut: currentBooking.check_out_date
        };
      }
      
      // Randomly assign some rooms to maintenance/cleaning for demo
      const randomStatus = Math.random();
      if (randomStatus > 0.9) return { id: room.id!, status: 'maintenance' };
      if (randomStatus > 0.8) return { id: room.id!, status: 'cleaning' };
      
      return { id: room.id!, status: 'available' };
    });
    
    setRoomStatuses(statuses);
  };

  const calculateStats = (bookingData: BookingWithDetails[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalRevenue = bookingData.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const monthlyRevenue = bookingData
      .filter(b => new Date(b.created_at) >= oneMonthAgo)
      .reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const weeklyBookings = bookingData.filter(b => new Date(b.created_at) >= oneWeekAgo).length;
    
    const todayCheckins = bookingData.filter(b => {
      const checkinDate = new Date(b.check_in_date);
      return checkinDate >= today && checkinDate < tomorrow;
    }).length;
    
    const todayCheckouts = bookingData.filter(b => {
      const checkoutDate = new Date(b.check_out_date);
      return checkoutDate >= today && checkoutDate < tomorrow;
    }).length;
    
    // Calculate occupancy based on confirmed bookings
    const occupiedRooms = bookingData.filter(b => 
      b.status === 'confirmed' &&
      new Date(b.check_in_date) <= now &&
      new Date(b.check_out_date) > now
    ).length;
    
    const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;
    
    setStats({
      totalBookings: bookingData.length,
      totalRevenue,
      occupancyRate,
      avgBookingValue: bookingData.length > 0 ? totalRevenue / bookingData.length : 0,
      monthlyRevenue,
      weeklyBookings,
      todayCheckins,
      todayCheckouts
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const result = await database.updateBookingStatus(bookingId, status as any);
      if (result.error) {
        console.error('Error updating booking status:', result.error);
        alert('Failed to update booking status');
        return;
      }
      await loadAllData(); // Reload all data to reflect changes
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Failed to update booking status');
    }
  };

  const updateRoomStatus = (roomId: string, newStatus: RoomStatus['status']) => {
    setRoomStatuses(prev => 
      prev.map(room => 
        room.id === roomId ? { ...room, status: newStatus } : room
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoomStatusColor = (status: RoomStatus['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-white">
        <Header />
        <div className="h-20"></div>
        <div className="pt-8 flex items-center justify-center min-h-[calc(100vh-20rem)]">
          <div className="relative max-w-md w-full mx-4">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-3xl blur-xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl p-12 text-center shadow-2xl border border-red-100">
              <div className="w-20 h-20 bg-red-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="font-heading text-3xl text-primary mb-4">System Error</h1>
              <p className="text-text text-lg mb-8">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-accent to-yellow-400 text-primary px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-accent/30"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && (!user || user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-white">
        <Header />
        <div className="h-20"></div>
        <div className="pt-8 flex items-center justify-center min-h-[calc(100vh-20rem)]">
          <div className="relative max-w-md w-full mx-4">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-400 rounded-3xl blur-xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl p-12 text-center shadow-2xl border border-accent/20">
              <div className="w-20 h-20 bg-accent/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="font-heading text-3xl text-primary mb-4">Access Restricted</h1>
              <p className="text-text text-lg">Administrator privileges required to access this dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-white">
        <Header />
        <div className="h-20"></div>
        <div className="pt-8 flex items-center justify-center min-h-[calc(100vh-20rem)]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-accent/30 rounded-full mx-auto mb-8"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="font-heading text-2xl text-primary mb-3">Loading Dashboard</h2>
            <p className="text-text text-lg">Fetching resort operations data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      <Header />
      
      {/* Header Spacer - Account for fixed header */}
      <div className="h-20"></div>
      
      <div className="pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Dashboard Header */}
          <div className="mb-12">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-green-700 to-primary rounded-3xl blur-2xl opacity-90"></div>
              <div className="relative bg-gradient-to-r from-primary to-green-700 rounded-3xl p-8 lg:p-12 text-white shadow-2xl border border-white/10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-6 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                        <span className="text-2xl">🏛️</span>
                      </div>
                      <div>
                        <h1 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight">Resort Operations</h1>
                        <p className="text-accent text-sm font-bold tracking-[0.2em] uppercase">Management Dashboard</p>
                      </div>
                    </div>
                    <p className="text-white/90 text-xl">Welcome back, <span className="text-accent font-semibold">{user.full_name}</span></p>
                    <p className="text-white/70 text-sm mt-1">Complete hotel management system</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-white/90 text-sm font-medium">System Online</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      Updated: {new Date().toLocaleTimeString()}
                    </div>
                    <button 
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105 hover:shadow-lg disabled:opacity-50"
                    >
                      {refreshing ? '⟳ Refreshing...' : '🔄 Refresh'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl"></div>
              <div className="relative bg-white rounded-2xl p-2 shadow-xl border border-white/50">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📊' },
                    { id: 'bookings', label: `Bookings (${bookings.length})`, icon: '📅' },
                    { id: 'rooms', label: 'Room Status', icon: '🏠' },
                    { id: 'guests', label: 'Guest Management', icon: '👥' },
                    { id: 'housekeeping', label: 'Housekeeping', icon: '🧹' },
                    { id: 'analytics', label: 'Reports', icon: '📈' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r from-accent to-yellow-400 text-primary shadow-xl shadow-accent/30`
                          : 'text-text hover:bg-background hover:text-primary hover:shadow-lg'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Today's Operations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { 
                    icon: '📊', 
                    value: stats.totalBookings, 
                    label: 'Total Bookings', 
                    color: 'from-blue-500 to-blue-600',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-600'
                  },
                  { 
                    icon: '💰', 
                    value: `₹${stats.totalRevenue.toLocaleString()}`, 
                    label: 'Total Revenue', 
                    color: 'from-green-500 to-green-600',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-600'
                  },
                  { 
                    icon: '🏠', 
                    value: `${stats.occupancyRate}%`, 
                    label: 'Occupancy Rate', 
                    color: 'from-purple-500 to-purple-600',
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-600'
                  },
                  { 
                    icon: '👥', 
                    value: `${stats.todayCheckins}/${stats.todayCheckouts}`, 
                    label: 'Today Check-in/out', 
                    color: 'from-orange-500 to-orange-600',
                    bgColor: 'bg-orange-100',
                    textColor: 'text-orange-600'
                  }
                ].map((metric, index) => (
                  <div key={index} className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-16 h-16 ${metric.bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <span className="text-3xl">{metric.icon}</span>
                        </div>
                        <div className={`px-3 py-1 ${metric.bgColor} ${metric.textColor} rounded-full text-xs font-bold uppercase tracking-wider`}>
                          Live
                        </div>
                      </div>
                      <div className="text-4xl font-heading text-primary mb-2 font-bold">{metric.value}</div>
                      <div className="text-text font-medium">{metric.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-700 rounded-2xl blur-xl opacity-20"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-white/50">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-heading text-2xl text-primary font-bold">Recent Bookings</h3>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-6">
                      {bookings.length > 0 ? (
                        bookings.slice(0, 5).map((booking, index) => (
                          <div key={booking.id || index} className="flex items-center justify-between p-6 bg-gradient-to-r from-background to-white rounded-xl border border-divider hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                                <span className="text-accent font-bold text-lg">
                                  {booking.user?.full_name?.charAt(0) || 'G'}
                                </span>
                              </div>
                              <div>
                                <div className="font-bold text-primary text-lg">{booking.user?.full_name || 'Guest'}</div>
                                <div className="text-text text-sm">{booking.room?.name || 'Room'}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-primary text-xl">₹{booking.total_amount?.toLocaleString()}</div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                {booking.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl">📅</span>
                          </div>
                          <p className="text-text text-lg">No bookings found</p>
                          <p className="text-text/60 text-sm">Bookings will appear here once created</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-400 rounded-2xl blur-xl opacity-20"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-white/50">
                    <h3 className="font-heading text-2xl text-primary mb-8 font-bold">Quick Operations</h3>
                    <div className="space-y-6">
                      <button className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-background to-white rounded-xl border border-divider hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-primary">Check-in Guest</div>
                            <div className="text-text text-sm">Process new arrivals</div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-background to-white rounded-xl border border-divider hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🛎️</span>
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-primary">Room Service</div>
                            <div className="text-text text-sm">Manage guest requests</div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-background to-white rounded-xl border border-divider hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🧹</span>
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-primary">Housekeeping</div>
                            <div className="text-text text-sm">Room cleaning status</div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-background to-white rounded-xl border border-divider hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🔧</span>
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-primary">Maintenance</div>
                            <div className="text-text text-sm">Facility repairs</div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-12">
              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { status: 'pending', count: bookings.filter(b => b.status === 'pending').length, color: 'yellow', icon: '⏳' },
                  { status: 'confirmed', count: bookings.filter(b => b.status === 'confirmed').length, color: 'green', icon: '✅' },
                  { status: 'completed', count: bookings.filter(b => b.status === 'completed').length, color: 'blue', icon: '🎉' },
                  { status: 'revenue', count: `₹${bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0).toLocaleString()}`, color: 'accent', icon: '💰' }
                ].map((item, index) => (
                  <div key={index} className="relative group">
                    <div className={`absolute inset-0 bg-${item.color === 'accent' ? 'gradient-to-r from-accent to-yellow-400' : item.color === 'yellow' ? 'yellow-400' : item.color === 'green' ? 'green-400' : 'blue-400'} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    <div className="relative bg-white rounded-2xl p-8 text-center shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <div className="text-5xl font-heading text-primary mb-3 font-bold">{item.count}</div>
                      <div className="text-text font-medium capitalize">{item.status === 'revenue' ? 'Total Revenue' : `${item.status} Bookings`}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bookings Table */}
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-white/50">
                  <div className="bg-gradient-to-r from-primary to-green-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-3xl font-bold mb-2">All Reservations</h3>
                        <p className="text-white/80 text-lg">Manage guest bookings and reservations</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{bookings.length}</div>
                        <div className="text-sm text-white/80">Total Bookings</div>
                      </div>
                    </div>
                  </div>
                  
                  {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-background">
                          <tr>
                            <th className="px-8 py-6 text-left text-sm font-bold text-primary uppercase tracking-wider">Guest</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-primary uppercase tracking-wider">Room</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-primary uppercase tracking-wider">Dates</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-primary uppercase tracking-wider">Guests</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-primary uppercase tracking-wider">Amount</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-primary uppercase tracking-wider">Status</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-primary uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider">
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-background/50 transition-colors duration-200">
                              <td className="px-8 py-6">
                                <div className="flex items-center">
                                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                    <span className="text-accent font-bold text-lg">
                                      {booking.user?.full_name?.charAt(0) || 'G'}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-bold text-primary text-lg">{booking.user?.full_name || 'N/A'}</div>
                                    <div className="text-text">{booking.user?.email || 'N/A'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="font-bold text-primary text-lg">{booking.room?.name || 'N/A'}</div>
                                <div className="text-text">{booking.room?.type || ''}</div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="text-text">
                                  <div className="font-medium">{new Date(booking.check_in_date).toLocaleDateString()}</div>
                                  <div className="text-sm opacity-75">to {new Date(booking.check_out_date).toLocaleDateString()}</div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="text-text font-bold text-lg">{booking.guest_count || 1} guest{(booking.guest_count || 1) > 1 ? 's' : ''}</div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="font-bold text-primary text-2xl">₹{booking.total_amount?.toLocaleString() || '0'}</div>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(booking.status)}`}>
                                  {booking.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex flex-wrap gap-2">
                                  {booking.status === 'pending' && (
                                    <button
                                      onClick={() => updateBookingStatus(booking.id!, 'confirmed')}
                                      className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold hover:bg-green-200 transition-colors duration-200 border border-green-200 hover:scale-105"
                                    >
                                      ✓ Confirm
                                    </button>
                                  )}
                                  {booking.status === 'confirmed' && (
                                    <button
                                      onClick={() => updateBookingStatus(booking.id!, 'completed')}
                                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold hover:bg-blue-200 transition-colors duration-200 border border-blue-200 hover:scale-105"
                                    >
                                      ✓ Complete
                                    </button>
                                  )}
                                  <button
                                    onClick={() => updateBookingStatus(booking.id!, 'cancelled')}
                                    className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-bold hover:bg-red-200 transition-colors duration-200 border border-red-200 hover:scale-105"
                                  >
                                    ✕ Cancel
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-16 text-center">
                      <div className="w-20 h-20 bg-accent/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <span className="text-4xl">📅</span>
                      </div>
                      <h3 className="font-heading text-2xl text-primary mb-4">No Bookings Found</h3>
                      <p className="text-text text-lg mb-8">Bookings will appear here once guests make reservations</p>
                      <p className="text-text/60">Check your database connection and try refreshing</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Room Status Tab */}
          {activeTab === 'rooms' && (
            <div className="space-y-12">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-heading text-3xl text-primary font-bold">Room Status Board</h3>
                      <p className="text-text text-lg">Real-time room availability and status</p>
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                        <span className="text-sm font-medium">Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                        <span className="text-sm font-medium">Occupied</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm font-medium">Cleaning</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                        <span className="text-sm font-medium">Maintenance</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rooms.map((room) => {
                      const roomStatus = roomStatuses.find(rs => rs.id === room.id) || { id: room.id!, status: 'available' as const };
                      return (
                        <div key={room.id} className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                          <div className="relative bg-gradient-to-b from-background to-white rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-heading text-xl text-primary font-bold">{room.name}</h4>
                                <p className="text-accent font-medium text-sm uppercase tracking-wider">{room.type}</p>
                              </div>
                              <span className={`px-3 py-2 rounded-full text-xs font-bold border ${getRoomStatusColor(roomStatus.status)}`}>
                                {roomStatus.status.toUpperCase()}
                              </span>
                            </div>
                            
                            {roomStatus.status === 'occupied' && roomStatus.guest && (
                              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-sm font-medium text-blue-800">Guest: {roomStatus.guest}</div>
                                {roomStatus.checkOut && (
                                  <div className="text-xs text-blue-600">Check-out: {new Date(roomStatus.checkOut).toLocaleDateString()}</div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="font-heading text-2xl text-primary font-bold">₹{room.price_per_night?.toLocaleString()}</div>
                                <div className="text-text text-sm">per night</div>
                              </div>
                              <div className="text-right">
                                <div className="text-text font-medium">{room.size}</div>
                                <div className="text-accent text-sm font-bold">{room.amenities?.length || 0} amenities</div>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <select 
                                value={roomStatus.status}
                                onChange={(e) => updateRoomStatus(room.id!, e.target.value as RoomStatus['status'])}
                                className="flex-1 px-3 py-2 border border-divider rounded-lg text-sm font-medium focus:outline-none focus:border-accent"
                              >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="cleaning">Cleaning</option>
                                <option value="maintenance">Maintenance</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guest Management Tab */}
          {activeTab === 'guests' && (
            <div className="space-y-12">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-white/50">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-accent/20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <span className="text-4xl">👥</span>
                    </div>
                    <h3 className="font-heading text-3xl text-primary mb-4 font-bold">Guest Management</h3>
                    <p className="text-text text-lg">Manage guest profiles, preferences, and special requests</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-8 bg-gradient-to-b from-background to-white rounded-2xl border border-divider shadow-lg text-center">
                      <div className="text-4xl mb-4">📋</div>
                      <div className="font-bold text-primary text-xl mb-2">Guest Profiles</div>
                      <div className="text-text mb-4">Manage guest information and preferences</div>
                      <button className="w-full bg-gradient-to-r from-accent to-yellow-400 text-primary px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all duration-300">
                        View Profiles
                      </button>
                    </div>
                    
                    <div className="p-8 bg-gradient-to-b from-background to-white rounded-2xl border border-divider shadow-lg text-center">
                      <div className="text-4xl mb-4">🎂</div>
                      <div className="font-bold text-primary text-xl mb-2">Special Occasions</div>
                      <div className="text-text mb-4">Track birthdays, anniversaries, and celebrations</div>
                      <button className="w-full bg-gradient-to-r from-accent to-yellow-400 text-primary px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all duration-300">
                        Manage Events
                      </button>
                    </div>
                    
                    <div className="p-8 bg-gradient-to-b from-background to-white rounded-2xl border border-divider shadow-lg text-center">
                      <div className="text-4xl mb-4">📧</div>
                      <div className="font-bold text-primary text-xl mb-2">Guest Communication</div>
                      <div className="text-text mb-4">Send notifications and updates to guests</div>
                      <button className="w-full bg-gradient-to-r from-accent to-yellow-400 text-primary px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all duration-300">
                        Send Messages
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Housekeeping Tab */}
          {activeTab === 'housekeeping' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-white/50">
                    <h3 className="font-heading text-2xl text-primary mb-6 font-bold">Cleaning Schedule</h3>
                    <div className="space-y-4">
                      {rooms.slice(0, 5).map((room, index) => (
                        <div key={room.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-background to-white rounded-xl border border-divider">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                              <span className="text-lg font-bold text-accent">{room.name?.split(' ')[1] || index + 1}</span>
                            </div>
                            <div>
                              <div className="font-bold text-primary">{room.name}</div>
                              <div className="text-text text-sm">Last cleaned: 2 hours ago</div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-200">
                              In Progress
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-white/50">
                    <h3 className="font-heading text-2xl text-primary mb-6 font-bold">Maintenance Requests</h3>
                    <div className="space-y-4">
                      {[
                        { room: 'Forest Villa', issue: 'AC not cooling', priority: 'High', time: '30 mins ago' },
                        { room: 'Canopy Suite', issue: 'Bathroom faucet leak', priority: 'Medium', time: '2 hours ago' },
                        { room: 'Sanctuary Loft', issue: 'Light bulb replacement', priority: 'Low', time: '1 day ago' }
                      ].map((request, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-background to-white rounded-xl border border-divider">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">🔧</span>
                            </div>
                            <div>
                              <div className="font-bold text-primary">{request.room}</div>
                              <div className="text-text text-sm">{request.issue}</div>
                              <div className="text-text/60 text-xs">{request.time}</div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            request.priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-green-100 text-green-800 border-green-200'
                          }`}>
                            {request.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-700 rounded-2xl blur-2xl opacity-20"></div>
                <div className="relative bg-white rounded-2xl p-16 text-center shadow-2xl border border-white/50">
                  <div className="max-w-3xl mx-auto">
                    <div className="w-24 h-24 bg-accent/20 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
                      <span className="text-5xl">📊</span>
                    </div>
                    <h3 className="font-heading text-4xl text-primary mb-6 font-bold">Advanced Analytics & Reports</h3>
                    <p className="text-text text-xl mb-12 leading-relaxed">
                      Comprehensive reporting dashboard with revenue trends, occupancy analytics, guest satisfaction metrics, 
                      and seasonal booking patterns to optimize your resort operations and increase profitability.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { icon: '📈', title: 'Revenue Analytics', desc: 'Monthly & yearly revenue trends with forecasting' },
                        { icon: '🎯', title: 'Occupancy Reports', desc: 'Room utilization and availability optimization' },
                        { icon: '⭐', title: 'Guest Insights', desc: 'Satisfaction scores and feedback analysis' },
                        { icon: '📅', title: 'Booking Patterns', desc: 'Seasonal trends and demand forecasting' },
                        { icon: '💰', title: 'Financial Reports', desc: 'P&L statements and cost analysis' },
                        { icon: '🏆', title: 'Performance KPIs', desc: 'Key metrics and benchmark comparisons' }
                      ].map((feature, index) => (
                        <div key={index} className="p-8 bg-gradient-to-b from-background to-white rounded-2xl border border-divider shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <div className="text-4xl mb-4">{feature.icon}</div>
                          <div className="font-bold text-primary text-xl mb-3">{feature.title}</div>
                          <div className="text-text text-sm leading-relaxed">{feature.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}