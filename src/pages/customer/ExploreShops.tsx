import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Clock } from 'lucide-react';
import { Shop } from '@/types';

const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Fresh Mart Grocery',
    description: 'Your neighborhood grocery store with fresh produce and daily essentials',
    address: '123 Main St, Downtown',
    phone: '+1234567890',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400',
    owner: 'owner1',
    rating: 4.5,
    isOpen: true,
  },
  {
    id: '2',
    name: 'Spice Garden',
    description: 'Authentic spices and traditional ingredients',
    address: '456 Spice Ave, Market District',
    phone: '+1234567891',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    owner: 'owner2',
    rating: 4.8,
    isOpen: true,
  },
  {
    id: '3',
    name: 'Corner Bakery',
    description: 'Fresh bread, pastries and custom cakes',
    address: '789 Baker St, Old Town',
    phone: '+1234567892',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    owner: 'owner3',
    rating: 4.3,
    isOpen: false,
  },
];

export default function ExploreShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setShops(mockShops);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ShopCard = ({ shop }: { shop: Shop }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
      onClick={() => navigate(`/customer/shop/${shop.id}`)}
    >
      <div className="aspect-video bg-gradient-secondary rounded-t-lg overflow-hidden">
        <img 
          src={shop.image} 
          alt={shop.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{shop.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="text-sm font-medium">{shop.rating}</span>
              <span className="text-xs text-muted-foreground ml-1">rating</span>
            </div>
          </div>
          <Badge variant={shop.isOpen ? "default" : "secondary"} className="ml-2">
            <Clock className="w-3 h-3 mr-1" />
            {shop.isOpen ? 'Open' : 'Closed'}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {shop.description}
        </p>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{shop.address}</span>
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonCard = () => (
    <Card>
      <div className="aspect-video bg-muted rounded-t-lg animate-pulse" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-5 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-mobile">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Explore Nearby Shops
        </h1>
        <p className="text-muted-foreground">
          Discover local businesses in your area
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search shops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : filteredShops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
      </div>

      {!loading && filteredShops.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No shops found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}