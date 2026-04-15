const SUPABASE_URL = 'https://acsjkmknrzohrojwmjmi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjc2prbWtucnpvaHJvandtam1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzkyOTUsImV4cCI6MjA5MTc1NTI5NX0.1jxe8mk4lb4snMpXuDFLQyWull56YriUBdlKk1KslFw';

let cart = [];
let currentProduct = null;
let currentQty = 1;
let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        allProducts = await response.json();
        return allProducts;
    } catch (err) {
        console.error('Fetch error:', err);
        return [];
    }
}

async function renderProducts() {
    const products = await fetchProducts();
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.style.display = 'flex';
        grid.style.justifyContent = 'center';
        grid.style.alignItems = 'center';
        grid.style.minHeight = '400px';
        grid.innerHTML = `
            <div style="text-align: center; opacity: 0.6; padding: 60px;">
                <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 20px;">Collection coming soon</h2>
                <p>Our artisans are meticulously crafting new eternal blooms. <br> Return soon to discover the silence of silk.</p>
            </div>
        `;
        return;
    }

    grid.style.display = 'grid';
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="image-wrapper">
                ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
                <img src="${p.img}" alt="${p.name}" style="${p.img && (p.img.includes('satin_rose') || p.img.includes('hero')) ? 'mix-blend-mode: multiply;' : ''}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
            </div>
            <div class="product-footer">
                <span class="price">${p.price}</span>
                <a href="javascript:void(0)" class="btn-add" onclick="openQtyModal(${p.id})">Add to Cart</a>
            </div>
        </div>
    `).join('');
}

window.openQtyModal = function(productId) {
    currentProduct = allProducts.find(p => p.id === productId);
    
    if (currentProduct) {
        currentQty = 1;
        document.getElementById('qtyProdImg').src = currentProduct.img;
        document.getElementById('qtyProdName').innerText = currentProduct.name;
        document.getElementById('qtyProdTag').innerText = currentProduct.tag || 'Boutique';
        document.getElementById('qtyProdDesc').innerText = currentProduct.desc;
        updateQtyDisplay();
        document.getElementById('qtyModal').classList.add('active');
    }
};

function updateQtyDisplay() {
    const price = parseFloat(currentProduct.price.replace(' DA', '').replace('$', ''));
    const total = price * currentQty;
    document.getElementById('qtyValue').innerText = currentQty;
    document.getElementById('qtyTotal').innerText = `${total.toLocaleString()} DA`;
}

document.getElementById('qtyPlus').addEventListener('click', () => {
    currentQty++;
    updateQtyDisplay();
});

document.getElementById('qtyMinus').addEventListener('click', () => {
    if (currentQty > 1) {
        currentQty--;
        updateQtyDisplay();
    }
});

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.innerText = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 2500);
}

document.getElementById('confirmAddBtn').addEventListener('click', () => {
    const cartItem = { id: currentProduct.id, quantity: currentQty };
    cart.push(cartItem);
    // localStorage.setItem('asmaFlowersCart', JSON.stringify(cart));
    updateCartUI();
    document.getElementById('qtyModal').classList.remove('active');
    
    showToast(`${currentProduct.name} added to cart`);
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 300);
});

function removeFromCart(index) {
    cart.splice(index, 1);
    // localStorage.setItem('asmaFlowersCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCountEls = document.querySelectorAll('#cartCount');
    const cartTotalText = document.getElementById('cartTotalText');
    
    let totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    cartCountEls.forEach(el => el.innerText = totalItems);
    
    let total = 0;
    cartItems.innerHTML = cart.map((cartRecord, index) => {
        const product = allProducts.find(p => p.id === cartRecord.id);
        if (!product) return '';

        const priceValue = parseFloat(product.price.replace(' DA', '').replace('$', ''));
        const qty = cartRecord.quantity || 1;
        total += (priceValue * qty);
        return `
            <div class="cart-item">
                <img src="${product.img}" alt="${product.name}">
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <p>${product.price} x ${qty}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    }).join('');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; opacity:0.5; padding: 40px 0;">Your cart is empty.</p>';
    }

    cartTotalText.innerText = `${total.toLocaleString()} DA`;
}

const modal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');
const qtyModal = document.getElementById('qtyModal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const closeQty = document.getElementById('closeQty');
const checkoutBtn = document.getElementById('checkoutBtn');
const backToCart = document.getElementById('backToCart');
const orderForm = document.getElementById('orderForm');

cartBtn.addEventListener('click', () => {
    modal.classList.add('active');
    updateCartUI();
});

closeCart.addEventListener('click', () => modal.classList.remove('active'));
closeQty.addEventListener('click', () => qtyModal.classList.remove('active'));

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    modal.classList.remove('active');
    checkoutModal.classList.add('active');
});

backToCart.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
    modal.classList.add('active');
});

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const wilaya = document.getElementById('custWilaya').value;
    const dayra = document.getElementById('custDayra').value;
    const addr = document.getElementById('custAddr').value;

    // Format Order Message
    let total = 0;
    let itemsText = cart.map(cartRecord => {
        const product = allProducts.find(p => p.id === cartRecord.id);
        if (!product) return '';
        
        const priceValue = parseFloat(product.price.replace(' DA', '').replace('$', ''));
        const qty = cartRecord.quantity || 1;
        const lineTotal = priceValue * qty;
        total += lineTotal;
        return `- ${product.name} | ${product.price} x ${qty} = ${lineTotal.toLocaleString()} DA`;
    }).join('%0A');

    const message = `*NEW ORDER FROM ASMA FLOWERS*%0A%0A` +
                    `*Customer Details:*%0A` +
                    `Name: ${name}%0A` +
                    `Phone: ${phone}%0A` +
                    `Location: ${wilaya}, ${dayra}%0A` +
                    `Address: ${addr}%0A%0A` +
                    `*Items ordered:*%0A${itemsText}%0A%0A` +
                    `*Total Amount:* ${total.toLocaleString()} DA %0A%0A` +
                    `_Sent via Asma Flowers Web App_`;

    const whatsappUrl = `https://wa.me/213696004501?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    document.getElementById('orderFormContainer').style.display = 'none';
    document.getElementById('orderSuccess').style.display = 'block';

    cart = [];
    // localStorage.setItem('asmaFlowersCart', JSON.stringify(cart));
    updateCartUI();
});

window.closeSuccessModal = function() {
    checkoutModal.classList.remove('active');
    setTimeout(() => {
        document.getElementById('orderFormContainer').style.display = 'block';
        document.getElementById('orderSuccess').style.display = 'none';
        orderForm.reset();
    }, 500);
};

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) checkoutModal.classList.remove('active');
});

qtyModal.addEventListener('click', (e) => {
    if (e.target === qtyModal) qtyModal.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', async () => {
    await renderProducts();
    updateCartUI();
});

window.addEventListener('storage', async () => {
    await renderProducts();
    // cart = JSON.parse(localStorage.getItem('asmaFlowersCart')) || [];
    // updateCartUI();
});
