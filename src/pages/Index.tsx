import { useState } from 'react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { CameraUpload } from '@/components/CameraUpload';
import { StyleResults } from '@/components/StyleResults';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState('camera');
  const [searchImage, setSearchImage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleImageCapture = (imageUrl: string) => {
    setSearchImage(imageUrl);
    setShowResults(true);
  };

  const handleBackToCamera = () => {
    setShowResults(false);
    setSearchImage(null);
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    if (showResults && searchImage) {
      return (
        <StyleResults 
          searchImage={searchImage} 
          onBack={handleBackToCamera}
        />
      );
    }

    switch (activeTab) {
      case 'discover':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
              <p className="text-muted-foreground">Discover what's popular in fashion</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden shadow-card animate-scale-in">
                  <div className="h-32 bg-gradient-card flex items-center justify-center">
                    <span className="text-muted-foreground">Trending #{i}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm">Coming Soon</h3>
                    <p className="text-xs text-muted-foreground">Fashion trends</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'camera':
        return (
          <CameraUpload onImageCapture={handleImageCapture} />
        );

      case 'favorites':
        return (
          <div className="p-6 text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-float">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">Your Favorites</h2>
            <p className="text-muted-foreground">Save items you love to see them here</p>
            <Button variant="outline" onClick={() => setActiveTab('camera')}>
              Start Discovering
            </Button>
          </div>
        );

      case 'closet':
        return (
          <div className="p-6 text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-card rounded-full flex items-center justify-center animate-float">
              <svg className="w-10 h-10 text-fashion-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">Virtual Closet</h2>
            <p className="text-muted-foreground">Organize your wardrobe and create outfits</p>
            <Button variant="fashion" onClick={() => setActiveTab('camera')}>
              Add Items
            </Button>
          </div>
        );

      case 'profile':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-hero rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Welcome to Pins!</h2>
                <p className="text-muted-foreground">Sign in to save your discoveries</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button variant="hero" className="w-full">
                Sign In with Google
              </Button>
              <Button variant="outline" className="w-full">
                Sign In with Email
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 shadow-soft">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Pins
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;