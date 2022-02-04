const cartItems = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
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

function showItemsSearched(search) {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.innerHTML = '';
  addLoading();
  const productsPromise = fetchProducts(search);
  productsPromise.then(({ results }) => {
    removeLoading();
    results.forEach((item) => {
      const productInfo = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      itemsContainer.appendChild(createProductItemElement(productInfo));
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

window.onload = () => {
  addSearchClickEvent();
  document.querySelector('.empty-cart')
    .addEventListener('click', emptyCart);
  fillItemsCart();
  showItemsSearched('computador');
};
