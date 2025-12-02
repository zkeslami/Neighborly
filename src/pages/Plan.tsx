import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, MapPin, Clock, Users, Dumbbell, ExternalLink, MessageCircle } from "lucide-react";
import { mockEvents, Event } from "@/data/mockEvents";
import { mockFriends } from "@/data/mockFriends";
import { format } from "date-fns";
import { CreateEventDialog } from "@/components/plan/CreateEventDialog";
import { EventDetailModal } from "@/components/plan/EventDetailModal";
import { WhatsAppShareModal } from "@/components/shared/WhatsAppShareModal";

export default function Plan() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [eventToShare, setEventToShare] = useState<Event | null>(null);

  const upcomingEvents = mockEvents.filter(e => e.status === "upcoming");
  const pastEvents = mockEvents.filter(e => e.status === "past");
  const suggestedEvents = mockEvents.filter(e => e.status === "suggested");

  const getFriendsByIds = (ids: string[]) => {
    return ids.map(id => mockFriends.find(f => f.id === id)).filter(Boolean);
  };

  const handleShare = (event: Event) => {
    setEventToShare(event);
    setShareModalOpen(true);
  };

  const EventCard = ({ event }: { event: Event }) => {
    const friends = getFriendsByIds(event.attendee_ids);
    const isWorkout = event.event_type === "workout";

    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEvent(event)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={isWorkout ? "default" : "secondary"} className={isWorkout ? "bg-green-600" : ""}>
                  {isWorkout ? <Dumbbell className="h-3 w-3 mr-1" /> : <Calendar className="h-3 w-3 mr-1" />}
                  {isWorkout ? "Workout" : "Social"}
                </Badge>
                {event.workout_name && (
                  <Badge variant="outline" className="text-xs">
                    {event.workout_name}
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-foreground">{event.title}</h3>
              
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(event.date), "EEE, MMM d 'at' h:mm a")}
                </span>
              </div>
              
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.location_name}
              </div>
              
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
          
          <div className="flex gap-2 mt-4" onClick={e => e.stopPropagation()}>
            <Button size="sm" variant="outline" onClick={() => handleShare(event)}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Share
            </Button>
            {isWorkout && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => window.open("https://generafit-ai.lovable.app/", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                GeneraFit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Plan
            </h1>
            <p className="text-muted-foreground">Coordinate events and workouts with friends</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="suggested">
              Suggested ({suggestedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming events</p>
                  <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                    Create your first event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggested" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {suggestedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateEventDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      
      <EventDetailModal 
        event={selectedEvent} 
        open={!!selectedEvent} 
        onOpenChange={(open) => !open && setSelectedEvent(null)} 
      />
      
      <WhatsAppShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        title={eventToShare?.title || ""}
        date={eventToShare ? format(new Date(eventToShare.date), "EEE, MMM d 'at' h:mm a") : ""}
        location={eventToShare?.location_name}
        workoutLink={eventToShare?.workout_id ? "https://generafit-ai.lovable.app/" : undefined}
      />
    </AppLayout>
  );
}
