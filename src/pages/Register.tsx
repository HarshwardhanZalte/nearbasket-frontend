import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadImageToFirebase } from "@/lib/uploadImageToFirebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

interface RegisterFormData {
  mobile_number: string;
  name: string;
  email: string;
  address: string;
  profile_image_url: string;
  role: "CUSTOMER" | "SHOPKEEPER";
  shop_info?: {
    name: string;
    address: string;
    description: string;
    shop_logo_url: string;
  };
}

export default function Register() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"CUSTOMER" | "SHOPKEEPER">("CUSTOMER");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [shopLogoPreview, setShopLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    mode: "onChange",
    defaultValues: {
      role: "CUSTOMER",
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (preview: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);

      // Upload profile image
      const profileInput = document.querySelector<HTMLInputElement>('#profile-image');
      const profileFile = profileInput?.files?.[0];
      
      if (profileFile) {
        const profileUrl = await uploadImageToFirebase(profileFile, "users/profile_images");
        data.profile_image_url = profileUrl;
      }

      // Upload shop logo if shopkeeper
      if (data.role === "SHOPKEEPER") {
        const logoInput = document.querySelector<HTMLInputElement>('#shop-logo');
        const logoFile = logoInput?.files?.[0];
        
        if (logoFile && data.shop_info) {
          const logoUrl = await uploadImageToFirebase(logoFile, "shops/logos");
          data.shop_info.shop_logo_url = logoUrl;
        }
      }

      // Submit to backend
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast({
        title: "Success",
        description: "Registration successful!",
      });

      // Reset form
      reset();
      setProfilePreview(null);
      setShopLogoPreview(null);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">Role</label>
          <Select
            defaultValue={role}
            onValueChange={(value: "CUSTOMER" | "SHOPKEEPER") => setRole(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
              <SelectItem value="SHOPKEEPER">Shopkeeper</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="mobile_number" className="text-sm font-medium">Mobile Number</label>
          <Input
            id="mobile_number"
            {...register("mobile_number", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit mobile number",
              },
            })}
            placeholder="Enter mobile number"
          />
          {errors.mobile_number && (
            <p className="text-sm text-red-500">{errors.mobile_number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input
            id="name"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">Address</label>
          <Textarea
            id="address"
            {...register("address", { required: "Address is required" })}
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-image" className="text-sm font-medium">Profile Picture</label>
          <Input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setProfilePreview)}
            className="cursor-pointer"
          />
          
          {profilePreview && (
            <div className="mt-2">
              <img
                src={profilePreview}
                alt="Profile preview"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          )}
        </div>

        {role === "SHOPKEEPER" && (
          <div className="space-y-6 border-t pt-6">
            <h2 className="text-xl font-semibold">Shop Information</h2>
            
            <div className="space-y-2">
              <label htmlFor="shop_name" className="text-sm font-medium">Shop Name</label>
              <Input
                id="shop_name"
                {...register("shop_info.name", {
                  required: role === "SHOPKEEPER" ? "Shop name is required" : false,
                })}
                placeholder="Enter shop name"
              />
              {errors.shop_info?.name && (
                <p className="text-sm text-red-500">{errors.shop_info.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="shop_address" className="text-sm font-medium">Shop Address</label>
              <Textarea
                id="shop_address"
                {...register("shop_info.address", {
                  required: role === "SHOPKEEPER" ? "Shop address is required" : false,
                })}
                placeholder="Enter shop address"
              />
              {errors.shop_info?.address && (
                <p className="text-sm text-red-500">{errors.shop_info.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="shop_description" className="text-sm font-medium">Shop Description</label>
              <Textarea
                id="shop_description"
                {...register("shop_info.description", {
                  required: role === "SHOPKEEPER" ? "Shop description is required" : false,
                })}
                placeholder="Enter shop description"
              />
              {errors.shop_info?.description && (
                <p className="text-sm text-red-500">{errors.shop_info.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="shop-logo" className="text-sm font-medium">Shop Logo</label>
              <Input
                id="shop-logo"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setShopLogoPreview)}
                className="cursor-pointer"
              />
              
              {shopLogoPreview && (
                <div className="mt-2">
                  <img
                    src={shopLogoPreview}
                    alt="Shop logo preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Card>
  );
}