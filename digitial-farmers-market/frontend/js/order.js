document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const productList = document.getElementById('productList');
  
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
  
    // Load all products
    async function loadProducts() {
      productList.innerHTML = '<p>Loading products...</p>';
  
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await res.json();
  
        if (res.ok) {
          productList.innerHTML = '';
  
          if (data.length === 0) {
            productList.innerHTML = '<p>No products available at the moment.</p>';
            return;
          }
  
          data.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product';
  
            // Correct image path
            const imagePath = `http://localhost:5000/${product.image}`;
  
            div.innerHTML = `
              <h3>${product.name}</h3>
              <img src="${imagePath}" alt="${product.name}" width="120" height="100" style="object-fit: cover; border: 1px solid #ccc;" />
              <p>${product.description || 'No description provided.'}</p>
              <p><strong>₹${product.price}</strong></p>
              <button class="buy-btn" data-id="${product._id}">🛒 Buy Now</button>
            `;
            productList.appendChild(div);
          });
  
          addBuyEventListeners();
        } else {
          productList.innerHTML = `<p>❌ Failed to load products: ${data.message || 'Unknown error.'}</p>`;
        }
      } catch (error) {
        productList.innerHTML = `<p>❌ Error loading products.</p>`;
      }
    }
  
    // Add click events for all "Buy Now" buttons
    function addBuyEventListeners() {
      const buttons = document.querySelectorAll('.buy-btn');
      buttons.forEach(button => {
        button.addEventListener('click', async () => {
          const productId = button.getAttribute('data-id');
  
          try {
            const res = await fetch('http://localhost:5000/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ productId }),
            });
  
            const result = await res.json();
  
            if (res.ok) {
              alert('✅ Order placed successfully!');
            } else {
              alert(result.message || '❌ Failed to place order.');
            }
          } catch (err) {
            alert('❌ Error placing order.');
          }
        });
      });
    }
  
    // Initial load
    loadProducts();
  });
  