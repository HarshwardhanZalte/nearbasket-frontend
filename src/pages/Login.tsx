import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { Smartphone } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  
  const { sendOtp, verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showOtp) {
      phoneInputRef.current?.focus();
    } else {
      // Focus OTP after switching view
      setTimeout(() => otpInputRef.current?.focus(), 0);
    }
  }, [showOtp]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const result = await sendOtp(phone);
    
    if (result.success) {
      setShowOtp(true);
      // Do not expose OTP in UI; rely on user input. Optionally log for dev only.
      if (import.meta.env.DEV && result.otp) {
        // eslint-disable-next-line no-console
        console.log('Dev OTP:', result.otp);
      }
      toast({ title: 'OTP Sent', description: 'Please enter the 4-digit OTP.' });
    } else {
      toast({
        title: "Failed to Send OTP",
        description: result.message,
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    
    const result = await verifyOtp(phone, otp);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: `Welcome to NearBasket!`,
      });
      
      // Navigate based on user role - will be determined from the API response
      navigate('/'); // RootRedirect will handle the navigation
    } else {
      toast({
        title: "Invalid OTP",
        description: result.message,
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <Card className="w-full max-w-md shadow-brand">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            NearBasket
          </CardTitle>
          <CardDescription>
            Connect with nearby shops and customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="shopkeeper">Shopkeeper</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer" className="space-y-4 mt-6">
              <div className="text-center">
                <h3 className="font-semibold">Customer Login</h3>
                <p className="text-sm text-muted-foreground">Explore nearby shops and place orders</p>
              </div>
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="shopkeeper" className="space-y-4 mt-6">
              <div className="text-center">
                <h3 className="font-semibold">Shopkeeper Login</h3>
                <p className="text-sm text-muted-foreground">Manage your shop and serve customers</p>
              </div>
              <LoginForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function LoginForm() {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={showOtp}
              ref={phoneInputRef}
              autoFocus={!showOtp}
          />
        </div>

        {showOtp && (
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={4}
                autoFocus
                ref={otpInputRef}
            />
          </div>
        )}

        <Button
          onClick={showOtp ? handleVerifyOtp : handleSendOtp}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Please wait...' : showOtp ? 'Verify OTP' : 'Send OTP'}
        </Button>

        {showOtp && (
          <Button
            variant="outline"
            onClick={() => {
              setShowOtp(false);
              setOtp('');
            }}
            className="w-full"
          >
            Change Phone Number
          </Button>
        )}
      </div>
    );
  }
}