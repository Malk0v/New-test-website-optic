let cart = [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    cart = JSON.parse(saved);
  }
}
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
}
function renderProducts(products) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <select>
        ${product.options
          .map(
            (opt) => `
          <option value="${opt.diopter}" data-price="${opt.price}">${opt.diopter} дптр — ${opt.price}грн</option>
        `
          )
          .join("")}
      </select>
      <button>Добавить в корзину</button>
    `;
    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      const select = card.querySelector("select");
      const selectedOption = select.options[select.selectedIndex];
      cart.push({
        name: product.name,
        diopter: selectedOption.value,
        price: +selectedOption.dataset.price,
      });
      saveCart();
      alert("Товар добавлен в корзину!");
    });
    list.appendChild(card);
  });
}
function openCart() {
  const modal = document.getElementById("cart-modal");
  const cartItems = document.getElementById("cart-items");
  const totalSum = document.getElementById("total-sum");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerText = `${item.name} (${item.diopter} дптр) — ${item.price}грн`;
    cartItems.appendChild(div);
  });
  totalSum.innerText = `Сумма: ${total}грн`;
  modal.style.display = "block";
}
function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}
function sendOrder() {
  if (cart.length === 0) return alert("Корзина пуста!");
  const message =
    cart
      .map((item) => `${item.name} (${item.diopter} дптр) — ${item.price}грн`)
      .join("%0A") + `%0AИтого: ${cart.reduce((s, i) => s + i.price, 0)}грн`;

  const TOKEN = "7891353623:AAHcw3UdOk4BgEoiB3HaIr4x0UhcDsJAXUs";
  const CHAT_ID = "-1002333743964";
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${message}`;

  fetch(url).then((res) => {
    if (res.ok) {
      alert("Заказ отправлен!");
      clearCart();
      closeCart();
    } else {
      alert("Ошибка при отправке заказа");
    }
  });
}

// === Инициализация ===
document.getElementById("cart-button").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("send-order").addEventListener("click", sendOrder);

loadCart();
fetch("products.json")
  .then((res) => res.json())
  .then((data) => renderProducts(data));
