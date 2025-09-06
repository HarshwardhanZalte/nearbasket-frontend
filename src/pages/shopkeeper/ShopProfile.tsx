import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Store, Phone, Mail, MapPin, Clock, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function ShopProfile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [shopData, setShopData] = useState({
    shopName: 'Fresh Mart Grocery',
    description: 'Your neighborhood grocery store with fresh produce and daily essentials',
    phone: user?.phone || '+1234567890',
    email: user?.email || 'freshmart@example.com',
    address: '123 Main St, Downtown, City 12345',
    openingHours: '8:00 AM - 9:00 PM',
    isOpen: true,
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Shop Profile Updated",
      description: "Your shop information has been saved successfully",
    });
  };

  const handleCancel = () => {
    // Reset to original data
    setShopData({
      shopName: 'Fresh Mart Grocery',
      description: 'Your neighborhood grocery store with fresh produce and daily essentials',
      phone: user?.phone || '+1234567890',
      email: user?.email || 'freshmart@example.com',
      address: '123 Main St, Downtown, City 12345',
      openingHours: '8:00 AM - 9:00 PM',
      isOpen: true,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shop Profile</h1>
          <p className="text-muted-foreground">Manage your shop information and settings</p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Shop Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Store className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {shopData.shopName}
              </h2>
              <p className="text-muted-foreground mb-3">
                {shopData.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${shopData.isOpen ? 'bg-success' : 'bg-destructive'}`} />
                  <span className="text-sm font-medium">
                    {shopData.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {shopData.openingHours}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shop Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Shop Information
            {isEditing && (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shopName">Shop Name</Label>
              {isEditing ? (
                <Input
                  id="shopName"
                  value={shopData.shopName}
                  onChange={(e) => setShopData(prev => ({ ...prev, shopName: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                  <Store className="w-4 h-4 text-muted-foreground" />
                  <span>{shopData.shopName}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={shopData.phone}
                  onChange={(e) => setShopData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{shopData.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={shopData.description}
                onChange={(e) => setShopData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            ) : (
              <div className="mt-2 p-2 bg-muted rounded">
                <span>{shopData.description}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={shopData.email}
                onChange={(e) => setShopData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{shopData.email}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="address">Shop Address</Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={shopData.address}
                onChange={(e) => setShopData(prev => ({ ...prev, address: e.target.value }))}
                className="mt-1"
              />
            ) : (
              <div className="flex items-start gap-2 mt-2 p-2 bg-muted rounded">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <span>{shopData.address}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="hours">Opening Hours</Label>
            {isEditing ? (
              <Input
                id="hours"
                value={shopData.openingHours}
                onChange={(e) => setShopData(prev => ({ ...prev, openingHours: e.target.value }))}
                className="mt-1"
                placeholder="e.g., 8:00 AM - 9:00 PM"
              />
            ) : (
              <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{shopData.openingHours}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <Label htmlFor="isOpen">Shop Status</Label>
              <p className="text-sm text-muted-foreground">
                Toggle to open/close your shop for orders
              </p>
            </div>
            <Switch
              id="isOpen"
              checked={shopData.isOpen}
              onCheckedChange={(checked) => setShopData(prev => ({ ...prev, isOpen: checked }))}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Statistics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Business Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">156</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">89</div>
              <div className="text-sm text-muted-foreground">Customers</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">23</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center p-4 bg-gradient-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">4.8</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Account Actions */}
      <div className="flex gap-4">
        <Button
          variant="destructive"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}