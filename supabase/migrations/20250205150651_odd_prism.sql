/*
  # Create users table
  
  1. New Tables
    - `users`
      - `id` (text, primary key)
      - `email` (text, unique, not null)
      - `password` (text, not null)
      - `username` (text, unique, not null)
      - `full_name` (text)
      - `avatar_url` (text)
      - `age` (integer)
      - `team` (text)
      - `position` (text)
      - `is_parent` (boolean)
      - `role` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
*/

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  team TEXT,
  position TEXT,
  is_parent BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);