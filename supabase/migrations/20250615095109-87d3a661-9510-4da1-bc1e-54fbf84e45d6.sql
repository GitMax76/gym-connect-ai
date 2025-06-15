
-- Enable Row Level Security on all profile tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
-- Users can view and update their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policies for user_profiles table
CREATE POLICY "Users can view their own user profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own user profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own user profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own user profile" 
  ON public.user_profiles 
  FOR DELETE 
  USING (auth.uid() = id);

-- Policies for trainer_profiles table
CREATE POLICY "Trainers can view their own trainer profile" 
  ON public.trainer_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Trainers can insert their own trainer profile" 
  ON public.trainer_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Trainers can update their own trainer profile" 
  ON public.trainer_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Trainers can delete their own trainer profile" 
  ON public.trainer_profiles 
  FOR DELETE 
  USING (auth.uid() = id);

-- Policies for gym_profiles table
CREATE POLICY "Gym owners can view their own gym profile" 
  ON public.gym_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Gym owners can insert their own gym profile" 
  ON public.gym_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Gym owners can update their own gym profile" 
  ON public.gym_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Gym owners can delete their own gym profile" 
  ON public.gym_profiles 
  FOR DELETE 
  USING (auth.uid() = id);
