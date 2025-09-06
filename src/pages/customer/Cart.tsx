import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const deliveryFee = 2.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a delivery address",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);

    // Simulate order placement
    setTimeout(() => {
      clearCart();
      setIsPlacingOrder(false);
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully",
      });
      navigate('/customer/orders');
    }, 2000);
  };

  const CartItem = ({ item }: { item: typeof items[0] }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-gradient-secondary rounded-lg overflow-hidden">
            <img 
              src={item.product.image} 
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              {item.product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              ${item.product.price} each
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-semibold text-primary">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (items.length === 0) {
    return (
      <div className="p-mobile">
        <h1 className="text-2xl font-bold text-foreground mb-6">Your Cart</h1>
        
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Explore nearby shops and add items to your cart
          </p>
          <Button onClick={() => navigate('/customer/explore')}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-mobile pb-24">
      <h1 className="text-2xl font-bold text-foreground mb-6">Your Cart</h1>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items.map(item => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      {/* Delivery Details */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Delivery Details</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Delivery Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter your complete address..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                placeholder="Any special delivery instructions..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between text-lg font-semibold text-primary">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Place Order Button */}
      <div className="fixed bottom-16 left-0 right-0 p-mobile bg-background/95 backdrop-blur-sm border-t border-border">
        <Button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !deliveryAddress.trim()}
          className="w-full h-12"
        >
          {isPlacingOrder ? 'Placing Order...' : `Place Order • $${grandTotal.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}