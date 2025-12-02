import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: string;
  user_id: string | null;
  title: string;
  event_type: string;
  date: string;
  status: string | null;
  location_name: string | null;
  location_address: string | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  workout_id: string | null;
  workout_name: string | null;
  workout_url: string | null;
  attendee_ids: string[] | null;
  reminder_sent_24h: boolean | null;
  reminder_sent_1h: boolean | null;
  created_at: string;
  updated_at: string;
}

export type NewEvent = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'reminder_sent_24h' | 'reminder_sent_1h'>;

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEvents = async () => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching events', description: error.message, variant: 'destructive' });
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const createEvent = async (event: Omit<NewEvent, 'user_id'>) => {
    if (!user) return null;

    const now = new Date();
    const eventDate = new Date(event.date);
    const status = eventDate > now ? 'upcoming' : 'past';

    const { data, error } = await supabase
      .from('events')
      .insert([{ ...event, user_id: user.id, status }])
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating event', description: error.message, variant: 'destructive' });
      return null;
    }

    setEvents(prev => [...prev, data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    toast({ title: 'Event created', description: `${event.title} has been added to your calendar.` });
    return data;
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const { error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating event', description: error.message, variant: 'destructive' });
      return false;
    }

    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    toast({ title: 'Event updated' });
    return true;
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting event', description: error.message, variant: 'destructive' });
      return false;
    }

    setEvents(prev => prev.filter(e => e.id !== id));
    toast({ title: 'Event deleted' });
    return true;
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming' || new Date(e.date) > new Date());
  const pastEvents = events.filter(e => e.status === 'past' || new Date(e.date) <= new Date());

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return { 
    events, 
    upcomingEvents, 
    pastEvents, 
    loading, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    refetch: fetchEvents 
  };
}
