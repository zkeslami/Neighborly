import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useFriends } from '@/hooks/useFriends';
import { usePlaces, NewPlace } from '@/hooks/usePlaces';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Home, User, Users, MapPin, Link2, ChevronRight, ChevronLeft, Plus, X, FileJson, Check, ExternalLink, Loader2 } from 'lucide-react';

const popularCities = [
  "Austin, TX", "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX",
  "San Francisco, CA", "Seattle, WA", "Denver, CO", "Miami, FL", "Atlanta, GA",
  "Boston, MA", "Phoenix, AZ", "San Diego, CA", "Dallas, TX", "Portland, OR",
  "Nashville, TN", "Las Vegas, NV", "Minneapolis, MN", "San Antonio, TX", "Philadelphia, PA",
  "Charlotte, NC", "Columbus, OH", "Indianapolis, IN", "San Jose, CA", "Fort Worth, TX",
  "Jacksonville, FL", "Austin, TX", "Memphis, TN", "Baltimore, MD", "Milwaukee, WI",
  "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA", "Kansas City, MO",
  "Mesa, AZ", "Virginia Beach, VA", "Oakland, CA", "Long Beach, CA", "Omaha, NE",
  "Raleigh, NC", "Colorado Springs, CO", "Tulsa, OK", "Cleveland, OH", "Arlington, TX",
  "New Orleans, LA", "Bakersfield, CA", "Tampa, FL", "Honolulu, HI", "Aurora, CO"
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [friendEmails, setFriendEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateProfile, completeOnboarding } = useProfile();
  const { inviteFriend } = useFriends();
  const { importPlaces } = usePlaces();
  const { connectService } = useUserSettings();

  const totalSteps = 4;

  const citySuggestions = useMemo(() => {
    if (city.length < 2) return [];
    return popularCities
      .filter(c => c.toLowerCase().includes(city.toLowerCase()))
      .slice(0, 5);
  }, [city]);

  const addEmail = () => {
    if (currentEmail && !friendEmails.includes(currentEmail)) {
      setFriendEmails([...friendEmails, currentEmail]);
      setCurrentEmail('');
    }
  };

  const removeEmail = (email: string) => {
    setFriendEmails(friendEmails.filter(e => e !== email));
  };

  const parseGoogleTakeout = (data: any): NewPlace[] => {
    if (data.features) {
      return data.features.map((f: any) => ({
        name: f.properties?.name || f.properties?.Title || 'Unknown',
        address: f.properties?.address || f.properties?.Location?.Address || null,
        latitude: f.geometry?.coordinates?.[1] || null,
        longitude: f.geometry?.coordinates?.[0] || null,
        google_place_id: f.properties?.google_maps_url?.match(/place_id=([^&]+)/)?.[1] || null,
        notes: f.properties?.Comment || null,
        is_favorite: false,
        user_id: null,
        category: null,
      }));
    }
    if (Array.isArray(data)) {
      return data.map(item => ({
        name: item.name || item.title || 'Unknown',
        address: item.address || item.location || null,
        latitude: item.latitude || item.lat || null,
        longitude: item.longitude || item.lng || null,
        google_place_id: item.place_id || item.google_place_id || null,
        notes: item.notes || item.comment || null,
        is_favorite: false,
        user_id: null,
        category: item.category || null,
      }));
    }
    return [];
  };

  const handleImportPlaces = async () => {
    try {
      setImporting(true);
      const data = JSON.parse(jsonInput);
      const places = parseGoogleTakeout(data);
      
      if (places.length === 0) {
        toast({ title: 'No places found', description: 'Could not parse any places from the input.', variant: 'destructive' });
        return;
      }

      const success = await importPlaces(places);
      if (success) {
        setImportedCount(places.length);
        setJsonInput('');
        await connectService('google_maps', true);
      }
    } catch (e) {
      toast({ title: 'Invalid JSON', description: 'Please paste valid JSON data.', variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonInput(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({ name, city });
    setSaving(false);
    setStep(2);
  };

  const handleSaveFriends = async () => {
    setSaving(true);
    for (const email of friendEmails) {
      await inviteFriend(email);
    }
    setSaving(false);
    setStep(3);
  };

  const handleComplete = async () => {
    setSaving(true);
    await completeOnboarding();
    setSaving(false);
    toast({ title: 'Welcome to Neighborly!', description: 'Your setup is complete.' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Home className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Neighborly</CardTitle>
          <CardDescription>Let's set up your account (Step {step} of {totalSteps})</CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full ${i + 1 <= step ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Your Profile</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Start typing your city..."
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setShowCitySuggestions(true);
                  }}
                  onFocus={() => setShowCitySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                />
                {showCitySuggestions && citySuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
                    {citySuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                        onClick={() => {
                          setCity(suggestion);
                          setShowCitySuggestions(false);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleSaveProfile} className="w-full" disabled={!name || saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Add Friends</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Invite friends by email to connect on Neighborly.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                />
                <Button variant="outline" onClick={addEmail}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {friendEmails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {friendEmails.map(email => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1">
                      {email}
                      <button onClick={() => removeEmail(email)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleSaveFriends} className="flex-1" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {friendEmails.length > 0 ? 'Send Invitations' : 'Skip for now'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Import Your Places</h3>
              </div>
              {importedCount > 0 ? (
                <div className="p-4 bg-accent/10 text-accent-foreground rounded-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-accent" />
                  Successfully imported {importedCount} places!
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Import from Google Takeout: Go to{' '}
                    <a href="https://takeout.google.com" target="_blank" rel="noopener" className="text-primary underline">
                      takeout.google.com
                    </a>
                    , select "Saved" under Maps, and download your data.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="gap-2" asChild>
                      <label>
                        <FileJson className="h-4 w-4" />
                        Upload JSON File
                        <input type="file" accept=".json,.geojson" className="hidden" onChange={handleFileUpload} />
                      </label>
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Or paste JSON data here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={6}
                    className="font-mono text-xs"
                  />
                  {jsonInput && (
                    <Button onClick={handleImportPlaces} disabled={importing} className="w-full">
                      {importing ? 'Importing...' : 'Import Places'}
                    </Button>
                  )}
                </>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1">
                  {importedCount > 0 ? 'Continue' : 'Skip for now'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Connect Services</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your favorite services to get the most out of Neighborly.
              </p>
              <div className="space-y-3">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">GeneraFit AI</p>
                      <p className="text-sm text-muted-foreground">Access workout plans</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open("https://generafit-ai.lovable.app/", "_blank");
                        connectService('generafit', true);
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Google Maps</p>
                      <p className="text-sm text-muted-foreground">
                        {importedCount > 0 ? `${importedCount} places imported` : 'Import your saved places'}
                      </p>
                    </div>
                    {importedCount > 0 ? (
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setStep(3)}>
                        Import
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Started
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
