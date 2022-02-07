const fetchProducts = async (search) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
