import { useState } from 'react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { EmailCapture } from '@/components/EmailCapture';
import { CameraUpload } from '@/components/CameraUpload';
import { StyleResults } from '@/components/StyleResults';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [showEmailCapture, setShowEmailCapture] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('camera');
  const [searchImage, setSearchImage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleEmailSubmitted = () => {
    setShowEmailCapture(false);
    setShowOnboarding(true);
  };

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

  if (showEmailCapture) {
    return <EmailCapture onEmailSubmitted={handleEmailSubmitted} />;
  }

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
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Trending Now</h2>
              <p className="text-muted-foreground">Discover what's popular in fashion</p>
              
              {/* Trending categories */}
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {['Dresses', 'Shoes', 'Accessories', 'Bags'].map((category) => (
                  <div key={category} className="px-4 py-2 bg-gradient-primary text-white rounded-full text-sm font-medium shadow-soft hover:shadow-floating transition-all duration-300 hover:scale-105 cursor-pointer">
                    {category}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 1, title: 'Summer Vibes', subtitle: 'Flowy dresses & sandals', color: 'from-pink-400 to-rose-500' },
                { id: 2, title: 'Street Style', subtitle: 'Urban & edgy looks', color: 'from-purple-400 to-indigo-500' },
                { id: 3, title: 'Office Chic', subtitle: 'Professional elegance', color: 'from-blue-400 to-cyan-500' },
                { id: 4, title: 'Date Night', subtitle: 'Romantic & stylish', color: 'from-red-400 to-pink-500' }
              ].map((trend) => (
                <Card key={trend.id} className="relative overflow-hidden shadow-card hover:shadow-floating transition-all duration-300 hover:scale-105 animate-scale-in group cursor-pointer">
                  <div className={`h-32 bg-gradient-to-br ${trend.color} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                    <div className="text-center z-10">
                      <div className="w-8 h-8 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-white font-semibold text-sm">Trending</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-foreground">{trend.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{trend.subtitle}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Quick actions */}
            <div className="bg-gradient-card rounded-xl p-4 space-y-3 shadow-soft">
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 flex items-center gap-2" onClick={() => setActiveTab('camera')}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  Find Similar
                </Button>
                <Button variant="outline" className="h-12 flex items-center gap-2" onClick={() => setActiveTab('closet')}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  My Closet
                </Button>
              </div>
            </div>
          </div>
        );

      case 'camera':
        return (
          <CameraUpload onImageCapture={handleImageCapture} />
        );

      case 'favorites':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-float">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Favorites</h2>
                <p className="text-muted-foreground">Items you've loved are saved here</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center shadow-soft">
                <div className="text-2xl font-bold text-pins-burgundy">0</div>
                <div className="text-xs text-muted-foreground">Saved Items</div>
              </Card>
              <Card className="p-4 text-center shadow-soft">
                <div className="text-2xl font-bold text-pins-burgundy">0</div>
                <div className="text-xs text-muted-foreground">Outfits</div>
              </Card>
              <Card className="p-4 text-center shadow-soft">
                <div className="text-2xl font-bold text-pins-burgundy">0</div>
                <div className="text-xs text-muted-foreground">Boards</div>
              </Card>
            </div>
            
            {/* Recent activity */}
            <Card className="p-4 shadow-soft">
              <h3 className="font-semibold mb-3 text-foreground">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-pins-burgundy rounded-full"></div>
                  <span>Start discovering items to see them here</span>
                </div>
              </div>
            </Card>
            
            <div className="space-y-3">
              <Button variant="hero" className="w-full" onClick={() => setActiveTab('camera')}>
                Start Discovering
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab('discover')}>
                Browse Trends
              </Button>
            </div>
          </div>
        );

      case 'closet':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-card rounded-full flex items-center justify-center animate-float">
              <svg className="w-10 h-10 text-pins-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Virtual Closet</h2>
                <p className="text-muted-foreground">Organize your wardrobe and create outfits</p>
              </div>
            </div>
            
            {/* Closet categories */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Tops', icon: '👕', count: 0 },
                { name: 'Bottoms', icon: '👖', count: 0 },
                { name: 'Dresses', icon: '👗', count: 0 },
                { name: 'Shoes', icon: '👠', count: 0 },
                { name: 'Accessories', icon: '👜', count: 0 },
                { name: 'Outerwear', icon: '🧥', count: 0 }
              ].map((category) => (
                <Card key={category.name} className="p-4 text-center shadow-soft hover:shadow-floating transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-sm text-foreground">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} items</p>
                </Card>
              ))}
            </div>
            
            {/* Quick actions */}
            <Card className="p-4 shadow-soft">
              <h3 className="font-semibold mb-3 text-foreground">Outfit Suggestions</h3>
              <p className="text-sm text-muted-foreground mb-4">Upload items to get personalized outfit combinations</p>
              <div className="space-y-2">
                <Button variant="pins" className="w-full" onClick={() => setActiveTab('camera')}>
                  Add New Item
                </Button>
                <Button variant="outline" className="w-full">
                  Create Outfit
                </Button>
              </div>
            </Card>
          </div>
        );

      case 'profile':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-hero rounded-full flex items-center justify-center shadow-floating">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Profile</h2>
                <p className="text-muted-foreground">Personalize your fashion discovery experience</p>
              </div>
            </div>
            
            {/* Profile stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center shadow-soft">
                <div className="text-2xl font-bold text-pins-burgundy">0</div>
                <div className="text-xs text-muted-foreground">Searches</div>
              </Card>
              <Card className="p-4 text-center shadow-soft">
                <div className="text-2xl font-bold text-pins-burgundy">0</div>
                <div className="text-xs text-muted-foreground">Saved</div>
              </Card>
              <Card className="p-4 text-center shadow-soft">
                <div className="text-2xl font-bold text-pins-burgundy">0</div>
                <div className="text-xs text-muted-foreground">Outfits</div>
              </Card>
            </div>
            
            {/* Settings */}
            <div className="space-y-3">
              <Card className="p-4 shadow-soft">
                <h3 className="font-semibold text-foreground mb-3">Style Preferences</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-foreground">Casual</span>
                    <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                      <div className="w-4 h-4 bg-pins-burgundy rounded-full absolute left-0 transition-all duration-300"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-foreground">Formal</span>
                    <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                      <div className="w-4 h-4 bg-gray-400 rounded-full absolute left-0 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 shadow-soft">
                <h3 className="font-semibold text-foreground mb-3">About</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Welcome to Pins - your fashion discovery companion!</p>
                    <Button 
                      variant="hero" 
                      className="w-full justify-between"
                      onClick={() => setShowEmailCapture(true)}
                    >
                      <span>Start Over</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
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