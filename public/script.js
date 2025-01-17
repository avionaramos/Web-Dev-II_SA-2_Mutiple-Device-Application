const hotDeals = document.querySelector('.hot-deals');
const hotDealItems = document.querySelectorAll('.hot-deals > .hot-deal-images');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

let currentIndex = 0;

function updateCarousel() {
    const itemWidth = hotDealItems[0].offsetWidth + 10; // Include gap in width
    const visibleItems = Math.floor(document.querySelector('.carousel-container').offsetWidth / itemWidth);
    const maxIndex = hotDealItems.length - visibleItems; // Ensure we don’t scroll beyond visible items

    currentIndex = Math.min(currentIndex, maxIndex); // Prevent overshooting max index
    const offset = -currentIndex * itemWidth;
    hotDeals.style.transform = `translateX(${offset}px)`;

    // Update the arrow states
    leftArrow.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    leftArrow.style.opacity = currentIndex === 0 ? 0.5 : 1;

    rightArrow.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
    rightArrow.style.opacity = currentIndex === maxIndex ? 0.5 : 1;
}
// Arrow button event listeners
rightArrow.addEventListener('click', () => {
    const itemWidth = hotDealItems[0].offsetWidth + 10;
    const visibleItems = Math.floor(document.querySelector('.carousel-container').offsetWidth / itemWidth);
    const maxIndex = hotDealItems.length - visibleItems;

    if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
    }
});

leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

// Initialize the carousel
updateCarousel();

document.addEventListener("DOMContentLoaded", () => {
    const basketButton = document.querySelector(".fas.fa-shopping-basket").parentElement;
    const basketItemsContainer = document.createElement("div");
    basketItemsContainer.classList.add("basket-items");

    // Add Cart title
    const cartTitle = document.createElement("h1");
    cartTitle.textContent = "Cart";
    basketItemsContainer.appendChild(cartTitle);

    basketButton.parentElement.appendChild(basketItemsContainer);

    // Handle heart icon click
    document.querySelectorAll(".hot-deal-images").forEach((product) => {
        const heartIcon = product.querySelector(".heart-icon");
        const productName = product.querySelector("h2").textContent;
        const productPrice = product.querySelector(".price-cart h3").textContent;

        heartIcon.addEventListener("click", () => {
            if (heartIcon.classList.contains("active")) {
                // Remove product from basket
                removeProductFromBasket(productName);
                heartIcon.classList.remove("active");
                heartIcon.textContent = "♡"; // Set to outline heart
                showMessage(`${productName} has been removed from your basket.`);
            } else {
                // Attempt to add product to basket
                const added = addProductToBasket(productName, productPrice);
                if (added) {
                    heartIcon.classList.add("active");
                    heartIcon.textContent = "♥"; // Set to filled heart
                }
            }
        });
    });

    // Toggle cart visibility on basket icon click
    basketButton.addEventListener("click", () => {
        basketItemsContainer.classList.toggle("active");
    });

    function addProductToBasket(productName, productPrice) {
        // Check if a product already exists in the basket
        const existingItems = basketItemsContainer.querySelectorAll(".basket-item");

        if (existingItems.length > 0) {
            // Show message to remove the existing product first
            showMessage("Remove the current product in the basket before adding another.");
            return false; // Return false to indicate failure
        }

        // Create a new basket item
        const basketItem = document.createElement("div");
        basketItem.classList.add("basket-item");
        basketItem.dataset.productName = productName;

        basketItem.innerHTML = `
            <div class="product-name">${productName}</div>
            <div class="product-price">${productPrice}</div>
        `;

        basketItemsContainer.appendChild(basketItem);

        // Apply styles for horizontal alignment
        basketItem.style.display = "flex";
        basketItem.style.justifyContent = "space-between";
        basketItem.style.alignItems = "center";
        basketItem.style.gap = "5px";
        basketItem.style.padding = "5px";
        basketItem.style.borderBottom = "1px solid #ccc";

        const productNameElement = basketItem.querySelector(".product-name");
        const productPriceElement = basketItem.querySelector(".product-price");

        productNameElement.style.flex = "2";
        productNameElement.style.fontSize = "12x";
        productNameElement.style.fontWeight = "bold";
        productNameElement.style.textAlign = "left";

        productPriceElement.style.flex = "2";
        productPriceElement.style.fontSize = "10px";
        productPriceElement.style.textAlign = "right";

        // Show success message
        showMessage(`${productName} has been added to your basket.`);
        return true; // Return true to indicate success
    }

    // Remove product from basket
    function removeProductFromBasket(productName) {
        const productToRemove = basketItemsContainer.querySelector(`[data-product-name="${productName}"]`);
        if (productToRemove) {
            basketItemsContainer.removeChild(productToRemove);
        }
    }

    // Show notification messages
    function showMessage(message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.hot-deal-images .image img'); // Select all images
    const modalOverlay = document.createElement('div'); // Create the overlay
    const enlargedContainer = document.createElement('div'); // Create container for image and title
    const enlargedImage = document.createElement('img'); // Create the enlarged image
    const enlargedTitle = document.createElement('div'); // Create the enlarged title
    const closeButton = document.createElement('button'); // Create the close button

    modalOverlay.className = 'modal-overlay';
    enlargedContainer.className = 'enlarged-image-container';
    enlargedImage.className = 'enlarged-image';
    enlargedTitle.className = 'enlarged-title';
    closeButton.className = 'close-btn';
    closeButton.textContent = 'X'; // Add "X" text to the button

    document.body.appendChild(modalOverlay);
    document.body.appendChild(enlargedContainer);
    enlargedContainer.appendChild(closeButton); // Add close button to container
    enlargedContainer.appendChild(enlargedImage);
    enlargedContainer.appendChild(enlargedTitle);

    images.forEach(image => {
        image.addEventListener('click', function () {
            enlargedImage.src = this.src; // Set the enlarged image source
            const productName = this.closest('.hot-deal-images').querySelector('h2').innerText; // Get product name
            enlargedTitle.textContent = productName; // Set the title
            modalOverlay.style.display = 'block'; // Show the overlay
            enlargedContainer.style.display = 'block'; // Show the enlarged container
        });
    });

    // Close the modal on close button click
    closeButton.addEventListener('click', function () {
        modalOverlay.style.display = 'none'; // Hide the overlay
        enlargedContainer.style.display = 'none'; // Hide the enlarged container
    });
});

const slider = document.querySelector('.slider');
const products = slider.children;

// Clone products to create an infinite loop effect
Array.from(products).forEach(product => {
    const clone = product.cloneNode(true);
    slider.appendChild(clone);
});

const allProducts = document.querySelectorAll('.products'); // Use a different variable for the click functionality
let isEnlarged = false;

// Function to pause the animation
function pauseAnimation() {
    slider.style.animationPlayState = 'paused';
}

// Function to resume the animation
function resumeAnimation() {
    slider.style.animationPlayState = 'running';
}

// Loop through each product and add an event listener for clicks
allProducts.forEach(product => {
    product.addEventListener('click', function () {
        if (isEnlarged) {
            // If already enlarged, shrink back and resume animation
            this.classList.remove('enlarged-container');
            resumeAnimation();
        } else {
            // If not enlarged, enlarge and stop the animation
            this.classList.add('enlarged-container');
            pauseAnimation();
        }
        isEnlarged = !isEnlarged; // Toggle the enlarged state
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-bar input");
    const suggestionsContainer = document.querySelector(".suggestions");

    // Select all elements containing product information
    const productElements = document.querySelectorAll(
        "#hero-content, .hot-deal-images, .nike-clothing-image, #jordan-image, #third"
    );

    const products = Array.from(productElements).map(product => {
        const productName = product.querySelector("h1, h2, h3, p, span, .product-name h2")?.textContent || "";
        console.log('Product Name:', productName);  // Debugging line
        return { name: productName.trim(), element: product };
    });

    searchInput.addEventListener("input", function (event) {
        const searchTerm = event.target.value.toLowerCase();
        suggestionsContainer.innerHTML = ""; // Clear previous suggestions
        suggestionsContainer.style.display = "none"; // Hide suggestions initially

        if (searchTerm) {
            const matches = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );

            if (matches.length > 0) {
                suggestionsContainer.style.display = "block"; // Show suggestions

                matches.forEach(match => {
                    const suggestion = document.createElement("div");
                    suggestion.textContent = match.name;

                    suggestion.addEventListener("click", () => {
                        searchInput.value = match.name; // Set search bar to clicked suggestion
                        match.element.scrollIntoView({ behavior: "smooth", block: "center" });
                        suggestionsContainer.innerHTML = "";
                        suggestionsContainer.style.display = "none";
                    });

                    suggestionsContainer.appendChild(suggestion);
                });
            }
        }
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".search-bar")) {
            suggestionsContainer.innerHTML = "";
            suggestionsContainer.style.display = "none";
        }
    });
});

// Function to close the form when "X" is clicked
function closeForm() {
    document.querySelector('.container').style.display = 'none';
}

// Get the user icon button and the signup container
const userIconButton = document.getElementById('user-icon');
const signupContainer = document.getElementById('signup-container');

// Toggle the visibility of the sign-up form when the user icon is clicked
userIconButton.addEventListener('click', () => {
    if (signupContainer.style.display === 'none' || signupContainer.style.display === '') {
        signupContainer.style.display = 'block';
    } else {
        signupContainer.style.display = 'none';
    }
});

// Get the form element
const form = document.getElementById('signup-form');

// Handle the form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page

    const email = document.getElementById('email').value;

    // Make sure the email is not empty
    if (!email) {
        alert("Please enter a valid email");
        return;
    }

    try {
        // Send the email to the server using Fetch API
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        // Display success or error message
        const messageElement = document.getElementById('response-message');
        if (response.ok) {
            messageElement.style.color = 'green';
            messageElement.textContent = data.message;
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('response-message').textContent = 'Error, please try again later.';
    }
});

// Get the close button and signup container
const closeBtn = document.querySelector('.close-btn-signup');

// Close the sign-up form when the close button is clicked
closeBtn.addEventListener('click', () => {
    signupContainer.style.display = 'none';
});
