'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  TrendingUp, 
  CalendarDays, 
  Hotel, 
  Users, 
  BarChart3, 
  UserCheck, 
  Settings, 
  LogOut,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';
import { authHelpers } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: {
    full_name: string;
    email: string;
    role: string;
  } | null;
}

export default function AdminSidebar({ activeTab, onTabChange, user }: AdminSidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = async () => {
    try {
      await authHelpers.signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, description: 'Overview & Analytics' },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays, description: 'Booking Management' },
    { id: 'rooms', label: 'Room Management', icon: Hotel, description: 'Room Status & Control' },
    { id: 'guests', label: 'Guest Profiles', icon: Users, description: 'Guest Management' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Reports & Insights' },
    { id: 'staff', label: 'Staff Management', icon: UserCheck, description: 'Team & Scheduling' },
  ];

  const notifications = [
    { id: 1, type: 'booking', message: 'New booking from John Doe', time: '5 min ago' },
    { id: 2, type: 'maintenance', message: 'Room 205 maintenance completed', time: '15 min ago' },
    { id: 3, type: 'checkin', message: '3 guests checking in today', time: '1 hour ago' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#1E3D34] to-[#2D5247] border-r border-[#D3A24F]/20 shadow-2xl z-50 transition-all duration-300 ${
        isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-80 lg:w-80'
      }`}>
        
        {/* Header Section */}
        <div className="p-6 border-b border-[#D3A24F]/20">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-4 ${isCollapsed ? 'lg:justify-center' : ''}`}>
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="Trails of Teak"
                  width={48}
                  height={48}
                  className="rounded-lg shadow-lg"
                />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-[#F3EFE7] font-heading text-xl font-bold">Trails of Teak</h1>
                  <p className="text-[#D3A24F] text-sm font-medium">Resort Operations</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden text-[#F3EFE7] hover:text-[#D3A24F] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6">
          <div className="space-y-2 px-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-[#D3A24F] text-[#1E3D34] shadow-lg' 
                      : 'text-[#F3EFE7] hover:bg-[#F3EFE7]/10 hover:text-[#D3A24F]'
                  } ${isCollapsed ? 'lg:justify-center' : ''}`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#1E3D34]' : 'text-[#D3A24F]'} group-hover:scale-110 transition-transform`} />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className={`font-semibold ${isActive ? 'text-[#1E3D34]' : 'text-[#F3EFE7]'}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-[#1E3D34]/70' : 'text-[#F3EFE7]/60'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#1E3D34] rounded-l-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Actions */}
        <div className="border-t border-[#D3A24F]/20 p-6">
          {/* Notifications */}
          <div className="relative mb-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F3EFE7]/10 hover:bg-[#F3EFE7]/20 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-5 h-5 text-[#D3A24F]" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    3
                  </span>
                </div>
                {!isCollapsed && (
                  <span className="text-[#F3EFE7] font-medium">Notifications</span>
                )}
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && !isCollapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#F3EFE7] rounded-xl shadow-2xl border border-[#D3A24F]/20 overflow-hidden">
                <div className="p-4 border-b border-[#B8B2A8]">
                  <h3 className="font-semibold text-[#5A4B3B]">Recent Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b border-[#B8B2A8]/50 hover:bg-[#D3A24F]/10 transition-colors">
                      <p className="text-sm text-[#5A4B3B] font-medium">{notification.message}</p>
                      <p className="text-xs text-[#5A4B3B]/60 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-[#D3A24F] text-sm font-medium hover:text-[#1E3D34] transition-colors">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className={`flex items-center space-x-3 p-4 rounded-xl bg-[#F3EFE7]/10 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-10 h-10 bg-[#D3A24F] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#1E3D34]" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[#F3EFE7] font-semibold truncate">
                  {user?.full_name || 'Admin User'}
                </div>
                <div className="text-[#D3A24F] text-sm truncate">
                  {user?.role || 'Administrator'}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`mt-4 space-y-2 ${isCollapsed ? 'lg:space-y-3' : ''}`}>
            <button className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-[#F3EFE7] hover:bg-[#F3EFE7]/10 hover:text-[#D3A24F] transition-colors ${isCollapsed ? 'lg:justify-center' : ''}`}>
              <Settings className="w-4 h-4" />
              {!isCollapsed && <span className="font-medium">Settings</span>}
            </button>
            
            <button 
              onClick={handleSignOut}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors ${isCollapsed ? 'lg:justify-center' : ''}`}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className={`fixed top-4 left-4 z-30 lg:hidden bg-[#1E3D34] text-[#F3EFE7] p-2 rounded-lg shadow-lg transition-all ${
          !isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar Toggle for Desktop */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hidden lg:block fixed top-6 transition-all duration-300 z-30 bg-[#1E3D34] text-[#F3EFE7] p-2 rounded-lg shadow-lg hover:bg-[#D3A24F] hover:text-[#1E3D34] ${
          isCollapsed ? 'left-24' : 'left-84'
        }`}
      >
        <Menu className="w-4 h-4" />
      </button>
    </>
  );
}