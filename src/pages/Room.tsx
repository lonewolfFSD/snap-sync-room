import { useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Camera, 
  Upload, 
  Download, 
  Share2, 
  ArrowLeft,
  Users,
  Lock,
  Plus,
  Image as ImageIcon
} from "lucide-react";

interface RoomData {
  name: string;
  isPrivate: boolean;
  password?: string;
  id: string;
}

interface Photo {
  id: string;
  url: string;
  name: string;
  uploadedAt: Date;
  uploader?: string;
}

const Room = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get room data from navigation state or mock data
  const roomData: RoomData = location.state || {
    name: `Room ${roomId}`,
    isPrivate: false,
    id: roomId || "unknown"
  };

  // Mock photos data - will be replaced with Supabase
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      name: "beach-sunset.jpg",
      uploadedAt: new Date(Date.now() - 3600000),
      uploader: "Alex"
    },
    {
      id: "2", 
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
      name: "mountain-view.jpg",
      uploadedAt: new Date(Date.now() - 7200000),
      uploader: "Sarah"
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop", 
      name: "forest-path.jpg",
      uploadedAt: new Date(Date.now() - 10800000),
      uploader: "Mike"
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random(),
          url,
          name: file.name,
          uploadedAt: new Date(),
          uploader: "You"
        };
        
        setPhotos(prev => [newPhoto, ...prev]);
        toast({
          title: "Photo uploaded!",
          description: `${file.name} has been added to the room.`,
        });
      }
    });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random(),
          url,
          name: file.name,
          uploadedAt: new Date(),
          uploader: "You"
        };
        
        setPhotos(prev => [newPhoto, ...prev]);
      }
    });
    
    toast({
      title: `${files.length} photo(s) uploaded!`,
      description: "Your images have been added to the room.",
    });
  };

  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.name;
    link.click();
    
    toast({
      title: "Download started",
      description: `${photo.name} is being downloaded.`,
    });
  };

  const shareRoom = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Room link copied!",
      description: "Share this link to invite others to the room.",
    });
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">{roomData.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {roomData.isPrivate ? (
                      <><Lock className="w-3 h-3" /> Private Room</>
                    ) : (
                      <><Users className="w-3 h-3" /> Public Room</>
                    )}
                    <span>•</span>
                    <span>{photos.length} photos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={shareRoom}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Room
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button 
                variant="hero"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {photos.length === 0 ? (
          // Empty State
          <div
            className="border-2 border-dashed border-muted rounded-3xl p-16 text-center transition-colors hover:border-primary/50"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">No photos yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Be the first to share! Drag and drop photos here or click the upload button to get started.
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Photo
            </Button>
          </div>
        ) : (
          // Photo Grid
          <div
            className="space-y-8"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Upload Zone */}
            <Card className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Drag photos here or{" "}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline font-medium"
                  >
                    click to upload
                  </button>
                </p>
              </CardContent>
            </Card>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden shadow-soft hover:shadow-elegant transition-shadow group">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity shadow-glow"
                        onClick={() => downloadPhoto(photo)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{photo.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {photo.uploader && (
                            <Badge variant="secondary" className="text-xs">
                              {photo.uploader}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(photo.uploadedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Room;