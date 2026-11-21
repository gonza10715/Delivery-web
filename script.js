"use strict";

const restaurants = [
  { id: "don-juan", name: "Pizzería Don Juan", specialty: "Pizzas", icon: "🍕", menu: [
    { id: "muzza", name: "Pizza muzzarella", price: 3500 },
    { id: "napolitana", name: "Pizza napolitana", price: 4200 },
    { id: "porcion", name: "Porción de pizza", price: 1200 }
  ] },
  { id: "idolo", name: "Ídolo Burger", specialty: "Hamburguesas", icon: "🍔", menu: [
    { id: "burger", name: "Burger Ídolo", price: 5500 },
    { id: "doble", name: "Doble queso", price: 6200 },
    { id: "papas", name: "Papas con cheddar", price: 2500 }
  ] },
  { id: "positiva", name: "La Positiva", specialty: "Comida casera", icon: "🍝", menu: [
    { id: "milanesa", name: "Milanesa con papas", price: 4800 },
    { id: "fideos", name: "Fideos a la boloñesa", price: 4200 },
    { id: "empanadas", name: "Media docena de empanadas", price: 3600 }
  ] },
  { id: "papas", name: "La Papa Frita", specialty: "Papas y combos", icon: "🍟", menu: [
    { id: "cheddar", name: "Papas con cheddar", price: 3800 },
    { id: "combo", name: "Combo especial", price: 5900 },
    { id: "clasicas", name: "Papas clásicas", price: 2200 }
  ] },
  { id: "casa-local", name: "La Casa Local", specialty: "Parrilla y bodegón", icon: "🥩", menu: [
    { id: "asado", name: "Asado completo", price: 7800 },
    { id: "bondiola", name: "Bondiola", price: 6200 },
    { id: "chori", name: "Choripán", price: 3200 }
  ] },
  { id: "express", name: "Sabores Express", specialty: "Comida rápida", icon: "🌮", menu: [
    { id: "wrap", name: "Wrap de pollo", price: 4100 },
    { id: "tacos", name: "Tres tacos", price: 3900 },
    { id: "combo", name: "Combo express", price: 5200 }
  ] },
  { id: "burger-house", name: "Burger House", specialty: "Hamburguesas", icon: "🍔", menu: [
    { id: "clasica", name: "Burger clásica", price: 4000 },
    { id: "doble", name: "Burger doble", price: 5200 },
    { id: "papas", name: "Papas", price: 1800 }
  ] },
  { id: "gaucho", name: "Parrilla El Gaucho", specialty: "Parrilla", icon: "🥩", menu: [
    { id: "asado", name: "Asado", price: 6500 },
    { id: "vacio", name: "Vacío", price: 7000 },
    { id: "entrana", name: "Entraña", price: 7500 }
  ] },
  { id: "shawarma", name: "Shawarma King", specialty: "Shawarma", icon: "🌯", menu: [
    { id: "pollo", name: "Shawarma de pollo", price: 4500 },
    { id: "carne", name: "Shawarma de carne", price: 4800 }
  ] },
  { id: "dulce", name: "Dulce Tentación", specialty: "Pastelería", icon: "🍰", menu: [
    { id: "cheesecake", name: "Cheesecake", price: 3200 },
    { id: "chocolate", name: "Torta de chocolate", price: 3500 }
  ] },
  { id: "polar", name: "Helados Polar", specialty: "Heladería", icon: "🍦", menu: [
    { id: "cuarto", name: "Cuarto kilo", price: 2800 },
    { id: "medio", name: "Medio kilo", price: 5000 }
  ] }
];

const formatPrice = value => new Intl.NumberFormat("es-AR", {
  style: "currency", currency: "ARS", maximumFractionDigits: 0
}).format(value);
const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const elements = {
  restaurants: document.getElementById("lista-restaurantes"),
  menu: document.getElementById("menu-items"),
  selectedRestaurant: document.getElementById("selected-restaurant"),
  restaurantCount: document.getElementById("restaurant-count"),
  search: document.getElementById("buscador"),
  noResults: document.getElementById("no-results"),
  cart: document.getElementById("lista-carrito"),
  cartCount: document.getElementById("cart-count"),
  navCount: document.getElementById("nav-count"),
  total: document.getElementById("cart-total"),
  empty: document.getElementById("empty-cart"),
  checkout: document.getElementById("btn-pagar"),
  clear: document.getElementById("clear-cart"),
  dialog: document.getElementById("order-dialog"),
  summary: document.getElementById("order-summary"),
  confirm: document.getElementById("confirm-demo"),
  confirmation: document.getElementById("order-confirmation"),
  notification: document.getElementById("notification")
};

const STORE_KEY = "delivery-rapido-cart-v1";
const catalog = new Map();
for (const restaurant of restaurants) {
  for (const item of restaurant.menu) {
    const id = restaurant.id + ":" + item.id;
    catalog.set(id, {
      id, name: item.name, restaurant: restaurant.name, price: item.price
    });
  }
}

function loadCart() {
  try {
    return DeliveryCart.restoreCart(JSON.parse(localStorage.getItem(STORE_KEY)), catalog);
  } catch {
    return [];
  }
}

let cart = loadCart();
let selectedRestaurantId = restaurants[0].id;

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function notify(message) {
  elements.notification.textContent = message;
}

function setCart(next) {
  cart = next;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity }))));
  } catch {
    // Demo remains usable when storage is unavailable or disabled.
  }
  renderCart();
}

function renderRestaurants(query = "") {
  const term = normalize(query.trim());
  const found = restaurants.filter(rest =>
    normalize(rest.name + " " + rest.specialty).includes(term));
  elements.restaurants.replaceChildren();
  elements.restaurantCount.textContent = found.length + " de " + restaurants.length;
  elements.noResults.hidden = found.length > 0;
  for (const rest of found) {
    const card = node("article", "restaurant-card");
    if (rest.id === selectedRestaurantId) card.classList.add("is-selected");
    card.append(node("span", "restaurant-icon", rest.icon));
    const details = node("div", "restaurant-info");
    details.append(node("h3", "", rest.name), node("p", "", rest.specialty));
    const button = node("button", "small-button", rest.id === selectedRestaurantId ? "Menú abierto" : "Ver menú");
    button.type = "button";
    button.setAttribute("aria-label", "Ver menú de " + rest.name);
    button.addEventListener("click", () => {
      selectedRestaurantId = rest.id;
      renderRestaurants(elements.search.value);
      renderMenu(rest);
      document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    card.append(details, button);
    elements.restaurants.append(card);
  }
}

function renderMenu(rest) {
  elements.selectedRestaurant.textContent = rest.name + " · " + rest.specialty;
  elements.menu.replaceChildren();
  for (const item of rest.menu) {
    const card = node("article", "dish-card");
    const information = node("div");
    information.append(node("h3", "", item.name), node("p", "", formatPrice(item.price)));
    const button = node("button", "add-button", "Agregar +");
    button.type = "button";
    button.setAttribute("aria-label", "Agregar " + item.name + " al carrito");
    button.addEventListener("click", () => {
      setCart(DeliveryCart.addItem(cart, catalog.get(rest.id + ":" + item.id)));
      notify(item.name + " agregado al carrito");
    });
    card.append(information, button);
    elements.menu.append(card);
  }
}

function renderCart() {
  elements.cart.replaceChildren();
  const count = DeliveryCart.countItems(cart);
  elements.cartCount.textContent = count;
  elements.navCount.textContent = count;
  elements.total.textContent = formatPrice(DeliveryCart.subtotal(cart));
  elements.empty.hidden = cart.length > 0;
  elements.checkout.disabled = !cart.length;
  elements.clear.disabled = !cart.length;

  for (const item of cart) {
    const row = node("li", "cart-item");
    const detail = node("div", "cart-item-detail");
    detail.append(node("strong", "", item.name),
                  node("small", "", item.restaurant),
                  node("span", "item-price", formatPrice(item.price * item.quantity)));

    const actions = node("div", "item-actions");
    const minus = node("button", "stepper", "−");
    minus.type = "button";
    minus.setAttribute("aria-label", "Quitar una unidad de " + item.name);
    minus.addEventListener("click", () => setCart(DeliveryCart.setQuantity(cart, item.id, item.quantity - 1)));
    const quantity = node("span", "quantity", String(item.quantity));
    quantity.setAttribute("aria-label", "Cantidad: " + item.quantity);
    const plus = node("button", "stepper", "+");
    plus.type = "button";
    plus.disabled = item.quantity >= DeliveryCart.MAX_QUANTITY;
    plus.setAttribute("aria-label", "Agregar una unidad de " + item.name);
    plus.addEventListener("click", () => setCart(DeliveryCart.addItem(cart, catalog.get(item.id))));
    const remove = node("button", "remove-button", "Eliminar");
    remove.type = "button";
    remove.setAttribute("aria-label", "Eliminar " + item.name + " del carrito");
    remove.addEventListener("click", () => setCart(DeliveryCart.removeItem(cart, item.id)));
    actions.append(minus, quantity, plus, remove);
    row.append(detail, actions);
    elements.cart.append(row);
  }
}

elements.search.addEventListener("input", event => renderRestaurants(event.target.value));
elements.clear.addEventListener("click", () => { setCart([]); notify("Carrito vaciado"); });
elements.checkout.addEventListener("click", () => {
  if (!cart.length) return;
  elements.summary.textContent = DeliveryCart.countItems(cart) + " productos · " +
    formatPrice(DeliveryCart.subtotal(cart)) + " (total ilustrativo)";
  elements.confirmation.hidden = true;
  elements.confirm.disabled = false;
  elements.dialog.showModal();
});
elements.confirm.addEventListener("click", () => {
  if (!cart.length) return;
  elements.confirmation.hidden = false;
  elements.confirm.disabled = true;
  setCart([]);
  notify("Simulación completada. No se cobró dinero ni se envió un pedido.");
});

renderRestaurants();
renderMenu(restaurants[0]);
renderCart();
