-- Create workout_plans table
create table if not exists public.workout_plans (
  id uuid default gen_random_uuid() primary key,
  trainer_id uuid REFERENCES public.profiles(id) not null, -- Intentionally referencing profiles(id) as trainer_profiles(id) is 1:1 but foreign key usually goes to base table for auth check, though trainer_profiles is valid too. sticking to profiles to be safe or trainer_profiles if consistent. Let's use profiles for user_id and trainer_id to match auth.uid() easily.
  user_id uuid REFERENCES public.profiles(id) not null,
  title text not null,
  description text,
  start_date date,
  end_date date,
  created_at timestamptz default now(),
  status text check (status in ('active', 'completed', 'archived')) default 'active'
);

-- Enable RLS
alter table public.workout_plans enable row level security;

-- Policies
create policy "Users can view their own plans and plans assigned to them"
  on public.workout_plans for select
  using (auth.uid() = user_id or auth.uid() = trainer_id);

create policy "Trainers can insert plans"
  on public.workout_plans for insert
  with check (auth.uid() = trainer_id);

create policy "Trainers can update their plans"
  on public.workout_plans for update
  using (auth.uid() = trainer_id);

create policy "Trainers can delete their plans"
  on public.workout_plans for delete
  using (auth.uid() = trainer_id);
