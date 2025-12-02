import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Dumbbell, ExternalLink, MessageCircle, Copy, Navigation } from "lucide-react";
import { Event } from "@/data/mockEvents";
import { mockFriends } from "@/data/mockFriends";
import { format } from "date-fns";
import { useState } from "react";
import { WhatsAppShareModal } from "@/components/shared/WhatsAppShareModal";
import { useToast } from "@/hooks/use-toast";

interface EventDetailModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailModal({ event, open, onOpenChange }: EventDetailModalProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const { toast } = useToast();

  if (!event) return null;

  const friends = event.attendee_ids.map(id => mockFriends.find(f => f.id === id)).filter(Boolean);
  const isWorkout = event.event_type === "workout";

  const handleCopyWorkoutLink = () => {
    navigator.clipboard.writeText("https://generafit-ai.lovable.app/");
    toast({ title: "Workout link copied!" });
  };

  const handleShareDirections = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_address || event.location_name)}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isWorkout ? "default" : "secondary"} className={isWorkout ? "bg-green-600" : ""}>
                {isWorkout ? <Dumbbell className="h-3 w-3 mr-1" /> : <Calendar className="h-3 w-3 mr-1" />}
                {isWorkout ? "Workout" : "Social"}
              </Badge>
              {event.workout_name && (
                <Badge variant="outline">{event.workout_name}</Badge>
              )}
            </div>
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Date & Time */}
            <div className="flex items-center gap-3 text-foreground">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-foreground font-medium">{event.location_name}</p>
                {event.location_address && (
                  <p className="text-sm text-muted-foreground">{event.location_address}</p>
                )}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Map view</p>
              </div>
            </div>

            {/* Attendees */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Attendees</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {friends.map(friend => (
                  <div key={friend?.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={friend?.avatar_url} />
                      <AvatarFallback>{friend?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{friend?.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {event.notes && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{event.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={() => setShareOpen(true)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Share to WhatsApp
              </Button>
              
              {isWorkout && (
                <Button variant="outline" onClick={handleCopyWorkoutLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy workout link
                </Button>
              )}
              
              <Button variant="outline" onClick={handleShareDirections}>
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>

              {isWorkout && (
                <Button 
                  variant="ghost"
                  onClick={() => window.open("https://generafit-ai.lovable.app/", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in GeneraFit AI
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <WhatsAppShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        title={event.title}
        date={format(new Date(event.date), "EEEE, MMMM d 'at' h:mm a")}
        location={`${event.location_name}${event.location_address ? ` - ${event.location_address}` : ""}`}
        workoutLink={isWorkout ? "https://generafit-ai.lovable.app/" : undefined}
      />
    </>
  );
}
