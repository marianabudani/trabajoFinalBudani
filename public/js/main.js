const socket = io();

function render(data) {
  const html = data
    .map((prod, index) => {
      return `<li class="productTitle">${prod.title} 
          <ul class="productDesc">
            <li>Description: ${prod.description}</li>
            <li>Price: ${prod.price}</li>
            <li>Stock: ${prod.stock}</li>
            <li>Code: ${prod.code}</li>
            <li>Category: ${prod.category}</li>
            <li>Id: ${prod.id}</li>
          </ul>
      </li>
          `;
    })
    .join(" ");
  document.getElementById("productList").innerHTML = html;
}
const renderProducts = (products) => {

  const html = document.getElementById('product');

  html.innerHTML = '';
  products.forEach((product) => {
    const elementHtml = document.createElement('div');
    elementHtml.innerHTML = `
      <p>${product.title}</p>
      <p>${product.code}</p>
      <p>${product.price}</p>
      <p>${product.stock}</p>
    `;
    html.appendChild(elementHtml);
  });


};
socket.on("productList", (data) => {
  render(data);
});

function uploadProduct() {
  let product = {
    title: document.getElementById("prodTitle").value,
    description: document.getElementById("prodDesc").value,
    price: parseInt(document.getElementById("prodPrice").value),
    status: true,
    stock: parseInt(document.getElementById("prodStock").value),
    code: document.getElementById("prodCode").value,
    category: document.getElementById("prodCategory").value,
  };
  socket.emit("newProduct", product);
}

function eraseProduct(){
  let id = parseInt(document.getElementById("deletedProdId").value)
  socket.emit("eraseProduct", id);
}