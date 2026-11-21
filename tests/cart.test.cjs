"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  addItem, setQuantity, removeItem, countItems, subtotal, restoreCart, MAX_QUANTITY
} = require("../cart.js");

const pizza = { id: "a:pizza", name: "Pizza", restaurant: "Pizzería", price: 3500 };
const drink = { id: "a:drink", name: "Bebida", restaurant: "Pizzería", price: 1250 };

test("adds products, groups duplicates and leaves previous arrays unchanged", () => {
  const first = addItem([], pizza);
  const second = addItem(first, pizza);
  const third = addItem(second, drink);
  assert.equal(first[0].quantity, 1);
  assert.equal(second[0].quantity, 2);
  assert.equal(third.length, 2);
  assert.equal(countItems(third), 3);
  assert.equal(subtotal(third), 8250);
});

test("supports quantity updates, removal and zero quantity", () => {
  const initial = [ ...addItem([], pizza), ...addItem([], drink) ];
  const changed = setQuantity(initial, pizza.id, 4);
  assert.equal(subtotal(changed), 15250);
  assert.equal(initial[0].quantity, 1);
  assert.equal(removeItem(changed, drink.id).length, 1);
  assert.equal(setQuantity(changed, pizza.id, 0).length, 1);
});

test("rejects invalid quantities and caps cart at maximum", () => {
  assert.throws(() => setQuantity([], "a:pizza", 1.5), TypeError);
  assert.throws(() => setQuantity([], "a:pizza", "3"), TypeError);
  assert.throws(() => addItem([], { id: "bad", name: "Bad", restaurant: "A", price: -1 }), TypeError);
  let cart = addItem([], pizza);
  cart = setQuantity(cart, pizza.id, 300);
  assert.equal(cart[0].quantity, MAX_QUANTITY);
  assert.equal(addItem(cart, pizza)[0].quantity, MAX_QUANTITY);
});

test("rehydrates stored items from trusted catalog, not stored prices", () => {
  const catalog = new Map([[pizza.id, pizza], [drink.id, drink]]);
  const saved = [
    { id: pizza.id, quantity: 2, price: 1, name: "Tampered" },
    { id: pizza.id, quantity: 10 },
    { id: "missing", quantity: 1 },
    { id: drink.id, quantity: 0 },
    { id: "a:drink", quantity: 1.5 }
  ];
  const restored = restoreCart(saved, catalog);
  assert.deepEqual(restored, [{ ...pizza, quantity: 2 }]);
  assert.equal(subtotal(restored), 7000);
});

test("ignores invalid or outdated storage safely", () => {
  const catalog = new Map([[pizza.id, pizza]]);
  assert.deepEqual(restoreCart(null, catalog), []);
  assert.deepEqual(restoreCart({ id: pizza.id }, catalog), []);
  assert.deepEqual(restoreCart([{ id: pizza.id, quantity: -1 }], catalog), []);
  assert.deepEqual(restoreCart([{ id: pizza.id, quantity: MAX_QUANTITY + 1 }], catalog), []);
});
