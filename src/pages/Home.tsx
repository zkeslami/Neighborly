import { AppLayout } from "@/components/layout/AppLayout";
import { ThisWeekSummary } from "@/components/home/ThisWeekSummary";
import { MemoryHighlight } from "@/components/home/MemoryHighlight";
import { SuggestionCard } from "@/components/home/SuggestionCard";
import { WelcomeGuide } from "@/components/home/WelcomeGuide";
import { useEvents } from "@/hooks/useEvents";
import { useFriends } from "@/hooks/useFriends";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { events, loading: eventsLoading } = useEvents();
  const { friends, loading: friendsLoading } = useFriends();
  const { profile } = useProfile();

  const loading = eventsLoading || friendsLoading;
  const hasData = events.length > 0 || friends.length > 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}! ☀️
          </h1>
          <p className="text-muted-foreground">
            {hasData ? "Here's what's happening in your social world" : "Let's set up your social life OS"}
          </p>
        </div>

        {hasData ? (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <ThisWeekSummary />
              <MemoryHighlight />
            </div>
            <SuggestionCard />
          </>
        ) : (
          <WelcomeGuide />
        )}
      </div>
    </AppLayout>
  );
}
