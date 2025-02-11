// Select all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll(".item .add-to-cart");
const orderBtn = document.getElementById("orderBtn");
const message = document.getElementById("preOrderMessage");
let currentOrder = document.getElementById('order');
let cakeImage = document.getElementById("preOrderImage");
const incrementButtons = document.querySelectorAll(".increment-button");
const decrementButtons = document.querySelectorAll(".decrement-button");
let cart = []; //initializing the cart items to empty array

function addToCart(item, quantity, itemElement) {
    // check if the item already exists in the cart
    const existingItem = cart.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
        // if the item exists, increase the quantity and update the total price
        existingItem.quantity += quantity;
        existingItem.totalPrice = (existingItem.quantity * existingItem.price).toFixed(2);
    } else {
        // If the item doesn't exist, add it with the specified quantity and total price
        cart.push({...item, quantity: quantity, totalPrice: (quantity * item.price).toFixed(2) });
    }

    updateCartDisplay(); // Update the cart display

    // Toggle the buttons to show increment-decrement controls
    toggleButtons(itemElement, true);
}
// Function to toggle between "Add to Cart" and increment-decrement buttons
function toggleButtons(itemElement, inCart) {
    const addToCartButton = itemElement.querySelector("#btn"); // Select the "Add to Cart" button
    const quantityCheck = itemElement.querySelector(".Quantity-check"); // Select the quantity controls

    if (inCart) {
        // Hide the "Add to Cart" button and show quantity controls if the item is in the cart
        addToCartButton.style.display = "none";
        quantityCheck.style.display = "flex";
    } else {
        // Show the "Add to Cart" button and hide quantity controls if the item is not in the cart
        addToCartButton.style.display = "block";
        quantityCheck.style.display = "none";
    }
}

// Function to remove an item from the cart
function removeFromCart(itemName) {
    console.log("Removing item:", itemName); // Debug statement
    cart = cart.filter(cartItem => cartItem.name !== itemName); // Remove item from the cart
    updateCartDisplay(); // Update the cart display
}
// Function to display the items that are ordered
function updateCartDisplay() {
    if (cart.length === 0) { // Check if the cart is empty
        message.style.display = "block"; // Show the message
        cakeImage.style.display = "block";
        currentOrder.innerHTML = ""; // Display is empty when there are no items in the cart

    } else {
        message.style.display = "none"; // Remove the pre-order message
        cakeImage.style.display = "none";
        // Generate HTML for the cart items with remove button
        currentOrder.innerHTML = cart.map(item => `
        <div class="cart-item">
         <p><strong>${item.name}</strong><br> x${item.quantity} $${item.price.toFixed(2)}  $${item.totalPrice}</p>
                <button class="remove-item">
                   <img src="assets/images/icon-remove-item.svg" alt="Remove item">
                </button>
                <hr class="cart-item-separator">
        </div>
  
    ` // The part in quotes is the HTML structure of each item in the array
        ).join(""); // It joins the strings generated by the map function into a single string
        // Add CSS styles for cart items
        const style = document.createElement('style');
        style.textContent = `
               .cart-item {
                   padding: 10px;
                   border-bottom: 1px solid #ddd;
               }
               .cart-item p {
                   margin: 0;
                   padding: 5px 0;
               }
               .remove-item {
                   border: none;
                   outline: none;
                   padding: 5px 10px;
                   cursor: pointer;
                   margin-top: 5px;
                   color: white;
               }
               .cart-item-separator {
                   border: none;
                   border-top: 1px solid #ddd;
                   margin: 10px 0;
               }
           `;
        document.head.appendChild(style);

        // Add event listeners to all remove buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        console.log("Remove buttons found:", removeButtons.length); // Debug statement
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemName = event.target.closest('.cart-item').querySelector('strong').innerText; // Get the item name
                removeFromCart(itemName); // Remove item from cart
            });
        });
    }
    updateCartQuantity(); // Update the cart quantity display after changes
}

// Function to update the quantity display
function updateQuantityDisplay(quantityElement, quantity) {
    quantityElement.innerText = quantity;
}
// Function to make changes when add cart is clicked
addToCartButtons.forEach(button => { //using forEach because this function applies to all target buttons
    button.addEventListener('click', (event) => { //event listener for a click
        const itemElement = event.target.closest('.item'); //find the closest element with class item(its the parent container that houses the  add to cart buttons and also other information about the dessert being orderred)
        const itemName = itemElement.querySelector(".dessertDetails #dessertName").innerText; //get the name of the dessert in the same container as the button
        const itemPrice = parseFloat(itemElement.querySelector(".dessertDetails #price").innerText.replace('$', '')); //get price of the item and also remove dollar sign since I've used parsefloat for easier calculation
        const quantityElement = itemElement.querySelector('.quantity-display'); //get the span element that displays quantity
        const quantity = parseInt(quantityElement.innerText) + 1; //get the quantity as an integer

        addToCart({ name: itemName, price: itemPrice }, quantity, itemElement); // Add item to the cart
        updateQuantityDisplay(quantityElement, quantity); // Update the quantity display immediately

    });
});

// Add event listeners to all increment buttons
incrementButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        const itemElement = event.target.closest('.item'); // Get the closest item element
        const itemName = itemElement.querySelector(".dessertDetails #dessertName").innerText; // Get the item name
        const quantityElement = itemElement.querySelector('.quantity-display'); // Get the quantity display element
        let currentQuantity = parseInt(quantityElement.innerText); // Get the current quantity

        currentQuantity++; // Increment quantity
        updateQuantityDisplay(quantityElement, currentQuantity); // Update the quantity display

        const existingItem = cart.find(cartItem => cartItem.name === itemName); // Find the item in the cart
        if (existingItem) {
            // Update the item's quantity and total price
            existingItem.quantity = currentQuantity;
            existingItem.totalPrice = (existingItem.quantity * existingItem.price).toFixed(2);
            updateCartDisplay(); // Update the cart display
        }
    });
});

// adding event listeners to decrement buttons
decrementButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        const itemElement = event.target.closest('.item'); // find the closest container with class item
        const itemName = itemElement.querySelector(".dessertDetails #dessertName").innerText; // get the name of the dessert in the same container as the button
        const quantityElement = itemElement.querySelector('.quantity-display'); //get the span element that shows quantity
        let currentQuantity = parseInt(quantityElement.innerText); // get the current quantity

        if (currentQuantity > 0) { // ensure quantity doesn't go below 0
            currentQuantity--; // decrement the quantity
            updateQuantityDisplay(quantityElement, currentQuantity); // update the display

            // remove the item from the cart if it's already there
            const existingItem = cart.find(cartItem => cartItem.name === itemName);
            if (existingItem) {
                if (currentQuantity === 0) {
                    // remove the item from the cart if the quantity is zero
                    cart = cart.filter(cartItem => cartItem.name !== itemName);
                    toggleButtons(itemElement, false); // Switch back to "Add to Cart" button
                } else {
                    // update the quantity and total price in the cart
                    existingItem.quantity = currentQuantity;
                    existingItem.totalPrice = (existingItem.quantity * existingItem.price).toFixed(2);
                }
                updateCartDisplay(); // Update the cart display
            }
        }
    });
});
// Function to update the cart quantity display in the header
function updateCartQuantity() {
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total quantity
    const cartHeading = document.querySelector('.orderInfo h1'); // Select the cart heading
    cartHeading.innerText = `Your Cart (${totalQuantity})`; // Update the cart heading text
}

function showOrderConfirmation() {
    if (cart.length !== 0) {
        alert("Your order has been received!");
    } else {
        alert("please order your items!");
    }

}
orderBtn.addEventListener("click", showOrderConfirmation);