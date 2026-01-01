-- Create the promotions table since it's missing
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    discount_value TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own promotions" ON public.promotions
    FOR SELECT
    USING (auth.uid() = gym_id);

CREATE POLICY "Users can create own promotions" ON public.promotions
    FOR INSERT
    WITH CHECK (auth.uid() = gym_id);

CREATE POLICY "Users can update own promotions" ON public.promotions
    FOR UPDATE
    USING (auth.uid() = gym_id);

CREATE POLICY "Users can delete own promotions" ON public.promotions
    FOR DELETE
    USING (auth.uid() = gym_id);

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotions TO authenticated;

-- Add comment
COMMENT ON TABLE public.promotions IS 'Stores promotional offers created by gyms.';
