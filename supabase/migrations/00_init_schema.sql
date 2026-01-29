-- Create a "profiles" table to extend the default "auth.users" table
-- We do NOT modify auth.users directly.
create type user_role as enum ('passenger', 'driver', 'admin');
create type driver_status as enum ('available', 'busy', 'offline');

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  phone text,
  role user_role default 'passenger' not null,
  driver_status driver_status default 'offline', -- Only relevant if role is driver
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);
-- Users can insert own profile, Admin can insert driver profiles
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create Bookings Table
create type booking_status as enum ('pending', 'assigned', 'driver_accepted', 'completed', 'cancelled');
create type service_type as enum ('fleet', 'tour', 'airport');

create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null, -- The Passenger
  driver_id uuid references public.profiles(id), -- Nullable initially. Assigned by Admin.
  
  service_type service_type not null,
  service_id text not null, -- e.g. 'basic-sedan'
  date date not null,
  pickup_details jsonb not null default '{}'::jsonb,
  price decimal(10, 2), -- Admin/System can set/update price
  
  status booking_status default 'pending' not null,
  contact_info jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on bookings
alter table public.bookings enable row level security;

-- Policies for bookings
create policy "Passengers view own bookings" on public.bookings
  for select using (auth.uid() = user_id);

create policy "Passengers create own bookings" on public.bookings
  for insert with check (auth.uid() = user_id);

create policy "Drivers view assigned bookings" on public.bookings
  for select using (auth.uid() = driver_id);

create policy "Drivers update assigned bookings" on public.bookings
  for update using (auth.uid() = driver_id);

create policy "Admins view all bookings" on public.bookings
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins update all bookings" on public.bookings
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Trigger to create profile after signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'passenger')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
