const localStorageSimulator = require('../mocks/localStorageSimulator');
const getSavedCartItems = require('../src/js/helpers/getSavedCartItems');

localStorageSimulator('getItem');

describe('4 - Teste a função getSavedCartItems', () => {
  test('O método localStorage.getItem deve ser chamado', () => {
    getSavedCartItems();
    expect(localStorage.getItem).toHaveBeenCalled();
  });
  test('O método localStorage.getItem deve ser chamado com o argumento "cartItems"', () => {
    getSavedCartItems();
    expect(localStorage.getItem).toHaveBeenCalledWith('cartItems');
  });
});
