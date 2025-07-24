-- Fix RLS (Row Level Security) for remaining tables
-- Run this after the main schema to fix security warnings

-- Enable RLS for remaining tables and add policies

-- Invoices - only booking owner and admin can access
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoices" ON public.invoices FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = invoices.booking_id AND bookings.user_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all invoices" ON public.invoices FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  )
);

-- Housekeeping tasks - only assigned staff and admins
ALTER TABLE public.housekeeping_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view assigned tasks" ON public.housekeeping_tasks FOR SELECT USING (
  auth.uid() = assigned_to OR 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'staff', 'housekeeping')
  )
);
CREATE POLICY "Admins can manage all tasks" ON public.housekeeping_tasks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  )
);

-- Reviews - users can see published reviews, manage their own
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published reviews" ON public.reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Users can manage own reviews" ON public.reviews FOR ALL USING (auth.uid() = guest_id);
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  )
);

-- POS orders - only related booking user and staff
ALTER TABLE public.pos_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.pos_orders FOR SELECT USING (
  booking_id IS NULL OR EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = pos_orders.booking_id AND bookings.user_id = auth.uid()
  )
);
CREATE POLICY "Staff can manage all orders" ON public.pos_orders FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'staff', 'pos')
  )
);

-- Gallery media - publicly viewable, only admins can manage
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery is publicly viewable" ON public.gallery_media FOR SELECT USING (true);
CREATE POLICY "Only admins can manage gallery" ON public.gallery_media FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  )
);

-- Settings - publicly readable, only admins can modify
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are publicly readable" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify settings" ON public.settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);