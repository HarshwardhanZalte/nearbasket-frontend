import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Store, Phone, Mail, MapPin, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { shopService } from '@/services/shop';
import { ApiError } from '@/services/api';

export default function ShopProfile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    shop_id: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const myShop = await shopService.getMyShop();
        if (myShop && !Array.isArray(myShop)) {
          setShopData({
            name: myShop.name,
            description: myShop.description,
            phone: user?.mobile_number || '',
            email: user?.email || '',
            address: myShop.address,
            shop_id: myShop.shop_id,
          });
        }
      } catch (error) {
        const apiError = error as ApiError;
        toast({ title: 'Failed to load shop', description: apiError.message || 'Could not fetch shop', variant: 'destructive' });
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      const updated = await shopService.updateMyShop({
        name: shopData.name,
        address: shopData.address,
        description: shopData.description,
      });
      setShopData(prev => ({ ...prev, name: updated.name, address: updated.address, description: updated.description }));
      toast({ title: 'Shop Profile Updated', description: 'Saved successfully' });
      setIsEditing(false);
    } catch (error) {
      const apiError = error as ApiError;
      toast({ title: 'Update Failed', description: apiError.message || 'Could not update shop', variant: 'destructive' });
    }
  };

  const handleCancel = () => {
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
                {shopData.name || 'My Shop'}
              </h2>
              <p className="text-muted-foreground mb-1">Shop ID: {shopData.shop_id}</p>
              <p className="text-muted-foreground mb-3">{shopData.description}</p>
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
                  value={shopData.name}
                  onChange={(e) => setShopData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                  <Store className="w-4 h-4 text-muted-foreground" />
                  <span>{shopData.name}</span>
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

          {/* Removed open/close toggle and hours per requirement */}
        </CardContent>
      </Card>

      {/* Removed Business Statistics per requirement */}

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