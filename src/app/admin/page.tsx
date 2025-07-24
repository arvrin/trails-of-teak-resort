'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authHelpers, database, Booking, Room, User } from '@/lib/supabase';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Hotel, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Bell,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Edit3,
  Trash2,
  Eye,
  Star,
  Coffee,
  Utensils,
  Wifi,
  Car,
  RefreshCw,
  X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  pendingBookings: number;
  confirmedBookings: number;
  availableRooms: number;
  maintenanceRooms: number;
}

interface RoomStatus {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  guest?: string;
  checkOut?: string;
  revenue?: number;
  amenities?: string[];
  lastCleaned?: string;
}

interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  preferences?: string[];
  vipStatus: boolean;
}

// Modal Components
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function ComprehensiveAdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [guestFormData, setGuestFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vipStatus: false,
    preferences: [] as string[]
  });
  const [isUpdatingGuest, setIsUpdatingGuest] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    totalAmount: 0,
    specialRequests: ''
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  
  const [stats, setStats] = useState<AdminStats>({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    avgBookingValue: 0,
    monthlyRevenue: 0,
    weeklyBookings: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    availableRooms: 0,
    maintenanceRooms: 0
  });
  
  const [roomStatuses, setRoomStatuses] = useState<RoomStatus[]>([]);
  const [guestProfiles, setGuestProfiles] = useState<GuestProfile[]>([]);
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
      setRefreshing(true);
      const [bookingsResult, roomsResult] = await Promise.all([
        database.getBookings(),
        database.getRooms()
      ]);
      
      const bookingsData = bookingsResult.data || [];
      const roomsData = roomsResult.data || [];
      
      setBookings(bookingsData);
      setRooms(roomsData);
      calculateStats(bookingsData, roomsData);
      generateRoomStatuses(roomsData, bookingsData);
      generateGuestProfiles(bookingsData);
      
      toast.success('Dashboard data refreshed successfully');
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load dashboard data');
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, loadAllData]);

  const calculateStats = (bookingData: BookingWithDetails[], roomsData: Room[]) => {
    const totalBookings = bookingData.length;
    const totalRevenue = bookingData
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.total_amount, 0);
    
    const avgBookingValue = totalBookings > 0 ? (totalRevenue / totalBookings) : 0;
    
    const pendingBookings = bookingData.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookingData.filter(b => b.status === 'confirmed').length;
    const availableRooms = roomsData.filter(r => r.status === 'available').length;
    const maintenanceRooms = roomsData.filter(r => r.status === 'maintenance').length;
    
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

    const occupancyRate = Math.round((roomsData.filter(r => r.status === 'occupied').length / roomsData.length) * 100);

    setStats({
      totalBookings,
      totalRevenue,
      occupancyRate,
      avgBookingValue,
      monthlyRevenue,
      weeklyBookings,
      todayCheckIns,
      todayCheckOuts,
      pendingBookings,
      confirmedBookings,
      availableRooms,
      maintenanceRooms
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

      return {
        id: room.id,
        name: room.name,
        type: room.type,
        status: currentBooking ? 'occupied' : room.status as RoomStatus['status'],
        guest: currentBooking?.user?.full_name,
        checkOut: currentBooking?.check_out_date,
        revenue: currentBooking?.total_amount,
        amenities: room.amenities || [],
        lastCleaned: '2024-01-23'
      };
    });
    
    setRoomStatuses(statuses);
  };

  const generateGuestProfiles = (bookingsData: BookingWithDetails[]) => {
    const guestMap = new Map();
    
    bookingsData.forEach(booking => {
      if (booking.user) {
        const existingGuest = guestMap.get(booking.user.id);
        if (existingGuest) {
          existingGuest.totalBookings += 1;
          existingGuest.totalSpent += booking.total_amount;
          if (new Date(booking.created_at) > new Date(existingGuest.lastVisit)) {
            existingGuest.lastVisit = booking.created_at;
          }
        } else {
          guestMap.set(booking.user.id, {
            id: booking.user.id,
            name: booking.user.full_name,
            email: booking.user.email,
            phone: booking.user.phone_number,
            totalBookings: 1,
            totalSpent: booking.total_amount,
            lastVisit: booking.created_at,
            preferences: ['Spa Services', 'Room Service'],
            vipStatus: booking.total_amount > 50000
          });
        }
      }
    });
    
    setGuestProfiles(Array.from(guestMap.values()));
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const result = await database.updateBookingStatus(bookingId, status as 'pending' | 'confirmed' | 'cancelled' | 'completed');
      if (result.error) {
        toast.error('Failed to update booking status');
        return;
      }
      await loadAllData();
      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      console.error('Update booking error:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleCreateBooking = async () => {
    try {
      setIsSubmittingBooking(true);
      
      if (!bookingFormData.guestName || !bookingFormData.email || !bookingFormData.checkInDate || !bookingFormData.checkOutDate || !bookingFormData.roomType) {
        toast.error('Please fill in all required fields');
        return;
      }

      const availableRoom = rooms.find(room => 
        room.type.toLowerCase().includes(bookingFormData.roomType.toLowerCase()) && 
        room.status === 'available'
      );

      if (!availableRoom) {
        toast.error(`No available rooms of type ${bookingFormData.roomType}`);
        return;
      }

      const checkIn = new Date(bookingFormData.checkInDate);
      const checkOut = new Date(bookingFormData.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
      const calculatedAmount = bookingFormData.totalAmount || (availableRoom.price_per_night * nights);

      const userId = 'temp-user-' + Date.now();

      const newBooking = {
        user_id: userId,
        room_id: availableRoom.id,
        check_in_date: bookingFormData.checkInDate,
        check_out_date: bookingFormData.checkOutDate,
        total_amount: calculatedAmount,
        guest_count: bookingFormData.guests,
        special_requests: bookingFormData.specialRequests || null,
        status: 'pending' as const
      };

      const result = await database.createBooking(newBooking);
      
      if (result.error) {
        console.error('Booking creation error:', result.error);
        toast.error('Failed to create booking: ' + result.error.message);
        return;
      }

      toast.success('Booking created successfully!');
      setShowNewBookingModal(false);
      
      setBookingFormData({
        guestName: '',
        email: '',
        phone: '',
        roomType: '',
        checkInDate: '',
        checkOutDate: '',
        guests: 1,
        totalAmount: 0,
        specialRequests: ''
      });

      await loadAllData();

    } catch (error) {
      console.error('Booking creation error:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const updateGuestProfile = async () => {
    if (!selectedGuest) return;
    
    try {
      setIsUpdatingGuest(true);
      
      const updates = {
        full_name: guestFormData.name,
        email: guestFormData.email,
        phone_number: guestFormData.phone,
        // Note: VIP status and preferences would need additional database structure
      };

      const result = await database.updateUser(selectedGuest.id, updates);
      
      if (result.error) {
        toast.error('Failed to update guest profile: ' + result.error.message);
        return;
      }

      toast.success('Guest profile updated successfully');
      setShowGuestModal(false);
      await loadAllData();
      
    } catch (error) {
      console.error('Guest update error:', error);
      toast.error('Failed to update guest profile');
    } finally {
      setIsUpdatingGuest(false);
    }
  };

  const exportGuestData = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Total Bookings', 'Total Spent', 'VIP Status', 'Last Visit'],
      ...guestProfiles.map(guest => [
        guest.name,
        guest.email,
        guest.phone || '',
        guest.totalBookings,
        guest.totalSpent,
        guest.vipStatus ? 'VIP' : 'Regular',
        format(new Date(guest.lastVisit), 'yyyy-MM-dd')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `guests-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Guest data exported successfully');
  };

  const exportAnalyticsReport = () => {
    const reportData = {
      generated: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      stats: {
        totalBookings: stats.totalBookings,
        totalRevenue: stats.totalRevenue,
        occupancyRate: stats.occupancyRate,
        avgBookingValue: stats.avgBookingValue,
        monthlyRevenue: stats.monthlyRevenue,
        availableRooms: stats.availableRooms,
        confirmedBookings: stats.confirmedBookings
      },
      guests: {
        total: guestProfiles.length,
        vip: guestProfiles.filter(g => g.vipStatus).length,
        avgSpend: guestProfiles.length > 0 ? Math.round(guestProfiles.reduce((sum, g) => sum + g.totalSpent, 0) / guestProfiles.length) : 0
      }
    };

    const jsonContent = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Analytics report exported successfully');
  };

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const occupancyChartData = {
    labels: ['Available', 'Occupied', 'Maintenance'],
    datasets: [
      {
        data: [stats.availableRooms, stats.confirmedBookings, stats.maintenanceRooms],
        backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0, 0, 0, 0.1)' } }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.room?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFE7] to-[#1E3D34]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D3A24F] mx-auto mb-4"></div>
          <p className="text-[#5A4B3B] text-lg font-medium">Loading Resort Management Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFE7] to-red-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1E3D34] mb-2">System Error</h1>
          <p className="text-[#5A4B3B]">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#D3A24F] text-[#1E3D34] px-6 py-2 rounded-lg hover:bg-[#D3A24F]/80 font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFE7] to-[#1E3D34]/10 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-16 h-16 text-[#5A4B3B]/60 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1E3D34] mb-2">Access Restricted</h1>
          <p className="text-[#5A4B3B]">Administrator credentials required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EFE7] via-white to-[#F3EFE7]">
      <Toaster position="top-right" />
      
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        user={user} 
      />
      
      <div className="lg:ml-80 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-[#1E3D34] mb-2">
                Resort Operations Center
              </h1>
              <p className="text-[#5A4B3B] text-lg">
                Welcome back, <span className="text-[#D3A24F] font-semibold">{user?.full_name}</span> • {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-[#D3A24F]/10 px-4 py-2 rounded-full border border-[#D3A24F]/30">
                <div className="w-2 h-2 bg-[#D3A24F] rounded-full animate-pulse"></div>
                <span className="text-[#1E3D34] text-sm font-medium">All Systems Online</span>
              </div>
              <button
                onClick={loadAllData}
                disabled={refreshing}
                className="bg-white hover:bg-[#F3EFE7] border border-[#B8B2A8] text-[#5A4B3B] px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#B8B2A8]/30 shadow-lg">
          
          {activeTab === 'dashboard' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#1E3D34]/10 to-[#1E3D34]/20 p-6 rounded-2xl border border-[#1E3D34]/30 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1E3D34] text-sm font-medium">Total Bookings</p>
                      <p className="text-3xl font-bold text-[#1E3D34]">{stats.totalBookings}</p>
                      <p className="text-xs text-[#5A4B3B]/70 mt-1">Pending: {stats.pendingBookings}</p>
                    </div>
                    <div className="bg-[#D3A24F] p-3 rounded-xl">
                      <CalendarIcon className="w-6 h-6 text-[#1E3D34]" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-[#5A4B3B]/70 ml-2">vs last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#D3A24F]/10 to-[#D3A24F]/20 p-6 rounded-2xl border border-[#D3A24F]/30 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#D3A24F] text-sm font-medium">Revenue</p>
                      <p className="text-3xl font-bold text-[#1E3D34]">₹{stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-[#5A4B3B]/70 mt-1">Monthly: ₹{stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#1E3D34] p-3 rounded-xl">
                      <DollarSign className="w-6 h-6 text-[#D3A24F]" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-[#5A4B3B]/70 ml-2">vs last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#F3EFE7] to-[#B8B2A8]/30 p-6 rounded-2xl border border-[#B8B2A8]/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#5A4B3B] text-sm font-medium">Occupancy Rate</p>
                      <p className="text-3xl font-bold text-[#1E3D34]">{stats.occupancyRate}%</p>
                      <p className="text-xs text-[#5A4B3B]/70 mt-1">Available: {stats.availableRooms} rooms</p>
                    </div>
                    <div className="bg-[#D3A24F] p-3 rounded-xl">
                      <Hotel className="w-6 h-6 text-[#1E3D34]" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-[#D3A24F] font-medium">85%</span>
                    <span className="text-[#5A4B3B]/70 ml-2">target achieved</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1E3D34]/5 to-[#D3A24F]/20 p-6 rounded-2xl border border-[#D3A24F]/40 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1E3D34] text-sm font-medium">Avg Booking Value</p>
                      <p className="text-3xl font-bold text-[#1E3D34]">₹{Math.round(stats.avgBookingValue).toLocaleString()}</p>
                      <p className="text-xs text-[#5A4B3B]/70 mt-1">Check-ins today: {stats.todayCheckIns}</p>
                    </div>
                    <div className="bg-[#1E3D34] p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-[#D3A24F]" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+15%</span>
                    <span className="text-[#5A4B3B]/70 ml-2">vs last month</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-[#F3EFE7]/50 p-6 rounded-2xl border border-[#B8B2A8]/30">
                  <h3 className="text-lg font-semibold text-[#1E3D34] mb-4">Revenue Trend</h3>
                  <div className="h-64">
                    <Line data={revenueChartData} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-[#F3EFE7]/50 p-6 rounded-2xl border border-[#B8B2A8]/30">
                  <h3 className="text-lg font-semibold text-[#1E3D34] mb-4">Room Distribution</h3>
                  <div className="h-64 flex items-center justify-center">
                    <Doughnut data={occupancyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#F3EFE7]/50 p-6 rounded-2xl border border-[#B8B2A8]/30">
                  <h3 className="text-lg font-semibold text-[#1E3D34] mb-4">Today&apos;s Schedule</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#B8B2A8]/30">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#D3A24F] p-2 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-[#1E3D34]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1E3D34]">Check-ins</p>
                          <p className="text-sm text-[#5A4B3B]/70">{stats.todayCheckIns} guests arriving</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-[#1E3D34]">{stats.todayCheckIns}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#B8B2A8]/30">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#1E3D34] p-2 rounded-lg">
                          <Clock className="w-4 h-4 text-[#D3A24F]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1E3D34]">Check-outs</p>
                          <p className="text-sm text-[#5A4B3B]/70">{stats.todayCheckOuts} guests departing</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-[#1E3D34]">{stats.todayCheckOuts}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F3EFE7]/50 p-6 rounded-2xl border border-[#B8B2A8]/30">
                  <h3 className="text-lg font-semibold text-[#1E3D34] mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setShowNewBookingModal(true)}
                      className="bg-white hover:bg-[#F3EFE7] border border-[#B8B2A8]/30 p-4 rounded-xl transition-all hover:shadow-md text-center group"
                    >
                      <Plus className="w-6 h-6 mx-auto mb-2 text-[#5A4B3B] group-hover:text-[#D3A24F] transition-colors" />
                      <div className="text-sm font-medium text-[#5A4B3B]">New Booking</div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('rooms')}
                      className="bg-white hover:bg-[#F3EFE7] border border-[#B8B2A8]/30 p-4 rounded-xl transition-all hover:shadow-md text-center group"
                    >
                      <Settings className="w-6 h-6 mx-auto mb-2 text-[#5A4B3B] group-hover:text-[#D3A24F] transition-colors" />
                      <div className="text-sm font-medium text-[#5A4B3B]">Housekeeping</div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="bg-white hover:bg-[#F3EFE7] border border-[#B8B2A8]/30 p-4 rounded-xl transition-all hover:shadow-md text-center group"
                    >
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[#5A4B3B] group-hover:text-[#D3A24F] transition-colors" />
                      <div className="text-sm font-medium text-[#5A4B3B]">Reports</div>
                    </button>
                    <button 
                      onClick={exportAnalyticsReport}
                      className="bg-white hover:bg-[#F3EFE7] border border-[#B8B2A8]/30 p-4 rounded-xl transition-all hover:shadow-md text-center group"
                    >
                      <Download className="w-6 h-6 mx-auto mb-2 text-[#5A4B3B] group-hover:text-[#D3A24F] transition-colors" />
                      <div className="text-sm font-medium text-[#5A4B3B]">Export Data</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1E3D34] mb-2">Room Management</h2>
                  <p className="text-[#5A4B3B]">Monitor room status and manage housekeeping operations</p>
                </div>
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-[#F3EFE7] px-4 py-2 rounded-lg border border-[#B8B2A8]/30">
                    <Hotel className="w-4 h-4 text-[#D3A24F]" />
                    <span className="text-sm font-medium text-[#5A4B3B]">{roomStatuses.length} Total Rooms</span>
                  </div>
                  <button className="bg-[#D3A24F] hover:bg-[#D3A24F]/90 text-[#1E3D34] px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Housekeeping</span>
                  </button>
                </div>
              </div>

              {/* Room Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {roomStatuses.map((room) => (
                  <div key={room.id} className="bg-gradient-to-br from-[#F3EFE7] to-white p-6 rounded-2xl border border-[#B8B2A8]/30 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-[#1E3D34] text-lg">{room.name}</h3>
                        <p className="text-sm text-[#5A4B3B]/70">{room.type}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.status === 'available' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : room.status === 'occupied'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : room.status === 'maintenance'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </div>
                    </div>

                    {room.status === 'occupied' && room.guest && (
                      <div className="mb-4 p-3 bg-white rounded-lg border border-[#B8B2A8]/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <UserIcon className="w-4 h-4 text-[#5A4B3B]" />
                          <span className="text-sm font-medium text-[#1E3D34]">{room.guest}</span>
                        </div>
                        {room.checkOut && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-[#5A4B3B]" />
                            <span className="text-xs text-[#5A4B3B]/70">Check-out: {format(new Date(room.checkOut), 'MMM dd')}</span>
                          </div>
                        )}
                        {room.revenue && (
                          <div className="mt-2 text-sm font-semibold text-[#D3A24F]">
                            ₹{room.revenue.toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-3">
                      {room.amenities && room.amenities.length > 0 && (
                        <div>
                          <p className="text-xs text-[#5A4B3B]/70 mb-2">Amenities</p>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="px-2 py-1 bg-[#D3A24F]/10 text-[#1E3D34] text-xs rounded-full border border-[#D3A24F]/20">
                                {amenity}
                              </span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className="px-2 py-1 bg-[#B8B2A8]/20 text-[#5A4B3B] text-xs rounded-full">
                                +{room.amenities.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {room.lastCleaned && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#5A4B3B]/70">Last cleaned:</span>
                          <span className="text-[#5A4B3B] font-medium">{format(new Date(room.lastCleaned), 'MMM dd')}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#B8B2A8]/20 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <select 
                          value={room.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value as RoomStatus['status'];
                            try {
                              // Update room status in database
                              const roomToUpdate = rooms.find(r => r.id === room.id);
                              if (roomToUpdate) {
                                const result = await database.updateRoom(room.id, { ...roomToUpdate, status: newStatus });
                                if (result.error) {
                                  toast.error('Failed to update room status');
                                  return;
                                }
                                await loadAllData();
                                toast.success(`Room ${room.name} status updated to ${newStatus}`);
                              }
                            } catch (error) {
                              console.error('Room update error:', error);
                              toast.error('Failed to update room status');
                            }
                          }}
                          className="text-xs px-2 py-1 border border-[#B8B2A8]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20"
                        >
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="cleaning">Cleaning</option>
                        </select>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-1 text-[#5A4B3B] hover:text-[#D3A24F] transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-[#5A4B3B] hover:text-[#D3A24F] transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Housekeeping Summary */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-medium">Available Rooms</p>
                      <p className="text-3xl font-bold text-green-900">{roomStatuses.filter(r => r.status === 'available').length}</p>
                    </div>
                    <div className="bg-green-500 p-3 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-800 font-medium">Occupied Rooms</p>
                      <p className="text-3xl font-bold text-blue-900">{roomStatuses.filter(r => r.status === 'occupied').length}</p>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-800 font-medium">Maintenance Needed</p>
                      <p className="text-3xl font-bold text-red-900">{roomStatuses.filter(r => r.status === 'maintenance').length}</p>
                    </div>
                    <div className="bg-red-500 p-3 rounded-xl">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1E3D34] mb-2">Reservations Management</h2>
                  <p className="text-[#5A4B3B]">Manage all guest bookings and reservations</p>
                </div>
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search reservations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border border-[#B8B2A8]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 text-sm"
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-[#B8B2A8]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => setShowNewBookingModal(true)}
                    className="bg-[#D3A24F] hover:bg-[#D3A24F]/90 text-[#1E3D34] px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Booking</span>
                  </button>
                </div>
              </div>

              {/* Reservations Table */}
              <div className="bg-white rounded-2xl border border-[#B8B2A8]/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F3EFE7] border-b border-[#B8B2A8]/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#5A4B3B] uppercase tracking-wider">Guest</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#5A4B3B] uppercase tracking-wider">Room</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#5A4B3B] uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#5A4B3B] uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#5A4B3B] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#5A4B3B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#B8B2A8]/20">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-[#F3EFE7]/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-[#D3A24F] rounded-full flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-[#1E3D34]" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[#1E3D34]">
                                  {booking.user?.full_name || 'Guest'}
                                </div>
                                <div className="text-sm text-[#5A4B3B]/70">
                                  {booking.user?.email || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-[#1E3D34]">
                              {booking.room?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-[#5A4B3B]/70">
                              {booking.room?.type || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-[#1E3D34]">
                              {format(new Date(booking.check_in_date), 'MMM dd')} - {format(new Date(booking.check_out_date), 'MMM dd')}
                            </div>
                            <div className="text-sm text-[#5A4B3B]/70">
                              {Math.ceil((new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) / (1000 * 3600 * 24))} nights
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-[#1E3D34]">
                              ₹{booking.total_amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-[#5A4B3B]/70">
                              {booking.guest_count} guest{booking.guest_count !== 1 ? 's' : ''}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                    title="Confirm booking"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Cancel booking"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'completed')}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Mark as completed"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                className="text-[#5A4B3B] hover:text-[#D3A24F] transition-colors"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="text-[#5A4B3B] hover:text-[#D3A24F] transition-colors"
                                title="Edit booking"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Booking Statistics */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#D3A24F]/10 to-[#D3A24F]/20 p-6 rounded-2xl border border-[#D3A24F]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#D3A24F] font-medium">Total Bookings</p>
                      <p className="text-2xl font-bold text-[#1E3D34]">{bookings.length}</p>
                    </div>
                    <CalendarIcon className="w-8 h-8 text-[#D3A24F]" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-800 font-medium">Pending</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.pendingBookings}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-medium">Confirmed</p>
                      <p className="text-2xl font-bold text-green-900">{stats.confirmedBookings}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-800 font-medium">This Month</p>
                      <p className="text-2xl font-bold text-blue-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1E3D34] mb-2">Guest Profiles</h2>
                  <p className="text-[#5A4B3B]">Manage guest information and preferences</p>
                </div>
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Search guests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-[#B8B2A8]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 text-sm"
                  />
                  <button 
                    onClick={exportGuestData}
                    className="bg-[#D3A24F] hover:bg-[#D3A24F]/90 text-[#1E3D34] px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Guest Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guestProfiles.filter(guest => 
                  guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  guest.email.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((guest) => (
                  <div key={guest.id} className="bg-gradient-to-br from-[#F3EFE7] to-white p-6 rounded-2xl border border-[#B8B2A8]/30 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#D3A24F] rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-[#1E3D34]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1E3D34] text-lg">{guest.name}</h3>
                          {guest.vipStatus && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-[#D3A24F]" />
                              <span className="text-xs text-[#D3A24F] font-medium">VIP Guest</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedGuest(guest);
                          setGuestFormData({
                            name: guest.name,
                            email: guest.email,
                            phone: guest.phone || '',
                            vipStatus: guest.vipStatus,
                            preferences: guest.preferences || []
                          });
                          setShowGuestModal(true);
                        }}
                        className="text-[#5A4B3B] hover:text-[#D3A24F] transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-[#5A4B3B]" />
                        <span className="text-[#5A4B3B] truncate">{guest.email}</span>
                      </div>
                      {guest.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-[#5A4B3B]" />
                          <span className="text-[#5A4B3B]">{guest.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-[#5A4B3B]" />
                        <span className="text-[#5A4B3B]">Last visit: {format(new Date(guest.lastVisit), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-[#B8B2A8]/20">
                        <div className="text-lg font-bold text-[#1E3D34]">{guest.totalBookings}</div>
                        <div className="text-xs text-[#5A4B3B]/70">Bookings</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-[#B8B2A8]/20">
                        <div className="text-lg font-bold text-[#D3A24F]">₹{guest.totalSpent.toLocaleString()}</div>
                        <div className="text-xs text-[#5A4B3B]/70">Total Spent</div>
                      </div>
                    </div>

                    {guest.preferences && guest.preferences.length > 0 && (
                      <div>
                        <p className="text-xs text-[#5A4B3B]/70 mb-2">Preferences</p>
                        <div className="flex flex-wrap gap-1">
                          {guest.preferences.map((preference, idx) => (
                            <span key={idx} className="px-2 py-1 bg-[#D3A24F]/10 text-[#1E3D34] text-xs rounded-full border border-[#D3A24F]/20">
                              {preference}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Guest Statistics */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#1E3D34]/10 to-[#1E3D34]/20 p-6 rounded-2xl border border-[#1E3D34]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1E3D34] font-medium">Total Guests</p>
                      <p className="text-2xl font-bold text-[#1E3D34]">{guestProfiles.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-[#D3A24F]" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#D3A24F]/10 to-[#D3A24F]/20 p-6 rounded-2xl border border-[#D3A24F]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#D3A24F] font-medium">VIP Guests</p>
                      <p className="text-2xl font-bold text-[#1E3D34]">{guestProfiles.filter(g => g.vipStatus).length}</p>
                    </div>
                    <Star className="w-8 h-8 text-[#D3A24F]" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-medium">Avg Bookings</p>
                      <p className="text-2xl font-bold text-green-900">
                        {guestProfiles.length > 0 ? Math.round(guestProfiles.reduce((sum, g) => sum + g.totalBookings, 0) / guestProfiles.length) : 0}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-800 font-medium">Avg Spend</p>
                      <p className="text-2xl font-bold text-blue-900">
                        ₹{guestProfiles.length > 0 ? Math.round(guestProfiles.reduce((sum, g) => sum + g.totalSpent, 0) / guestProfiles.length).toLocaleString() : 0}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1E3D34] mb-2">Analytics & Reports</h2>
                  <p className="text-[#5A4B3B]">Detailed insights into resort performance</p>
                </div>
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  <select className="px-4 py-2 border border-[#B8B2A8]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 text-sm">
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                    <option>Last Year</option>
                  </select>
                  <button 
                    onClick={exportAnalyticsReport}
                    className="bg-[#D3A24F] hover:bg-[#D3A24F]/90 text-[#1E3D34] px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#1E3D34]/10 to-[#1E3D34]/20 p-6 rounded-2xl border border-[#1E3D34]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1E3D34] font-medium">Revenue Growth</p>
                      <p className="text-3xl font-bold text-[#1E3D34]">+23%</p>
                      <p className="text-xs text-green-600 mt-1">vs last month</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-[#D3A24F]" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#D3A24F]/10 to-[#D3A24F]/20 p-6 rounded-2xl border border-[#D3A24F]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#D3A24F] font-medium">ADR (Avg Daily Rate)</p>
                      <p className="text-3xl font-bold text-[#1E3D34]">₹{Math.round(stats.avgBookingValue).toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">+8% vs target</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#D3A24F]" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-800 font-medium">Guest Satisfaction</p>
                      <p className="text-3xl font-bold text-blue-900">4.8</p>
                      <p className="text-xs text-green-600 mt-1">98% positive</p>
                    </div>
                    <Star className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-medium">Repeat Guests</p>
                      <p className="text-3xl font-bold text-green-900">67%</p>
                      <p className="text-xs text-green-600 mt-1">+12% increase</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#F3EFE7]/50 p-6 rounded-2xl border border-[#B8B2A8]/30">
                  <h3 className="text-lg font-semibold text-[#1E3D34] mb-4">Monthly Revenue</h3>
                  <div className="h-64">
                    <Bar data={revenueChartData} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-[#F3EFE7]/50 p-6 rounded-2xl border border-[#B8B2A8]/30">
                  <h3 className="text-lg font-semibold text-[#1E3D34] mb-4">Booking Trends</h3>
                  <div className="h-64">
                    <Line data={revenueChartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-white p-6 rounded-2xl border border-[#B8B2A8]/30">
                <h3 className="text-lg font-semibold text-[#1E3D34] mb-4">Performance Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold text-[#D3A24F] mb-2">85%</div>
                    <div className="text-sm text-[#5A4B3B]">Occupancy Rate</div>
                    <div className="text-xs text-green-600 mt-1">Above target</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold text-[#1E3D34] mb-2">3.2</div>
                    <div className="text-sm text-[#5A4B3B]">Avg Length of Stay</div>
                    <div className="text-xs text-[#5A4B3B]/70 mt-1">nights</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold text-[#D3A24F] mb-2">₹45K</div>
                    <div className="text-sm text-[#5A4B3B]">Revenue per Guest</div>
                    <div className="text-xs text-green-600 mt-1">+15% growth</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1E3D34] mb-2">Staff Management</h2>
                  <p className="text-[#5A4B3B]">Manage team schedules and assignments</p>
                </div>
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  <button className="bg-white hover:bg-[#F3EFE7] border border-[#B8B2A8]/30 text-[#5A4B3B] px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Schedule</span>
                  </button>
                  <button className="bg-[#D3A24F] hover:bg-[#D3A24F]/90 text-[#1E3D34] px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Staff</span>
                  </button>
                </div>
              </div>

              {/* Staff Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { name: 'Priya Sharma', role: 'Front Desk Manager', status: 'On Duty', shift: '6 AM - 2 PM', department: 'Reception' },
                  { name: 'Ravi Kumar', role: 'Housekeeping Supervisor', status: 'On Duty', shift: '8 AM - 4 PM', department: 'Housekeeping' },
                  { name: 'Anjali Patel', role: 'Spa Therapist', status: 'Off Duty', shift: '10 AM - 6 PM', department: 'Wellness' },
                  { name: 'Vikram Singh', role: 'Maintenance Head', status: 'On Duty', shift: '7 AM - 3 PM', department: 'Maintenance' },
                  { name: 'Meera Joshi', role: 'Restaurant Manager', status: 'On Duty', shift: '5 PM - 1 AM', department: 'F&B' },
                  { name: 'Arjun Nair', role: 'Security Officer', status: 'Night Shift', shift: '10 PM - 6 AM', department: 'Security' }
                ].map((staff, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-[#F3EFE7] to-white p-6 rounded-2xl border border-[#B8B2A8]/30 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#D3A24F] rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-[#1E3D34]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1E3D34] text-lg">{staff.name}</h3>
                          <p className="text-sm text-[#5A4B3B]/70">{staff.role}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        staff.status === 'On Duty' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : staff.status === 'Night Shift'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {staff.status}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#5A4B3B]/70">Department:</span>
                        <span className="text-[#1E3D34] font-medium">{staff.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#5A4B3B]/70">Shift:</span>
                        <span className="text-[#1E3D34] font-medium">{staff.shift}</span>
                      </div>
                      <div className="pt-3 border-t border-[#B8B2A8]/20 flex justify-between">
                        <button className="text-[#5A4B3B] hover:text-[#D3A24F] transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-[#5A4B3B] hover:text-[#D3A24F] transition-colors">
                          <CalendarIcon className="w-4 h-4" />
                        </button>
                        <button className="text-[#5A4B3B] hover:text-[#D3A24F] transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Department Overview */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { name: 'Reception', staff: 4, onDuty: 2, color: 'bg-blue-100 text-blue-800 border-blue-200' },
                  { name: 'Housekeeping', staff: 8, onDuty: 6, color: 'bg-green-100 text-green-800 border-green-200' },
                  { name: 'F&B', staff: 6, onDuty: 4, color: 'bg-purple-100 text-purple-800 border-purple-200' },
                  { name: 'Maintenance', staff: 3, onDuty: 2, color: 'bg-orange-100 text-orange-800 border-orange-200' },
                  { name: 'Security', staff: 4, onDuty: 2, color: 'bg-red-100 text-red-800 border-red-200' }
                ].map((dept, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-[#B8B2A8]/30 text-center">
                    <h3 className="font-bold text-[#1E3D34] mb-3">{dept.name}</h3>
                    <div className="text-2xl font-bold text-[#D3A24F] mb-2">{dept.staff}</div>
                    <div className="text-sm text-[#5A4B3B]/70 mb-3">Total Staff</div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${dept.color}`}>
                      {dept.onDuty} On Duty
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        </div>
      </div>

      <Modal
        isOpen={showNewBookingModal}
        onClose={() => setShowNewBookingModal(false)}
        title="Create New Booking"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Guest Name *</label>
            <input
              type="text"
              value={bookingFormData.guestName}
              onChange={(e) => setBookingFormData(prev => ({ ...prev, guestName: e.target.value }))}
              className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
              placeholder="Enter guest name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Email *</label>
            <input
              type="email"
              value={bookingFormData.email}
              onChange={(e) => setBookingFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
              placeholder="guest@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Phone</label>
            <input
              type="tel"
              value={bookingFormData.phone}
              onChange={(e) => setBookingFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Room Type *</label>
            <select 
              value={bookingFormData.roomType}
              onChange={(e) => setBookingFormData(prev => ({ ...prev, roomType: e.target.value }))}
              className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
              required
            >
              <option value="">Select room type</option>
              {[...new Set(rooms.filter(r => r.status === 'available').map(r => r.type))].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Check-in Date *</label>
            <input
              type="date"
              value={bookingFormData.checkInDate}
              onChange={(e) => setBookingFormData(prev => ({ ...prev, checkInDate: e.target.value }))}
              className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Check-out Date *</label>
            <input
              type="date"
              value={bookingFormData.checkOutDate}
              onChange={(e) => setBookingFormData(prev => ({ ...prev, checkOutDate: e.target.value }))}
              className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Number of Guests *</label>
            <select
              value={bookingFormData.guests}
              onChange={(e) => setBookingFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
              required
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num} Guest{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Total Amount (₹)</label>
            <input
              type="number"
              value={bookingFormData.totalAmount || ''}
              onChange={(e) => setBookingFormData(prev => ({ ...prev, totalAmount: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
              placeholder="Auto-calculated if left empty"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Special Requests</label>
          <textarea
            value={bookingFormData.specialRequests}
            onChange={(e) => setBookingFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
            className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F] h-24 resize-none"
            placeholder="Any special requests or notes..."
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowNewBookingModal(false);
              setBookingFormData({
                guestName: '',
                email: '',
                phone: '',
                roomType: '',
                checkInDate: '',
                checkOutDate: '',
                guests: 1,
                totalAmount: 0,
                specialRequests: ''
              });
            }}
            disabled={isSubmittingBooking}
            className="px-6 py-2 border border-[#B8B2A8]/50 text-[#5A4B3B] rounded-lg hover:bg-[#F3EFE7] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateBooking}
            disabled={isSubmittingBooking}
            className="px-6 py-2 bg-[#D3A24F] text-[#1E3D34] rounded-lg hover:bg-[#D3A24F]/90 transition-colors font-semibold disabled:opacity-50 flex items-center space-x-2"
          >
            {isSubmittingBooking && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1E3D34]"></div>
            )}
            <span>{isSubmittingBooking ? 'Creating...' : 'Create Booking'}</span>
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title={`Edit Guest Profile - ${selectedGuest?.name || ''}`}
      >
        {selectedGuest && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Full Name</label>
                <input
                  type="text"
                  value={guestFormData.name}
                  onChange={(e) => setGuestFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Email</label>
                <input
                  type="email"
                  value={guestFormData.email}
                  onChange={(e) => setGuestFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Phone</label>
                <input
                  type="tel"
                  value={guestFormData.phone}
                  onChange={(e) => setGuestFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5A4B3B] mb-2">VIP Status</label>
                <select
                  value={guestFormData.vipStatus ? 'true' : 'false'}
                  onChange={(e) => setGuestFormData(prev => ({ ...prev, vipStatus: e.target.value === 'true' }))}
                  className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
                >
                  <option value="false">Regular Guest</option>
                  <option value="true">VIP Guest</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5A4B3B] mb-2">Preferences</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedGuest.preferences?.map((pref, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#D3A24F]/10 text-[#1E3D34] text-sm rounded-full border border-[#D3A24F]/20 flex items-center space-x-2">
                    {pref}
                    <button className="text-red-500 hover:text-red-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add new preference..."
                className="w-full px-4 py-2 border border-[#B8B2A8]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3A24F]/20 focus:border-[#D3A24F]"
              />
            </div>

            <div className="bg-[#F3EFE7]/50 p-4 rounded-lg">
              <h4 className="font-semibold text-[#1E3D34] mb-3">Guest Statistics</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#D3A24F]">{selectedGuest.totalBookings}</div>
                  <div className="text-sm text-[#5A4B3B]/70">Total Bookings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#1E3D34]">₹{selectedGuest.totalSpent.toLocaleString()}</div>
                  <div className="text-sm text-[#5A4B3B]/70">Total Spent</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#D3A24F]">{format(new Date(selectedGuest.lastVisit), 'MMM yyyy')}</div>
                  <div className="text-sm text-[#5A4B3B]/70">Last Visit</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowGuestModal(false)}
                className="px-6 py-2 border border-[#B8B2A8]/50 text-[#5A4B3B] rounded-lg hover:bg-[#F3EFE7] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateGuestProfile}
                disabled={isUpdatingGuest}
                className="px-6 py-2 bg-[#D3A24F] text-[#1E3D34] rounded-lg hover:bg-[#D3A24F]/90 transition-colors font-semibold disabled:opacity-50 flex items-center space-x-2"
              >
                {isUpdatingGuest && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1E3D34]"></div>
                )}
                <span>{isUpdatingGuest ? 'Updating...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
        
    </div>
  );
}