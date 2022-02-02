const localStorageSimulator = require('../mocks/localStorageSimulator');
const saveCartItems = require('../helpers/saveCartItems');

localStorageSimulator('setItem');

describe('4 - Teste a função saveCartItems', () => {
  test('O método localStorage.setItem deve ser chamado', () => {
    saveCartItems('<ol><li>Item</li></ol>');
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  test('O método localStorage.setItem deve ser chamado com os argumentos "cartItems" e "<ol><li>Item</li></ol>"', () => {
    const cartItems = '<ol><li>Item</li></ol>';
    saveCartItems(cartItems);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', cartItems);
  });
});
