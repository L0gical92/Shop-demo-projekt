"use strict";
const currentOrdersCellsEl = document.getElementById("currentOrdersCells");

fetch("https://firestore.googleapis.com/v1/projects/fyndish-23b06/databases/(default)/documents/Orders/")
  .then(res => res.json())
  .then(orders => currentOrders(orders));

function currentOrders(orders) {
  const ordersArray = orders.documents;
  console.log(ordersArray);
  for (let order of ordersArray) {
    let orderData = order.fields;
    const fullPath = order.name;
    const pathParts = fullPath.split("/");
    const id = pathParts[pathParts.length - 1];
    let productDetails = "";
    const products = orderData.products.mapValue.fields;
    for (const productName in products) {
      const quantity = products[productName].mapValue.fields.quantity.integerValue;
      const productId = products[productName].mapValue.fields.productId.integerValue;
      productDetails += `|${productName} (<b>${quantity}</b>)-(<b>ID:${productId}</b>)| `;
    }
    currentOrdersCellsEl.innerHTML += `<tr>
      <td>${id}</td>
      <td>${orderData.firstName.stringValue} ${orderData.lastName.stringValue}</td>
      <td>${orderData.email.stringValue}</td>
      <td>${orderData.address.stringValue}, ${orderData.zipcode.integerValue}, ${orderData.city.stringValue}</td>
      <td>${orderData.shipping.stringValue}</td>
      <td class="productCell">${productDetails}</td>
      <td>${orderData.total.integerValue}$</td>
    </tr>`
  }
}

