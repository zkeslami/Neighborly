import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Users, Plus, Pencil, Trash2, Loader2, Mail, Clock } from "lucide-react";
import { useFriends, Friend } from "@/hooks/useFriends";
import { formatDistanceToNow } from "date-fns";

export function FriendsManagement() {
  const { friends, invitations, loading, addFriend, inviteFriend, updateFriend, deleteFriend } = useFriends();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await addFriend(newName.trim());
    if (newEmail.trim()) {
      await inviteFriend(newEmail.trim());
    }
    setSaving(false);
    setNewName("");
    setNewEmail("");
    setAddDialogOpen(false);
  };

  const handleEdit = async () => {
    if (!selectedFriend || !newName.trim()) return;
    setSaving(true);
    await updateFriend(selectedFriend.id, { name: newName.trim() });
    setSaving(false);
    setEditDialogOpen(false);
    setSelectedFriend(null);
    setNewName("");
  };

  const handleDelete = async () => {
    if (!selectedFriend) return;
    await deleteFriend(selectedFriend.id);
    setDeleteDialogOpen(false);
    setSelectedFriend(null);
  };

  const openEdit = (friend: Friend) => {
    setSelectedFriend(friend);
    setNewName(friend.name);
    setEditDialogOpen(true);
  };

  const openDelete = (friend: Friend) => {
    setSelectedFriend(friend);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Friends
          </CardTitle>
          <CardDescription>Manage your friends and invitations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setAddDialogOpen(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Friend
          </Button>

          {friends.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No friends added yet</p>
          ) : (
            <div className="space-y-2">
              {friends.map((friend, index) => (
                <div key={friend.id}>
                  {index > 0 && <Separator className="my-2" />}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={friend.avatar_url || undefined} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{friend.name}</p>
                        {friend.tags && friend.tags.length > 0 && (
                          <div className="flex gap-1 mt-0.5">
                            {friend.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(friend)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDelete(friend)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {invitations.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Pending Invitations
                </h4>
                <div className="space-y-2">
                  {invitations.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <span className="text-sm">{inv.invitee_email}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{inv.status}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(inv.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Friend Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Friend</DialogTitle>
            <DialogDescription>Add a new friend to your network</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="friendName">Name</Label>
              <Input
                id="friendName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Friend's name"
              />
            </div>
            <div>
              <Label htmlFor="friendEmail">Email (optional)</Label>
              <Input
                id="friendEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="friend@example.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll send them an invitation to join Neighborly
              </p>
            </div>
            <Button onClick={handleAdd} disabled={!newName.trim() || saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Friend
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Friend Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Friend</DialogTitle>
            <DialogDescription>Update your friend's information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editName">Name</Label>
              <Input
                id="editName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Friend's name"
              />
            </div>
            <Button onClick={handleEdit} disabled={!newName.trim() || saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Friend</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedFriend?.name} from your friends?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
