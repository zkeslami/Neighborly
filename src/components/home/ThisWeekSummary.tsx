import { Calendar, Dumbbell, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEvents } from "@/data/mockEvents";
import { mockFriends } from "@/data/mockFriends";
import { format } from "date-fns";

export function ThisWeekSummary() {
  const upcomingEvents = mockEvents.filter(e => e.status === "upcoming").slice(0, 3);
  const socialEvents = upcomingEvents.filter(e => e.event_type === "social");
  const workoutEvents = upcomingEvents.filter(e => e.event_type === "workout");

  const getFriendNames = (ids: string[]) => {
    return ids.map(id => mockFriends.find(f => f.id === id)?.name || "Unknown").join(", ");
  };

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
          {upcomingEvents.map(event => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`w-2 h-2 rounded-full mt-2 ${event.event_type === "workout" ? "bg-green-500" : "bg-blue-500"}`} />
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
