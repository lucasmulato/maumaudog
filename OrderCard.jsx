import React from 'react';
import OrderStatusSelector from './OrderStatusSelector';

const statusColors = {
  NEW: 'bg-blue-500',
  PREPARING: 'bg-yellow-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

const OrderCard = ({ order, onStatusChange }) => {
  const { id, customerName, items, status, createdAt } = order;
  const statusColor = statusColors[status] || 'bg-gray-500';

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-white">{customerName}</h3>
          <OrderStatusSelector
            orderId={id}
            currentStatus={status}
            onStatusChange={onStatusChange}
          />
        </div>
        <p className="text-sm text-gray-400 mb-2">ID: {id}</p>
        <div className="mb-4">
          <ul className="list-disc list-inside text-gray-300">
            {items.map((item, index) => (
              <li key={index}>
                {item.quantity}x {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span
          className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${statusColor}`}
        >
          {status}
        </span>
        <span className="text-sm text-gray-400">
          {new Date(createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;