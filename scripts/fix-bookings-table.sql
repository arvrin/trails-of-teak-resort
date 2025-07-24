-- Alter the bookings table to change user_id from UUID to TEXT
-- This allows for both registered users (UUID) and guest bookings (custom IDs)
ALTER TABLE bookings 
ALTER COLUMN user_id TYPE TEXT;

-- Optionally, add guest information columns if they don't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS guest_name TEXT,
ADD COLUMN IF NOT EXISTS guest_email TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT;

-- Update the insert policy to be more permissive
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);