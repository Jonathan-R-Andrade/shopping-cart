const cartItems = document.querySelector('.cart__items');

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

function calculateTotalPrice() {
  const allCartItems = document.querySelectorAll('.cart__item');
  let totalPrice = Array
    .from(allCartItems)
    .reduce((total, item) => {
      const itemPrice = item.querySelector('.item__price').textContent;
      return Number(itemPrice) + total;
    }, 0);
  totalPrice = totalPrice.toFixed(2);
  document.querySelector('.total-price').textContent = Number(totalPrice);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCartItems(event.path[1].innerHTML);
  calculateTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  const itemPrice = `<span class="item__price">${salePrice}</span>`;
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $${itemPrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemInTheCart(event) {
  const itemID = getSkuFromProductItem(event.target.parentElement);

  const itemPromise = fetchItem(itemID);
  itemPromise.then((item) => {
    console.log(item);
    const itemInfo = {
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    };
    const itemElemetn = createCartItemElement(itemInfo);
    cartItems.appendChild(itemElemetn);
    saveCartItems(cartItems.innerHTML);
    calculateTotalPrice();
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
  priceCents = (priceCents) ? `00${priceCents}`.slice(-2) : '00';

  const priceContainer = createCustomElement('div', `${className}__container`, '');
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
  cartItems.innerHTML = getSavedCartItems();
  const items = cartItems.getElementsByTagName('li');
  Array.from(items).forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  calculateTotalPrice();
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
    console.log(items);
    removeLoading();
    items.forEach((item) => {
      const productInfo = {
        sku: item.id,
        name: item.title,
        image: item.pictures[0].url,
        price: item.price
      };
      itemsContainer.appendChild(createProductItemElement(item));
    });
  });
}

function emptyCart() {
  const totalPrice = document.querySelector('.total-price');
  cartItems.innerHTML = '';
  totalPrice.innerHTML = '0';
  saveCartItems(cartItems.innerHTML);
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
  document.querySelector('.material-icons')
    .addEventListener('click', showCartItems);
  fillItemsCart();
  showItemsSearched('computador');
};
