/*
  # Fix profiles and posts tables

  1. Changes
    - Add `role` column to profiles table
    - Add `name` column to profiles table
    - Add `is_academy_post` column to posts table
    - Update column references in existing tables

  2. Security
    - Maintain existing RLS policies
*/

-- Add role column to profiles
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- Add name column to profiles if full_name doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN name TEXT;
  END IF;
END $$;

-- Add is_academy_post to posts if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'is_academy_post'
  ) THEN
    ALTER TABLE posts ADD COLUMN is_academy_post BOOLEAN DEFAULT false;
  END IF;
END $$;