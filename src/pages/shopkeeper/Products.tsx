import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical,
  Package
} from 'lucide-react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Product Deleted",
        description: "The product has been removed from your inventory",
      });
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-md transition-all duration-200">
      <div className="aspect-square bg-gradient-secondary overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
            <Badge variant="outline" className="text-xs mb-2">
              {product.category}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary">
            ${product.price}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant={product.inStock ? "default" : "secondary"}>
              {product.inStock ? `${product.quantity} in stock` : 'Out of stock'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/shopkeeper/products/edit/${product.id}`)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteProduct(product.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonCard = () => (
    <Card>
      <div className="aspect-square bg-muted animate-pulse" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-5 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage your product inventory
          </p>
        </div>
        <Button onClick={() => navigate('/shopkeeper/products/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {products.length}
          </div>
          <div className="text-sm text-muted-foreground">Total Products</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {products.filter(p => p.inStock).length}
          </div>
          <div className="text-sm text-muted-foreground">In Stock</div>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {searchQuery 
              ? 'Try adjusting your search criteria'
              : 'Start building your inventory by adding your first product'
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => navigate('/shopkeeper/products/add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
}