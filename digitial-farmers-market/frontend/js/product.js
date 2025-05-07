document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const productForm = document.getElementById('productForm');
    const myProducts = document.getElementById('myProducts');
  
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
  
    // Add new product
    productForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('name', document.getElementById('name').value);
      formData.append('price', document.getElementById('price').value);
      formData.append('description', document.getElementById('description').value);
      formData.append('image', document.getElementById('image').files[0]);
  
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
  
        const data = await res.json();
        if (res.ok) {
          alert('✅ Product added successfully!');
          productForm.reset();
          fetchMyProducts();
        } else {
          alert(data.message || '❌ Failed to add product.');
        }
      } catch (error) {
        alert('❌ Error adding product.');
      }
    });
  
    // Fetch products created by the logged-in farmer
    async function fetchMyProducts() {
      try {
        const res = await fetch('http://localhost:5000/api/products/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await res.json();
        if (res.ok) {
          myProducts.innerHTML = '';
  
          if (data.length === 0) {
            myProducts.innerHTML = '<p>No products added yet.</p>';
            return;
          }
  
          data.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
              <h4>${product.name}</h4>
              <img src="http://localhost:5000/uploads/${product.image}" width="120" height="100" style="object-fit:cover; border:1px solid #ccc;" />
              <p><strong>Price:</strong> ₹${product.price}</p>
              <p>${product.description}</p>
              <button onclick="deleteProduct('${product._id}')">🗑️ Delete</button>
            `;
            myProducts.appendChild(div);
          });
        } else {
          myProducts.innerHTML = '<p>❌ Failed to load products.</p>';
        }
      } catch (error) {
        myProducts.innerHTML = '<p>❌ Error fetching products.</p>';
      }
    }
  
    // Delete a product
    window.deleteProduct = async (productId) => {
      if (!confirm('Are you sure you want to delete this product?')) return;
  
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (res.ok) {
          alert('🗑️ Product deleted.');
          fetchMyProducts();
        } else {
          alert('❌ Failed to delete product.');
        }
      } catch (error) {
        alert('❌ Error deleting product.');
      }
    };
  
    // Initial fetch
    fetchMyProducts();
  });
  