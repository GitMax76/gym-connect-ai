
-- Create bookings table for trainer sessions
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  session_type TEXT CHECK (session_type IN ('personal', 'group')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Prevent double booking for the same trainer at the same time
  UNIQUE(trainer_id, booking_date, start_time)
);

-- Create reviews table for feedback system
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Prevent multiple reviews for the same booking
  UNIQUE(reviewer_id, booking_id),
  -- Prevent self-reviews
  CHECK (reviewer_id != reviewed_id)
);

-- Create payments table for session payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_method TEXT CHECK (payment_method IN ('stripe', 'paypal', 'cash')) DEFAULT 'stripe',
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscriptions table for gym memberships
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gym_id UUID NOT NULL REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  subscription_type TEXT CHECK (subscription_type IN ('monthly', 'quarterly', 'yearly')) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')) DEFAULT 'active',
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trainer availability table (fixed version)
CREATE TABLE public.trainer_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Simple unique constraint to prevent overlapping slots (we'll handle validation in application logic)
  CONSTRAINT no_overlapping_times CHECK (start_time < end_time)
);

-- Enable RLS for new tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_availability ENABLE ROW LEVEL SECURITY;

-- RLS policies for bookings
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = trainer_id);

CREATE POLICY "Users can create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and trainers can update their bookings" 
  ON public.bookings FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid() = trainer_id);

-- RLS policies for reviews
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews FOR SELECT 
  USING (true);

CREATE POLICY "Users can create reviews for their bookings" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews FOR UPDATE 
  USING (auth.uid() = reviewer_id);

-- RLS policies for payments
CREATE POLICY "Users can view their own payments" 
  ON public.payments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage payments" 
  ON public.payments FOR ALL 
  WITH CHECK (true);

-- RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create subscriptions" 
  ON public.subscriptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
  ON public.subscriptions FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for trainer availability
CREATE POLICY "Anyone can view trainer availability" 
  ON public.trainer_availability FOR SELECT 
  USING (true);

CREATE POLICY "Trainers can manage their availability" 
  ON public.trainer_availability FOR ALL 
  USING (auth.uid() = trainer_id);

-- Create function to check trainer availability
CREATE OR REPLACE FUNCTION check_trainer_availability(
  p_trainer_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
) RETURNS BOOLEAN AS $$
BEGIN
  -- Check if trainer has availability on this day and time
  RETURN EXISTS (
    SELECT 1 FROM public.trainer_availability ta
    WHERE ta.trainer_id = p_trainer_id
    AND ta.day_of_week = EXTRACT(DOW FROM p_date)
    AND ta.is_available = true
    AND ta.start_time <= p_start_time
    AND ta.end_time >= p_end_time
  ) AND NOT EXISTS (
    -- Check if trainer already has a booking at this time
    SELECT 1 FROM public.bookings b
    WHERE b.trainer_id = p_trainer_id
    AND b.booking_date = p_date
    AND b.status IN ('confirmed', 'pending')
    AND (
      (b.start_time <= p_start_time AND b.end_time > p_start_time) OR
      (b.start_time < p_end_time AND b.end_time >= p_end_time) OR
      (b.start_time >= p_start_time AND b.end_time <= p_end_time)
    )
  );
END;
$$ LANGUAGE plpgsql;
