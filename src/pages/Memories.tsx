import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, Dumbbell, MapPin, Users, Loader2, Sparkles } from "lucide-react";
import { useMemories } from "@/hooks/useMemories";
import { useFriends } from "@/hooks/useFriends";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const memoryTypeIcons: Record<string, any> = {
  timeline: Heart,
  trip: MapPin,
  workout_streak: Dumbbell,
  milestone: Calendar,
  event: Calendar
};

const memoryTypeColors: Record<string, string> = {
  timeline: "bg-primary/10 text-primary",
  trip: "bg-accent/10 text-accent",
  workout_streak: "bg-accent/10 text-accent",
  milestone: "bg-primary/10 text-primary",
  event: "bg-muted text-muted-foreground"
};

export default function Memories() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const { memories, loading: memoriesLoading } = useMemories();
  const { friends, loading: friendsLoading } = useFriends();
  const navigate = useNavigate();

  const loading = memoriesLoading || friendsLoading;

  const filteredMemories = selectedFriend
    ? memories.filter(m => m.friend_ids?.includes(selectedFriend))
    : memories;

  const getFriends = (ids: string[] | null) => {
    if (!ids) return [];
    return ids.map(id => friends.find(f => f.id === id)).filter(Boolean);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Memories
          </h1>
          <p className="text-muted-foreground">Your relationship history and shared moments</p>
        </div>

        {friends.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedFriend === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFriend(null)}
            >
              All
            </Button>
            {friends.slice(0, 5).map(friend => (
              <Button
                key={friend.id}
                variant={selectedFriend === friend.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFriend(friend.id)}
                className="flex items-center gap-2"
              >
                <Avatar className="w-5 h-5">
                  <AvatarImage src={friend.avatar_url || undefined} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {friend.name.split(" ")[0]}
              </Button>
            ))}
          </div>
        )}

        {memories.length === 0 ? (
          <Card className="bg-muted/30">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No memories yet</h2>
              <p className="text-muted-foreground mb-4">
                Memories are created automatically as you plan events and hang out with friends.
              </p>
              <Button onClick={() => navigate('/plan')}>Plan an Event</Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Memories</TabsTrigger>
              <TabsTrigger value="workouts">Workouts</TabsTrigger>
              <TabsTrigger value="trips">Trips</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredMemories.map(memory => {
                const Icon = memoryTypeIcons[memory.memory_type] || Calendar;
                const memoryFriends = getFriends(memory.friend_ids);
                
                return (
                  <Card key={memory.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {memory.image_url && (
                          <img 
                            src={memory.image_url} 
                            alt={memory.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Badge className={memoryTypeColors[memory.memory_type] || "bg-muted"} variant="secondary">
                                <Icon className="h-3 w-3 mr-1" />
                                {memory.memory_type.replace("_", " ")}
                              </Badge>
                              <h3 className="font-semibold text-foreground mt-2">{memory.title}</h3>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(memory.date), "MMM d, yyyy")}
                            </span>
                          </div>
                          {memory.description && (
                            <p className="text-sm text-muted-foreground mt-1">{memory.description}</p>
                          )}
                          
                          {memoryFriends.length > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                              <div className="flex -space-x-2">
                                {memoryFriends.slice(0, 3).map(friend => (
                                  <Avatar key={friend?.id} className="w-6 h-6 border-2 border-background">
                                    <AvatarImage src={friend?.avatar_url || undefined} />
                                    <AvatarFallback>{friend?.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {memoryFriends.map(f => f?.name?.split(" ")[0]).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="workouts" className="space-y-4">
              {filteredMemories.filter(m => m.memory_type === "workout_streak").length === 0 ? (
                <Card className="bg-muted/30">
                  <CardContent className="p-6 text-center">
                    <Dumbbell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No workout memories yet</p>
                  </CardContent>
                </Card>
              ) : (
                filteredMemories.filter(m => m.memory_type === "workout_streak").map(memory => {
                  const memoryFriends = getFriends(memory.friend_ids);
                  return (
                    <Card key={memory.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Dumbbell className="h-8 w-8 text-accent" />
                          <div>
                            <h3 className="font-semibold text-foreground">{memory.title}</h3>
                            <p className="text-sm text-muted-foreground">{memory.description}</p>
                            {memoryFriends.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                {memoryFriends.map(friend => (
                                  <Avatar key={friend?.id} className="w-6 h-6">
                                    <AvatarImage src={friend?.avatar_url || undefined} />
                                    <AvatarFallback>{friend?.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="trips" className="space-y-4">
              {filteredMemories.filter(m => m.memory_type === "trip").length === 0 ? (
                <Card className="bg-muted/30">
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No trip memories yet</p>
                  </CardContent>
                </Card>
              ) : (
                filteredMemories.filter(m => m.memory_type === "trip").map(memory => {
                  const memoryFriends = getFriends(memory.friend_ids);
                  return (
                    <Card key={memory.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {memory.image_url && (
                            <img 
                              src={memory.image_url} 
                              alt={memory.title}
                              className="w-32 h-24 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground">{memory.title}</h3>
                            <p className="text-sm text-muted-foreground">{memory.description}</p>
                            {memoryFriends.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                {memoryFriends.map(friend => (
                                  <Avatar key={friend?.id} className="w-6 h-6">
                                    <AvatarImage src={friend?.avatar_url || undefined} />
                                    <AvatarFallback>{friend?.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        )}

        {selectedFriend && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Friend Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const friend = friends.find(f => f.id === selectedFriend);
                if (!friend) return null;
                return (
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={friend.avatar_url || undefined} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{friend.name}</h3>
                      {friend.relationship_start && (
                        <p className="text-sm text-muted-foreground">
                          Friends since {format(new Date(friend.relationship_start), "MMMM yyyy")}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Last hangout: {friend.last_hangout ? format(new Date(friend.last_hangout), "MMM d, yyyy") : "Never"}
                      </p>
                      {friend.tags && friend.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {friend.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" onClick={() => navigate('/plan')}>Plan something</Button>
                        <Button size="sm" variant="outline" onClick={() => navigate('/plan')}>Plan a workout</Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
