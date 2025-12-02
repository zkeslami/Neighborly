import { useState } from 'react';
import { usePlaces } from '@/hooks/usePlaces';
import { PlaceCard } from '@/components/PlaceCard';
import { ImportDialog } from '@/components/ImportDialog';
import { AddPlaceDialog } from '@/components/AddPlaceDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Heart } from 'lucide-react';

const Index = () => {
  const { places, loading, addPlace, importPlaces, deletePlace, toggleFavorite } = usePlaces();
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(search.toLowerCase()) ||
      place.address?.toLowerCase().includes(search.toLowerCase()) ||
      place.category?.toLowerCase().includes(search.toLowerCase());
    const matchesFavorite = !showFavorites || place.is_favorite;
    return matchesSearch && matchesFavorite;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Neighborly</h1>
            </div>
            <div className="flex items-center gap-2">
              <ImportDialog onImport={importPlaces} />
              <AddPlaceDialog onAdd={addPlace} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search places..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant={showFavorites ? 'default' : 'outline'}
              size="icon"
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <Heart className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading places...</div>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {places.length === 0 ? 'No places yet' : 'No places found'}
            </h2>
            <p className="text-muted-foreground max-w-sm">
              {places.length === 0
                ? 'Import your Google Maps list or add places manually to get started.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlaces.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                onDelete={deletePlace}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
