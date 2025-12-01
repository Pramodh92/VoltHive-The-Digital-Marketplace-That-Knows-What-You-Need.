// Admin panel functionality
let products = [];
let editingProductId = null;

// Load all products
async function loadProducts() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  const productsTableBody = document.getElementById('productsTableBody');

  try {
    loadingSpinner.style.display = 'flex';
    products = await API.getProducts();
    displayProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    productsTableBody.innerHTML = '<tr><td colspan="7">Error loading products</td></tr>';
  } finally {
    loadingSpinner.style.display = 'none';
  }
}

// Display products in table
function displayProducts() {
  const productsTableBody = document.getElementById('productsTableBody');

  if (products.length === 0) {
    productsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No products found</td></tr>';
    return;
  }

  productsTableBody.innerHTML = products.map(product => `
    <tr>
      <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>
        <div class="admin-actions">
          <button class="btn btn-small btn-primary" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn btn-small btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Open modal for adding new product
function openModal() {
  editingProductId = null;
  document.getElementById('modalTitle').textContent = 'Add New Product';
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('productModal').classList.add('active');
}

// Close modal
function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.getElementById('modalAlert').innerHTML = '';
}

// Edit product
function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) return;

  editingProductId = productId;
  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productDescription').value = product.description;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productStock').value = product.stock;
  document.getElementById('productImage').value = product.image;
  
  document.getElementById('productModal').classList.add('active');
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    await API.deleteProduct(productId);
    alert('Product deleted successfully!');
    await loadProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Failed to delete product');
  }
}

// Handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  const productData = {
    name: document.getElementById('productName').value.trim(),
    description: document.getElementById('productDescription').value.trim(),
    category: document.getElementById('productCategory').value,
    price: parseFloat(document.getElementById('productPrice').value),
    stock: parseInt(document.getElementById('productStock').value),
    image: document.getElementById('productImage').value.trim() || 'https://via.placeholder.com/500?text=No+Image',
  };

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    if (editingProductId) {
      // Update existing product
      await API.updateProduct(editingProductId, productData);
      alert('Product updated successfully!');
    } else {
      // Create new product
      await API.createProduct(productData);
      alert('Product created successfully!');
    }

    closeModal();
    await loadProducts();
  } catch (error) {
    console.error('Error saving product:', error);
    showModalAlert(error.message || 'Failed to save product');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Product';
  }
}

// Show alert in modal
function showModalAlert(message) {
  const modalAlert = document.getElementById('modalAlert');
  modalAlert.innerHTML = `
    <div class="alert alert-error">
      ${message}
    </div>
  `;
  
  setTimeout(() => {
    modalAlert.innerHTML = '';
  }, 5000);
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  const modal = document.getElementById('productModal');
  if (event.target === modal) {
    closeModal();
  }
});
