-- SECURITY PATCH
-- Previously, we allowed role to be set via metadata: coalesce((new.raw_user_meta_data->>'role')::user_role, 'passenger')
-- This is a risk if someone spoofs the API call.
-- We now FORCE 'passenger' role for ALL new signups. Admin/Driver promotion is strictly manual via DB.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    'passenger' -- HARDCODED Security: Everyone starts as a passenger. No exceptions.
  );
  return new;
end;
$$ language plpgsql security definer;
