import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, Dumbbell, MapPin, Users } from "lucide-react";
import { mockMemories } from "@/data/mockMemories";
import { mockFriends } from "@/data/mockFriends";
import { format } from "date-fns";

const memoryTypeIcons = {
  timeline: Heart,
  trip: MapPin,
  workout_streak: Dumbbell,
  milestone: Calendar
};

const memoryTypeColors = {
  timeline: "bg-pink-100 text-pink-700",
  trip: "bg-blue-100 text-blue-700",
  workout_streak: "bg-green-100 text-green-700",
  milestone: "bg-purple-100 text-purple-700"
};

export default function Memories() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const filteredMemories = selectedFriend
    ? mockMemories.filter(m => m.friend_ids.includes(selectedFriend))
    : mockMemories;

  const getFriends = (ids: string[]) => {
    return ids.map(id => mockFriends.find(f => f.id === id)).filter(Boolean);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" />
            Memories
          </h1>
          <p className="text-muted-foreground">Your relationship history and shared moments</p>
        </div>

        {/* Friend Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedFriend === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFriend(null)}
          >
            All
          </Button>
          {mockFriends.slice(0, 5).map(friend => (
            <Button
              key={friend.id}
              variant={selectedFriend === friend.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFriend(friend.id)}
              className="flex items-center gap-2"
            >
              <Avatar className="w-5 h-5">
                <AvatarImage src={friend.avatar_url} />
                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {friend.name.split(" ")[0]}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Memories</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredMemories.map(memory => {
              const Icon = memoryTypeIcons[memory.memory_type];
              const friends = getFriends(memory.friend_ids);
              
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
                            <Badge className={memoryTypeColors[memory.memory_type]} variant="secondary">
                              <Icon className="h-3 w-3 mr-1" />
                              {memory.memory_type.replace("_", " ")}
                            </Badge>
                            <h3 className="font-semibold text-foreground mt-2">{memory.title}</h3>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(memory.date), "MMM d, yyyy")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{memory.description}</p>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex -space-x-2">
                            {friends.slice(0, 3).map(friend => (
                              <Avatar key={friend?.id} className="w-6 h-6 border-2 border-background">
                                <AvatarImage src={friend?.avatar_url} />
                                <AvatarFallback>{friend?.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {friends.map(f => f?.name?.split(" ")[0]).join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="workouts" className="space-y-4">
            {filteredMemories.filter(m => m.memory_type === "workout_streak").map(memory => {
              const friends = getFriends(memory.friend_ids);
              return (
                <Card key={memory.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Dumbbell className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-semibold text-foreground">{memory.title}</h3>
                        <p className="text-sm text-muted-foreground">{memory.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {friends.map(friend => (
                            <Avatar key={friend?.id} className="w-6 h-6">
                              <AvatarImage src={friend?.avatar_url} />
                              <AvatarFallback>{friend?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="trips" className="space-y-4">
            {filteredMemories.filter(m => m.memory_type === "trip").map(memory => {
              const friends = getFriends(memory.friend_ids);
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
                        <div className="flex items-center gap-2 mt-2">
                          {friends.map(friend => (
                            <Avatar key={friend?.id} className="w-6 h-6">
                              <AvatarImage src={friend?.avatar_url} />
                              <AvatarFallback>{friend?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Friend Detail Section */}
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
                const friend = mockFriends.find(f => f.id === selectedFriend);
                if (!friend) return null;
                return (
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={friend.avatar_url} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{friend.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Friends since {format(new Date(friend.relationship_start), "MMMM yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last hangout: {friend.last_hangout ? format(new Date(friend.last_hangout), "MMM d, yyyy") : "Never"}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {friend.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm">Plan something</Button>
                        <Button size="sm" variant="outline">Plan a workout</Button>
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
