import { Coffee, Utensils, Dumbbell, ExternalLink, Mail, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFriends } from "@/hooks/useFriends";
import { usePlaces } from "@/hooks/usePlaces";
import { EmailShareModal } from "@/components/shared/EmailShareModal";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface Suggestion {
  id: string;
  type: "reconnect" | "place" | "workout";
  title: string;
  description: string;
  friend?: { id: string; name: string; avatar_url: string | null };
  place_name?: string;
}

const iconMap = {
  reconnect: Coffee,
  place: Utensils,
  workout: Dumbbell
};

export function SuggestionCard() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const { friends } = useFriends();
  const { places } = usePlaces();
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    const result: Suggestion[] = [];

    // Suggest reconnecting with friends not seen recently
    const driftingFriends = friends
      .filter(f => (f.days_since_seen || 0) > 30)
      .slice(0, 1);

    driftingFriends.forEach(friend => {
      result.push({
        id: `reconnect-${friend.id}`,
        type: "reconnect",
        title: "Coffee catch-up?",
        description: `You haven't seen ${friend.name} in ${friend.days_since_seen || 'a while'} days`,
        friend: { id: friend.id, name: friend.name, avatar_url: friend.avatar_url }
      });
    });

    // Suggest visiting unvisited places
    const unvisitedPlaces = places
      .filter(p => p.visited_status === 'not_visited')
      .slice(0, 1);

    unvisitedPlaces.forEach(place => {
      result.push({
        id: `place-${place.id}`,
        type: "place",
        title: `Try ${place.name}`,
        description: `You saved this place but haven't visited yet`,
        place_name: place.name
      });
    });

    // Always suggest workout
    if (friends.length > 0) {
      const randomFriend = friends[Math.floor(Math.random() * friends.length)];
      result.push({
        id: "workout-suggestion",
        type: "workout",
        title: "Workout together?",
        description: `Invite ${randomFriend.name} to a GeneraFit workout!`,
        friend: { id: randomFriend.id, name: randomFriend.name, avatar_url: randomFriend.avatar_url }
      });
    }

    return result.slice(0, 3);
  }, [friends, places]);

  const handleShare = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setShareModalOpen(true);
  };

  if (suggestions.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-foreground mb-1">Add friends to get suggestions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We'll suggest ways to stay connected once you add some friends
          </p>
          <Button size="sm" onClick={() => navigate('/settings')}>
            Add Friends
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Suggestions for You</h3>
        {suggestions.map(suggestion => {
          const Icon = iconMap[suggestion.type];
          
          return (
            <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {suggestion.friend && (
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={suggestion.friend.avatar_url || undefined} alt={suggestion.friend.name} />
                      <AvatarFallback>{suggestion.friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm text-foreground">{suggestion.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button size="sm" variant="default" onClick={() => navigate('/plan')}>
                        Plan this
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare(suggestion)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      {suggestion.type === "workout" && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => window.open("https://generafit-ai.lovable.app/", "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          GeneraFit AI
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <EmailShareModal 
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        title={selectedSuggestion?.title || ""}
        description={selectedSuggestion?.description || ""}
        location={selectedSuggestion?.place_name}
      />
    </>
  );
}
