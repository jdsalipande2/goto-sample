import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔗 Connect to Supabase
const SUPABASE_URL = "https://xnknxmmlfphomxixfgol.supabase.co";  // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhua254bW1sZnBob214aXhmZ29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDkyMDIsImV4cCI6MjA1NTA4NTIwMn0.-iZuTbbKblvRpc3BWg07zSKyjPTA-O8n-Ql0uHPuckI";  // Replace with your Supabase Anon Key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let cart = [];

// 🥘 Fetch Menu Items from Supabase
async function fetchMenu() {
    const { data, error } = await supabase.from("menu").select("*");
    
    if (error) {
        console.error("Error fetching menu:", error);
        return;
    }

    const menuContainer = document.getElementById("menu");
    menuContainer.innerHTML = "";

    data.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("menu-item");
        itemDiv.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>₱${item.price}</p>
            <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
        `;
        menuContainer.appendChild(itemDiv);
    });
}

// 🛒 Add Item to Cart
window.addToCart = function(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCart();
}

// 🔄 Update Cart UI
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div>
                <p>${item.name} x${item.quantity} - ₱${item.price * item.quantity}</p>
                <button onclick="removeFromCart('${item.name}')">Remove</button>
            </div>
        `;
    });

    document.getElementById("total-price").textContent = total;
}

// ❌ Remove Item from Cart
window.removeFromCart = function(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

// ✅ Checkout Order
document.getElementById("checkout-btn").addEventListener("click", async function() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        method: "Pickup",
        timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase.from("orders").insert([orderData]);

    if (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order.");
    } else {
        alert("Order placed successfully!");
        cart = [];
        updateCart();
    }
});

// 🔥 Load Menu on Page Load
document.addEventListener("DOMContentLoaded", fetchMenu);
