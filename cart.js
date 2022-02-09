function cart_CreateCart() {
  return { items: [], totalPrice: 0 };
}

function cart_CreateItem(item, quantity, totalPrice) {
  return { item, quantity, totalPrice };
}

function cart_Verify(cart) {
  if (typeof cart === 'object') {
    const modelCartKyes = Object.keys(cart_CreateCart());
    const cartKyes = Object.keys(cart);
    if (modelCartKyes.length !== cartKyes.length) return false;
    if (!cartKyes.every((key, index) => key === modelCartKyes[index])) return false;
    if (!Array.isArray(cart.items)) return false;
    return true;
  }
  return false;
}

function cart_Save(cart) {
  saveCartItems(JSON.stringify(cart));
}

function cart_Get() {
  try {
    const cart = JSON.parse(getSavedCartItems());
    return (cart_Verify(cart)) ? cart : cart_CreateCart();
  } catch (error) {
    return cart_CreateCart();
  }
}

function cart_AddItem(itemToAdd, cart, quantity) {
  const { items } = cart;
  let foundItem = items.find(({ item }) => item.id === itemToAdd.id);
  const priceToAdd = itemToAdd.price * quantity;
  if (foundItem) {
    foundItem.quantity += quantity;
    foundItem.totalPrice += priceToAdd;
  } else {
    const newItem = cart_CreateItem(itemToAdd, quantity, priceToAdd);
    items.push(newItem);
    foundItem = newItem;
  }
  cart.totalPrice += priceToAdd;
  cart.totalPrice = Number(cart.totalPrice.toFixed(2));
  foundItem.totalPrice = Number(foundItem.totalPrice.toFixed(2));
  console.log(foundItem.totalPrice);
  return foundItem;
}

function cart_RemoveItem(id, cart, quantity) {
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
    cart.totalPrice = Number(cart.totalPrice.toFixed(2));
  }
  return foundItem;
}
