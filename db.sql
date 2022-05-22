-- Create a table for Users
create table users (
  id uuid not null,
  createdAt timestamp with time zone default timezone('utc'::text, now()) not null,
  wallet_address text,
  nonce text,
  primary key (id),
  unique(id),
);
-- Create a table for Public Profiles
create table profiles (
  id uuid references auth.users on delete cascade not null,
  createdAt timestamp with time zone default timezone('utc'::text, now()) not null,
  updatedAt timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique,
  avatar_url text,
  website text,
  description text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

create function public.handle_new_user_profile() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created_profile
  after insert on public.users
  for each row execute procedure public.handle_new_user_profile();