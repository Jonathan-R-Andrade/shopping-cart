const localStorageSimulator = require('../mocks/localStorageSimulator');
const saveCartItems = require('../helpers/saveCartItems');

localStorageSimulator('setItem');

describe('4 - Teste a função saveCartItems', () => {
  test('O método localStorage.setItem deve ser chamado', () => {
    saveCartItems({});
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  test('O método localStorage.setItem deve ser chamado com os argumentos "cartItems" e {}', () => {
    saveCartItems({});
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', {});
  });
});
