import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, Dumbbell, MapPin, TrendingUp, Heart, Loader2 } from "lucide-react";
import { useFriends } from "@/hooks/useFriends";
import { useEvents } from "@/hooks/useEvents";
import { usePlaces } from "@/hooks/usePlaces";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { friends, loading: friendsLoading } = useFriends();
  const { events, loading: eventsLoading } = useEvents();
  const { places, loading: placesLoading } = usePlaces();
  const navigate = useNavigate();

  const loading = friendsLoading || eventsLoading || placesLoading;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const recentFriends = friends.filter(f => (f.days_since_seen || 0) <= 14);
  const driftingFriends = friends.filter(f => (f.days_since_seen || 0) > 30);
  const workoutEvents = events.filter(e => e.event_type === "workout");
  const socialEvents = events.filter(e => e.event_type === "social");

  const recentHangouts = socialEvents.length;
  const recentWorkouts = workoutEvents.length;
  const visitedPlaces = places.filter(p => p.visited_status !== "not_visited").length;
  const wellnessScore = Math.min(100, Math.round(
    (recentHangouts * 15) + (recentWorkouts * 10) + (visitedPlaces * 5) + (recentFriends.length * 5)
  ));

  const hasData = friends.length > 0 || events.length > 0 || places.length > 0;

  if (!hasData) {
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

          <Card className="bg-muted/30">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No data yet</h2>
              <p className="text-muted-foreground mb-4">
                Start by adding friends and planning events to see your social wellness insights.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/settings')}>Add Friends</Button>
                <Button variant="outline" onClick={() => navigate('/plan')}>Plan Event</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Recent Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentFriends.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent connections. Plan a hangout!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentFriends.slice(0, 4).map(friend => (
                    <div key={friend.id} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={friend.avatar_url || undefined} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{friend.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {friend.days_since_seen === 0 ? "Today" : `${friend.days_since_seen} days ago`}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        Recent
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Haven't Seen in a While
              </CardTitle>
            </CardHeader>
            <CardContent>
              {driftingFriends.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  You're staying connected with everyone!
                </p>
              ) : (
                <div className="space-y-3">
                  {driftingFriends.slice(0, 4).map(friend => (
                    <div key={friend.id} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={friend.avatar_url || undefined} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{friend.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {friend.days_since_seen} days since last hangout
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => navigate('/plan')}>
                        Reconnect
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-accent" />
                Workouts with Friends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workoutEvents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">No workouts planned yet</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/plan')}>
                    Plan a workout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {workoutEvents.slice(0, 3).map(event => {
                    const eventFriends = (event.attendee_ids || []).map(id => friends.find(f => f.id === id)).filter(Boolean);
                    return (
                      <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <Dumbbell className="h-8 w-8 text-accent" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{event.workout_name || event.title}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {eventFriends.slice(0, 2).map(f => (
                                <Avatar key={f?.id} className="w-5 h-5 border border-background">
                                  <AvatarImage src={f?.avatar_url || undefined} />
                                  <AvatarFallback className="text-xs">{f?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              with {eventFriends.map(f => f?.name?.split(" ")[0]).join(", ") || "you"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Button variant="outline" className="w-full" size="sm" onClick={() => navigate('/plan')}>
                    Plan a workout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Your Places
              </CardTitle>
            </CardHeader>
            <CardContent>
              {places.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">No places saved yet</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/lists')}>
                    Add Places
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total saved</span>
                    <span className="font-medium text-foreground">{places.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Visited</span>
                    <span className="font-medium text-foreground">{visitedPlaces}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">To explore</span>
                    <span className="font-medium text-foreground">{places.length - visitedPlaces}</span>
                  </div>
                  <Button variant="outline" className="w-full" size="sm" onClick={() => navigate('/lists')}>
                    View all places
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {(driftingFriends.length > 0 || places.filter(p => p.visited_status === 'not_visited').length > 0) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Boost Your Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {driftingFriends.length > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <p className="text-sm text-foreground font-medium">
                        {driftingFriends.length} friend{driftingFriends.length > 1 ? 's' : ''} you haven't seen in a while
                      </p>
                      <Button size="sm" className="mt-2" variant="outline" onClick={() => navigate('/plan')}>
                        Plan a hangout
                      </Button>
                    </CardContent>
                  </Card>
                )}
                {places.filter(p => p.visited_status === 'not_visited').length > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <p className="text-sm text-foreground font-medium">
                        {places.filter(p => p.visited_status === 'not_visited').length} places left to explore
                      </p>
                      <Button size="sm" className="mt-2" variant="outline" onClick={() => navigate('/lists')}>
                        Pick from your list
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
