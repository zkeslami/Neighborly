import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Link2, Bell, Check, X, ExternalLink, MessageCircle, Map, Dumbbell, Instagram, Twitter } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  icon: React.ElementType;
  connected: boolean;
  description: string;
  url?: string;
}

const integrations: Integration[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    connected: true,
    description: "Share events and plans with friends"
  },
  {
    id: "google",
    name: "Google Maps & Lists",
    icon: Map,
    connected: true,
    description: "Import and sync your saved places"
  },
  {
    id: "generafit",
    name: "GeneraFit AI",
    icon: Dumbbell,
    connected: true,
    description: "Access workout plans and track fitness",
    url: "https://generafit-ai.lovable.app/"
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    connected: false,
    description: "Import memories from your posts"
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: Twitter,
    connected: false,
    description: "Get local alerts and updates"
  }
];

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function Settings() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: "memories", label: "Memory Highlights", description: "Get notified about anniversaries and throwbacks", enabled: true },
    { id: "events", label: "Event Reminders", description: "Reminders before upcoming events", enabled: true },
    { id: "workouts", label: "Workout Suggestions", description: "Get workout ideas with friends", enabled: true },
    { id: "alerts", label: "Local Alerts", description: "Urgent updates from your community", enabled: true },
    { id: "nudges", label: "Relationship Nudges", description: "Reminders to reconnect with friends", enabled: false }
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
  };

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
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Your Name" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" defaultValue="Austin, TX" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Input id="timezone" defaultValue="Central Time (CT)" />
              </div>
            </div>
            
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

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
                          {integration.connected ? (
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
                      <Button variant="outline" size="sm">
                        {integration.connected ? "Manage" : "Connect"}
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
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{notification.label}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <Switch
                    checked={notification.enabled}
                    onCheckedChange={() => toggleNotification(notification.id)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
