import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, ShoppingCart, Package, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export const CustomerNavigation: React.FC = () => {
  const { totalItems } = useCart();

  const navItems = [
    { to: '/customer/explore', icon: Store, label: 'Explore' },
    { to: '/customer/cart', icon: ShoppingCart, label: 'Cart', badge: totalItems },
    { to: '/customer/orders', icon: Package, label: 'Orders' },
    { to: '/customer/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 relative ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {badge && badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};