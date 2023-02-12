"use strict";
//Variables
const productSectionEl = document.getElementById("productsSection");
const itemsCountEl = document.getElementById("itemCount");
const productsInCartSectionEl = document.getElementById("productsInCart");
const tableCellsEl = document.getElementById("tableCells");
const productPriceEl = document.getElementById("price");
const cartSectionEl = document.getElementById("cartSection");
const logoEl = document.getElementById("logo");
const cartEl = document.getElementById("cart");
const checkoutcontainerEl = document.getElementById("checkOutContainer");
const homeEl = document.getElementById("home");
const electronicsEl = document.getElementById("electronics");
const jeweleryEl = document.getElementById("jewelery");
const mensEl = document.getElementById("mens");
const womensEl = document.getElementById("womens");
const checkoutCartEl = document.getElementById("checkOutCart");
const totalEl = document.getElementById("grandTotal");
//checkout form variables 
const firstNameEl = document.getElementById("firstName");
const lastNameEl = document.getElementById("lastName");
const emailEl = document.getElementById("email");
const addressEl = document.getElementById("address");
const zipcodeEl = document.getElementById("zipcode");
const cityEl = document.getElementById("city");
const shippingEl = document.getElementById("shipping");
const submitCheckoutEl = document.getElementById("contactForm");
const checkOutSecEl = document.getElementById("checkOutSec");
const confirmationMSGEl = document.getElementById("confirmationMSG");
let runningTotal = 0;

//Declaring cartItems, its value depends on localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
if (typeof itemsCountEl !== 'undefined' && itemsCountEl != null) {
  itemsCountEl.innerHTML = cartItems.length;
}
fetchingProducts();
//fetching products from Fake store API
function fetchingProducts() {
  let apiPath = localStorage.getItem("apiPath") || "products";
  fetch("https://fakestoreapi.com/" + apiPath) //apiPath changes depending on localstorage value, therefore changing fetched products.
    .then(result => result.json())
    .then(data => {
      if (productSectionEl != null) {
        displayProducts(data);
      }
    });
}


//Displaying products in main page.
function displayProducts(jsonData) {
  const productArray = jsonData;
  for (let product of productArray) {
    productSectionEl.innerHTML +=
      `<article class="border rounded" id="productArticle">
        <h5>${product.title}</h5>
        <img src='${product.image}' alt='' class='image m-4 "' width="100vw">
        <div>
        <p class="card-text">${product.description}</p>
        <div class="text-center">${product.rating.rate}&#11088; <b>(${product.rating.count})</b> || Price:<b> ${product.price}$</b></div>
        
        <div class=" text-center" id="productButtons">
        <button class="btn btn-primary m-5" onclick="addToCart('${product.id}');window.location.href='cart.html';">Buy now</button>
        <button class="btn btn-primary" onclick="addToCart('${product.id}')">Add to cart</button>
        </div>
        </article>`;

  }
}

//making sure Checkout button dissapears if cart is empty.
if (checkoutcontainerEl != null && typeof checkoutcontainerEl !== 'undefined') {
  if (!localStorage.getItem("cartItems") || cartItems.length == 0) {
    checkoutcontainerEl.className = "d-none";
  }
}

//Add to cart function
function addToCart(productId) {
  if (!cartItems.includes(productId)) {
    cartItems.push(productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    itemsCountEl.innerHTML = cartItems.length;
    localStorage.setItem(`quantity-${productId}`, 1)
    console.log("ItemId " + productId + " added...");
    console.log(cartItems);
  } else {
    alert("Item already in cart")
  }
}

//Displaying products in cart
if (typeof cartSectionEl !== 'undefined' && cartSectionEl != null) {
  for (let i = 0; i < cartItems.length; i++) {
    fetch('https://fakestoreapi.com/products/' + cartItems[i])
      .then(res => res.json())
      .then(product => {
        let productId = product.id;
        let subTotal = localStorage.getItem(`subTotal-${productId}`) || product.price;
        let quantity = localStorage.getItem(`quantity-${productId}`);
        tableCellsEl.innerHTML += `<tr>
        <td class="tableCell">${product.title}<br><img src="${product.image}" width="50vw" alt=""></td>
        <td><input type="image" src="Media/Images/minus-button.png" alt="decrease quantity" height="20vh" width="20vw" onclick="decreaseQuantity('${product.id}')">
        <span class="quantityField" id="quantity-${product.id}">${quantity}</span><input type="image" src="Media/Images/plus-button.png" alt="increase quantity" height="20vh" 
        width="20vw" onclick="increaseQuantity('${product.id}')">
        </td>
        <td id="price-${product.id}">${product.price}</td>
        <td><input type="image" src="Media/Images/remove-button.png" alt="delete from cart" height="30vh" width="30vw" onclick="removeFromCart('${product.id}')"></td>
        <td id="subTotal-${product.id}">${subTotal}</td>
      </tr>`;
        let intSubTotal = parseInt(subTotal);
        runningTotal += +subTotal;
        totalEl.innerText = runningTotal;
        localStorage.setItem("total", totalEl.innerText)
      });
  }
}

//removing items from cart
function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item !== productId);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  localStorage.removeItem(`subTotal-${productId}`);
  localStorage.removeItem(`quantity-${productId}`);
  if (cartItems == 0) {
    localStorage.removeItem(`total`);
  }
  console.log("Item removed" + productId);
  window.location.reload();
}

//decreasing quantity in cart
function decreaseQuantity(productId) {
  let quantityEl = document.getElementById(`quantity-${productId}`);
  let quantity = parseInt(quantityEl.innerText);
  if (quantity > 1) {
    quantity--;
    quantityEl.innerText = quantity;
    let priceEl = document.getElementById(`price-${productId}`);
    let price = parseInt(priceEl.innerText);
    let subTotalEl = document.getElementById(`subTotal-${productId}`);
    subTotalEl.innerText = price * quantity;
    localStorage.setItem(`quantity-${productId}`, quantity);
    localStorage.setItem(`subTotal-${productId}`, subTotalEl.innerText);
    console.log("new subTotal " + localStorage.getItem(`subTotal-${productId}`));
    window.location.reload();
  }
}

//increasing quantity in cart
function increaseQuantity(productId) {
  console.log(localStorage.getItem(`quantity-${productId}`))
  let quantityEl = document.getElementById(`quantity-${productId}`);
  let quantity = parseInt(quantityEl.innerText);
  if (quantity < 10) {
    quantity++;
    quantityEl.innerText = quantity;
    let priceEl = document.getElementById(`price-${productId}`);
    let price = parseInt(priceEl.innerText);
    let subTotalEl = document.getElementById(`subTotal-${productId}`);
    subTotalEl.innerText = price * quantity;
    localStorage.setItem(`quantity-${productId}`, quantity);
    localStorage.setItem(`subTotal-${productId}`, subTotalEl.innerText);
    console.log("new subTotal " + localStorage.getItem(`subTotal-${productId}`));
    console.log(localStorage.getItem(`quantity-${productId}`))
  }
}

//displaying a preview of the cart while checking out.
if (typeof checkoutCartEl !== 'undefined' && checkoutCartEl != null) {
  let promises = [];
  for (let i = 0; i < cartItems.length; i++) {
    let productId = cartItems[i];
    let checkoutQuantity = localStorage.getItem(`quantity-${productId}`);
    promises.push(
      fetch('https://fakestoreapi.com/products/' + cartItems[i])
        .then(res => res.json())
        .then(product => {
          checkoutCartEl.innerHTML += `<article id="productArticle">
          <p>${product.title} <br> <img src='${product.image}' alt='' class='image m-4 "' width="30vw"> Quantity: ${checkoutQuantity} | Price: ${product.price}$</p>
          <hr class="hrCart">
          </article>`;
        })
    );
  }
  Promise.all(promises)
    .then(() => {

      let total = parseInt(localStorage.getItem("total"));
      checkoutCartEl.innerHTML += `<hr><p class="text-center"><b>Grand total: ${total}$</b></p>`;
    });
}

//listning to checkout button and posting items to firebase with the help of cartItems array fetching the items first.
submitCheckoutEl?.addEventListener("submit", function (event) {
  event.preventDefault();
  let checkoutProducts = [];
  let promises = [];

  for (let i = 0; i < cartItems.length; i++) {
    promises.push(
      fetch('https://fakestoreapi.com/products/' + cartItems[i])
        .then(res => res.json())
        .then(product => {
          let productId = product.id;
          let quantity = parseInt(localStorage.getItem(`quantity-${productId}`));
          checkoutProducts.push({
            "mapValue": {
              "fields": {
                "title": {
                  "stringValue": product.title
                },
                "quantity": {
                  "integerValue": quantity
                },
                "productId": {
                  "integerValue": product.id
                },
                "price": {
                  "doubleValue": product.price
                }
              }
            }
          }
          );
        })
    );
  }

  Promise.all(promises)
    .then(() => {
      let stringed = JSON.stringify(checkoutProducts);
      console.log(stringed);
      let firstName = firstNameEl.value;
      let lastName = lastNameEl.value;;
      let email = emailEl.value;
      let address = addressEl.value;
      let zipcode = zipcodeEl.value;
      let city = cityEl.value;
      let shipping = shippingEl.value;
      let total = localStorage.getItem("total");
      let body = JSON.stringify({
        "fields": {
          "firstName": {
            "stringValue": firstName
          },
          "lastName": {
            "stringValue": lastName
          },
          "email": {
            "stringValue": email
          },
          "address": {
            "stringValue": address
          },
          "zipcode": {
            "integerValue": zipcode
          },
          "city": {
            "stringValue": city
          },
          "shipping": {
            "stringValue": shipping
          },
          "total": {
            "doubleValue": total
          },
          "products": {
            "arrayValue": {
              "values":
                checkoutProducts
            }
          }
        }
      })
      console.log(body);
      fetch("https://firestore.googleapis.com/v1/projects/fyndish-23b06/databases/(default)/documents/Orders/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      })
        .then(res => res.json())
        .then(data => {
          console.log("Order submitted");
          localStorage.clear();
          checkOutSecEl.className = "d-none"
          confirmationMSGEl.classList.remove("d-none");
        })
    });

});

logoEl.addEventListener("click", function () {
  localStorage.setItem("apiPath", "");
});
homeEl.addEventListener("click", function () {
  localStorage.setItem("apiPath", "");
});
electronicsEl.addEventListener("click", function () {
  localStorage.setItem("apiPath", "products/category/electronics");
});
jeweleryEl.addEventListener("click", function () {
  localStorage.setItem("apiPath", "products/category/jewelery");
});
mensEl.addEventListener("click", function () {
  localStorage.setItem("apiPath", "products/category/men's clothing");
});
womensEl.addEventListener("click", function () {
  localStorage.setItem("apiPath", "products/category/women's clothing");
});