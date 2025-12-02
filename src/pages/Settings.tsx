import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Link2, Bell, Check, X, ExternalLink, Map, Dumbbell, LogOut, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useUserSettings, NotificationPreferences } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FriendsManagement } from "@/components/settings/FriendsManagement";

const timezones = [
  'Pacific Time (PT)',
  'Mountain Time (MT)',
  'Central Time (CT)',
  'Eastern Time (ET)',
  'UTC',
  'GMT',
];

interface Integration {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  url?: string;
  settingsKey?: 'generafit_connected' | 'google_maps_connected';
}

const integrations: Integration[] = [
  {
    id: "google",
    name: "Google Maps & Lists",
    icon: Map,
    description: "Import and sync your saved places",
    settingsKey: 'google_maps_connected'
  },
  {
    id: "generafit",
    name: "GeneraFit AI",
    icon: Dumbbell,
    description: "Access workout plans and track fitness",
    url: "https://generafit-ai.lovable.app/",
    settingsKey: 'generafit_connected'
  },
];

interface NotificationSetting {
  id: keyof NotificationPreferences;
  label: string;
  description: string;
}

const notificationSettings: NotificationSetting[] = [
  { id: "memoryHighlights", label: "Memory Highlights", description: "Get notified about anniversaries and throwbacks" },
  { id: "eventReminders", label: "Event Reminders", description: "Reminders before upcoming events" },
  { id: "workoutSuggestions", label: "Workout Suggestions", description: "Get workout ideas with friends" },
  { id: "communityAlerts", label: "Community Alerts", description: "Urgent updates from your community" },
  { id: "relationshipNudges", label: "Relationship Nudges", description: "Reminders to reconnect with friends" }
];

export default function Settings() {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { settings, loading: settingsLoading, updateNotificationPreference, connectService } = useUserSettings();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [timezone, setTimezone] = useState('Central Time (CT)');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setCity(profile.city || '');
      setTimezone(profile.timezone || 'Central Time (CT)');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({ name, city, timezone });
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isConnected = (settingsKey?: 'generafit_connected' | 'google_maps_connected') => {
    if (!settings || !settingsKey) return false;
    return settings[settingsKey];
  };

  const handleConnect = async (integration: Integration) => {
    if (integration.url) {
      window.open(integration.url, "_blank");
    }
    if (integration.settingsKey) {
      const service = integration.settingsKey === 'generafit_connected' ? 'generafit' : 'google_maps';
      await connectService(service, true);
    }
  };

  const loading = profileLoading || settingsLoading;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}`} />
                <AvatarFallback>{name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <select
                  id="timezone"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Friends Management */}
        <FriendsManagement />

        {/* Connected Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Connected Services
            </CardTitle>
            <CardDescription>Manage your integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              const connected = isConnected(integration.settingsKey);
              return (
                <div key={integration.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{integration.name}</p>
                          {connected ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <Check className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground">
                              <X className="h-3 w-3 mr-1" />
                              Not Connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.url && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(integration.url, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConnect(integration)}
                      >
                        {connected ? "Manage" : "Connect"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what you want to be notified about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationSettings.map((notification, index) => (
              <div key={notification.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{notification.label}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <Switch
                    checked={settings?.notification_preferences?.[notification.id] ?? false}
                    onCheckedChange={(checked) => updateNotificationPreference(notification.id, checked)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="pt-6">
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
