import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package,
  DollarSign,
  Clock,
  Eye,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/order';
import { productService } from '@/services/product';
import { shopService } from '@/services/shop';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/services/api';
import { Order, Shop } from '@/types';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  todayOrders: number;
}

const mockStats: DashboardStats = {
  totalOrders: 156,
  pendingOrders: 8,
  totalRevenue: 4567.89,
  totalCustomers: 89,
  totalProducts: 23,
  todayOrders: 12,
};

const recentOrders = [
  {
    id: 'ord1',
    customer: 'John Doe',
    items: 3,
    total: 45.67,
    status: 'pending',
    time: '10 min ago',
  },
  {
    id: 'ord2',
    customer: 'Sarah Smith',
    items: 2,
    total: 23.45,
    status: 'accepted',
    time: '25 min ago',
  },
  {
    id: 'ord3',
    customer: 'Mike Johnson',
    items: 5,
    total: 78.90,
    status: 'pending',
    time: '45 min ago',
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.shop) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.shop) return;
    
    try {
      setLoading(true);
      
      // Load orders and products in parallel
      const [orders, products] = await Promise.all([
        orderService.getShopOrders(user.shop.id),
        productService.getShopProducts(user.shop.id)
      ]);
      
      setRecentOrders(orders.slice(0, 5)); // Get recent 5 orders
      
      // Calculate stats
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
      const totalRevenue = orders
        .filter(order => order.status === 'DELIVERED')
        .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      
      const totalCustomers = new Set(orders.map(order => order.customer.id)).size;
      
      setStats({
        totalOrders,
        pendingOrders,
        totalRevenue,
        totalCustomers,
        totalProducts: products.length,
        todayOrders: orders.filter(order => {
          const today = new Date().toDateString();
          return new Date(order.created_at).toDateString() === today;
        }).length,
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Error Loading Dashboard",
        description: apiError.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = "primary" 
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color?: string;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className="text-xs text-success mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${color}/10`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OrderRow = ({ order }: { order: Order }) => {
    const getTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes} min ago`;
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
      } else {
        return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
      }
    };

    return (
      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-foreground">{order.customer.name}</span>
            <Badge 
              variant={order.status === 'PENDING' ? 'secondary' : 'default'}
              className={
                order.status === 'PENDING' 
                  ? 'bg-warning/10 text-warning border-warning/20' 
                  : order.status === 'ACCEPTED'
                  ? 'bg-success/10 text-success border-success/20'
                  : order.status === 'DELIVERED'
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              }
            >
              {order.status.toLowerCase()}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{order.order_items.length} items</span>
            <span>₹{order.total_amount}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {getTimeAgo(order.created_at)}
            </span>
            <span>#{order.id.toString().slice(-6).toUpperCase()}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your shop overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            trend="+12.5% from last month"
            color="primary"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            trend="+8.2% from last week"
            color="accent"
          />
          <StatCard
            title="Customers"
            value={stats.totalCustomers}
            icon={Users}
            trend="+5.7% from last month"
            color="success"
          />
          <StatCard
            title="Products"
            value={stats.totalProducts}
            icon={Package}
            color="warning"
          />
        </div>
      )}

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate('/shopkeeper/products/add')}
              className="w-full justify-start h-12"
            >
              <Package className="w-5 h-5 mr-3" />
              Add New Product
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/shopkeeper/orders')}
              className="w-full justify-start h-12"
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              View All Orders
              {stats && stats.pendingOrders > 0 && (
                <Badge className="ml-auto bg-warning text-warning-foreground">
                  {stats.pendingOrders}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/shopkeeper/customers')}
              className="w-full justify-start h-12"
            >
              <Users className="w-5 h-5 mr-3" />
              Manage Customers
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/shopkeeper/profile')}
              className="w-full justify-start h-12"
            >
              <Eye className="w-5 h-5 mr-3" />
              View Shop Profile
            </Button>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/shopkeeper/orders')}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <OrderRow key={order.id} order={order} />
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent orders
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/shopkeeper/orders')}
            >
              View All Orders
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats?.todayOrders || 0}
              </div>
              <div className="text-sm text-muted-foreground">Orders Today</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats?.pendingOrders || 0}
              </div>
              <div className="text-sm text-muted-foreground">Pending Orders</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">
                ₹{stats ? (stats.totalRevenue * 0.05).toFixed(2) : '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">Today's Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}