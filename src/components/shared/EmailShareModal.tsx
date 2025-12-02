import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Copy, CheckCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

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

  const handleEmailShare = () => {
    const subject = encodeURIComponent(generateSubject());
    const body = encodeURIComponent(generateMessage());
    const mailtoLink = recipientEmail 
      ? `mailto:${recipientEmail}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
  };

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      toast({ title: "Please enter an email address", variant: "destructive" });
      return;
    }

    setSending(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-invitation', {
        body: {
          type: 'event_share',
          recipientEmail,
          senderName: profile?.name || 'A friend',
          details: {
            title,
            description,
            date,
            location
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
      }
    } catch (e) {
      console.error('Error:', e);
      handleEmailShare();
      toast({ title: "Opening email client" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
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
              disabled={sending}
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
