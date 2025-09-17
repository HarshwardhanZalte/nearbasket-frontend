import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, MapPin, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';
import { ApiError } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile_number: user?.mobile_number || '',
    email: user?.email || '',
    address: user?.address || '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const me = await authService.getProfile();
        setFormData({
          name: me.name || '',
          mobile_number: me.mobile_number || '',
          email: me.email || '',
          address: me.address || '',
        });
      } catch (error) {
        const apiError = error as ApiError;
        toast({
          title: 'Failed to load profile',
          description: apiError.message || 'Could not fetch profile',
          variant: 'destructive',
        });
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const success = await updateUser(formData);
    if (success) {
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      mobile_number: user?.mobile_number || '',
      email: user?.email || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="p-mobile">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {user?.name || 'Customer'}
          </h2>
          <p className="text-muted-foreground">
            {user?.mobile_number}
          </p>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Personal Information
            {isEditing && (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
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
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              ) : (
                <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{user?.name || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.mobile_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              ) : (
                <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{user?.mobile_number || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user?.email || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your complete address"
                className="mt-1"
              />
            ) : (
              <div className="flex items-start gap-2 mt-2 p-2 bg-muted rounded">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <span>{user?.address || 'Not provided'}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics removed per requirement */}

      <Separator className="my-6" />

      {/* Logout */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="w-full"
      >
        Logout
      </Button>
    </div>
  );
}