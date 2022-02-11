const cartItems = document.querySelector('.cart__items');
cartItems.addEventListener('click', removeItemInTheCart);

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;

  const itemImageContainer = createCustomElement('div', 'item__image__container', '');
  itemImageContainer.appendChild(img);
  return itemImageContainer;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function updateItemsTotalInTheIcon(cart) {
  const totalItems = document.querySelector('.cart-icon-items-total');
  if (cart.itemsTotal > 99) {
    totalItems.textContent = '99+';
  } else if (cart.itemsTotal < 1) {
    totalItems.textContent = '';
  } else {
    totalItems.textContent = cart.itemsTotal;
  }
}

function updateTotalPrice(cart) {
  const totalPrice = document.querySelector('.total-price__container');
  totalPrice.outerHTML = createPriceContainer(cart.totalPrice, 'total-price').outerHTML;
}

function changeEmptyCartMessage(cart) {
  if (cart.itemsTotal > 0) {
    document.querySelector('.cart__items__container')
      .style.display = 'flex';
    document.querySelector('.empty__cart__message__container')
      .style.display = 'none';
  } else {
    document.querySelector('.cart__items__container')
      .style.display = 'none';
    document.querySelector('.empty__cart__message__container')
      .style.display = 'flex';
  }
}

function removeItemInTheCart(event) {
  if (event.target.classList.contains('cart__item__delete')) {
    const item = event.target.parentElement.parentElement;
    const cart = cart_Get();
    const itemInCart = cart_RemoveItem(item.id, cart, 1);
    if (itemInCart) {
      updateCartItem(itemInCart);
    } else {
      item.remove();
    }
    cart_Save(cart);
    updateItemsTotalInTheIcon(cart);
    updateTotalPrice(cart);
    changeEmptyCartMessage(cart);
  }
}

function createCartItemQuantityElement(quantity) {
  const itemQuantityContainer = createCustomElement('span', 'item__quantity__container', '');
  const itemQuantity = createCustomElement('span', 'item__quantity', quantity);
  const itemQuantityText = createCustomElement('span', 'item__quantity-text', '');
  itemQuantityText.innerHTML = (quantity > 1) ? 'itens' : 'item';
  itemQuantityContainer.appendChild(itemQuantity);
  itemQuantityContainer.appendChild(itemQuantityText);
  return itemQuantityContainer;
}

function updateCartItem(item) {
  const itemElement = document.querySelector(`#${item.item.id}`);
  const itemQuantity = itemElement.querySelector('.item__quantity__container');
  itemQuantity.outerHTML = createCartItemQuantityElement(item.quantity).outerHTML;
  const itemPrice = itemElement.querySelector('.item__price__container');
  itemPrice.outerHTML = createPriceContainer(item.totalPrice, 'item__price').outerHTML;
}

function createCartItemElement(item) {
  const li = document.createElement('li');
  const { id, title, thumbnail } = item.item;
  li.id = `${id}`;
  li.className = 'cart__item';

  const itemMain = createCustomElement('div', 'cart__item__main', '');
  const img = createCustomElement('img', 'cart__item__thumbnail', '');
  const itemRemove = createCustomElement('i', 'cart__item__delete material-icons', 'delete');
  img.src = thumbnail;
  itemMain.innerHTML = `${img.outerHTML}${itemRemove.outerHTML}${title}`;
  li.appendChild(itemMain);

  const itemInfo = createCustomElement('div', 'cart__item__info', '');
  const itemPrice = createPriceContainer(item.totalPrice, 'item__price');
  itemInfo.appendChild(itemPrice);
  itemInfo.appendChild(createCartItemQuantityElement(item.quantity));
  li.appendChild(itemInfo);
  return li;
}

function addItemInTheCart(event) {
  const itemID = getSkuFromProductItem(event.target.parentElement);
  const itemPromise = fetchItem(itemID);
  itemPromise.then((item) => {
    const cart = cart_Get();
    const itemInCart = cart_AddItem(item, cart, 1);
    cart_Save(cart);
    if (itemInCart.quantity > 1) {
      updateCartItem(itemInCart);
    } else {
      const itemElemetn = createCartItemElement(itemInCart);
      cartItems.appendChild(itemElemetn);
    }
    updateItemsTotalInTheIcon(cart);
    updateTotalPrice(cart);
    changeEmptyCartMessage(cart);
  });
}

function thousandsSeparator(integerNumber) {
  const numbers = String(integerNumber).split('');
  const lastIndex = numbers.length - 1;
  numbers.reverse();
  const numberSeparated = [numbers[0]];
  for (let index = 1; index < numbers.length; index += 1) {
    numberSeparated.unshift(numbers[index]);
    if ((index + 1) % 3 === 0 && index < lastIndex) numberSeparated.unshift('.');
  }
  return numberSeparated.join('');
}

function createPriceContainer(price, className) {
  const priceSeparated = String(price).split('.');
  const priceInteger = thousandsSeparator(priceSeparated[0]);
  let priceCents = priceSeparated[1];
  priceCents = (priceCents) ? `${priceCents}00`.slice(0, 2) : '00';

  const priceContainer = createCustomElement('span', `${className}__container`, '');
  priceContainer.appendChild(createCustomElement('span', `${className}__symbol`, 'R$'));
  priceContainer.appendChild(createCustomElement('span', `${className}__integer`, priceInteger));
  priceContainer.appendChild(createCustomElement('span', `${className}__decimal_separator`, ','));
  priceContainer.appendChild(createCustomElement('span', `${className}__cents`, priceCents));
  return priceContainer;
}

function createProductItemElement({ id, title, pictures, price }) {
  const section = createCustomElement('section', 'item', '');
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createProductImageElement(pictures[0].url));
  section.appendChild(createPriceContainer(price, 'item__price'));
  section.appendChild(createCustomElement('span', 'item__title', title));
  const btnItemAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnItemAdd.addEventListener('click', addItemInTheCart);
  section.appendChild(btnItemAdd);
  return section;
}

function fillItemsCart() {
  const cart = cart_Get();
  cart.items.forEach((item) => {
    const itemElemetn = createCartItemElement(item);
    cartItems.appendChild(itemElemetn);
  });
  updateItemsTotalInTheIcon(cart);
  updateTotalPrice(cart);
  changeEmptyCartMessage(cart);
}

function addLoading() {
  const itemsContainer = document.querySelector('.items');
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.textContent = 'Carregando...';
  itemsContainer.appendChild(loadingElement);
}

function removeLoading() {
  document.querySelector('.loading').remove();
}

async function fetchItems(search) {
  const { results } = await fetchProducts(search);
  if (results === undefined) return undefined;
  const itemsIDs = results.map(({ id }) => id);
  const itemsPromise = await Promise.all(itemsIDs.map(fetchItem));
  return itemsPromise;
}

function showItemsSearched(search) {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.innerHTML = '';
  addLoading();
  const itemsPromise = fetchItems(search);
  itemsPromise.then((items) => {
    removeLoading();
    items.forEach((item) => {
      itemsContainer.appendChild(createProductItemElement(item));
    });
  });
}

function emptyCart() {
  const totalPrice = document.querySelector('.total-price__container');
  totalPrice.outerHTML = createPriceContainer(0, 'total-price').outerHTML;
  const cart = cart_CreateCart();
  cart_Save(cart);
  updateItemsTotalInTheIcon(cart);
  cartItems.innerHTML = '';
  changeEmptyCartMessage(cart);
}

function searchProducts() {
  const input = document.getElementById('search_product');
  if (input.value.length > 0) showItemsSearched(input.value);
}

function addSearchClickEvent() {
  document.getElementById('search_product')
    .addEventListener('keypress', (event) => {
      if (event.key === 'Enter') searchProducts();
    });
  document.querySelector('#icon-search')
    .addEventListener('click', searchProducts);
}

function showCartItems() {
  document.querySelector('.cart__title')
    .classList.toggle('cart__title-open');
  document.querySelector('.container-cartTitle')
    .classList.toggle('container-cartTitle-open');
  document.querySelector('.cart')
    .classList.toggle('cart-open');
}

window.onload = () => {
  addSearchClickEvent();
  document.querySelector('.empty-cart')
    .addEventListener('click', emptyCart);
  document.querySelector('.material-icons.cart-icon')
    .addEventListener('click', showCartItems);
  fillItemsCart();
  showItemsSearched('computador');
};
