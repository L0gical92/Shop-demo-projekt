"use strict";
const currentOrdersCellsEl = document.getElementById("currentOrdersCells");
const editBoxContainerEl = document.getElementById("editBoxContainer");
const editOptionsEl = document.getElementById("editOptions");
const newNameEl = document.getElementById("newName");
const newFirstNameEl = document.getElementById("newFirstName");
const newLastNameEl = document.getElementById("newLastName");
const NewEmailEl = document.getElementById("NewEmail");
const NewAddressEl = document.getElementById("NewAddress");
const NewZipcodeEl = document.getElementById("NewZipcode");
const NewCityEl = document.getElementById("NewCity");
const NewShippingEl = document.getElementById("NewShipping");
const NewTotalEl = document.getElementById("newTotal");
const selectOptionsEl = document.getElementById("selectOptions");
const contactInfoEl = document.getElementById("contactInfo");
const shippingTotEl = document.getElementById("shippingTot");
const editNameButtonEl = document.getElementById("editNameButton");
const contactInfoButtonEl = document.getElementById("editInfoButton");
const newTotShippingEl = document.getElementById("newTotShipping");
let updateMask;
let patchBody;


fetch("https://firestore.googleapis.com/v1/projects/fyndish-23b06/databases/(default)/documents/Orders/")
    .then(res => res.json())
    .then(orders => currentOrders(orders));


function currentOrders(orders) {
    const ordersArray = orders.documents;
    if (ordersArray) {
        for (let order of ordersArray) {
            let orderData = order.fields;
            const fullPath = order.name;
            const pathParts = fullPath.split("/");
            const orderId = pathParts[pathParts.length - 1];
            let productDetails = "";
            const products = orderData.products.arrayValue.values;
            let productNum = 1;
            for (const product of products) {
                const productData = product.mapValue.fields;
                const title = productData.title.stringValue;
                const quantity = productData.quantity.integerValue;
                const productId = productData.productId.integerValue;
                const productPrice= productData.price.doubleValue;
                productDetails += `${productNum}. ${title} (<b>Q:${quantity}</b>)-(<b>ID:${productId}</b>)-(<b>Price:${productPrice}$</b>)<br> `;
                productNum++;
            }
            currentOrdersCellsEl.innerHTML += `<tr>
                <td>${orderId}</td>
                <td>${orderData.firstName.stringValue} ${orderData.lastName.stringValue}</td>
                <td>${orderData.email.stringValue}</td>
                <td>${orderData.address.stringValue}, ${orderData.zipcode.integerValue}, ${orderData.city.stringValue}</td>
                <td>${orderData.shipping.stringValue}</td>
                <td class="productCell">${productDetails}</td>
                <td>${orderData.total.doubleValue}$</td>
                <td><button class="btn btn-danger" onclick="deleteOrder('${orderId}')">Delete</button> <button onclick="showMenu('${orderId}')" id="edit-('${orderId}')"  class="btn btn-primary">Edit</button></td>
                </tr>`
        }
    }
}

//delete an order
function deleteOrder(orderId) {
    fetch("https://firestore.googleapis.com/v1/projects/fyndish-23b06/databases/(default)/documents/Orders/" + orderId, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            window.location.reload();
            console.log("Order deleted..")
        });
}

function showMenu(orderId) {
    if (editBoxContainerEl.style.display === "block") {
        editBoxContainerEl.style.display = "none";
    } else {
        editBoxContainerEl.style.display = "block";
    }
    selectOptionsEl.addEventListener("click", function () {
        if (this.value === "1") {
            newNameEl.style.display = "block";
            contactInfoEl.style.display = "none";
            shippingTotEl.style.display="none";

        } else if (this.value === "2") {
            contactInfoEl.style.display = "block";
            newNameEl.style.display = "none";
            shippingTotEl.style.display="none";

        } else if (this.value === "3") {
            shippingTotEl.style.display="block";
            contactInfoEl.style.display = "none";
            newNameEl.style.display = "none";
        }
    })
    editNameButtonEl.addEventListener("click", function () {
        updateMask = "?updateMask.fieldPaths=firstName&updateMask.fieldPaths=lastName";
        let firstName = newFirstNameEl.value;
        let lastName = newLastNameEl.value;
        patchBody = JSON.stringify({
            "fields": {
                "firstName": {
                    "stringValue": firstName
                }, "lastName": {
                    "stringValue": lastName
                },
            }
        });
        editOrder(orderId);
    })

    contactInfoButtonEl.addEventListener("click", function () {
        updateMask = "?updateMask.fieldPaths=email&updateMask.fieldPaths=address&updateMask.fieldPaths=zipcode&updateMask.fieldPaths=city";
        let email = NewEmailEl.value;
        let address = NewAddressEl.value;
        let zipcode = NewZipcodeEl.value;
        let city = NewCityEl.value;
        patchBody = JSON.stringify({
            "fields": {
                "email": {
                    "stringValue": email
                }, "address": {
                    "stringValue": address
                }, "zipcode": {
                    "stringValue": zipcode
                }, "city": {
                    "stringValue": city
                }
            }
        });
        editOrder(orderId);
    })
    newTotShippingEl.addEventListener("click", function () {
        updateMask = "?updateMask.fieldPaths=total&updateMask.fieldPaths=shipping";
        let total = NewTotalEl.value;
        let shipping = NewShippingEl.value;
        patchBody = JSON.stringify({
            "fields": {
                "total": {
                    "doubleValue": total
                }, "shipping": {
                    "stringValue": shipping
                },
            }
        });
        editOrder(orderId);
    })
}

function editOrder(orderId){
    fetch("https://firestore.googleapis.com/v1/projects/fyndish-23b06/databases/(default)/documents/Orders/" + orderId + updateMask, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: patchBody
        }).then(res => {
            if (!res.ok) {
                throw new Error(`Failed to update order with ID: ${orderId}. Response status: ${res.status}. Response text: ${res.statusText}.`);
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}

