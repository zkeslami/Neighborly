import { Coffee, Utensils, Dumbbell, ExternalLink, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockFriends } from "@/data/mockFriends";
import { WhatsAppShareModal } from "@/components/shared/WhatsAppShareModal";
import { useState } from "react";

interface Suggestion {
  id: string;
  type: "reconnect" | "place" | "workout";
  title: string;
  description: string;
  friend_id?: string;
  place_name?: string;
  workout_name?: string;
}

const suggestions: Suggestion[] = [
  {
    id: "s1",
    type: "reconnect",
    title: "Coffee catch-up?",
    description: "You haven't seen Alex in 90 days—coffee at Epoch?",
    friend_id: "f1",
    place_name: "Epoch Coffee"
  },
  {
    id: "s2",
    type: "place",
    title: "Try that brunch spot",
    description: "You and Priya saved Paperboy—want to finally book it?",
    friend_id: "f2",
    place_name: "Paperboy"
  },
  {
    id: "s3",
    type: "workout",
    title: "Workout together?",
    description: "You and Sam haven't worked out in a while—try a GeneraFit routine together!",
    friend_id: "f3",
    workout_name: "Full-Body 30 Min HIIT"
  }
];

const iconMap = {
  reconnect: Coffee,
  place: Utensils,
  workout: Dumbbell
};

export function SuggestionCard() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  const handleShare = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setShareModalOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Suggestions for You</h3>
        {suggestions.map(suggestion => {
          const friend = mockFriends.find(f => f.id === suggestion.friend_id);
          const Icon = iconMap[suggestion.type];
          
          return (
            <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {friend && (
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={friend.avatar_url} alt={friend.name} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm text-foreground">{suggestion.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button size="sm" variant="default">
                        Plan this
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare(suggestion)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
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
      
      <WhatsAppShareModal 
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        title={selectedSuggestion?.title || ""}
        description={selectedSuggestion?.description || ""}
        location={selectedSuggestion?.place_name}
      />
    </>
  );
}
