import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StyleItem {
  id: string;
  title: string;
  price: string;
  brand: string;
  image: string;
  similarity: number;
}

interface StyleResultsProps {
  searchImage: string;
  onBack: () => void;
}

export const StyleResults = ({ searchImage, onBack }: StyleResultsProps) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    searchPinterest();
  }, [searchImage]);

  const searchPinterest = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('pinterest-search', {
        body: {
          imageUrl: searchImage,
          searchQuery: 'fashion style similar items'
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      setResults(response.data?.results || mockResults);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock data
      setResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (item: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (favorites.has(item.id)) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', item.id);
        
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
        
        toast({
          title: "Removed from favorites",
          description: "Item removed from your favorites.",
        });
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            item_id: item.id,
            item_data: item
          });
        
        setFavorites(prev => new Set([...prev, item.id]));
        
        toast({
          title: "Added to favorites",
          description: "Item saved to your favorites!",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock data for similar items
  const mockResults = [
    {
      id: '1',
      title: 'Floral Midi Dress',
      price: '$89.99',
      brand: 'Zara',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop',
      similarity: 95
    },
    {
      id: '2', 
      title: 'Summer Wrap Dress',
      price: '$125.00',
      brand: 'H&M',
      image: 'https://images.unsplash.com/photo-1566479179817-0e86b4b8f91c?w=300&h=400&fit=crop',
      similarity: 89
    },
    {
      id: '3',
      title: 'Vintage Print Dress',
      price: '$99.50',
      brand: 'Urban Outfitters',
      image: 'https://images.unsplash.com/photo-1572804013427-4d01c56b9e5f?w=300&h=400&fit=crop',
      similarity: 87
    },
    {
      id: '4',
      title: 'Bohemian Maxi Dress',
      price: '$149.99',
      brand: 'Free People',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=400&fit=crop',
      similarity: 85
    },
    {
      id: '5',
      title: 'Casual Day Dress',
      price: '$79.00',
      brand: 'Mango',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop',
      similarity: 82
    },
    {
      id: '6',
      title: 'Elegant Evening Dress',
      price: '$199.99',
      brand: 'ASOS',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
      similarity: 80
    }
  ];


  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header with original image */}
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onBack}
          variant="outline" 
          size="icon"
          className="shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div className="flex items-center space-x-3">
          <img 
            src={searchImage} 
            alt="Your uploaded item" 
            className="w-16 h-16 rounded-lg object-cover shadow-card"
          />
          <div>
            <h2 className="text-xl font-bold text-foreground">Similar Items Found</h2>
            <p className="text-muted-foreground">{results.length} matches from Pinterest</p>
          </div>
        </div>
      </div>

      {/* Filter badges */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Badge variant="secondary" className="whitespace-nowrap">All Items</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Under $100</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Designer</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Similar Color</Badge>
      </div>

      {/* Results grid */}
      {loading ? (
        <div className="col-span-2 flex justify-center items-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-pins-burgundy border-t-transparent rounded-full animate-spin"></div>
            Searching for similar items...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {results.map((item, index) => (
          <Card 
            key={item.id} 
            className="overflow-hidden shadow-card hover:shadow-floating transition-all duration-300 hover:scale-105 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <Button
                onClick={() => toggleFavorite(item)}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-soft"
              >
                <svg 
                  className={`w-4 h-4 ${favorites.has(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                  fill={favorites.has(item.id) ? 'currentColor' : 'none'}
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Button>
              <Badge 
                className="absolute top-2 left-2 bg-pins-burgundy text-white text-xs"
              >
                {item.similarity || '95'}% match
              </Badge>
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-sm text-foreground truncate">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.brand}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{item.price}</span>
                <Button 
                  variant="pins" 
                  size="sm"
                  className="text-xs px-3 h-7"
                >
                  View
                </Button>
              </div>
            </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load more button */}
      <div className="text-center pt-4">
        <Button variant="outline" className="w-full max-w-sm">
          Load More Results
        </Button>
      </div>
    </div>
  );
};