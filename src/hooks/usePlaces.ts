import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Place {
  id: string;
  user_id: string | null;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
  category: string | null;
  notes: string | null;
  is_favorite: boolean | null;
  visited_status: string | null;
  created_at: string;
  updated_at: string;
}

export type NewPlace = Omit<Place, 'id' | 'created_at' | 'updated_at' | 'visited_status'>;

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPlaces = async () => {
    if (!user) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching places', description: error.message, variant: 'destructive' });
    } else {
      setPlaces(data || []);
    }
    setLoading(false);
  };

  const addPlace = async (place: Omit<NewPlace, 'user_id'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('places')
      .insert([{ ...place, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({ title: 'Error adding place', description: error.message, variant: 'destructive' });
      return null;
    }
    
    setPlaces(prev => [data, ...prev]);
    toast({ title: 'Place added', description: `${place.name} has been added to your list.` });
    return data;
  };

  const importPlaces = async (placesToImport: NewPlace[]) => {
    if (!user) return false;

    const placesWithUser = placesToImport.map(p => ({ ...p, user_id: user.id }));

    const { data, error } = await supabase
      .from('places')
      .insert(placesWithUser)
      .select();

    if (error) {
      toast({ title: 'Error importing places', description: error.message, variant: 'destructive' });
      return false;
    }

    setPlaces(prev => [...(data || []), ...prev]);
    toast({ title: 'Import successful', description: `${data?.length || 0} places imported.` });
    return true;
  };

  const deletePlace = async (id: string) => {
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting place', description: error.message, variant: 'destructive' });
      return false;
    }

    setPlaces(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Place deleted' });
    return true;
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    const { error } = await supabase
      .from('places')
      .update({ is_favorite: isFavorite })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating place', description: error.message, variant: 'destructive' });
      return false;
    }

    setPlaces(prev => prev.map(p => p.id === id ? { ...p, is_favorite: isFavorite } : p));
    return true;
  };

  const updateVisitedStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('places')
      .update({ visited_status: status })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating place', description: error.message, variant: 'destructive' });
      return false;
    }

    setPlaces(prev => prev.map(p => p.id === id ? { ...p, visited_status: status } : p));
    return true;
  };

  useEffect(() => {
    fetchPlaces();
  }, [user]);

  return { places, loading, addPlace, importPlaces, deletePlace, toggleFavorite, updateVisitedStatus, refetch: fetchPlaces };
}
