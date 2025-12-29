-- Create promotions table
create table if not exists public.promotions (
  id uuid not null default gen_random_uuid(),
  gym_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  discount_value text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint promotions_pkey primary key (id)
);

-- Enable RLS
alter table public.promotions enable row level security;

-- Policies
create policy "Gyms can view their own promotions"
  on public.promotions for select
  using ( auth.uid() = gym_id );

create policy "Gyms can insert their own promotions"
  on public.promotions for insert
  with check ( auth.uid() = gym_id );

create policy "Gyms can update their own promotions"
  on public.promotions for update
  using ( auth.uid() = gym_id );

create policy "Gyms can delete their own promotions"
  on public.promotions for delete
  using ( auth.uid() = gym_id );
