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


alter table "profiles" enable row level security;

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

create policy "Profiles are viewable by everyone."
  on profiles for select
  using ( true );

  alter table "users" enable row level security;

  create policy "Users are viewable by everyone."
  on users for select
  using ( true );

  -- Create a table for Public Profiles
create table donations (
  id uuid not null,
  from_id uuid references "profiles"(id) not null,
  to_id uuid references "profiles"(id) on delete cascade not null,
  amount float not null,
  createdAt timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);


-- Create a table for Donations

alter table "donations" enable row level security;

create policy "Users can insert their own donations."
  on "donations" for insert
  with check ( auth.uid() = from_id );

create policy "Donations are viewable by everyone."
  on donations for select
  using ( true );

-- Create a storage

insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

-- Weird hack

  alter table storage.objects
drop constraint objects_owner_fkey

