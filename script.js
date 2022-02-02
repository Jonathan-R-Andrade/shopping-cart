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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCartItems(event.path[1].innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemInTheCartClickListener(event) {
  const itemID = getSkuFromProductItem(event.target.parentElement);

  const itemPromise = fetchItem(itemID);
  itemPromise.then((item) => {
    const itemInfo = {
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    };
    const itemElemetn = createCartItemElement(itemInfo);
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(itemElemetn);
    saveCartItems(cartItems.innerHTML);
  });
}

const fillItemsCart = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = getSavedCartItems();
  const items = cartItems.getElementsByTagName('li');
  Array.from(items).forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

const showItemsSearched = () => {
  const itemsContainer = document.querySelector('.items');
  const productsPromise = fetchProducts('computador');
  productsPromise.then(({ results }) => {
    results.forEach((product) => {
      const productInfo = {
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      };
      const productElement = createProductItemElement(productInfo);
      productElement
        .querySelector('.item__add')
        .addEventListener('click', addItemInTheCartClickListener);
      itemsContainer.appendChild(productElement);
    });
  });
};

window.onload = () => {
  fillItemsCart();
  showItemsSearched();
};
