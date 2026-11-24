/* ===================================================
   QuickCart — Application Logic
   Handles cart management, validation, and checkout
   =================================================== */

// ===== PRODUCT DATA =====
// Fixed product catalogue — prices in INR
const products = [
    { id: 1, name: "The Art of Letting Go", price: 499 },
    { id: 2, name: "Think and Grow Rich", price: 399 }
];

// ===== CART STATE =====
// Each cart item: { productId, name, price, quantity }
let cart = [];

// Submission guard — prevents duplicate orders on rapid clicks
let isSubmitting = false;


// =====================================================
// CART OPERATIONS
// =====================================================

/**
 * Adds a product to the cart.
 * If the product already exists in the cart, its quantity is incremented.
 * Otherwise, a new entry is created with quantity 1.
 */
function addToCart(productId) {
    // Find the product in our catalogue
    const product = products.find(function (p) {
        return p.id === productId;
    });

    if (!product) return;

    // Check if the product is already in the cart
    const existingItem = cart.find(function (item) {
        return item.productId === productId;
    });

    if (existingItem) {
        // Product already in cart — increase quantity
        existingItem.quantity += 1;
    } else {
        // New product — add to cart with quantity 1
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    // Re-render the cart display
    renderCart();
}

/**
 * Removes a product entirely from the cart.
 */
function removeFromCart(productId) {
    cart = cart.filter(function (item) {
        return item.productId !== productId;
    });

    renderCart();
}

/**
 * Updates the quantity of a cart item by a given delta (+1 or -1).
 * If the quantity reaches 0, the item is removed from the cart.
 */
function updateQuantity(productId, delta) {
    var item = cart.find(function (item) {
        return item.productId === productId;
    });

    if (!item) return;

    item.quantity += delta;

    // If quantity drops to 0 or below, remove the item
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    renderCart();
}


// =====================================================
// RENDERING
// =====================================================

/**
 * Re-renders the entire cart display.
 * Builds the HTML for each cart item, calculates line totals,
 * and updates the order total.
 */
function renderCart() {
    var cartItemsContainer = document.getElementById("cart-items");
    var emptyMsg = document.getElementById("empty-cart-msg");
    var totalAmountSpan = document.getElementById("total-amount");

    // Clear current cart display
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        // Show empty message
        var emptyP = document.createElement("p");
        emptyP.id = "empty-cart-msg";
        emptyP.textContent = "Your cart is empty.";
        cartItemsContainer.appendChild(emptyP);
        totalAmountSpan.textContent = "0";
        return;
    }

    var orderTotal = 0;

    // Build a row for each cart item
    cart.forEach(function (item) {
        // Calculate line total: price × quantity
        var lineTotal = item.price * item.quantity;
        orderTotal += lineTotal;

        // Create the cart item row
        var row = document.createElement("div");
        row.className = "cart-item";

        // Product name
        var nameSpan = document.createElement("span");
        nameSpan.className = "cart-item-name";
        nameSpan.textContent = item.name;

        // Quantity controls: − [qty] +
        var qtyControls = document.createElement("div");
        qtyControls.className = "qty-controls";

        var btnDecrease = document.createElement("button");
        btnDecrease.className = "btn-qty";
        btnDecrease.setAttribute("data-id", item.productId);
        btnDecrease.textContent = "−";
        btnDecrease.onclick = function () {
            updateQuantity(item.productId, -1);
        };

        var qtySpan = document.createElement("span");
        qtySpan.className = "qty-value";
        qtySpan.textContent = item.quantity;

        var btnIncrease = document.createElement("button");
        btnIncrease.className = "btn-qty btn-increase";
        btnIncrease.setAttribute("data-id", item.productId);
        btnIncrease.textContent = "+";
        btnIncrease.onclick = function () {
            updateQuantity(item.productId, 1);
        };

        qtyControls.appendChild(btnDecrease);
        qtyControls.appendChild(qtySpan);
        qtyControls.appendChild(btnIncrease);

        // Line total display
        var totalSpan = document.createElement("span");
        totalSpan.className = "cart-item-total";
        totalSpan.textContent = "₹" + lineTotal;

        // Remove button
        var btnRemove = document.createElement("button");
        btnRemove.className = "btn-remove";
        btnRemove.title = "Remove item";
        btnRemove.textContent = "✕";
        btnRemove.onclick = function () {
            removeFromCart(item.productId);
        };

        // Assemble the row
        row.appendChild(nameSpan);
        row.appendChild(qtyControls);
        row.appendChild(totalSpan);
        row.appendChild(btnRemove);

        cartItemsContainer.appendChild(row);
    });

    // Update the order total
    totalAmountSpan.textContent = orderTotal;
}


// =====================================================
// CHECKOUT / ORDER PLACEMENT
// =====================================================

/**
 * Clears all inline error messages.
 */
function clearErrors() {
    document.getElementById("cart-error").textContent = "";
    document.getElementById("name-error").textContent = "";
}

function generateOrderRef() {

    var timestamp = Date.now();

    var random = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return "ORD-" + timestamp + "-" + random;
}

/**
 * Handles the Place Order button click.
 * Validates the cart and customer name using inline error messages.
 * Disables the button during processing to prevent duplicate orders.
 * Generates a unique order reference number on success.
 */
function placeOrder() {
    // --- Duplicate submission guard ---
    // If an order is already being processed, ignore the click
    if (isSubmitting) {
        return;
    }

    // Clear any previous error messages
    clearErrors();

    var hasErrors = false;

    // --- Validate: cart must not be empty ---
    if (cart.length === 0) {
        document.getElementById("cart-error").textContent =
            "Your cart is empty. Please add items before placing an order.";
        hasErrors = true;
    }

    // --- Validate: customer name is required ---
    var nameInput = document.getElementById("customer-name");
    var customerName = nameInput.value.trim();

    if (customerName === "") {
        document.getElementById("name-error").textContent =
            "Please enter your name to place an order.";
        hasErrors = true;
    }

    // If any validation failed, stop here (input is preserved)
    if (hasErrors) {
        return;
    }

    // --- Set submission guard and disable button ---
    isSubmitting = true;
    var orderBtn = document.getElementById("place-order-btn");
    orderBtn.disabled = true;

    // --- Generate unique order reference ---
    var orderRef = generateOrderRef();

    // --- Calculate final order total ---
    var orderTotal = 0;
    cart.forEach(function (item) {
        orderTotal += item.price * item.quantity;
    });

    // --- Build confirmation display ---
    document.getElementById("conf-ref").textContent = orderRef;
    document.getElementById("conf-name").textContent = customerName;
    document.getElementById("conf-total").textContent = orderTotal;

    // Build the ordered items list
    var confItemsContainer = document.getElementById("conf-items");
    confItemsContainer.innerHTML = "";

    cart.forEach(function (item) {
        var lineTotal = item.price * item.quantity;

        var itemDiv = document.createElement("div");
        itemDiv.className = "conf-item";

        var itemName = document.createElement("span");
        itemName.textContent = item.name + " × " + item.quantity;

        var itemTotal = document.createElement("span");
        itemTotal.textContent = "₹" + lineTotal;

        itemDiv.appendChild(itemName);
        itemDiv.appendChild(itemTotal);
        confItemsContainer.appendChild(itemDiv);
    });

    // --- Hide cart and checkout sections, show confirmation ---
    document.getElementById("cart-section").style.display = "none";
    document.getElementById("checkout-section").style.display = "none";
    document.getElementById("confirmation-section").style.display = "block";

    // --- Clear the cart after successful order ---
    cart = [];
}
