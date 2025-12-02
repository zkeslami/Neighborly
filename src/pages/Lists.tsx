import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Plus, ExternalLink, MessageCircle, Calendar, Star, Check, Map } from "lucide-react";
import { mockPlaces, MockPlace } from "@/data/mockPlaces";
import { CreateEventDialog } from "@/components/plan/CreateEventDialog";
import { WhatsAppShareModal } from "@/components/shared/WhatsAppShareModal";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const statusColors = {
  not_visited: "bg-muted text-muted-foreground",
  visited: "bg-blue-100 text-blue-700",
  favorite: "bg-yellow-100 text-yellow-700"
};

const statusLabels = {
  not_visited: "Not visited",
  visited: "Visited",
  favorite: "Favorite"
};

export default function Lists() {
  const [places, setPlaces] = useState<MockPlace[]>(mockPlaces);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<MockPlace | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [placeToShare, setPlaceToShare] = useState<MockPlace | null>(null);
  const [addListOpen, setAddListOpen] = useState(false);
  const [newListUrl, setNewListUrl] = useState("");
  const { toast } = useToast();

  const categories = ["all", ...new Set(mockPlaces.map(p => p.category))];

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || place.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePlanOuting = (place: MockPlace) => {
    setSelectedPlace(place);
    setCreateEventOpen(true);
  };

  const handleShare = (place: MockPlace) => {
    setPlaceToShare(place);
    setShareModalOpen(true);
  };

  const cycleStatus = (placeId: string) => {
    setPlaces(prev => prev.map(p => {
      if (p.id !== placeId) return p;
      const statuses: MockPlace["visited_status"][] = ["not_visited", "visited", "favorite"];
      const currentIndex = statuses.indexOf(p.visited_status);
      const nextStatus = statuses[(currentIndex + 1) % statuses.length];
      return { ...p, visited_status: nextStatus };
    }));
  };

  const handleAddList = () => {
    if (newListUrl) {
      toast({
        title: "List added!",
        description: "Your Google List has been imported (conceptual)."
      });
      setNewListUrl("");
      setAddListOpen(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Lists
            </h1>
            <p className="text-muted-foreground">Your saved places from Google Lists</p>
          </div>
          <Button variant="outline" onClick={() => setAddListOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add List
          </Button>
        </div>

        {/* Source attribution */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Map className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Austin Spots</p>
                <p className="text-sm text-muted-foreground">
                  Imported from Google Maps List · {places.length} places
                </p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => window.open("https://maps.app.goo.gl/GHdXjGMqno5KeNoX9", "_blank")}>
                <ExternalLink className="h-4 w-4" />
              </Button>
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
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
          <TabsList className="flex-wrap h-auto gap-1">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Places grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPlaces.map(place => (
            <Card key={place.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{place.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{place.category}</Badge>
                      <span className="text-sm text-muted-foreground">{place.neighborhood}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => cycleStatus(place.id)}
                  >
                    {place.visited_status === "favorite" ? (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ) : place.visited_status === "visited" ? (
                      <Check className="h-5 w-5 text-blue-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">{place.address}</p>
                
                {place.notes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">"{place.notes}"</p>
                )}
                
                <Badge className={`mt-2 ${statusColors[place.visited_status]}`} variant="secondary">
                  {statusLabels[place.visited_status]}
                </Badge>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => handlePlanOuting(place)}>
                    <Calendar className="h-4 w-4 mr-1" />
                    Plan outing
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare(place)}>
                    <MessageCircle className="h-4 w-4 mr-1" />
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
      </div>

      <CreateEventDialog 
        open={createEventOpen} 
        onOpenChange={setCreateEventOpen}
        prefilledLocation={selectedPlace?.name}
      />

      <WhatsAppShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        title={placeToShare?.name || ""}
        description={`${placeToShare?.category} in ${placeToShare?.neighborhood}`}
        location={placeToShare?.address}
      />

      {/* Add List Dialog */}
      <Dialog open={addListOpen} onOpenChange={setAddListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Google List</DialogTitle>
            <DialogDescription>
              Paste a Google Maps List URL to import places
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="listUrl">Google List URL</Label>
              <Input
                id="listUrl"
                placeholder="https://maps.app.goo.gl/..."
                value={newListUrl}
                onChange={e => setNewListUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleAddList} disabled={!newListUrl}>
              Import List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
