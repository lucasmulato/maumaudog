import React, { useState, useEffect } from 'react';
import OrderList from './OrderList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const POLLING_INTERVAL_MS = 5000; // 5 seconds

function DashboardLayout() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      // Assuming you have an endpoint to get all current orders
      const response = await fetch(`${API_URL}/api/orders`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
      setError(null); // Clear previous errors on successful fetch
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      setError("Failed to load orders. Trying again soon...");
    }
  };

  // useEffect for initial data fetch and setting up polling
  useEffect(() => {
    fetchOrders(); // Fetch immediately on component mount

    const intervalId = setInterval(fetchOrders, POLLING_INTERVAL_MS);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">MaoMaoDog Dashboard</h1>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </header>
      <main>
        <OrderList orders={orders} />
      </main>
    </div>
  );
}

export default DashboardLayout;