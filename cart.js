(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.DeliveryCart = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MAX_QUANTITY = 99;

  function validProduct(product) {
    return product && typeof product.id === "string" && product.id.length > 0 &&
      typeof product.name === "string" && product.name.length > 0 &&
      typeof product.restaurant === "string" &&
      Number.isSafeInteger(product.price) && product.price >= 0;
  }

  function addItem(cart, product) {
    if (!Array.isArray(cart) || !validProduct(product)) {
      throw new TypeError("Carrito o producto inválido");
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      return cart.map(item => item.id === product.id
        ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
        : item);
    }
    return [...cart, {
      id: product.id,
      name: product.name,
      restaurant: product.restaurant,
      price: product.price,
      quantity: 1
    }];
  }

  function setQuantity(cart, productId, quantity) {
    if (!Array.isArray(cart) || !Number.isInteger(quantity)) {
      throw new TypeError("La cantidad debe ser un número entero");
    }
    if (quantity <= 0) return removeItem(cart, productId);
    const bounded = Math.min(quantity, MAX_QUANTITY);
    return cart.map(item => item.id === productId
      ? { ...item, quantity: bounded }
      : item);
  }

  function removeItem(cart, productId) {
    if (!Array.isArray(cart)) throw new TypeError("Carrito inválido");
    return cart.filter(item => item.id !== productId);
  }

  function countItems(cart) {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function subtotal(cart) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function restoreCart(saved, catalog) {
    if (!Array.isArray(saved) || !(catalog instanceof Map)) return [];
    const result = [];
    const used = new Set();
    for (const entry of saved) {
      if (!entry || typeof entry.id !== "string" || used.has(entry.id)) continue;
      const product = catalog.get(entry.id);
      if (!validProduct(product) || !Number.isInteger(entry.quantity) ||
          entry.quantity < 1 || entry.quantity > MAX_QUANTITY) continue;
      // Price and product name are always reconstructed from our own catalog.
      result.push({ ...product, quantity: entry.quantity });
      used.add(entry.id);
    }
    return result;
  }

  return { addItem, setQuantity, removeItem, countItems, subtotal, restoreCart, MAX_QUANTITY };
});
