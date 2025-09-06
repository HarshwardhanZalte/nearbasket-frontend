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
import { Customer } from '@/types';
import { useToast } from '@/hooks/use-toast';

const mockCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john.doe@example.com',
    address: '123 Main St, Downtown',
    totalOrders: 15,
  },
  {
    id: 'cust2',
    name: 'Sarah Smith',
    phone: '+1234567891',
    email: 'sarah.smith@example.com',
    address: '456 Oak Ave, Uptown',
    totalOrders: 8,
  },
  {
    id: 'cust3',
    name: 'Mike Johnson',
    phone: '+1234567892',
    email: 'mike.johnson@example.com',
    address: '789 Pine St, Midtown',
    totalOrders: 23,
  },
  {
    id: 'cust4',
    name: 'Emily Davis',
    phone: '+1234567893',
    email: 'emily.davis@example.com',
    totalOrders: 4,
  },
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide at least name and phone number",
        variant: "destructive",
      });
      return;
    }

    const customer: Customer = {
      id: `cust${Date.now()}`,
      ...newCustomer,
      totalOrders: 0,
    };

    setCustomers(prev => [...prev, customer]);
    setNewCustomer({ name: '', phone: '', email: '', address: '' });
    setShowAddDialog(false);
    
    toast({
      title: "Customer Added",
      description: `${customer.name} has been added to your customer list`,
    });
  };

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    if (window.confirm(`Are you sure you want to remove ${customerName} from your customer list?`)) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      toast({
        title: "Customer Removed",
        description: `${customerName} has been removed from your customer list`,
      });
    }
  };

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {customer.name}
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="flex-1">{customer.address}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              {customer.totalOrders}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteCustomer(customer.id, customer.name)}
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
                <Label htmlFor="customerName">Name *</Label>
                <Input
                  id="customerName"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter customer name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email (Optional)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerAddress">Address (Optional)</Label>
                <Input
                  id="customerAddress"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter customer address"
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
        <Card className="p-4 text-center">
          <div className="text-xl font-bold text-success">
            {customers.filter(c => c.totalOrders > 10).length}
          </div>
          <div className="text-sm text-muted-foreground">Loyal Customers</div>
          <div className="text-xs text-muted-foreground mt-1">(10+ orders)</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xl font-bold text-warning">
            {customers.filter(c => c.totalOrders >= 1 && c.totalOrders <= 5).length}
          </div>
          <div className="text-sm text-muted-foreground">Regular Customers</div>
          <div className="text-xs text-muted-foreground mt-1">(1-5 orders)</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xl font-bold text-muted-foreground">
            {customers.filter(c => c.totalOrders === 0).length}
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