import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, Users, Lock, Zap, Download, Upload } from "lucide-react";
import heroImage from "@/assets/hero-camera.jpg";

const Index = () => {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const createRoom = (isPrivate: boolean) => {
    if (!roomName.trim()) return;
    
    const roomData = {
      name: roomName,
      isPrivate,
      password: isPrivate ? password : undefined,
      id: Date.now().toString() // Temporary ID generation
    };
    
    // For now, navigate to room view - will be connected to Supabase later
    navigate(`/room/${roomData.id}`, { state: roomData });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Zap className="w-3 h-3 mr-1" />
                  Real-time Photo Sharing
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                  LiveSnap
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Create instant photo boards that sync in real-time. Perfect for events, trips, and team collaboration.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Instant Upload
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Real-time Sync
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Easy Download
                </div>
              </div>

              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <Camera className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-accent rounded-3xl blur-3xl opacity-30"></div>
              <img 
                src={heroImage} 
                alt="LiveSnap Hero" 
                className="relative rounded-3xl shadow-elegant w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Room Creation Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Create Your Photo Room</h2>
              <p className="text-muted-foreground">Choose between public rooms for open sharing or private rooms with password protection.</p>
            </div>

            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  New Room
                </CardTitle>
                <CardDescription>
                  Set up your shared photo space in seconds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    placeholder="e.g., Beach Trip 2024, Team Meeting"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Public Room Option */}
                  <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer" 
                        onClick={() => createRoom(false)}>
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Public Room</h3>
                        <p className="text-sm text-muted-foreground">
                          Anyone with the link can join and share photos
                        </p>
                      </div>
                      <Button variant="outline" disabled={!roomName.trim()} className="w-full">
                        Create Public Room
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Private Room Option */}
                  <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6 space-y-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                          <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Private Room</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Password protected for invited members only
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <Input
                          type="password"
                          placeholder="Set room password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-10"
                        />
                        <Button 
                          variant="default" 
                          disabled={!roomName.trim() || !password.trim()}
                          onClick={() => createRoom(true)}
                          className="w-full"
                        >
                          Create Private Room
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose LiveSnap?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The fastest way to share and collect photos from any event or gathering.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Instant Sharing</h3>
              <p className="text-muted-foreground">
                Photos appear instantly for everyone in the room. No refresh needed.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Easy Upload</h3>
              <p className="text-muted-foreground">
                Drag and drop or click to upload from any device. Mobile friendly.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Download All</h3>
              <p className="text-muted-foreground">
                One-click download of all photos in high quality. Never lose memories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;