'use client';

import { useEffect, useState, useCallback } from 'react';
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
  todayCheckIns: number;
  todayCheckOuts: number;
}

interface RoomStatus {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  guest?: string;
  checkOut?: string;
  revenue?: number;
}

export default function ModernAdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    avgBookingValue: 0,
    monthlyRevenue: 0,
    weeklyBookings: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0
  });
  const [roomStatuses, setRoomStatuses] = useState<RoomStatus[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Authentication check
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authHelpers.getCurrentUser();
        if (!currentUser) {
          router.push('/');
          return;
        }

        const { data: userProfile } = await database.getUser(currentUser.id);
        if (!userProfile || userProfile.role !== 'admin') {
          router.push('/');
          return;
        }
        
        setUser(userProfile);
      } catch (err) {
        console.error('Error in checkUser:', err);
        setError('Authentication error');
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  const loadAllData = useCallback(async () => {
    try {
      console.log('Loading admin data...');
      const [bookingsResult, roomsResult] = await Promise.all([
        database.getBookings(),
        database.getRooms()
      ]);
      
      console.log('Bookings result:', bookingsResult);
      console.log('Rooms result:', roomsResult);
      
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
  }, []);

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, loadAllData]);

  const calculateStats = (bookingData: BookingWithDetails[]) => {
    const totalBookings = bookingData.length;
    const totalRevenue = bookingData
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.total_amount, 0);
    
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const monthlyRevenue = bookingData
      .filter(b => new Date(b.created_at) >= thisMonth && (b.status === 'confirmed' || b.status === 'completed'))
      .reduce((sum, b) => sum + b.total_amount, 0);
    
    const weeklyBookings = bookingData
      .filter(b => new Date(b.created_at) >= thisWeek)
      .length;
    
    const todayStr = today.toISOString().split('T')[0];
    const todayCheckIns = bookingData
      .filter(b => b.check_in_date === todayStr)
      .length;
    
    const todayCheckOuts = bookingData
      .filter(b => b.check_out_date === todayStr)
      .length;

    setStats({
      totalBookings,
      totalRevenue,
      occupancyRate: 85, // Mock for now
      avgBookingValue,
      monthlyRevenue,
      weeklyBookings,
      todayCheckIns,
      todayCheckOuts
    });
  };

  const generateRoomStatuses = (roomsData: Room[], bookingsData: BookingWithDetails[]) => {
    const today = new Date();
    const statuses: RoomStatus[] = roomsData.map(room => {
      const currentBooking = bookingsData.find(booking => 
        booking.room_id === room.id &&
        booking.status === 'confirmed' &&
        new Date(booking.check_in_date) <= today &&
        new Date(booking.check_out_date) >= today
      );

      if (currentBooking) {
        return {
          id: room.id,
          name: room.name,
          type: room.type,
          status: 'occupied' as const,
          guest: currentBooking.user?.full_name || 'Guest',
          checkOut: currentBooking.check_out_date,
          revenue: currentBooking.total_amount
        };
      }

      return {
        id: room.id,
        name: room.name,
        type: room.type,
        status: room.status as 'available' | 'occupied' | 'maintenance' | 'cleaning'
      };
    });
    
    setRoomStatuses(statuses);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const result = await database.updateBookingStatus(bookingId, status as 'pending' | 'confirmed' | 'cancelled' | 'completed');
      if (result.error) {
        console.error('Error updating booking status:', result.error);
        alert('Failed to update booking status');
        return;
      }
      await loadAllData();
    } catch (error) {
      console.error('Update booking error:', error);
      alert('Failed to update booking status');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRoomStatusColor = (status: RoomStatus['status']) => {
    switch (status) {
      case 'available': return 'bg-emerald-500';
      case 'occupied': return 'bg-blue-500';
      case 'maintenance': return 'bg-red-500';
      case 'cleaning': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading Resort Management...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Unauthorized Access</h1>
          <p className="text-slate-600">Please log in with admin credentials.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      
      {/* Header Spacer */}
      <div className="h-20"></div>
      
      {/* Modern Admin Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-slate-900 mb-2">
                Resort Operations
              </h1>
              <p className="text-slate-600 text-lg">
                Welcome back, <span className="text-primary font-semibold">{user?.full_name}</span>
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-700 text-sm font-medium">System Online</span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-slate-200 bg-white rounded-t-2xl px-6">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'bookings', label: 'Bookings', icon: '📅' },
                { id: 'rooms', label: 'Room Status', icon: '🏨' },
                { id: 'guests', label: 'Guests', icon: '👥' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Bookings</p>
                      <p className="text-3xl font-bold text-blue-900">{stats.totalBookings}</p>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-xl">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-emerald-600 font-medium">+12%</span>
                    <span className="text-blue-600 ml-2">vs last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600 text-sm font-medium">Revenue</p>
                      <p className="text-3xl font-bold text-emerald-900">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-500 p-3 rounded-xl">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-emerald-600 font-medium">+8%</span>
                    <span className="text-emerald-600 ml-2">vs last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-600 text-sm font-medium">Occupancy Rate</p>
                      <p className="text-3xl font-bold text-amber-900">{stats.occupancyRate}%</p>
                    </div>
                    <div className="bg-amber-500 p-3 rounded-xl">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-amber-600 font-medium">85%</span>
                    <span className="text-amber-600 ml-2">target achieved</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Avg Booking Value</p>
                      <p className="text-3xl font-bold text-purple-900">₹{stats.avgBookingValue.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-500 p-3 rounded-xl">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-emerald-600 font-medium">+15%</span>
                    <span className="text-purple-600 ml-2">vs last month</span>
                  </div>
                </div>
              </div>

              {/* Today's Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Today&apos;s Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span className="text-slate-700">Check-ins</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{stats.todayCheckIns}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span className="text-slate-700">Check-outs</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{stats.todayCheckOuts}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-xl transition-colors text-center">
                      <div className="text-2xl mb-2">📝</div>
                      <div className="text-sm font-medium text-slate-700">New Booking</div>
                    </button>
                    <button className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-xl transition-colors text-center">
                      <div className="text-2xl mb-2">🧹</div>
                      <div className="text-sm font-medium text-slate-700">Housekeeping</div>
                    </button>
                    <button className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-xl transition-colors text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-sm font-medium text-slate-700">Reports</div>
                    </button>
                    <button className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-xl transition-colors text-center">
                      <div className="text-2xl mb-2">⚙️</div>
                      <div className="text-sm font-medium text-slate-700">Settings</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Room Status Overview */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Room Status Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roomStatuses.map((room) => (
                    <div key={room.id} className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-900">{room.name}</h4>
                        <div className={`w-3 h-3 rounded-full ${getRoomStatusColor(room.status)}`}></div>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{room.type}</p>
                      <p className="text-sm font-medium capitalize text-slate-700">{room.status}</p>
                      {room.guest && (
                        <p className="text-xs text-slate-500 mt-1">Guest: {room.guest}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Booking Management</h2>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                    Add Booking
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Booking ID</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Guest</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Room</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Dates</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Amount</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Status</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-2">
                          <span className="font-mono text-sm text-slate-600">#{booking.id.slice(0, 8)}</span>
                        </td>
                        <td className="py-4 px-2">
                          <div>
                            <p className="font-medium text-slate-900">{booking.user?.full_name || 'N/A'}</p>
                            <p className="text-sm text-slate-500">{booking.user?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <p className="font-medium text-slate-900">{booking.room?.name || 'N/A'}</p>
                          <p className="text-sm text-slate-500">{booking.room?.type || 'N/A'}</p>
                        </td>
                        <td className="py-4 px-2">
                          <p className="text-sm text-slate-700">{booking.check_in_date}</p>
                          <p className="text-sm text-slate-500">to {booking.check_out_date}</p>
                        </td>
                        <td className="py-4 px-2">
                          <p className="font-semibold text-slate-900">₹{booking.total_amount.toLocaleString()}</p>
                          <p className="text-sm text-slate-500">{booking.guest_count} guests</p>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                              >
                                Confirm
                              </button>
                            )}
                            <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No bookings found</h3>
                  <p className="text-slate-500">Bookings will appear here once guests make reservations.</p>
                </div>
              )}
            </div>
          )}

          {/* Other tabs can be implemented similarly */}
          {activeTab === 'rooms' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Room Status Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roomStatuses.map((room) => (
                  <div key={room.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
                      <div className={`w-4 h-4 rounded-full ${getRoomStatusColor(room.status)}`}></div>
                    </div>
                    <p className="text-slate-600 mb-2">{room.type}</p>
                    <p className="text-sm font-medium capitalize text-slate-700 mb-4">{room.status}</p>
                    {room.guest && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 mb-4">
                        <p className="text-sm font-medium text-slate-700">Current Guest</p>
                        <p className="text-slate-900">{room.guest}</p>
                        <p className="text-xs text-slate-500">Check-out: {room.checkOut}</p>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        Update Status
                      </button>
                      <button className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Guest Management</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Guest Management</h3>
                <p className="text-slate-500">Advanced guest profiles and communication tools coming soon.</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Analytics & Reports</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Advanced Analytics</h3>
                <p className="text-slate-500">Detailed reports and charts will be available here.</p>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <Footer />
    </div>
  );
}