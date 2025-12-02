import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  workoutLink?: string;
}

export function WhatsAppShareModal({
  open,
  onOpenChange,
  title,
  description,
  date,
  location,
  workoutLink
}: WhatsAppShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateMessage());
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(generateMessage());
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Share to WhatsApp
          </DialogTitle>
          <DialogDescription>
            Share this with your friends on WhatsApp
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
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
              onClick={handleWhatsAppShare}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
