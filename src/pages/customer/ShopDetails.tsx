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
import { shopService } from '@/services/shop';
import { productService } from '@/services/product';
import { ApiError } from '@/services/api';

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
    if (shopId) {
      loadShopDetails();
    }
  }, [shopId]);

  const loadShopDetails = async () => {
    if (!shopId) return;
    
    try {
      setLoading(true);
      // First get shop details to get the internal shop ID
      const shopData = await shopService.getShopDetails(shopId);
      setShop(shopData);
      
      // Then get products using the shop's internal ID
      const productsData = await productService.getShopProducts(shopData.id);
      setProducts(productsData);
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Error Loading Shop",
        description: apiError.message || "Failed to load shop details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCartQuantity = (productId: number) => {
    return items.find(item => item.product.id === productId)?.quantity || 0;
  };

  const updateQuantity = (productId: number, change: number) => {
    const currentQty = quantities[productId] || 0;
    const newQty = Math.max(0, currentQty + change);
    setQuantities(prev => ({ ...prev, [productId]: newQty }));
  };

  const handleAddToCart = (product: Product) => {
    if (!shop) return;
    
    const quantity = quantities[product.id] || 1;
    addToCart(product, shop.id, quantity);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to cart`,
    });
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const cartQty = getCartQuantity(product.id);
    const selectedQty = quantities[product.id] || 0;
    const inStock = product.stock > 0;

    return (
      <Card className="overflow-hidden">
        <div className="aspect-square bg-gradient-secondary overflow-hidden">
          <img 
            src={product.product_image_url || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300'} 
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
                ₹{product.price}
              </span>
              <Badge variant={inStock ? "default" : "secondary"}>
                {inStock ? `${product.stock} in stock` : 'Out of Stock'}
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

          {inStock && (
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
              src={shop.shop_logo_url || 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600'} 
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">{shop.name}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">
                    Open
                  </Badge>
                  {shop.owner_name && (
                    <span className="text-sm text-muted-foreground">Owner: {shop.owner_name}</span>
                  )}
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
                <span className="text-xs text-muted-foreground">Shop ID: {shop.shop_id}</span>
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