require('../mocks/fetchSimulator');
const { fetchProducts } = require('../src/js/helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fecthProducts', () => {
  test('Deve ser uma função', async () => {
    expect(typeof fetchProducts).toBe('function');
  });
  test('A função fetch deve ser chamada', async () => {
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalled();
  });
  test('A função fetch deve ser chamada com o endpoint "https://api.mercadolibre.com/sites/MLB/search?q=computador"', async () => {
    await fetchProducts('computador');
    const expectEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    expect(fetch).toHaveBeenCalledWith(expectEndpoint);
  });
  test('Deve retornar o objeto esperado', async () => {
    const products = await fetchProducts('computador');
    expect(products).toEqual(computadorSearch);
  });
  test('Deve lançar uma exceção com a mensagem "You must provide an url"', async () => {
    try {
      await fetchProducts();
      fail('Deveria lançar uma exceção.');
    } catch (error) {
      expect(error).toEqual(new Error('You must provide an url'));
    }
  });
});
