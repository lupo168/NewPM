-- Supabase Database Schema for China Finds

-- Users Table
-- This table will store basic user profile information.
-- Supabase Auth automatically creates a users table in the 'auth' schema.
-- This 'users' table in the 'public' schema is for public profile data linked to auth.users.
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase auth.users table
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT, -- URL to user's avatar image
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to automatically create a public user profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username)
  VALUES (NEW.id, NEW.email); -- Or use a generated username if desired
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after a new user is inserted into auth.users
-- Check if trigger exists before creating
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;

-- Enable Row Level Security (RLS) for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies for users table
-- Allow users to read all public profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.users FOR SELECT
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile."
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (handled by trigger, but good to have for completeness if direct insert is needed)
CREATE POLICY "Users can insert their own profile."
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);


-- Posts Table
-- This table will store community posts.
CREATE TABLE IF NOT EXISTS public.posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT, -- Optional title for the post
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies for posts table
-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts."
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view all posts (or posts from users they follow, etc. - keeping it simple for now)
CREATE POLICY "Posts are viewable by everyone."
  ON public.posts FOR SELECT
  USING (true); -- Or 'TO authenticated' if only logged-in users can see posts

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts."
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete their own posts."
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Optional: Comments Table (If you plan to implement comments later)
/*
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Authenticated users can create comments."
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comments are viewable by everyone."
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own comments."
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments."
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);
*/

SELECT 'Supabase schema SQL generated in database_schema/supabase_schema.sql';
