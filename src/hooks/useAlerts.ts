import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LocalAlert {
  id: string;
  message: string;
  category: string | null;
  location_name: string | null;
  source: string | null;
  created_at: string;
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<LocalAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('local_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      toast({ title: 'Error fetching alerts', description: error.message, variant: 'destructive' });
    } else {
      setAlerts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return { alerts, loading, refetch: fetchAlerts };
}
