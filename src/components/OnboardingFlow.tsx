import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-fashion.jpg';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to Pins!",
      description: "Discover fashion items similar to your style with AI-powered visual search",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Snap & Discover",
      description: "Take a photo of any clothing item and we'll find similar styles from top brands",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Save & Share",
      description: "Build your favorites collection and share your style discoveries with friends",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-floating animate-scale-in">
        <div className="p-8 text-center space-y-6">
          {/* Hero Image - Only show on first step */}
          {currentStep === 0 && (
            <div className="mb-6 animate-fade-in">
              <img 
                src={heroImage} 
                alt="Fashion App" 
                className="w-full h-32 object-cover rounded-lg shadow-card"
              />
            </div>
          )}

          {/* Step Icon */}
          <div className="flex justify-center mb-4 animate-float">
            {steps[currentStep].icon}
          </div>

          {/* Step Content */}
          <div className="space-y-4 animate-fade-in" key={currentStep}>
            <h2 className="text-2xl font-bold text-foreground">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 py-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-3 pt-4">
            {currentStep > 0 && (
              <Button 
                onClick={handlePrev}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              variant="hero"
              className="flex-1"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>

          {/* Skip Button */}
          {currentStep < steps.length - 1 && (
            <button
              onClick={onComplete}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip Introduction
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};