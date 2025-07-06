import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CameraUploadProps {
  onImageCapture: (imageUrl: string) => void;
}

export const CameraUpload = ({ onImageCapture }: CameraUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPreview(imageUrl);
        setIsLoading(true);
        
        // Simulate processing time
        setTimeout(() => {
          onImageCapture(imageUrl);
          setIsLoading(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Discover Your Style</h2>
        <p className="text-muted-foreground">Upload a photo to find similar fashion items</p>
      </div>

      {preview ? (
        <Card className="w-full max-w-sm overflow-hidden shadow-card animate-scale-in">
          <div className="relative">
            <img 
              src={preview} 
              alt="Uploaded fashion item" 
              className="w-full h-64 object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-white rounded-full p-4 shadow-floating">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <Button 
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              variant="outline" 
              className="w-full"
            >
              Try Another Photo
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="w-full max-w-sm bg-gradient-card border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer shadow-card hover:shadow-floating animate-fade-in">
          <div 
            className="p-8 text-center space-y-4"
            onClick={triggerFileInput}
          >
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-float">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Upload Your Fashion Item</h3>
              <p className="text-sm text-muted-foreground">
                Take a photo or select from gallery
              </p>
            </div>
            <Button variant="camera" size="lg" className="w-full">
              Choose Photo
            </Button>
          </div>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        capture="environment"
      />
    </div>
  );
};