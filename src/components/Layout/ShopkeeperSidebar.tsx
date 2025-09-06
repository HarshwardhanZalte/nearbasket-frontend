import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  ShoppingBag, 
  User, 
  LogOut,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface ShopkeeperSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopkeeperSidebar: React.FC<ShopkeeperSidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/shopkeeper/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/shopkeeper/products', icon: Package, label: 'Manage Products' },
    { to: '/shopkeeper/customers', icon: Users, label: 'Manage Customers' },
    { to: '/shopkeeper/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/shopkeeper/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            NearBasket
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-brand'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
};