'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface AvailabilityCalendarProps {
  roomId?: string;
  onDateSelect?: (checkIn: string, checkOut: string) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
}

interface BookedDate {
  check_in_date: string;
  check_out_date: string;
}

export default function AvailabilityCalendar({ 
  roomId, 
  onDateSelect, 
  selectedCheckIn, 
  selectedCheckOut 
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const [tempCheckIn, setTempCheckIn] = useState<string>('');

  useEffect(() => {
    if (roomId) {
      fetchBookedDates();
    }
  }, [roomId, currentMonth]);

  const fetchBookedDates = async () => {
    if (!roomId) return;
    
    setLoading(true);
    try {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const { data } = await database.getBookingsByDateRange(
        roomId,
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
      
      setBookedDates(data || []);
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookedDates.some(booking => {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      return date >= checkIn && date < checkOut;
    });
  };

  const isDateInRange = (date: Date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    const checkIn = new Date(selectedCheckIn);
    const checkOut = new Date(selectedCheckOut);
    return date >= checkIn && date <= checkOut;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dateStr === selectedCheckIn || dateStr === selectedCheckOut;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    if (dateStr < today || isDateBooked(date)) return;

    if (!selectingCheckOut && !tempCheckIn) {
      // First click - select check-in
      setTempCheckIn(dateStr);
      setSelectingCheckOut(true);
    } else if (selectingCheckOut && tempCheckIn) {
      // Second click - select check-out
      if (dateStr > tempCheckIn) {
        onDateSelect?.(tempCheckIn, dateStr);
        setSelectingCheckOut(false);
        setTempCheckIn('');
      } else {
        // If clicked date is before check-in, start over
        setTempCheckIn(dateStr);
      }
    } else {
      // Reset selection
      setTempCheckIn(dateStr);
      setSelectingCheckOut(true);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  const currentMonthIndex = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();

  return (
    <div className="luxury-border rounded-2xl p-6 bg-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-5 h-5 text-accent" />
          <h3 className="font-heading text-xl text-primary">
            {roomId ? 'Availability Calendar' : 'Select Your Dates'}
          </h3>
        </div>
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-background rounded-lg transition-colors duration-300"
          disabled={currentYear === today.getFullYear() && currentMonthIndex <= today.getMonth()}
        >
          <ChevronLeft className="w-5 h-5 text-text" />
        </button>
        
        <h4 className="font-heading text-lg text-primary">
          {monthNames[currentMonthIndex]} {currentYear}
        </h4>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-background rounded-lg transition-colors duration-300"
        >
          <ChevronRight className="w-5 h-5 text-text" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center">
            <span className="text-sm font-medium text-text opacity-75">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2"></div>;
          }

          const isPast = date < today;
          const isBooked = isDateBooked(date);
          const isSelected = isDateSelected(date);
          const isInRange = isDateInRange(date);
          const isToday = date.toDateString() === today.toDateString();
          const dateStr = date.toISOString().split('T')[0];
          const isTempCheckIn = dateStr === tempCheckIn;

          let buttonClass = 'w-full h-10 rounded-lg text-sm font-medium transition-all duration-300 ';
          
          if (isPast || isBooked) {
            buttonClass += 'text-gray-400 cursor-not-allowed bg-gray-100';
          } else if (isSelected) {
            buttonClass += 'bg-accent text-white shadow-lg';
          } else if (isTempCheckIn) {
            buttonClass += 'bg-accent/50 text-white';
          } else if (isInRange) {
            buttonClass += 'bg-accent/20 text-accent';
          } else if (isToday) {
            buttonClass += 'bg-primary text-white hover:bg-primary/80';
          } else {
            buttonClass += 'text-text hover:bg-accent/10 hover:text-accent';
          }

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isPast || isBooked}
              className={buttonClass}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded"></div>
          <span className="text-text">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent/20 rounded"></div>
          <span className="text-text">Selected Range</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span className="text-text">Unavailable</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-text">Today</span>
        </div>
      </div>

      {selectingCheckOut && tempCheckIn && (
        <div className="mt-4 p-3 bg-accent/10 rounded-lg text-center">
          <p className="text-sm text-accent">
            Check-in: {new Date(tempCheckIn).toLocaleDateString()} • Now select check-out date
          </p>
        </div>
      )}
    </div>
  );
}