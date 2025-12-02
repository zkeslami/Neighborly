import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface NotificationPreferences {
  friendRequests: boolean;
  eventReminders: boolean;
  communityAlerts: boolean;
  weeklyDigest: boolean;
  memoryHighlights?: boolean;
  workoutSuggestions?: boolean;
  relationshipNudges?: boolean;
  [key: string]: boolean | undefined;
}

export interface UserSettings {
  user_id: string;
  notification_preferences: NotificationPreferences;
  generafit_connected: boolean;
  google_maps_connected: boolean;
  created_at: string;
  updated_at: string;
}

const defaultNotifications: NotificationPreferences = {
  friendRequests: true,
  eventReminders: true,
  communityAlerts: true,
  weeklyDigest: false,
  memoryHighlights: true,
  workoutSuggestions: true,
  relationshipNudges: false,
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSettings = async () => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      toast({ title: 'Error fetching settings', description: error.message, variant: 'destructive' });
    } else if (data) {
      const prefs = data.notification_preferences as Record<string, boolean> | null;
      setSettings({
        ...data,
        notification_preferences: { ...defaultNotifications, ...prefs }
      });
    }
    setLoading(false);
  };

  const updateSettings = async (updates: { 
    notification_preferences?: NotificationPreferences; 
    generafit_connected?: boolean; 
    google_maps_connected?: boolean;
  }) => {
    if (!user) return false;

    const dbUpdates: Record<string, Json | boolean> = {};
    if (updates.notification_preferences !== undefined) {
      dbUpdates.notification_preferences = updates.notification_preferences as unknown as Json;
    }
    if (updates.generafit_connected !== undefined) {
      dbUpdates.generafit_connected = updates.generafit_connected;
    }
    if (updates.google_maps_connected !== undefined) {
      dbUpdates.google_maps_connected = updates.google_maps_connected;
    }

    const { error } = await supabase
      .from('user_settings')
      .update(dbUpdates)
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Error updating settings', description: error.message, variant: 'destructive' });
      return false;
    }

    setSettings(prev => prev ? { ...prev, ...updates } : null);
    toast({ title: 'Settings updated' });
    return true;
  };

  const updateNotificationPreference = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!settings) return false;
    
    const newPreferences = { ...settings.notification_preferences, [key]: value };
    return updateSettings({ notification_preferences: newPreferences });
  };

  const connectService = async (service: 'generafit' | 'google_maps', connected: boolean) => {
    if (service === 'generafit') {
      return updateSettings({ generafit_connected: connected });
    } else {
      return updateSettings({ google_maps_connected: connected });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return { 
    settings, 
    loading, 
    updateSettings, 
    updateNotificationPreference, 
    connectService,
    refetch: fetchSettings 
  };
}
