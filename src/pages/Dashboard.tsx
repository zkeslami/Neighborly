import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, Dumbbell, MapPin, Calendar, TrendingUp, Heart } from "lucide-react";
import { mockFriends } from "@/data/mockFriends";
import { mockEvents } from "@/data/mockEvents";
import { mockPlaces } from "@/data/mockPlaces";

export default function Dashboard() {
  const recentFriends = mockFriends.filter(f => f.days_since_seen <= 14);
  const driftingFriends = mockFriends.filter(f => f.days_since_seen > 30);
  const workoutEvents = mockEvents.filter(e => e.event_type === "workout");
  const socialEvents = mockEvents.filter(e => e.event_type === "social");

  // Calculate social wellness score
  const recentHangouts = socialEvents.filter(e => e.status === "past" || e.status === "upcoming").length;
  const recentWorkouts = workoutEvents.filter(e => e.status === "past" || e.status === "upcoming").length;
  const visitedPlaces = mockPlaces.filter(p => p.visited_status !== "not_visited").length;
  const wellnessScore = Math.min(100, Math.round(
    (recentHangouts * 15) + (recentWorkouts * 10) + (visitedPlaces * 5) + (recentFriends.length * 5)
  ));

  // Neighborhood stats
  const neighborhoods = mockPlaces.reduce((acc, place) => {
    acc[place.neighborhood] = (acc[place.neighborhood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topNeighborhoods = Object.entries(neighborhoods)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground">Your social wellness overview</p>
        </div>

        {/* Social Wellness Score */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Social Wellness Score</h2>
                <p className="text-sm text-muted-foreground">Based on your recent social activity</p>
              </div>
              <div className="text-4xl font-bold text-primary">{wellnessScore}</div>
            </div>
            <Progress value={wellnessScore} className="h-3" />
            <div className="grid grid-cols-4 gap-4 mt-4 text-center">
              <div>
                <p className="text-2xl font-semibold text-foreground">{recentHangouts}</p>
                <p className="text-xs text-muted-foreground">Hangouts</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{recentWorkouts}</p>
                <p className="text-xs text-muted-foreground">Workouts</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{recentFriends.length}</p>
                <p className="text-xs text-muted-foreground">Friends seen</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{visitedPlaces}</p>
                <p className="text-xs text-muted-foreground">Places visited</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Connections */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Recent Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentFriends.slice(0, 4).map(friend => (
                  <div key={friend.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={friend.avatar_url} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {friend.days_since_seen === 0 ? "Today" : `${friend.days_since_seen} days ago`}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Recent
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Drifting Friends */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-orange-500" />
                Haven't Seen in a While
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {driftingFriends.slice(0, 4).map(friend => (
                  <div key={friend.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={friend.avatar_url} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {friend.days_since_seen} days since last hangout
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Reconnect
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Workouts with Friends */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-blue-500" />
                Workouts with Friends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workoutEvents.slice(0, 3).map(event => {
                  const friends = event.attendee_ids.map(id => mockFriends.find(f => f.id === id)).filter(Boolean);
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Dumbbell className="h-8 w-8 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{event.workout_name || event.title}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1">
                            {friends.slice(0, 2).map(f => (
                              <Avatar key={f?.id} className="w-5 h-5 border border-background">
                                <AvatarImage src={f?.avatar_url} />
                                <AvatarFallback className="text-xs">{f?.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            with {friends.map(f => f?.name?.split(" ")[0]).join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Button variant="outline" className="w-full" size="sm">
                  Plan a workout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Neighborhoods */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-500" />
                Your Neighborhoods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topNeighborhoods.map(([name, count], index) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 ? "bg-purple-100 text-purple-700" :
                      index === 1 ? "bg-blue-100 text-blue-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">{count} saved places</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Boost Your Wellness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground font-medium">
                    {driftingFriends.length} friends you haven't seen in a while
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    Plan a hangout
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground font-medium">
                    Haven't done a group workout in 2 weeks
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    Invite someone to GeneraFit
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground font-medium">
                    {mockPlaces.filter(p => p.visited_status === "not_visited").length} places left to explore
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    Pick from your list
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
