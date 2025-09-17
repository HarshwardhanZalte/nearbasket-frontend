import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Trash2,
  Users,
  ShoppingBag
} from 'lucide-react';
import { ShopCustomer, User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { shopService } from '@/services/shop';
import { ApiError } from '@/services/api';

// Backend-driven list

export default function Customers() {
  const [customers, setCustomers] = useState<ShopCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await shopService.getCustomers();
      setCustomers(response);
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Error Loading Customers',
        description: apiError.message || 'Failed to load customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(({ customer }) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.mobile_number && customer.mobile_number.includes(searchQuery)) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddCustomer = async () => {
    const isValid = /^\d{10}$/.test(mobileNumber.trim());
    if (!isValid) {
      toast({
        title: 'Invalid Mobile Number',
        description: 'Enter a valid 10-digit mobile number',
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await shopService.addCustomer(mobileNumber.trim());
      // Reload list to reflect server state
      await loadCustomers();
      setMobileNumber('');
      setShowAddDialog(false);
      toast({
        title: 'Customer Added',
        description: `${res.customer.name || res.customer.mobile_number} has been added`,
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Add Failed',
        description: apiError.message || 'Failed to add customer',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCustomer = async (userId: number, customerName: string) => {
    if (!window.confirm(`Remove ${customerName} from your customer list?`)) return;
    try {
      await shopService.removeCustomer(userId);
      setCustomers(prev => prev.filter(c => c.customer.id !== userId));
      toast({
        title: 'Customer Removed',
        description: `${customerName} has been removed`,
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Remove Failed',
        description: apiError.message || 'Failed to remove customer',
        variant: 'destructive',
      });
    }
  };

  const CustomerCard = ({ customer }: { customer: ShopCustomer }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {customer.customer.name}
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{customer.customer.mobile_number}</span>
              </div>
              {customer.customer.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.customer.email}</span>
                </div>
              )}
              {customer.customer.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="flex-1">{customer.customer.address}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteCustomer(customer.customer.id, customer.customer.name)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonCard = () => (
    <Card>
      <CardContent className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-muted rounded w-2/3" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
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
          <h1 className="text-2xl font-bold text-foreground">Manage Customers</h1>
          <p className="text-muted-foreground">
            View and manage your customer relationships
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="customerPhone">Customer Mobile Number *</Label>
                <Input
                  id="customerPhone"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddCustomer} className="flex-1">
                  Add Customer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {customers.length}
          </div>
          <div className="text-sm text-muted-foreground">Total Customers</div>
        </Card>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Removed Loyal & Regular customer count cards per requirement */}
        <Card className="p-4 text-center">
          <div className="text-xl font-bold text-muted-foreground">
            {customers.length}
          </div>
          <div className="text-sm text-muted-foreground">New Customers</div>
          <div className="text-xs text-muted-foreground mt-1">(No orders yet)</div>
        </Card>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : filteredCustomers.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
      </div>

      {/* Empty State */}
      {!loading && filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {searchQuery 
              ? 'Try adjusting your search criteria'
              : 'Add customers to build relationships and track orders'
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Customer
            </Button>
          )}
        </div>
      )}
    </div>
  );
}