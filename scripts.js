// scripts.js - Updated Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu');
const nav = document.querySelector('nav');
const cartCount = document.querySelector('.cart-count');

// Mobile menu toggle
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('show');
  });
}

// Cart functions
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1
    });
  }
  
  updateCart();
  updateCartCount();
  saveCartToLocalStorage();
  showNotification(`${name} added to cart!`);
}

function updateCart() {
  const cartContainer = document.querySelector('.cart-items');
  const emptyCart = document.querySelector('.empty-cart');
  const orderItemsContainer = document.querySelector('.order-items');
  
  if (cartContainer) {
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
      if (emptyCart) emptyCart.style.display = 'block';
      document.querySelector('.subtotal').textContent = '$0.00';
      document.querySelector('.total-amount').textContent = '$2.99';
      return;
    } else {
      if (emptyCart) emptyCart.style.display = 'none';
    }
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button onclick="changeQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
          <button class="remove-item" onclick="removeItem(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      cartContainer.appendChild(cartItem);
    });
    
    const subtotal = calculateSubtotal();
    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee;
    
    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
  }
  
  if (orderItemsContainer) {
    orderItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      orderItemsContainer.innerHTML = '<p class="empty-order">No items in your order</p>';
      return;
    }
    
    cart.forEach(item => {
      const orderItem = document.createElement('div');
      orderItem.className = 'order-item';
      orderItem.innerHTML = `
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-quantity">x${item.quantity}</span>
        </div>
        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      `;
      orderItemsContainer.appendChild(orderItem);
    });
    
    const subtotal = calculateSubtotal();
    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee;
    
    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.delivery-fee').textContent = `$${deliveryFee.toFixed(2)}`;
    document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
  }
}

function calculateSubtotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCount() {
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function changeQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += change;
    
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== id);
    }
    
    updateCart();
    updateCartCount();
    saveCartToLocalStorage();
    showNotification('Cart updated');
  }
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
  updateCartCount();
  saveCartToLocalStorage();
  showNotification('Item removed from cart');
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCart();
  updateCartCount();
  
  // Close mobile menu when clicking a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('show');
    });
  });
});

// Checkout form validation
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Process order here (in a real app)
    showNotification('Order placed successfully!');
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
    updateCartCount();
    
    // Redirect to confirmation page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  });
}