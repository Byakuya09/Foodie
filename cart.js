// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

// DOM Elements
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const deliveryElement = document.getElementById('delivery');
const totalAmountElement = document.getElementById('total-amount');
const orderComplete = document.getElementById('order-complete');
const upiApps = document.querySelectorAll('.upi-app');
const paymentMethods = document.querySelectorAll('.payment-method');
const simulatePaymentBtn = document.getElementById('simulate-payment');
const payViaUpiBtn = document.getElementById('pay-via-upi');
const cartCountElements = document.querySelectorAll('.cart-count');

// Initialize Cart Page
function initializeCartPage() {
    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        cartItemsContainer.classList.add('hidden');
        updateOrderSummary(0);
        return;
    }
    
    emptyCartMessage.classList.add('hidden');
    cartItemsContainer.classList.remove('hidden');
    renderCartItems();
    updateOrderSummary(calculateSubtotal());
    updateCartCount();
}

// Render Cart Items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item-card';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="menu-item-price">₹${item.price}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeCartItem(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
            <div class="cart-item-total">
                <strong>₹${itemTotal}</strong>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
}

// Calculate Subtotal
function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Update Order Summary
function updateOrderSummary(subtotal) {
    const delivery = 30;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + delivery + tax;
    
    subtotalElement.textContent = subtotal;
    taxElement.textContent = tax;
    totalAmountElement.textContent = total;
}

// Update Cart Item Quantity
function updateCartItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Save to localStorage
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        
        // Update display
        initializeCartPage();
    }
}

// Remove Cart Item
function removeCartItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
    initializeCartPage();
}

// Update Cart Count in Header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// UPI App Selection
upiApps.forEach(app => {
    app.addEventListener('click', () => {
        // Remove active class from all
        upiApps.forEach(a => a.classList.remove('active'));
        // Add active class to clicked
        app.classList.add('active');
        
        const appType = app.dataset.app;
        
        // Hide all payment methods
        paymentMethods.forEach(method => method.classList.add('hidden'));
        
        // Show selected payment method
        if (appType === 'qr') {
            document.getElementById('qr-method').classList.remove('hidden');
        } else if (appType === 'gpay' || appType === 'phonepe' || appType === 'paytm') {
            document.getElementById('upi-id-method').classList.remove('hidden');
            document.getElementById('simulate-method').classList.remove('hidden');
        }
    });
});

// Simulate Payment
if (simulatePaymentBtn) {
    simulatePaymentBtn.addEventListener('click', processPayment);
}

if (payViaUpiBtn) {
    payViaUpiBtn.addEventListener('click', processPayment);
}

// Process Payment
function processPayment() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Generate random order ID
    const orderId = 'FH-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('order-id').textContent = orderId;
    
    // Show success message
    document.querySelector('.payment-methods').classList.add('hidden');
    orderComplete.classList.remove('hidden');
    
    // Clear cart
    cart = [];
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
    updateCartCount();
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeCartPage);
