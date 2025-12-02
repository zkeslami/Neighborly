import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Answer {
  id: string;
  friend_name: string;
  friend_avatar: string;
  text: string;
  location_name?: string;
}

export interface Question {
  id: string;
  user_id: string | null;
  question: string;
  category: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  is_urgent: boolean | null;
  answers: Answer[];
  created_at: string;
  updated_at: string;
}

export type NewQuestion = {
  question: string;
  category: string;
  location_name?: string | null;
  is_urgent?: boolean;
};

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching questions', description: error.message, variant: 'destructive' });
    } else {
      const formatted = (data || []).map(q => ({
        ...q,
        answers: Array.isArray(q.answers) ? q.answers as Answer[] : []
      }));
      setQuestions(formatted);
    }
    setLoading(false);
  };

  const createQuestion = async (question: NewQuestion) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('questions')
      .insert({ 
        ...question, 
        user_id: user.id,
        answers: []
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error posting question', description: error.message, variant: 'destructive' });
      return null;
    }

    const formatted = { ...data, answers: [] as Answer[] };
    setQuestions(prev => [formatted, ...prev]);
    toast({ title: 'Question posted!' });
    return formatted;
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting question', description: error.message, variant: 'destructive' });
      return false;
    }

    setQuestions(prev => prev.filter(q => q.id !== id));
    return true;
  };

  useEffect(() => {
    fetchQuestions();
  }, [user]);

  return { questions, loading, createQuestion, deleteQuestion, refetch: fetchQuestions };
}
