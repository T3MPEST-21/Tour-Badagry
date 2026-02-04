-- PHASE 14: TRUST & SAFETY LAYER

-------------------------------------------------------------------------------
-- 1. RATINGS TABLE (Mission Debrief)
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ratings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  rater_id uuid REFERENCES auth.users(id) NOT NULL,
  rated_id uuid REFERENCES auth.users(id) NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS: Security Policies for Ratings
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can CREATE a rating if they are the rater (Passenger or Driver)
CREATE POLICY "Users can create ratings" 
ON ratings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = rater_id);

-- Policy: Users can VIEW ratings they wrote OR ratings about them
CREATE POLICY "Users can view relevant ratings" 
ON ratings FOR SELECT 
TO authenticated 
USING (auth.uid() = rater_id OR auth.uid() = rated_id);

-------------------------------------------------------------------------------
-- 2. SHARE TOKEN (Telemetry Uplink)
-------------------------------------------------------------------------------
-- Add share_token to bookings if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'share_token') THEN
        ALTER TABLE bookings ADD COLUMN share_token uuid DEFAULT gen_random_uuid();
    END IF;
END $$;

-- Make share_token unique
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_share_token_key;
ALTER TABLE bookings ADD CONSTRAINT bookings_share_token_key UNIQUE (share_token);

-------------------------------------------------------------------------------
-- 3. PUBLIC ACCESS POLICY (For Share Links)
-------------------------------------------------------------------------------
-- Allow PUBLIC access to READ specific booking columns if they have the valid token
-- Note: This requires enabling read access to 'anon' role only for specific rows
-- Since we can't easily pass args to policies, we allow Select where share_token is known?
-- Actually, standard RLS makes "fetching by token" hard for public without a function or permissive policy.
-- STRATEGY: We will create a secure RPC function to fetch booking by token to avoid opening the whole table.

CREATE OR REPLACE FUNCTION get_booking_by_token(token uuid)
RETURNS TABLE (
  id uuid,
  status text,
  pickup_details jsonb,
  driver_details jsonb,
  lat float,
  lng float
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with admin privileges to bypass RLS
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.status,
    b.pickup_details,
    (SELECT jsonb_build_object('full_name', p.full_name, 'phone', p.phone) FROM profiles p WHERE p.id = b.driver_id) as driver_details,
    0.0::float as lat, -- We would join with real location if we stored it, but for now we rely on realtime channel
    0.0::float as lng
  FROM bookings b
  WHERE b.share_token = token;
END;
$$;
