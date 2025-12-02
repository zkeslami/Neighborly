import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Copy, CheckCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Input validation schema
const emailShareSchema = z.object({
  recipientEmail: z.string()
    .trim()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters")
    .email("Please enter a valid email address"),
  senderName: z.string()
    .trim()
    .min(1, "Sender name is required")
    .max(100, "Name must be less than 100 characters"),
  title: z.string().max(200, "Title must be less than 200 characters").optional(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  location: z.string().max(500, "Location must be less than 500 characters").optional(),
});

interface EmailShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  workoutLink?: string;
}

export function EmailShareModal({
  open,
  onOpenChange,
  title,
  description,
  date,
  location,
  workoutLink
}: EmailShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();

  const generateMessage = () => {
    let message = `🏠 Neighborly\n\n`;
    message += `📌 ${title}\n`;
    if (description) message += `${description}\n`;
    if (date) message += `📅 ${date}\n`;
    if (location) message += `📍 ${location}\n`;
    if (workoutLink) message += `💪 Workout: ${workoutLink}\n`;
    message += `\nSent via Neighborly`;
    return message;
  };

  const generateSubject = () => {
    return `Neighborly: ${title}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateMessage());
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailChange = (value: string) => {
    setRecipientEmail(value);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError(null);
    }
  };

  const validateEmail = (): boolean => {
    const result = emailShareSchema.shape.recipientEmail.safeParse(recipientEmail);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(generateSubject());
    const body = encodeURIComponent(generateMessage());
    const mailtoLink = recipientEmail 
      ? `mailto:${encodeURIComponent(recipientEmail)}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
  };

  const handleSendEmail = async () => {
    // Validate email before sending
    if (!validateEmail()) {
      return;
    }

    const senderName = profile?.name || 'A friend';

    // Full validation
    const validationResult = emailShareSchema.safeParse({
      recipientEmail,
      senderName,
      title,
      description,
      location
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      toast({ title: errorMessage, variant: "destructive" });
      return;
    }

    setSending(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-invitation', {
        body: {
          type: 'event_share',
          recipientEmail: validationResult.data.recipientEmail,
          senderName: validationResult.data.senderName,
          details: {
            title: validationResult.data.title,
            description: validationResult.data.description,
            date,
            location: validationResult.data.location
          }
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        // Fallback to mailto
        handleEmailShare();
        toast({ title: "Opening email client as fallback" });
      } else {
        toast({ title: "Email sent!", description: `Shared with ${recipientEmail}` });
        onOpenChange(false);
        setRecipientEmail('');
        setEmailError(null);
      }
    } catch (e) {
      console.error('Error:', e);
      handleEmailShare();
      toast({ title: "Opening email client" });
    } finally {
      setSending(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEmailError(null);
      setRecipientEmail('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Share via Email
          </DialogTitle>
          <DialogDescription>
            Share this with your friends via email
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="friend@example.com"
              value={recipientEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={validateEmail}
              className={emailError ? "border-destructive" : ""}
              maxLength={255}
            />
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>

          <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-line">
            {generateMessage()}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleCopy} 
              variant="outline" 
              className="flex-1"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button 
              onClick={handleSendEmail}
              className="flex-1"
              disabled={sending || !!emailError}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
