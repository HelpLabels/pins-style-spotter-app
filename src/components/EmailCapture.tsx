import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailCaptureProps {
  onEmailSubmitted: () => void;
}

export const EmailCapture = ({ onEmailSubmitted }: EmailCaptureProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      
      // Simple validation for email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // For demo purposes, accept any valid email and proceed
      setTimeout(() => {
        toast({
          title: "Welcome to Pins!",
          description: "Get ready to discover amazing fashion!",
        });
        onEmailSubmitted();
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-floating animate-float">
            <img 
              src="/lovable-uploads/e02ca147-79dc-4046-9306-6a9c699bcbd7.png" 
              alt="Pins Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Welcome to Pins
            </h1>
            <p className="text-muted-foreground text-center">
              Discover fashion items similar to your style with AI-powered visual search
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 py-6">
          <Card className="p-4 text-center space-y-2 shadow-card hover:shadow-floating transition-all duration-300 animate-scale-in">
            <div className="w-8 h-8 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">Photo Search</p>
          </Card>
          
          <Card className="p-4 text-center space-y-2 shadow-card hover:shadow-floating transition-all duration-300 animate-scale-in">
            <div className="w-8 h-8 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">Save Favorites</p>
          </Card>
          
          <Card className="p-4 text-center space-y-2 shadow-card hover:shadow-floating transition-all duration-300 animate-scale-in">
            <div className="w-8 h-8 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">Virtual Closet</p>
          </Card>
        </div>

        {/* Email Form */}
        <Card className="p-6 shadow-floating animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-center">Get Early Access</h3>
              <p className="text-sm text-muted-foreground text-center">
                Be the first to discover fashion with AI
              </p>
            </div>
            
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-center"
              />
              
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Start Discovering"}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};