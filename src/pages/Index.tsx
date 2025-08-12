import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Camera, Users, Lock, Plus, ExternalLink } from "lucide-react";

interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  createdAt: Date;
  photoCount: number;
}

const Index = () => {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const roomsList: Room[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        roomsList.push({
          id: doc.id,
          name: data.name,
          isPrivate: data.isPrivate,
          createdAt: data.createdAt.toDate(),
          photoCount: data.photoCount || 0
        });
      });
      
      setRooms(roomsList);
    } catch (error) {
      console.error("Error loading rooms:", error);
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive"
      });
    } finally {
      setLoadingRooms(false);
    }
  };

  const createRoom = async (isPrivate: boolean) => {
    if (!roomName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room name",
        variant: "destructive"
      });
      return;
    }

    if (isPrivate && !password.trim()) {
      toast({
        title: "Error", 
        description: "Please set a password for private room",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "rooms"), {
        name: roomName.trim(),
        isPrivate,
        password: isPrivate ? password : null,
        createdAt: new Date(),
        photoCount: 0
      });

      toast({
        title: "Room created!",
        description: `${roomName} has been created successfully.`
      });

      // Navigate to the new room
      navigate(`/room/${docRef.id}`);
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = (room: Room) => {
    if (room.isPrivate) {
      const enteredPassword = prompt(`Enter password for "${room.name}":`);
      if (!enteredPassword) return;
      
      // Note: In a real app, you'd verify this on the server
      // For now, we'll pass it and verify in the room component
      navigate(`/room/${room.id}`, { state: { passwordAttempt: enteredPassword } });
    } else {
      navigate(`/room/${room.id}`);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Camera className="w-8 h-8 text-primary" />
            LiveSnap
          </h1>
          <p className="text-muted-foreground">Create and manage your photo rooms</p>
        </div>

        {/* Room Creation */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Room
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                placeholder="Enter room name..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Public Room */}
              <Button
                variant="outline"
                onClick={() => createRoom(false)}
                disabled={!roomName.trim() || loading}
                className="h-auto p-6 flex-col space-y-2"
              >
                <Users className="w-6 h-6 text-primary" />
                <span className="font-semibold">Public Room</span>
                <span className="text-sm text-muted-foreground">Anyone can join</span>
              </Button>

              {/* Private Room */}
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder="Set password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <Button
                  variant="default"
                  onClick={() => createRoom(true)}
                  disabled={!roomName.trim() || !password.trim() || loading}
                  className="w-full h-auto p-6 flex-col space-y-2"
                >
                  <Lock className="w-6 h-6" />
                  <span className="font-semibold">Private Room</span>
                  <span className="text-sm opacity-90">Password protected</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms List */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Your Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRooms ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading rooms...
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No rooms created yet. Create your first room above!
              </div>
            ) : (
              <div className="grid gap-3">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {room.isPrivate ? (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Private
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              Public
                            </Badge>
                          )}
                          <span>•</span>
                          <span>{room.photoCount} photos</span>
                          <span>•</span>
                          <span>{formatTimeAgo(room.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => joinRoom(room)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;