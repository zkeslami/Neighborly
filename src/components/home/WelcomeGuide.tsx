import { Users, Calendar, MapPin, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GuideCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}

function GuideCard({ icon, title, description, action, onClick }: GuideCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button onClick={onClick} size="sm" className="mt-2">
            {action}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function WelcomeGuide() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Neighborly! 🎉</h2>
          <p className="text-muted-foreground">
            Your social life OS is ready. Let's get you started with a few quick actions.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <GuideCard
          icon={<Users className="h-6 w-6 text-primary" />}
          title="Invite Friends"
          description="Send invites to people you want to hang out with"
          action="Add Friends"
          onClick={() => navigate('/settings')}
        />
        <GuideCard
          icon={<Calendar className="h-6 w-6 text-primary" />}
          title="Plan Your First Event"
          description="Schedule a coffee, dinner, or workout with friends"
          action="Create Event"
          onClick={() => navigate('/plan')}
        />
        <GuideCard
          icon={<MapPin className="h-6 w-6 text-primary" />}
          title="Explore Your Places"
          description="Import your Google Maps lists or add favorite spots"
          action="View Lists"
          onClick={() => navigate('/lists')}
        />
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-medium text-foreground mb-2">💡 Pro tip</h3>
          <p className="text-sm text-muted-foreground">
            Import your saved places from Google Takeout to quickly populate your lists. 
            Go to <a href="https://takeout.google.com" target="_blank" rel="noopener" className="text-primary underline">takeout.google.com</a>, 
            select "Saved" under Maps, then import the JSON file in your Lists page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
