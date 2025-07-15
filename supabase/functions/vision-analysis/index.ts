import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface VisionAnalysisRequest {
  imageUrl: string;
  features?: string[];
}

interface VisionResponse {
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
    boundingPoly: any;
  }>;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, features = ['LABEL_DETECTION', 'IMAGE_PROPERTIES', 'TEXT_DETECTION', 'OBJECT_LOCALIZATION'] }: VisionAnalysisRequest = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Invalid user");
    }

    // Google Cloud Vision API key
    const API_KEY = "AIzaSyCFwq96ghGRgB-jSrZ2sYD2qUhnenMdD90";
    const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

    // Prepare the request body for Vision API
    const visionRequest = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl
            }
          },
          features: features.map(feature => ({
            type: feature,
            maxResults: feature === 'LABEL_DETECTION' ? 20 : 10
          }))
        }
      ]
    };

    // Call Google Cloud Vision API
    const visionResponse = await fetch(VISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visionRequest)
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      throw new Error(`Vision API error: ${visionResponse.status} - ${errorText}`);
    }

    const visionData = await visionResponse.json();
    const annotations = visionData.responses[0];

    // Process the response
    const analysisResult: VisionResponse = {
      labels: [],
      colors: [],
      text: '',
      objects: []
    };

    // Extract labels (fashion-related items, colors, styles, etc.)
    if (annotations.labelAnnotations) {
      analysisResult.labels = annotations.labelAnnotations.map((label: any) => ({
        description: label.description,
        score: label.score,
        topicality: label.topicality || label.score
      }));
    }

    // Extract dominant colors
    if (annotations.imagePropertiesAnnotation?.dominantColors?.colors) {
      analysisResult.colors = annotations.imagePropertiesAnnotation.dominantColors.colors.map((colorInfo: any) => ({
        color: {
          red: Math.round(colorInfo.color.red || 0),
          green: Math.round(colorInfo.color.green || 0),
          blue: Math.round(colorInfo.color.blue || 0)
        },
        score: colorInfo.score,
        pixelFraction: colorInfo.pixelFraction
      }));
    }

    // Extract text (brand names, labels, etc.)
    if (annotations.textAnnotations && annotations.textAnnotations.length > 0) {
      analysisResult.text = annotations.textAnnotations[0].description;
    }

    // Extract objects
    if (annotations.localizedObjectAnnotations) {
      analysisResult.objects = annotations.localizedObjectAnnotations.map((obj: any) => ({
        name: obj.name,
        score: obj.score,
        boundingPoly: obj.boundingPoly
      }));
    }

    // Generate fashion-specific insights
    const fashionInsights = generateFashionInsights(analysisResult);

    // Store analysis in database
    const { data: analysisData, error: analysisError } = await supabaseClient
      .from("vision_analyses")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        labels: analysisResult.labels,
        colors: analysisResult.colors,
        detected_text: analysisResult.text,
        objects: analysisResult.objects,
        fashion_insights: fashionInsights,
        raw_response: annotations
      })
      .select()
      .single();

    if (analysisError) {
      console.error("Error storing analysis:", analysisError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysisResult,
        fashionInsights,
        analysisId: analysisData?.id,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in vision-analysis function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

function generateFashionInsights(analysis: VisionResponse) {
  const insights = {
    category: 'Unknown',
    style: [],
    colors: [],
    materials: [],
    occasions: [],
    confidence: 0
  };

  // Analyze labels for fashion categories
  const fashionCategories = {
    'dress': ['dress', 'gown', 'frock'],
    'top': ['shirt', 'blouse', 'top', 't-shirt', 'sweater', 'cardigan'],
    'bottom': ['pants', 'jeans', 'skirt', 'shorts', 'trousers'],
    'shoes': ['shoe', 'boot', 'sneaker', 'heel', 'sandal'],
    'accessory': ['bag', 'purse', 'jewelry', 'watch', 'belt', 'hat']
  };

  const styleKeywords = {
    'casual': ['casual', 'everyday', 'relaxed'],
    'formal': ['formal', 'elegant', 'sophisticated'],
    'vintage': ['vintage', 'retro', 'classic'],
    'modern': ['modern', 'contemporary', 'trendy'],
    'bohemian': ['boho', 'bohemian', 'hippie'],
    'minimalist': ['minimal', 'simple', 'clean']
  };

  const occasionKeywords = {
    'work': ['office', 'professional', 'business'],
    'party': ['party', 'celebration', 'festive'],
    'casual': ['everyday', 'casual', 'weekend'],
    'formal': ['formal', 'evening', 'gala'],
    'summer': ['summer', 'beach', 'vacation'],
    'winter': ['winter', 'warm', 'cozy']
  };

  // Determine category
  let maxCategoryScore = 0;
  for (const [category, keywords] of Object.entries(fashionCategories)) {
    const score = analysis.labels
      .filter(label => keywords.some(keyword => 
        label.description.toLowerCase().includes(keyword)
      ))
      .reduce((sum, label) => sum + label.score, 0);
    
    if (score > maxCategoryScore) {
      maxCategoryScore = score;
      insights.category = category;
      insights.confidence = score;
    }
  }

  // Determine style
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    const hasStyle = analysis.labels.some(label => 
      keywords.some(keyword => 
        label.description.toLowerCase().includes(keyword)
      )
    );
    if (hasStyle) {
      insights.style.push(style);
    }
  }

  // Determine occasions
  for (const [occasion, keywords] of Object.entries(occasionKeywords)) {
    const hasOccasion = analysis.labels.some(label => 
      keywords.some(keyword => 
        label.description.toLowerCase().includes(keyword)
      )
    );
    if (hasOccasion) {
      insights.occasions.push(occasion);
    }
  }

  // Extract color names
  insights.colors = analysis.colors.slice(0, 3).map(colorInfo => {
    const { red, green, blue } = colorInfo.color;
    return getColorName(red, green, blue);
  });

  // Extract materials from labels
  const materialKeywords = ['cotton', 'silk', 'wool', 'leather', 'denim', 'lace', 'chiffon', 'satin'];
  insights.materials = analysis.labels
    .filter(label => materialKeywords.some(material => 
      label.description.toLowerCase().includes(material)
    ))
    .map(label => label.description.toLowerCase())
    .filter((material, index, self) => self.indexOf(material) === index);

  return insights;
}

function getColorName(red: number, green: number, blue: number): string {
  // Simple color name mapping based on RGB values
  const colors = [
    { name: 'black', r: 0, g: 0, b: 0 },
    { name: 'white', r: 255, g: 255, b: 255 },
    { name: 'red', r: 255, g: 0, b: 0 },
    { name: 'green', r: 0, g: 255, b: 0 },
    { name: 'blue', r: 0, g: 0, b: 255 },
    { name: 'yellow', r: 255, g: 255, b: 0 },
    { name: 'purple', r: 128, g: 0, b: 128 },
    { name: 'pink', r: 255, g: 192, b: 203 },
    { name: 'brown', r: 165, g: 42, b: 42 },
    { name: 'gray', r: 128, g: 128, b: 128 },
    { name: 'navy', r: 0, g: 0, b: 128 },
    { name: 'beige', r: 245, g: 245, b: 220 }
  ];

  let closestColor = 'unknown';
  let minDistance = Infinity;

  for (const color of colors) {
    const distance = Math.sqrt(
      Math.pow(red - color.r, 2) +
      Math.pow(green - color.g, 2) +
      Math.pow(blue - color.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color.name;
    }
  }

  return closestColor;
}