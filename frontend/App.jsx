import React from 'react';
import DashboardLayout from './src/components/DashboardLayout';
import OrderList from './src/components/OrderList';

function App() {
  return (
    <DashboardLayout>
      <OrderList />
    </DashboardLayout>
  );
}

export default App;