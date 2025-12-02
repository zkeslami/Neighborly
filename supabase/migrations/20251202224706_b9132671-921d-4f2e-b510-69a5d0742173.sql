-- Add workout_url column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS workout_url text;

-- Add reminder tracking columns to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS reminder_sent_24h boolean DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS reminder_sent_1h boolean DEFAULT false;