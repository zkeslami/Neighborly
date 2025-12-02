import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMemories } from "@/data/mockMemories";
import { mockFriends } from "@/data/mockFriends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MemoryHighlight() {
  const memory = mockMemories.find(m => m.memory_type === "milestone") || mockMemories[0];
  
  const friends = memory.friend_ids.map(id => mockFriends.find(f => f.id === id)).filter(Boolean);

  return (
    <Card className="bg-gradient-to-br from-card to-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          One Year Ago Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-foreground font-medium">{memory.title}</p>
          <p className="text-sm text-muted-foreground">{memory.description}</p>
          
          <div className="flex items-center gap-2 pt-2">
            <div className="flex -space-x-2">
              {friends.slice(0, 3).map((friend) => (
                <Avatar key={friend?.id} className="w-8 h-8 border-2 border-background">
                  <AvatarImage src={friend?.avatar_url} alt={friend?.name} />
                  <AvatarFallback>{friend?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {friends.map(f => f?.name).join(", ")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
