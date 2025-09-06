import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ShopkeeperSidebar } from './ShopkeeperSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export const ShopkeeperLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-primary">NearBasket</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex">
        <ShopkeeperSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};