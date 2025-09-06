import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Star, MapPin, Phone, Plus, Minus, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product, Shop } from '@/types';

const mockShop: Shop = {
  id: '1',
  name: 'Fresh Mart Grocery',
  description: 'Your neighborhood grocery store with fresh produce and daily essentials',
  address: '123 Main St, Downtown',
  phone: '+1234567890',
  image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600',
  owner: 'owner1',
  rating: 4.5,
  isOpen: true,
};

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Fresh Organic Apples',
    description: 'Premium quality organic apples, perfect for snacking',
    price: 3.99,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300',
    shopId: '1',
    inStock: true,
    quantity: 50,
  },
  {
    id: 'p2',
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread, soft and nutritious',
    price: 2.49,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300',
    shopId: '1',
    inStock: true,
    quantity: 20,
  },
  {
    id: 'p3',
    name: 'Farm Fresh Milk',
    description: 'Pure and fresh milk from local farms',
    price: 1.99,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300',
    shopId: '1',
    inStock: true,
    quantity: 30,
  },
  {
    id: 'p4',
    name: 'Organic Tomatoes',
    description: 'Fresh, juicy organic tomatoes',
    price: 2.99,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1546470427-e4b8b1029d59?w=300',
    shopId: '1',
    inStock: false,
    quantity: 0,
  },
];

export default function ShopDetails() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { toast } = useToast();
  
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setShop(mockShop);
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, [shopId]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCartQuantity = (productId: string) => {
    return items.find(item => item.product.id === productId)?.quantity || 0;
  };

  const updateQuantity = (productId: string, change: number) => {
    const currentQty = quantities[productId] || 0;
    const newQty = Math.max(0, currentQty + change);
    setQuantities(prev => ({ ...prev, [productId]: newQty }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to cart`,
    });
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const cartQty = getCartQuantity(product.id);
    const selectedQty = quantities[product.id] || 0;

    return (
      <Card className="overflow-hidden">
        <div className="aspect-square bg-gradient-secondary overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-lg text-foreground mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ${product.price}
              </span>
              <Badge variant={product.inStock ? "default" : "secondary"}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
          </div>

          {cartQty > 0 && (
            <div className="mb-3 p-2 bg-primary/10 rounded-lg">
              <span className="text-sm text-primary font-medium">
                {cartQty} in cart
              </span>
            </div>
          )}

          {product.inStock && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(product.id, -1)}
                  disabled={selectedQty <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">
                  {selectedQty || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(product.id, 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={() => handleAddToCart(product)}
                className="flex-1 ml-4"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-mobile">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-48 bg-muted rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="p-mobile text-center py-12">
        <p className="text-muted-foreground">Shop not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-mobile">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{shop.name}</h1>
        </div>
      </div>

      <div className="p-mobile">
        {/* Shop Info */}
        <Card className="mb-6">
          <div className="aspect-video bg-gradient-secondary overflow-hidden">
            <img 
              src={shop.image} 
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">{shop.name}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-medium">{shop.rating}</span>
                  <Badge variant={shop.isOpen ? "default" : "secondary"}>
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">{shop.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{shop.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Products */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No products found</div>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}