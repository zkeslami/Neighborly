import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Plus, Calendar, Star, Check, Map, Loader2, Mail } from "lucide-react";
import { usePlaces, Place } from "@/hooks/usePlaces";
import { CreateEventDialog } from "@/components/plan/CreateEventDialog";
import { EmailShareModal } from "@/components/shared/EmailShareModal";
import { ImportDialog } from "@/components/ImportDialog";
import { AddPlaceDialog } from "@/components/AddPlaceDialog";

const statusColors: Record<string, string> = {
  not_visited: "bg-muted text-muted-foreground",
  visited: "bg-blue-100 text-blue-700",
  favorite: "bg-yellow-100 text-yellow-700"
};

const statusLabels: Record<string, string> = {
  not_visited: "Not visited",
  visited: "Visited",
  favorite: "Favorite"
};

export default function Lists() {
  const { places, loading, importPlaces, toggleFavorite, refetch } = usePlaces();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [placeToShare, setPlaceToShare] = useState<Place | null>(null);
  const [addPlaceOpen, setAddPlaceOpen] = useState(false);

  const categories = ["all", ...new Set(places.filter(p => p.category).map(p => p.category as string))];

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (place.address?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = categoryFilter === "all" || place.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePlanOuting = (place: Place) => {
    setSelectedPlace(place);
    setCreateEventOpen(true);
  };

  const handleShare = (place: Place) => {
    setPlaceToShare(place);
    setShareModalOpen(true);
  };

  const cycleStatus = async (place: Place) => {
    const statuses = ["not_visited", "visited", "favorite"];
    const currentIndex = statuses.indexOf(place.visited_status || "not_visited");
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    if (nextStatus === "favorite") {
      await toggleFavorite(place.id, true);
    } else {
      await toggleFavorite(place.id, false);
    }
    refetch();
  };

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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Lists
            </h1>
            <p className="text-muted-foreground">Your saved places</p>
          </div>
          <div className="flex gap-2">
            <ImportDialog onImport={importPlaces} />
            <Button onClick={() => setAddPlaceOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Place
            </Button>
          </div>
        </div>

        {places.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No places yet</h3>
              <p className="text-muted-foreground mb-4">
                Import places from Google Takeout or add them manually.
              </p>
              <div className="flex justify-center gap-2">
                <ImportDialog onImport={importPlaces} />
                <Button onClick={() => setAddPlaceOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Place
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Source attribution */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Map className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Your Places</p>
                    <p className="text-sm text-muted-foreground">
                      {places.length} places saved
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search places..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category tabs */}
            {categories.length > 1 && (
              <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
                <TabsList className="flex-wrap h-auto gap-1">
                  {categories.map(cat => (
                    <TabsTrigger key={cat} value={cat} className="capitalize">
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}

            {/* Places grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredPlaces.map(place => (
                <Card key={place.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{place.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {place.category && <Badge variant="secondary">{place.category}</Badge>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => cycleStatus(place)}
                      >
                        {place.is_favorite ? (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        ) : place.visited_status === "visited" ? (
                          <Check className="h-5 w-5 text-blue-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    
                    {place.address && (
                      <p className="text-sm text-muted-foreground">{place.address}</p>
                    )}
                    
                    {place.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">"{place.notes}"</p>
                    )}
                    
                    <Badge 
                      className={`mt-2 ${statusColors[place.visited_status || 'not_visited']}`} 
                      variant="secondary"
                    >
                      {statusLabels[place.visited_status || 'not_visited']}
                    </Badge>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" onClick={() => handlePlanOuting(place)}>
                        <Calendar className="h-4 w-4 mr-1" />
                        Plan outing
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleShare(place)}>
                        <Mail className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPlaces.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No places found</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <CreateEventDialog 
        open={createEventOpen} 
        onOpenChange={setCreateEventOpen}
        prefilledLocation={selectedPlace?.name}
      />

      <EmailShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        title={placeToShare?.name || ""}
        description={placeToShare?.category || ""}
        location={placeToShare?.address || undefined}
      />

      <AddPlaceDialog 
        open={addPlaceOpen}
        onOpenChange={setAddPlaceOpen}
      />
    </AppLayout>
  );
}
