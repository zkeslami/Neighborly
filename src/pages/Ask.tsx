import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle, Plus, MapPin, AlertTriangle, Clock } from "lucide-react";
import { mockQuestions, Question } from "@/data/mockQuestions";
import { mockAlerts, LocalAlert } from "@/data/mockAlerts";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const categoryColors: Record<string, string> = {
  "Home Repair": "bg-orange-100 text-orange-700",
  "Food & Drink": "bg-green-100 text-green-700",
  "Fitness": "bg-blue-100 text-blue-700",
  "Safety": "bg-red-100 text-red-700",
  "Events": "bg-purple-100 text-purple-700",
  "Utilities": "bg-yellow-100 text-yellow-700",
  "Recreation": "bg-teal-100 text-teal-700",
  "Traffic": "bg-gray-100 text-gray-700"
};

export default function Ask() {
  const [askDialogOpen, setAskDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const { toast } = useToast();

  const handleSubmitQuestion = () => {
    if (newQuestion && newCategory) {
      toast({
        title: "Question posted!",
        description: "Your question has been shared with your community."
      });
      setNewQuestion("");
      setNewCategory("");
      setNewLocation("");
      setIsUrgent(false);
      setAskDialogOpen(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              Ask the Community
            </h1>
            <p className="text-muted-foreground">Get trusted local recommendations from your network</p>
          </div>
          <Button onClick={() => setAskDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ask a Question
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Questions Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Questions</h2>
            
            {mockQuestions.map(question => (
              <Card key={question.id} className={question.is_urgent ? "border-red-300 bg-red-50/50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {question.is_urgent && (
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={categoryColors[question.category] || "bg-muted"} variant="secondary">
                          {question.category}
                        </Badge>
                        {question.location_name && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {question.location_name}
                          </span>
                        )}
                        {question.is_urgent && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-foreground">{question.question}</h3>
                      
                      {/* Answers */}
                      <div className="mt-4 space-y-3">
                        {question.answers.map(answer => (
                          <div key={answer.id} className="flex items-start gap-3 pl-4 border-l-2 border-muted">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={answer.friend_avatar} />
                              <AvatarFallback>{answer.friend_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">{answer.friend_name}</p>
                              <p className="text-sm text-muted-foreground">{answer.text}</p>
                              {answer.location_name && (
                                <span className="text-xs text-primary flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {answer.location_name}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" variant="ghost">
                          Answer
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {question.answers.length} {question.answers.length === 1 ? "answer" : "answers"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Local Alerts Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Local Alerts
            </h2>
            
            <div className="space-y-3">
              {mockAlerts.map(alert => (
                <Card key={alert.id} className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <Badge className={`${categoryColors[alert.category] || "bg-muted"} text-xs shrink-0`} variant="secondary">
                        {alert.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mt-2">{alert.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-primary">{alert.source}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ask Question Dialog */}
      <Dialog open={askDialogOpen} onOpenChange={setAskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
            <DialogDescription>
              Get help from friends and neighbors in your community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Your Question</Label>
              <Textarea
                id="question"
                placeholder="e.g., Best coffee shop for remote work near downtown?"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                  <SelectItem value="Home Repair">Home Repair</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location">Location (optional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  className="pl-9"
                  placeholder="e.g., East Austin"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="urgent">Mark as Urgent</Label>
                <p className="text-xs text-muted-foreground">For time-sensitive questions</p>
              </div>
              <Switch
                id="urgent"
                checked={isUrgent}
                onCheckedChange={setIsUrgent}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleSubmitQuestion}
              disabled={!newQuestion || !newCategory}
            >
              Post Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
