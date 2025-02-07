/*
  # Update users table schema

  This migration ensures the users table has the correct schema while handling
  the case where the table might already exist.

  1. Changes
    - Add missing columns if they don't exist
    - Update default values and constraints
    - Ensure proper timestamp handling
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN 
  -- Add full_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE users ADD COLUMN full_name TEXT;
  END IF;

  -- Add avatar_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url TEXT;
  END IF;

  -- Add age if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'age'
  ) THEN
    ALTER TABLE users ADD COLUMN age INTEGER;
  END IF;

  -- Add team if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'team'
  ) THEN
    ALTER TABLE users ADD COLUMN team TEXT;
  END IF;

  -- Add position if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'position'
  ) THEN
    ALTER TABLE users ADD COLUMN position TEXT;
  END IF;

  -- Add is_parent if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_parent'
  ) THEN
    ALTER TABLE users ADD COLUMN is_parent BOOLEAN DEFAULT false;
  END IF;

  -- Add role if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;