import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Friend {
  id: string;
  user_id: string | null;
  name: string;
  avatar_url: string | null;
  last_hangout: string | null;
  days_since_seen: number | null;
  tags: string[] | null;
  relationship_start: string | null;
  created_at: string;
  updated_at: string;
}

export interface FriendInvitation {
  id: string;
  inviter_id: string;
  invitee_email: string;
  status: string;
  created_at: string;
}

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [invitations, setInvitations] = useState<FriendInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFriends = async () => {
    if (!user) {
      setFriends([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) {
      toast({ title: 'Error fetching friends', description: error.message, variant: 'destructive' });
    } else {
      setFriends(data || []);
    }
    setLoading(false);
  };

  const fetchInvitations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('friend_invitations')
      .select('*')
      .eq('inviter_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setInvitations(data || []);
    }
  };

  const addFriend = async (name: string, email?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('friends')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({ title: 'Error adding friend', description: error.message, variant: 'destructive' });
      return null;
    }

    setFriends(prev => [...prev, data]);
    toast({ title: 'Friend added', description: `${name} has been added to your friends.` });
    return data;
  };

  const inviteFriend = async (email: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('friend_invitations')
      .insert([{ inviter_id: user.id, invitee_email: email }])
      .select()
      .single();

    if (error) {
      toast({ title: 'Error sending invitation', description: error.message, variant: 'destructive' });
      return null;
    }

    setInvitations(prev => [data, ...prev]);
    toast({ title: 'Invitation sent', description: `An invitation has been sent to ${email}.` });
    return data;
  };

  const updateFriend = async (id: string, updates: Partial<Friend>) => {
    const { error } = await supabase
      .from('friends')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating friend', description: error.message, variant: 'destructive' });
      return false;
    }

    setFriends(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    return true;
  };

  const deleteFriend = async (id: string) => {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error removing friend', description: error.message, variant: 'destructive' });
      return false;
    }

    setFriends(prev => prev.filter(f => f.id !== id));
    toast({ title: 'Friend removed' });
    return true;
  };

  useEffect(() => {
    fetchFriends();
    fetchInvitations();
  }, [user]);

  return { 
    friends, 
    invitations, 
    loading, 
    addFriend, 
    inviteFriend, 
    updateFriend, 
    deleteFriend, 
    refetch: fetchFriends 
  };
}
