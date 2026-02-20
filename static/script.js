const API_URL = "http://127.0.0.1:8000/products/";
let products = [];
let currentPage = 1;
let recordsPerPage = 5;

function fetchProducts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      products = data;
      document.getElementById("noRecord").style.display = "none";
      renderTable();
    });
}

function saveProduct() {
  const id = document.getElementById("productId").value;
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  if (!name || !price) {
    document.getElementById("error").innerText = "Name and Price are required!";
    return;
  }

  document.getElementById("error").innerText = "";

  const payload = { name, price, description };

  if (id) {
    fetch(API_URL + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => resetForm());
  } else {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => resetForm());
  }
}

function editProduct(product) {
  document.getElementById("productId").value = product.id;
  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("description").value = product.description;
}

function deleteProduct(id) {
  if (confirm("Are you sure?")) {
    fetch(API_URL + id, { method: "DELETE" })
      .then(() => fetchProducts());
  }
}

function renderTable(filtered = products) {
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  const start = (currentPage - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  const pageData = filtered.slice(start, end);

  pageData.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.description}</td>
        <td>
          <button onclick='editProduct(${JSON.stringify(p)})'>Edit</button>
          <button class="delete" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>`;
  });

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} of ${Math.ceil(filtered.length / recordsPerPage)}`;
}
document.getElementById("noRecord").style.display = "none";

function searchProducts() {
  const value = document.getElementById("search").value.toLowerCase();
  const noRecordMsg = document.getElementById("noRecord");

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value)
  );

  currentPage = 1;

  if (filtered.length === 0) {
    document.getElementById("productTable").innerHTML = "";
    noRecordMsg.style.display = "block";
  } else {
    noRecordMsg.style.display = "none";
    renderTable(filtered);
  }
}

function nextPage() {
  if (currentPage * recordsPerPage < products.length) {
    currentPage++;
    renderTable();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

function resetForm() {
  document.getElementById("productId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("description").value = "";
  fetchProducts();
}

fetchProducts();
