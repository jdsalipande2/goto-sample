const SUPABASE_URL = 'https://xnknxmmlfphomxixfgol.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhua254bW1sZnBob214aXhmZ29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDkyMDIsImV4cCI6MjA1NTA4NTIwMn0.-iZuTbbKblvRpc3BWg07zSKyjPTA-O8n-Ql0uHPuckI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchCategories() {
    let { data, error } = await supabase.from('category').select('*');
    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    const categoryContainer = document.getElementById('categories');
    categoryContainer.innerHTML = '';

    data.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.innerHTML = `
            <img src="${category.image}" alt="${category.name}">
            <p>${category.name}</p>
        `;
        categoryDiv.addEventListener('click', () => fetchMenuItems(category.id));
        categoryContainer.appendChild(categoryDiv);
    });
}

fetchCategories();

async function fetchMenuItems(categoryId) {
    let { data, error } = await supabase.from('menu').select('*').eq('category_id', categoryId);
    if (error) {
        console.error('Error fetching menu items:', error);
        return;
    }

    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = '';

    if (data.length === 0) {
        menuContainer.innerHTML = '<p>No items available for this category.</p>';
    } else {
        data.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>₱${item.price}</p>
                <button onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
            `;
            menuContainer.appendChild(menuItem);
        });
    }

    document.getElementById('menu-section').style.display = 'block';
}

let cart = [];

function addToCart(id, name, price) {
    let existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div>
                <p>${item.name} - ₱${item.price} x ${item.quantity}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });

    document.getElementById('total-price').innerText = total;
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function proceedToCheckout() {
    document.getElementById('checkout-form').style.display = 'block';
}

function validateInputs(customer) {
    return Object.values(customer).every(value => value.trim() !== "");
}

async function placeOrder() {
    const customer = {
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        contact: document.getElementById('contact').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
    };

    if (!validateInputs(customer)) {
        alert("Please fill in all details before placing an order.");
        return;
    }

    let { data: customerData, error: customerError } = await supabase
        .from('customer')
        .insert([customer])
        .select('id');

    if (customerError) {
        console.error('Error adding customer:', customerError);
        return;
    }

    const customerId = customerData[0].id;

    let { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{ customer_id: customerId, total_price: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) }])
        .select('id');

    if (orderError) {
        console.error('Error creating order:', orderError);
        return;
    }

    const orderId = orderData[0].id;

    let orderItems = cart.map(item => ({
        order_id: orderId,
        menu_id: item.id,
        quantity: item.quantity,
        price: item.price,
    }));

    let { error: orderItemsError } = await supabase.from('order_item').insert(orderItems);
    if (orderItemsError) {
        console.error('Error adding order items:', orderItemsError);
        return;
    }

    alert(`Thank you for ordering! Your order has been placed successfully.`);
    cart = [];
    updateCartUI();
}
