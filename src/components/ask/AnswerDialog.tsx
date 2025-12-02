import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import type { Question, Answer } from "@/hooks/useQuestions";

interface AnswerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  onAnswerSubmitted: () => void;
}

export function AnswerDialog({ open, onOpenChange, question, onAnswerSubmitted }: AnswerDialogProps) {
  const [answerText, setAnswerText] = useState("");
  const [locationName, setLocationName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();

  const handleSubmit = async () => {
    if (!answerText.trim() || !question || !user) return;

    setSubmitting(true);

    const newAnswer: Answer = {
      id: crypto.randomUUID(),
      friend_name: profile?.name || user.email?.split("@")[0] || "Anonymous",
      friend_avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      text: answerText.trim(),
      location_name: locationName.trim() || undefined,
    };

    const updatedAnswers = [...(question.answers || []), newAnswer];

    const { error } = await supabase
      .from("questions")
      .update({ answers: updatedAnswers as unknown as any })
      .eq("id", question.id);

    setSubmitting(false);

    if (error) {
      toast({ title: "Error submitting answer", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Answer submitted!" });
    setAnswerText("");
    setLocationName("");
    onOpenChange(false);
    onAnswerSubmitted();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Answer Question</DialogTitle>
          <DialogDescription>
            {question?.question}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="answer">Your Answer</Label>
            <Textarea
              id="answer"
              placeholder="Share your recommendation or advice..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location">Location (optional)</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                className="pl-9"
                placeholder="e.g., Joe's Coffee on South Congress"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!answerText.trim() || submitting}
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Answer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
