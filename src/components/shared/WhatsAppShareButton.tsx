import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppShareButtonProps {
  title: string;
  date?: string;
  location?: string;
  workoutUrl?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function WhatsAppShareButton({
  title,
  date,
  location,
  workoutUrl,
  variant = "outline",
  size = "sm",
  className,
}: WhatsAppShareButtonProps) {
  const handleShare = () => {
    const lines = [
      `🗓️ ${title}`,
      date && `📅 ${date}`,
      location && `📍 ${location}`,
      workoutUrl && `💪 Workout: ${workoutUrl}`,
      "",
      "Sent via Neighborly",
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button variant={variant} size={size} onClick={handleShare} className={className}>
      <MessageCircle className="h-4 w-4 mr-1" />
      WhatsApp
    </Button>
  );
}
