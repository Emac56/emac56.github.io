// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart
function addProductCart(name, price) {
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCartCounter();
    alert(name + " added to cart!");
}

// Update small cart counter
function updateCartCounter() {
    const counter = document.getElementById("cartCounter");
    if (!counter) return;

    let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    counter.textContent = totalQty;
}

