-- Create friends table
CREATE TABLE public.friends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  avatar_url TEXT,
  last_hangout TIMESTAMP WITH TIME ZONE,
  relationship_start DATE,
  tags TEXT[] DEFAULT '{}',
  days_since_seen INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'social',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location_name TEXT,
  location_address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  attendee_ids UUID[] DEFAULT '{}',
  workout_id TEXT,
  workout_name TEXT,
  notes TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memories table
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  memory_type TEXT NOT NULL DEFAULT 'event',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  friend_ids UUID[] DEFAULT '{}',
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  location_name TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  is_urgent BOOLEAN DEFAULT false,
  answers JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create local_alerts table
CREATE TABLE public.local_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  source TEXT,
  category TEXT,
  location_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add visited_status to places table
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS visited_status TEXT DEFAULT 'not_visited';

-- Enable RLS on all tables
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_alerts ENABLE ROW LEVEL SECURITY;

-- Friends policies
CREATE POLICY "Users can view all friends" ON public.friends FOR SELECT USING (true);
CREATE POLICY "Users can create friends" ON public.friends FOR INSERT WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));
CREATE POLICY "Users can update their own friends" ON public.friends FOR UPDATE USING ((auth.uid() = user_id) OR (user_id IS NULL));
CREATE POLICY "Users can delete their own friends" ON public.friends FOR DELETE USING ((auth.uid() = user_id) OR (user_id IS NULL));

-- Events policies
CREATE POLICY "Users can view all events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));
CREATE POLICY "Users can update their own events" ON public.events FOR UPDATE USING ((auth.uid() = user_id) OR (user_id IS NULL));
CREATE POLICY "Users can delete their own events" ON public.events FOR DELETE USING ((auth.uid() = user_id) OR (user_id IS NULL));

-- Memories policies
CREATE POLICY "Users can view all memories" ON public.memories FOR SELECT USING (true);
CREATE POLICY "Users can create memories" ON public.memories FOR INSERT WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));
CREATE POLICY "Users can update their own memories" ON public.memories FOR UPDATE USING ((auth.uid() = user_id) OR (user_id IS NULL));
CREATE POLICY "Users can delete their own memories" ON public.memories FOR DELETE USING ((auth.uid() = user_id) OR (user_id IS NULL));

-- Questions policies
CREATE POLICY "Users can view all questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Users can create questions" ON public.questions FOR INSERT WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));
CREATE POLICY "Users can update their own questions" ON public.questions FOR UPDATE USING ((auth.uid() = user_id) OR (user_id IS NULL));
CREATE POLICY "Users can delete their own questions" ON public.questions FOR DELETE USING ((auth.uid() = user_id) OR (user_id IS NULL));

-- Local alerts policies (read-only for users)
CREATE POLICY "Users can view all alerts" ON public.local_alerts FOR SELECT USING (true);
CREATE POLICY "Users can create alerts" ON public.local_alerts FOR INSERT WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_friends_updated_at BEFORE UPDATE ON public.friends FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON public.memories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();