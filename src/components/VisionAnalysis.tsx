import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VisionAnalysisProps {
  imageUrl: string;
  onAnalysisComplete?: (analysis: any) => void;
}

interface FashionInsights {
  category: string;
  style: string[];
  colors: string[];
  materials: string[];
  occasions: string[];
  confidence: number;
}

interface AnalysisResult {
  labels: Array<{
    description: string;
    score: number;
    topicality: number;
  }>;
  colors: Array<{
    color: {
      red: number;
      green: number;
      blue: number;
    };
    score: number;
    pixelFraction: number;
  }>;
  text?: string;
  objects?: Array<{
    name: string;
    score: number;
  }>;
}

export const VisionAnalysis = ({ imageUrl, onAnalysisComplete }: VisionAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [fashionInsights, setFashionInsights] = useState<FashionInsights | null>(null);
  const { toast } = useToast();

  const analyzeImage = async () => {
    try {
      setIsAnalyzing(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('vision-analysis', {
        body: {
          imageUrl: imageUrl,
          features: ['LABEL_DETECTION', 'IMAGE_PROPERTIES', 'TEXT_DETECTION', 'OBJECT_LOCALIZATION']
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      setAnalysis(response.data.analysis);
      setFashionInsights(response.data.fashionInsights);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data);
      }

      toast({
        title: "Analysis Complete!",
        description: "AI has analyzed your fashion item successfully.",
      });
    } catch (error) {
      console.error('Vision analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getColorStyle = (color: { red: number; green: number; blue: number }) => ({
    backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`
  });

  return (
    <div className="space-y-4">
      {!analysis && (
        <Card className="p-4 text-center shadow-card">
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Fashion Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed insights about this fashion item
              </p>
            </div>
            <Button 
              onClick={analyzeImage}
              disabled={isAnalyzing}
              variant="hero"
              className="w-full"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze with AI'
              )}
            </Button>
          </div>
        </Card>
      )}

      {analysis && fashionInsights && (
        <div className="space-y-4 animate-fade-in">
          {/* Fashion Insights */}
          <Card className="p-4 shadow-card">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-pins-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fashion Insights
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Category:</span>
                <Badge variant="secondary" className="ml-2 capitalize">
                  {fashionInsights.category}
                </Badge>
              </div>
              
              {fashionInsights.style.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Style:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fashionInsights.style.map((style, index) => (
                      <Badge key={index} variant="outline" className="text-xs capitalize">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {fashionInsights.occasions.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Occasions:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fashionInsights.occasions.map((occasion, index) => (
                      <Badge key={index} variant="outline" className="text-xs capitalize">
                        {occasion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {fashionInsights.materials.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Materials:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fashionInsights.materials.map((material, index) => (
                      <Badge key={index} variant="outline" className="text-xs capitalize">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Dominant Colors */}
          {analysis.colors.length > 0 && (
            <Card className="p-4 shadow-card">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-pins-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                Dominant Colors
              </h3>
              <div className="flex gap-2">
                {analysis.colors.slice(0, 5).map((colorInfo, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-border shadow-soft"
                      style={getColorStyle(colorInfo.color)}
                    />
                    <span className="text-xs text-muted-foreground capitalize">
                      {fashionInsights.colors[index] || 'Color'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Detected Labels */}
          <Card className="p-4 shadow-card">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-pins-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Detected Features
            </h3>
            <div className="flex flex-wrap gap-1">
              {analysis.labels.slice(0, 10).map((label, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                  title={`Confidence: ${Math.round(label.score * 100)}%`}
                >
                  {label.description}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Detected Objects */}
          {analysis.objects && analysis.objects.length > 0 && (
            <Card className="p-4 shadow-card">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-pins-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Detected Objects
              </h3>
              <div className="flex flex-wrap gap-1">
                {analysis.objects.map((object, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs"
                    title={`Confidence: ${Math.round(object.score * 100)}%`}
                  >
                    {object.name}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Detected Text */}
          {analysis.text && (
            <Card className="p-4 shadow-card">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-pins-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Detected Text
              </h3>
              <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                {analysis.text}
              </p>
            </Card>
          )}

          <Button 
            onClick={() => {
              setAnalysis(null);
              setFashionInsights(null);
            }}
            variant="outline"
            className="w-full"
          >
            Analyze Again
          </Button>
        </div>
      )}
    </div>
  );
};