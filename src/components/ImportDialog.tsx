import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { NewPlace } from '@/hooks/usePlaces';

interface ImportDialogProps {
  onImport: (places: NewPlace[]) => Promise<boolean>;
}

export function ImportDialog({ onImport }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const parseGoogleTakeout = (data: any): NewPlace[] => {
    // Google Takeout saved places format
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
    // Simple array format
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

  const handleImport = async () => {
    try {
      setImporting(true);
      const data = JSON.parse(jsonInput);
      const places = parseGoogleTakeout(data);
      
      if (places.length === 0) {
        toast({ title: 'No places found', description: 'Could not parse any places from the input.', variant: 'destructive' });
        return;
      }

      const success = await onImport(places);
      if (success) {
        setJsonInput('');
        setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Places</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import from Google Takeout: Go to{' '}
            <a href="https://takeout.google.com" target="_blank" rel="noopener" className="text-primary underline">
              takeout.google.com
            </a>
            , select "Saved" under Maps, and download your data. Then upload the GeoJSON file or paste its contents below.
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
            rows={8}
            className="font-mono text-xs"
          />
          <Button onClick={handleImport} disabled={!jsonInput.trim() || importing} className="w-full">
            {importing ? 'Importing...' : 'Import Places'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
