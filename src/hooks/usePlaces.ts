import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export type NewPlace = Omit<Place, 'id' | 'created_at' | 'updated_at'>;

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlaces = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching places', description: error.message, variant: 'destructive' });
    } else {
      setPlaces(data || []);
    }
    setLoading(false);
  };

  const addPlace = async (place: NewPlace) => {
    const { data, error } = await supabase
      .from('places')
      .insert([place])
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
    const { data, error } = await supabase
      .from('places')
      .insert(placesToImport)
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

  useEffect(() => {
    fetchPlaces();
  }, []);

  return { places, loading, addPlace, importPlaces, deletePlace, toggleFavorite, refetch: fetchPlaces };
}
