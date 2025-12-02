import React from 'react';

// A helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

function OrderCard({ order }) {
  // Placeholder for API call to update status
  const handleUpdateStatus = async (newStatus) => {
    console.log(`Updating order ${order.id} to ${newStatus}`);
    // Example API call:
    // try {
    //   const response = await fetch(`/api/orders/${order.id}/status`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ status: newStatus }),
    //   });
    //   if (!response.ok) throw new Error('Failed to update status');
    //   // You might want to trigger a re-fetch of orders here
    // } catch (error) {
    //   console.error(error);
    //   // Show an error toast/notification to the user
    // }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h2 className="text-lg font-bold">Order #{order.displayId || order.id}</h2>
          <span className="px-2 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
            {order.status}
          </span>
        </div>
        <div className="mb-4">
          <p className="font-semibold text-gray-700">{order.customer?.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <ul className="text-sm text-gray-800 space-y-1 mb-4">
          {order.items?.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatCurrency(item.totalPrice)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-2 text-right font-bold text-lg">
          Total: {formatCurrency(order.total || 0)}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-end">
        <button onClick={() => handleUpdateStatus('PREPARING')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm">Preparing</button>
        <button onClick={() => handleUpdateStatus('COMPLETED')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm">Complete</button>
        <button onClick={() => handleUpdateStatus('CANCELLED')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">Cancel</button>
      </div>
    </div>
  );
}

export default OrderCard;