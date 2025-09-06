import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Order } from '@/types';

const mockOrders: Order[] = [
  {
    id: 'ord1',
    customerId: 'cust1',
    shopId: '1',
    items: [
      {
        product: {
          id: 'p1',
          name: 'Fresh Organic Apples',
          description: 'Premium quality organic apples',
          price: 3.99,
          category: 'Fruits',
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300',
          shopId: '1',
          inStock: true,
          quantity: 50,
        },
        quantity: 2,
      },
      {
        product: {
          id: 'p2',
          name: 'Whole Wheat Bread',
          description: 'Freshly baked whole wheat bread',
          price: 2.49,
          category: 'Bakery',
          image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300',
          shopId: '1',
          inStock: true,
          quantity: 20,
        },
        quantity: 1,
      },
    ],
    total: 10.47,
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    deliveryAddress: '123 Main St, Downtown',
  },
  {
    id: 'ord2',
    customerId: 'cust1',
    shopId: '2',
    items: [
      {
        product: {
          id: 'p3',
          name: 'Organic Spice Mix',
          description: 'Traditional spice blend',
          price: 5.99,
          category: 'Spices',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          shopId: '2',
          inStock: true,
          quantity: 15,
        },
        quantity: 1,
      },
    ],
    total: 8.98,
    status: 'accepted',
    createdAt: '2024-01-14T15:45:00Z',
    deliveryAddress: '123 Main St, Downtown',
  },
  {
    id: 'ord3',
    customerId: 'cust1',
    shopId: '1',
    items: [
      {
        product: {
          id: 'p4',
          name: 'Farm Fresh Milk',
          description: 'Pure milk from local farms',
          price: 1.99,
          category: 'Dairy',
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300',
          shopId: '1',
          inStock: true,
          quantity: 30,
        },
        quantity: 2,
      },
    ],
    total: 6.97,
    status: 'delivered',
    createdAt: '2024-01-12T09:15:00Z',
    deliveryAddress: '123 Main St, Downtown',
  },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-warning text-warning-foreground',
          label: 'Pending',
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          color: 'bg-success text-success-foreground',
          label: 'Accepted',
        };
      case 'delivered':
        return {
          icon: Truck,
          color: 'bg-primary text-primary-foreground',
          label: 'Delivered',
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'bg-destructive text-destructive-foreground',
          label: 'Rejected',
        };
      default:
        return {
          icon: Clock,
          color: 'bg-muted text-muted-foreground',
          label: 'Unknown',
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Order #{order.id.slice(-6).toUpperCase()}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge className={statusConfig.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg overflow-hidden">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × ${item.product.price}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {order.items.length} item(s)
            </span>
            <span className="text-lg font-semibold text-primary">
              ${order.total.toFixed(2)}
            </span>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            <strong>Delivery:</strong> {order.deliveryAddress}
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ status }: { status: string }) => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No {status} orders
      </h3>
      <p className="text-sm text-muted-foreground">
        {status === 'all' 
          ? "You haven't placed any orders yet" 
          : `No orders with ${status} status`
        }
      </p>
    </div>
  );

  const SkeletonCard = () => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="flex justify-between">
            <div className="h-5 bg-muted rounded w-1/3" />
            <div className="h-6 bg-muted rounded w-20" />
          </div>
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
          <div className="h-4 bg-muted rounded w-full" />
        </div>
      </CardContent>
    </Card>
  );

  const filterOrders = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  return (
    <div className="p-mobile">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Active</TabsTrigger>
          <TabsTrigger value="delivered">Completed</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'accepted', 'delivered'].map(status => (
          <TabsContent key={status} value={status}>
            {loading ? (
              <div>
                {Array(3).fill(0).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div>
                {filterOrders(status).length > 0 ? (
                  filterOrders(status).map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <EmptyState status={status} />
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}