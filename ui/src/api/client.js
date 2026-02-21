const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || res.statusText);
  return data;
}

export const api = {
  getMenus(includeStock = false) {
    return request(`/api/menus${includeStock ? '?includeStock=1' : ''}`);
  },
  getInventory() {
    return request('/api/menus/inventory');
  },
  updateStock(menuId, body) {
    return request(`/api/menus/${encodeURIComponent(menuId)}/stock`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
  getOrders() {
    return request('/api/orders');
  },
  getOrder(id) {
    return request(`/api/orders/${id}`);
  },
  createOrder(body) {
    return request('/api/orders', { method: 'POST', body: JSON.stringify(body) });
  },
  updateOrderStatus(orderId, status) {
    return request(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
