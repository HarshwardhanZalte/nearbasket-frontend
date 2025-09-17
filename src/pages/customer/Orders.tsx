import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Order } from '@/types';
import { orderService } from '@/services/order';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/services/api';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response);
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Error Loading Orders",
        description: apiError.message || "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          color: 'bg-warning text-warning-foreground',
          label: 'Pending',
        };
      case 'ACCEPTED':
        return {
          icon: CheckCircle,
          color: 'bg-success text-success-foreground',
          label: 'Accepted',
        };
      case 'DELIVERED':
        return {
          icon: Truck,
          color: 'bg-primary text-primary-foreground',
          label: 'Delivered',
        };
      case 'REJECTED':
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
                Order #{order.id.toString().slice(-6).toUpperCase()}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.created_at)}
              </p>
            </div>
            <Badge className={statusConfig.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>

          <div className="mb-3 p-2 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-foreground">{order.shop.name}</p>
            <p className="text-xs text-muted-foreground">{order.shop.address}</p>
          </div>

          <div className="space-y-2 mb-4">
            {order.order_items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    📦
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  ₹{(item.quantity * parseFloat(item.price)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {order.order_items.length} item(s)
            </span>
            <span className="text-lg font-semibold text-primary">
              ₹{order.total_amount}
            </span>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            <strong>Customer:</strong> {order.customer.name} ({order.customer.mobile_number})
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
    const statusMap: Record<string, Order['status']> = {
      'pending': 'PENDING',
      'accepted': 'ACCEPTED',
      'delivered': 'DELIVERED',
      'rejected': 'REJECTED',
    };
    return orders.filter(order => order.status === statusMap[status]);
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