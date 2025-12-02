import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Memory {
  id: string;
  user_id: string | null;
  title: string;
  description: string | null;
  date: string;
  memory_type: string;
  friend_ids: string[] | null;
  event_id: string | null;
  image_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export type NewMemory = Omit<Memory, 'id' | 'created_at' | 'updated_at'>;

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMemories = async () => {
    if (!user) {
      setMemories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching memories', description: error.message, variant: 'destructive' });
    } else {
      setMemories(data || []);
    }
    setLoading(false);
  };

  const createMemory = async (memory: Omit<NewMemory, 'user_id'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('memories')
      .insert({ ...memory, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating memory', description: error.message, variant: 'destructive' });
      return null;
    }

    setMemories(prev => [data, ...prev]);
    toast({ title: 'Memory created' });
    return data;
  };

  const updateMemory = async (id: string, updates: Partial<Memory>) => {
    const { error } = await supabase
      .from('memories')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating memory', description: error.message, variant: 'destructive' });
      return false;
    }

    setMemories(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    return true;
  };

  const deleteMemory = async (id: string) => {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting memory', description: error.message, variant: 'destructive' });
      return false;
    }

    setMemories(prev => prev.filter(m => m.id !== id));
    return true;
  };

  useEffect(() => {
    fetchMemories();
  }, [user]);

  return { memories, loading, createMemory, updateMemory, deleteMemory, refetch: fetchMemories };
}
