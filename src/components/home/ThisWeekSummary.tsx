import { Calendar, Dumbbell, Users, CalendarPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { useFriends } from "@/hooks/useFriends";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export function ThisWeekSummary() {
  const { upcomingEvents } = useEvents();
  const { friends } = useFriends();
  const navigate = useNavigate();

  const events = upcomingEvents.slice(0, 3);
  const socialEvents = events.filter(e => e.event_type === "social");
  const workoutEvents = events.filter(e => e.event_type === "workout");

  const getFriendNames = (ids: string[] | null) => {
    if (!ids || ids.length === 0) return "Just you";
    return ids.map(id => friends.find(f => f.id === id)?.name || "Friend").join(", ");
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            This Week with Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <CalendarPlus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">No events planned yet</p>
            <Button size="sm" onClick={() => navigate('/plan')}>
              Plan something
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          This Week with Friends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{socialEvents.length} hangouts</span>
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="h-4 w-4" />
            <span>{workoutEvents.length} workouts</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`w-2 h-2 rounded-full mt-2 ${event.event_type === "workout" ? "bg-accent" : "bg-primary"}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.date), "EEE, MMM d 'at' h:mm a")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  with {getFriendNames(event.attendee_ids)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
