import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  city: string | null;
  timezone: string | null;
  email: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      toast({ title: 'Error fetching profile', description: error.message, variant: 'destructive' });
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast({ title: 'Error updating profile', description: error.message, variant: 'destructive' });
      return false;
    }

    setProfile(prev => prev ? { ...prev, ...updates } : null);
    toast({ title: 'Profile updated' });
    return true;
  };

  const completeOnboarding = async () => {
    return updateProfile({ onboarding_completed: true });
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { profile, loading, updateProfile, completeOnboarding, refetch: fetchProfile };
}
