import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Search } from 'lucide-react';
import { Place, NewPlace } from '@/hooks/usePlaces';

interface AddPlaceDialogProps {
  onAdd: (place: NewPlace) => Promise<Place | null>;
}

export function AddPlaceDialog({ onAdd }: AddPlaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    category: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setAdding(true);
    const result = await onAdd({
      name: form.name.trim(),
      address: form.address.trim() || null,
      latitude: null,
      longitude: null,
      google_place_id: null,
      category: form.category.trim() || null,
      notes: form.notes.trim() || null,
      is_favorite: false,
      user_id: null,
    });

    if (result) {
      setForm({ name: '', address: '', category: '', notes: '' });
      setOpen(false);
    }
    setAdding(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Place
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Place</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Franklin Barbecue"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="e.g., 900 E 11th St, Austin, TX"
              value={form.address}
              onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Restaurant, Bar, Park"
              value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about this place..."
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={!form.name.trim() || adding} className="w-full">
            {adding ? 'Adding...' : 'Add Place'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
