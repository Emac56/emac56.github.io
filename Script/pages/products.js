window.addEventListener('load', () => {
    const elements = document.querySelectorAll('#animate');

    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('active');
        }, index * 300);
    });
});

window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.animateNav');

    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('active');
        }, index * 300);
    });
});

//

// Make sure cart exists from globalSaveData.js
if (!Array.isArray(cart)) {
    cart = [];
    saveCart();
}

function addProductCart(name, price) {
    console.log("Adding to cart:", name, price); // debug log

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

function updateCartCounter() {
    const counter = document.getElementById("cartCounter");
    if (!counter) return;

    let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    counter.textContent = totalQty;
}

updateCartCounter();