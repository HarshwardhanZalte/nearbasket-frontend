import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerNavigation } from './CustomerNavigation';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="relative">
        <Outlet />
      </main>
      <CustomerNavigation />
    </div>
  );
};