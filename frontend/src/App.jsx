import React from 'react';
import DashboardLayout from './components/DashboardLayout';
import OrderList from './components/OrderList';

function App() {
  return (
    <DashboardLayout>
      <OrderList />
    </DashboardLayout>
  );
}

export default App;