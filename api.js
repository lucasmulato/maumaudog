const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'An API error occurred.');
    error.status = response.status;
    throw error;
  }

  // For 204 No Content, there's no body to parse
  if (response.status === 204) {
    return;
  }

  return response.json();
}

export const fetchOrders = () => {
  // Assuming an endpoint `/api/orders` exists to get all active orders
  return request('/orders');
};

export const updateOrderStatus = (orderId, status) => {
  // Assuming an endpoint like `/api/orders/:id/status` exists for updates
  return request(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};