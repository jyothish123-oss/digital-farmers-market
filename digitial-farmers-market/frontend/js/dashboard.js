document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username') || 'User';
    const dashboardContent = document.getElementById('dashboardContent');
  
    if (!role) {
      window.location.href = 'login.html';
      return;
    }
  
    let panelLink = '';
    if (role === 'farmer') {
      panelLink = '<a class="btn" href="farmer.html">Go to Farmer Panel</a>';
    } else if (role === 'customer') {
      panelLink = '<a class="btn" href="customer.html">Go to Customer Panel</a>';
    } else if (role === 'delivery') {
      panelLink = '<a class="btn" href="delivery.html">Go to Delivery Panel</a>';
    }
  
    dashboardContent.innerHTML = `
      <p>Welcome, <strong>${username}</strong>!</p>
      <p>Your role: <strong>${role}</strong></p>
      <div class="nav-links">
        ${panelLink}
      </div>
    `;
  
    document.getElementById('logout').addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'login.html';
    });
  });
  