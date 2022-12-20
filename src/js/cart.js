function createCart() {
  return { items: [], totalPrice: 0, itemsTotal: 0 };
}

function createItem(item, quantity, totalPrice) {
  return { item, quantity, totalPrice };
}

function verifyCart(cart) {
  if (typeof cart !== 'object') return false;
  const modelCartKyes = Object.keys(createCart());
  const cartKyes = Object.keys(cart);
  if (modelCartKyes.length !== cartKyes.length) return false;
  if (!cartKyes.every((key, index) => key === modelCartKyes[index])) return false;
  if (!Array.isArray(cart.items)) return false;
  return true;
}

function saveCart(cart) {
  saveCartItems(JSON.stringify(cart));
}

function getCart() {
  try {
    const cart = JSON.parse(getSavedCartItems());
    return (verifyCart(cart)) ? cart : createCart();
  } catch (error) {
    return createCart();
  }
}

function addItemToCart(itemToAdd, cart, quantity) {
  const { items } = cart;
  let foundItem = items.find(({ item }) => item.id === itemToAdd.id);
  const priceToAdd = itemToAdd.price * quantity;
  if (foundItem) {
    foundItem.quantity += quantity;
    foundItem.totalPrice += priceToAdd;
  } else {
    const newItem = createItem(itemToAdd, quantity, priceToAdd);
    items.push(newItem);
    foundItem = newItem;
  }
  cart.itemsTotal += quantity;
  cart.totalPrice += priceToAdd;
  cart.totalPrice = Number(cart.totalPrice.toFixed(2));
  foundItem.totalPrice = Number(foundItem.totalPrice.toFixed(2));
  return foundItem;
}

function removeItemFromCart(id, cart, quantity) {
  const { items } = cart;
  let foundItem = items.find(({ item }) => item.id === id);
  if (foundItem) {
    if (quantity >= foundItem.quantity) {
      cart.totalPrice -= foundItem.item.price * foundItem.quantity;
      cart.items = items.filter(({ item }) => item.id !== id);
      foundItem = undefined;
    } else {
      cart.totalPrice -= foundItem.item.price * quantity;
      foundItem.quantity -= quantity;
      foundItem.totalPrice -= foundItem.item.price * quantity;
      foundItem.totalPrice = Number(foundItem.totalPrice.toFixed(2));
    }
    cart.itemsTotal -= quantity;
    cart.totalPrice = Number(cart.totalPrice.toFixed(2));
  }
  return foundItem;
}

if (typeof module === 'object') {
  module.exports = {
    createCart,
    saveCart,
    getCart,
    addItemToCart,
    removeItemFromCart,
  };
}
