import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Eye,
  Check,
  X
} from 'lucide-react';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
    customerId: 'cust2',
    shopId: '1',
    items: [
      {
        product: {
          id: 'p3',
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
    status: 'accepted',
    createdAt: '2024-01-14T15:45:00Z',
    deliveryAddress: '456 Oak Ave, Uptown',
  },
  {
    id: 'ord3',
    customerId: 'cust3',
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
        quantity: 5,
      },
    ],
    total: 22.94,
    status: 'delivered',
    createdAt: '2024-01-12T09:15:00Z',
    deliveryAddress: '789 Pine St, Midtown',
  },
  {
    id: 'ord4',
    customerId: 'cust4',
    shopId: '1',
    items: [
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
        quantity: 3,
      },
    ],
    total: 10.46,
    status: 'rejected',
    createdAt: '2024-01-13T14:20:00Z',
    deliveryAddress: '321 Elm St, Southside',
  },
];

const customerNames = {
  'cust1': 'John Doe',
  'cust2': 'Sarah Smith',
  'cust3': 'Mike Johnson',
  'cust4': 'Emily Davis',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'accepted' as const }
          : order
      )
    );
    toast({
      title: "Order Accepted",
      description: "The order has been accepted and customer will be notified",
    });
  };

  const handleRejectOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'rejected' as const }
            : order
        )
      );
      toast({
        title: "Order Rejected",
        description: "The order has been rejected and customer will be notified",
        variant: "destructive",
      });
    }
  };

  const handleMarkDelivered = (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'delivered' as const }
          : order
      )
    );
    toast({
      title: "Order Delivered",
      description: "The order has been marked as delivered",
    });
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;
    const customerName = customerNames[order.customerId as keyof typeof customerNames] || 'Unknown Customer';

    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">
                Order #{order.id.slice(-6).toUpperCase()}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                Customer: {customerName}
              </p>
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
              <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
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

          <div className="border-t border-border pt-3 mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Items ({order.items.length})</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Delivery Address:</strong> {order.deliveryAddress}
            </div>
          </div>

          {/* Order Actions */}
          {order.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleAcceptOrder(order.id)}
                className="flex-1"
                size="sm"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept Order
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRejectOrder(order.id)}
                className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          )}

          {order.status === 'accepted' && (
            <Button
              onClick={() => handleMarkDelivered(order.id)}
              className="w-full"
              size="sm"
            >
              <Truck className="w-4 h-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ status }: { status: string }) => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
        <Eye className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No {status} orders
      </h3>
      <p className="text-sm text-muted-foreground">
        {status === 'all' 
          ? "You don't have any orders yet" 
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
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
          <div className="h-8 bg-muted rounded w-full" />
        </div>
      </CardContent>
    </Card>
  );

  const filterOrders = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      rejected: orders.filter(o => o.status === 'rejected').length,
    };
  };

  const counts = getOrderCounts();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">
            View and manage incoming customer orders
          </p>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-xl font-bold text-primary">{counts.all}</div>
          <div className="text-xs text-muted-foreground">Total Orders</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xl font-bold text-warning">{counts.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xl font-bold text-success">{counts.accepted}</div>
          <div className="text-xs text-muted-foreground">Accepted</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xl font-bold text-primary">{counts.delivered}</div>
          <div className="text-xs text-muted-foreground">Delivered</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xl font-bold text-destructive">{counts.rejected}</div>
          <div className="text-xs text-muted-foreground">Rejected</div>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 w-full mb-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            {counts.pending > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] text-xs p-0 flex items-center justify-center bg-warning text-warning-foreground">
                {counts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'accepted', 'delivered', 'rejected'].map(status => (
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