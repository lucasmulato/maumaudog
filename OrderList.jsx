import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import { fetchOrders, updateOrderStatus } from './api'; // Assuming api.js exists

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getOrders();

    // Setup WebSocket connection
    const wsUrl = `ws://${window.location.host.replace(/:\d+$/, '')}:3000`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log('WebSocket connected');
    ws.onclose = () => console.log('WebSocket disconnected');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);

      if (message.type === 'NEW_ORDER') {
        setOrders((prevOrders) => [...prevOrders, message.payload]);
      } else if (message.type === 'STATUS_UPDATE') {
        const { orderId, newStatus } = message.payload;
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistic update is no longer needed as WebSocket provides the update
    try {
      await updateOrderStatus(orderId, newStatus);
      // The WebSocket listener will handle the state update
    } catch (err) {
      console.error(`Failed to update order ${orderId}:`, err);
      // Optionally show an error message to the user
      alert(`Error: Could not update order status. Please try again.`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Pedidos Ativos</h2>
      {loading && <p className="text-center text-gray-400">Carregando pedidos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;