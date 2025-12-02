import { AppLayout } from "@/components/layout/AppLayout";
import { ThisWeekSummary } from "@/components/home/ThisWeekSummary";
import { MemoryHighlight } from "@/components/home/MemoryHighlight";
import { SuggestionCard } from "@/components/home/SuggestionCard";

export default function Home() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning! ☀️</h1>
          <p className="text-muted-foreground">Here's what's happening in your social world</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <ThisWeekSummary />
          <MemoryHighlight />
        </div>
        
        <SuggestionCard />
      </div>
    </AppLayout>
  );
}
