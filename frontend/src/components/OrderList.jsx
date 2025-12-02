import React from 'react';
import OrderCard from './OrderCard';

function OrderList({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>No new orders at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default OrderList;