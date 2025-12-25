-- Create leads table for contact forms
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    type TEXT NOT NULL CHECK (type IN ('athlete', 'trainer', 'gym')),
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived'))
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can submit a contact form)
CREATE POLICY "Allow public insert to leads" ON public.leads
    FOR INSERT
    WITH CHECK (true);

-- Allow admins (or authenticated users for now if no admin role) to view leads
-- For simplicity in this demo phase, we'll allow authenticated users to view, 
-- but in production this should be restricted to admin roles.
CREATE POLICY "Allow authenticated view leads" ON public.leads
    FOR SELECT
    USING (auth.role() = 'authenticated');
