document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const assignedOrders = document.getElementById('deliveryOrdersContainer');

  // Redirect if not logged in or not a delivery agent
  if (!token || role !== 'delivery') {
    window.location.href = 'login.html';
    return;
  }

  // Logout handler
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'login.html';
    });
  }

  // Load assigned orders
  async function loadAssignedOrders() {
    try {
      const res = await fetch('http://localhost:5000/api/delivery/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch orders.');

      assignedOrders.innerHTML = '';

      if (data.length === 0) {
        assignedOrders.innerHTML = '<p>No assigned orders found.</p>';
        return;
      }

      data.forEach(order => {
        const div = document.createElement('div');
        div.className = 'order-card';
        div.innerHTML = `
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Product:</strong> ${order.product?.name || 'Unknown Product'}</p>
          <p><strong>Customer:</strong> ${order.customer?.username || 'Unknown Customer'}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          ${order.status === 'assigned' ? `<button data-id="${order._id}">Mark as Delivered</button>` : ''}
        `;
        assignedOrders.appendChild(div);
      });

      // Add event listeners to delivery buttons
      const buttons = document.querySelectorAll('button[data-id]');
      buttons.forEach(button => {
        button.addEventListener('click', async () => {
          const orderId = button.getAttribute('data-id');
          await markAsDelivered(orderId);
        });
      });
    } catch (err) {
      console.error(err);
      assignedOrders.innerHTML = `<p>Error: ${err.message}</p>`;
    }
  }

  // Mark an order as delivered
  async function markAsDelivered(orderId) {
    try {
      const res = await fetch(`http://localhost:5000/api/delivery/update/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'delivered' }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to update order.');

      alert('Order marked as delivered.');
      loadAssignedOrders(); // Reload the orders
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }

  // Initial call
  loadAssignedOrders();
});
