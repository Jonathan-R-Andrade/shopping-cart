require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fecthItem', () => {
  test('Deve ser uma função', () => {
    expect(typeof fetchItem).toBe('function');
  });
  test('A função fetch deve ser chamada', async () => {
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalled();
  });
  test('A função fetch deve ser chamada com o endpoint "https://api.mercadolibre.com/items/MLB1615760527"', async () => {
    await fetchItem('MLB1615760527');
    const expectEndpoint = 'https://api.mercadolibre.com/items/MLB1615760527';
    expect(fetch).toHaveBeenCalledWith(expectEndpoint);
  });
  test('Deve retornar o objeto esperado', async () => {
    const receivedItem = await fetchItem('MLB1615760527');
    expect(receivedItem).toEqual(item);
  });
  test('Deve retornar um erro com a mensagem "You must provide an url"', async () => {
    const receivedItem = await fetchItem();
    expect(receivedItem).toEqual(new Error('You must provide an url'));
  });
});
