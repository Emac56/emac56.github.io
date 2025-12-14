let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCart() {
    let container = document.getElementById("cartItems");
    let total = 0;
    container.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-row">
                <strong>${item.name}</strong> - ₱${item.price} x 
                <input type="number" min="1" value="${item.quantity}" onchange="updateQty(${index}, this.value)">
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    document.getElementById("totalPrice").innerText = total;
}

function updateQty(index, qty) {
    cart[index].quantity = parseInt(qty);
    save();
}

function removeItem(index) {
    cart.splice(index, 1);
    save();
}

function save() {
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function showPaymentInfo() {
    let selected = document.querySelector('input[name="payment"]:checked').value;

    document.getElementById("gcashBox").style.display = "none";
    document.getElementById("bankBox").style.display = "none";

    if (selected === "GCash") {
        document.getElementById("gcashBox").style.display = "block";
    }

    if (selected === "Bank Transfer") {
        document.getElementById("bankBox").style.display = "block";
    }
}

function placeOrder() {
    let name = document.getElementById("fullname").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let payment = document.querySelector('input[name="payment"]:checked');

    if (!name || !phone || !address) {
        alert("Please complete your personal information.");
        return;
    }

    if (!payment) {
        alert("Please select a payment method.");
        return;
    }

    // Validate GCash Fields
    if (payment.value === "GCash") {
        let num = document.getElementById("gcashNumber").value;
        let acc = document.getElementById("gcashName").value;

        if (!num || !acc) {
            alert("Please fill out your GCash Number and Account Name.");
            return;
        }
    }

    // Validate Bank Fields
    if (payment.value === "Bank Transfer") {
        let bank = document.getElementById("bankName").value;
        let bankNum = document.getElementById("bankNumber").value;
        let accName = document.getElementById("bankAccountName").value;

        if (!bank || !bankNum || !accName) {
            alert("Please complete all Bank Transfer details.");
            return;
        }
    }

    alert("Order placed successfully!");

    localStorage.removeItem("cart");
    window.location.href = "products.html";
}


// Ensure user is logged in before checkout
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (!isLoggedIn) {
    alert("You must log in first to proceed to checkout.");
    window.location.href = "login.html";
    return;
  }

  // Prefill full name if available
  const fullName = localStorage.getItem("fullName");
  if (fullName) document.getElementById("fullname").value = fullName;
});

displayCart();