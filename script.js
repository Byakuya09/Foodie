// Menu Data - 5 items with prices
const menuItems = [
    {
        id: 1,
        name: "Butter Chicken",
        description: "Tender chicken in rich tomato butter sauce",
        price: 299,
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        category: "Main Course"
    },
    {
        id: 2,
        name: "Paneer Tikka",
        description: "Grilled cottage cheese with spices",
        price: 249,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
        category: "Appetizer"
    },
    {
        id: 3,
        name: "Biryani",
        description: "Fragrant rice with vegetables & spices",
        price: 199,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        category: "Main Course"
    },
    {
        id: 4,
        name: "Garlic Naan",
        description: "Soft bread with garlic butter",
        price: 79,
        image: "https://images.unsplash.com/photo-1645112411341-1c8ed15b55c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        category: "Bread"
    },
    {
        id: 5,
        name: "Gulab Jamun",
        description: "Sweet milk dumplings in syrup",
        price: 129,
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
        category: "Dessert"
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

// DOM Elements
const menuContainer = document.getElementById('menu-items');
const cartCountElements = document.querySelectorAll('.cart-count, .cart-badge');
const cartSidebar = document.getElementById('cart-sidebar');
const sidebarCartItems = document.getElementById('sidebar-cart-items');
const sidebarTotal = document.getElementById('sidebar-total');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');

// Initialize Menu
function initializeMenu() {
    menuContainer.innerHTML = '';
    
    menuItems.forEach(item => {
        const cartItem = cart.find(c => c.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-price">₹${item.price}</div>
                
                <div class="quantity-controls">
                    <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="number" class="quantity-input" id="qty-${item.id}" 
                           value="${quantity}" min="0" max="10" 
                           onchange="updateQuantityInput(${item.id}, this.value)">
                    <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                
                <button class="add-to-cart" onclick="addToCart(${item.id})">
                    ${quantity > 0 ? 'Update Cart' : 'Add to Cart'}
                </button>
            </div>
        `;
        
        menuContainer.appendChild(menuItemElement);
    });
}

// Update Cart
function updateCart() {
    // Save to localStorage
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
    
    // Update sidebar if open
    updateSidebarCart();
    
    // Update quantity inputs
    cart.forEach(item => {
        const input = document.getElementById(`qty-${item.id}`);
        if (input) {
            input.value = item.quantity;
            const button = input.closest('.menu-item').querySelector('.add-to-cart');
            button.textContent = 'Update Cart';
        }
    });
}

// Update Quantity
function updateQuantity(itemId, change) {
    const item = menuItems.find(m => m.id === itemId);
    const cartItem = cart.find(c => c.id === itemId);
    
    let newQuantity = (cartItem ? cartItem.quantity : 0) + change;
    newQuantity = Math.max(0, Math.min(10, newQuantity));
    
    if (newQuantity === 0) {
        // Remove from cart
        cart = cart.filter(c => c.id !== itemId);
    } else {
        if (cartItem) {
            cartItem.quantity = newQuantity;
        } else {
            cart.push({
                id: itemId,
                name: item.name,
                price: item.price,
                quantity: newQuantity,
                image: item.image
            });
        }
    }
    
    updateCart();
}

// Update Quantity from Input
function updateQuantityInput(itemId, value) {
    const newQuantity = parseInt(value) || 0;
    updateQuantity(itemId, newQuantity - (cart.find(c => c.id === itemId)?.quantity || 0));
}

// Add to Cart (single click)
function addToCart(itemId) {
    const cartItem = cart.find(c => c.id === itemId);
    const newQuantity = cartItem ? cartItem.quantity + 1 : 1;
    
    updateQuantity(itemId, newQuantity - (cartItem?.quantity || 0));
}

// Update Sidebar Cart
function updateSidebarCart() {
    if (!sidebarCartItems) return;
    
    sidebarCartItems.innerHTML = '';
    
    if (cart.length === 0) {
        sidebarCartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
        sidebarTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div>₹${item.price} × ${item.quantity}</div>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-price">₹${itemTotal}</span>
                <button onclick="updateQuantity(${item.id}, -1)" style="background:none;border:none;cursor:pointer;color:#ff6b6b">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        sidebarCartItems.appendChild(cartItemElement);
    });
    
    sidebarTotal.textContent = total;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeMenu();
    updateCart();
    
    // Cart Sidebar Toggle
    if (openCartBtn) {
        openCartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && 
            e.target !== openCartBtn) {
            cartSidebar.classList.remove('active');
        }
    });
});
