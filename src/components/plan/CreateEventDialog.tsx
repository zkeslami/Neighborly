import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Coffee, Utensils, MapPin, Film, Briefcase, Plane, Dumbbell, ExternalLink, Check, Loader2 } from "lucide-react";
import { useFriends } from "@/hooks/useFriends";
import { useEvents } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefilledLocation?: string;
}

const eventTypes = [
  { id: "dinner", label: "Dinner", icon: Utensils },
  { id: "coffee", label: "Coffee", icon: Coffee },
  { id: "brunch", label: "Brunch", icon: Utensils },
  { id: "movie", label: "Movie", icon: Film },
  { id: "coworking", label: "Coworking", icon: Briefcase },
  { id: "trip", label: "Trip", icon: Plane },
  { id: "workout", label: "Workout", icon: Dumbbell },
];

export function CreateEventDialog({ open, onOpenChange, prefilledLocation }: CreateEventDialogProps) {
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState<string>("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState(prefilledLocation || "");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const { friends, loading: friendsLoading } = useFriends();
  const { createEvent } = useEvents();
  const { toast } = useToast();

  useEffect(() => {
    if (prefilledLocation) {
      setLocation(prefilledLocation);
    }
  }, [prefilledLocation]);

  const resetForm = () => {
    setStep(1);
    setEventType("");
    setSelectedFriends([]);
    setTitle("");
    setDate("");
    setTime("");
    setLocation(prefilledLocation || "");
    setNotes("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreate = async () => {
    setSaving(true);
    
    const dateTime = new Date(`${date}T${time}`);
    
    const event = await createEvent({
      title: title || `${eventTypes.find(t => t.id === eventType)?.label} with friends`,
      event_type: eventType,
      date: dateTime.toISOString(),
      location_name: location || null,
      location_address: null,
      latitude: null,
      longitude: null,
      notes: notes || null,
      workout_id: null,
      workout_name: eventType === "workout" ? "Custom Workout" : null,
      attendee_ids: selectedFriends,
      status: 'upcoming'
    });

    setSaving(false);
    
    if (event) {
      handleClose();
    }
  };

  const isWorkout = eventType === "workout";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Step {step} of 3
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <Label>What type of event?</Label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map(type => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={eventType === type.id ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => setEventType(type.id)}
                  >
                    <Icon className="h-6 w-6" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
            <Button 
              className="w-full" 
              disabled={!eventType}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Label>Who's joining? (optional)</Label>
            {friendsLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : friends.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  No friends added yet. You can add friends in Settings.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                {friends.map(friend => (
                  <Button
                    key={friend.id}
                    variant={selectedFriends.includes(friend.id) ? "default" : "outline"}
                    className="h-auto py-3 justify-start"
                    onClick={() => toggleFriend(friend.id)}
                  >
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarImage src={friend.avatar_url || undefined} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{friend.name.split(" ")[0]}</span>
                    {selectedFriends.includes(friend.id) && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input 
                id="title"
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder={`${eventTypes.find(t => t.id === eventType)?.label} with friends`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date"
                  type="date" 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time"
                  type="time" 
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="location"
                  className="pl-9"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Search for a place..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea 
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any additional details..."
              />
            </div>
            {isWorkout && (
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => window.open("https://generafit-ai.lovable.app/", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Browse workouts on GeneraFit AI
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button 
                className="flex-1" 
                disabled={!date || !time || saving}
                onClick={handleCreate}
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Event
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
