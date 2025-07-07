import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SearchRequest {
  imageUrl: string;
  searchQuery?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, searchQuery }: SearchRequest = await req.json();
    
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

    // Simulate Pinterest-like search results (since actual Pinterest API requires approval)
    const mockResults = [
      {
        id: "1",
        title: "Elegant Summer Dress",
        image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400",
        price: "$89.99",
        brand: "Zara",
        description: "Perfect for summer occasions",
        url: "https://pinterest.com/mock1"
      },
      {
        id: "2",
        title: "Floral Midi Dress",
        image: "https://images.unsplash.com/photo-1566479179817-c0f1e5f6b5db?w=400",
        price: "$129.99",
        brand: "H&M",
        description: "Romantic floral pattern",
        url: "https://pinterest.com/mock2"
      },
      {
        id: "3",
        title: "Casual Day Dress",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
        price: "$65.99",
        brand: "Forever 21",
        description: "Comfortable and stylish",
        url: "https://pinterest.com/mock3"
      },
      {
        id: "4",
        title: "Boho Chic Dress",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        price: "$149.99",
        brand: "Free People",
        description: "Bohemian style dress",
        url: "https://pinterest.com/mock4"
      },
      {
        id: "5",
        title: "Classic Black Dress",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400",
        price: "$199.99",
        brand: "Calvin Klein",
        description: "Timeless elegance",
        url: "https://pinterest.com/mock5"
      },
      {
        id: "6",
        title: "Polka Dot Dress",
        image: "https://images.unsplash.com/photo-1596783074506-d1d6b2a44d3d?w=400",
        price: "$79.99",
        brand: "ASOS",
        description: "Vintage inspired pattern",
        url: "https://pinterest.com/mock6"
      }
    ];

    // Store search in database
    const { data: searchData, error: searchError } = await supabaseClient
      .from("searches")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        search_query: searchQuery,
        results: mockResults,
      })
      .select()
      .single();

    if (searchError) {
      console.error("Error storing search:", searchError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: mockResults,
        searchId: searchData?.id,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in pinterest-search function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});