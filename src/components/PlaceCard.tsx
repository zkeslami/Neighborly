import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Trash2, ExternalLink } from 'lucide-react';
import { Place } from '@/hooks/usePlaces';

interface PlaceCardProps {
  place: Place;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

export function PlaceCard({ place, onDelete, onToggleFavorite }: PlaceCardProps) {
  const openInMaps = () => {
    const query = place.latitude && place.longitude
      ? `${place.latitude},${place.longitude}`
      : encodeURIComponent(place.address || place.name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{place.name}</h3>
            {place.address && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{place.address}</span>
              </p>
            )}
            {place.category && (
              <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                {place.category}
              </span>
            )}
            {place.notes && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{place.notes}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleFavorite(place.id, !place.is_favorite)}
            >
              <Heart className={`h-4 w-4 ${place.is_favorite ? 'fill-destructive text-destructive' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={openInMaps}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(place.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
