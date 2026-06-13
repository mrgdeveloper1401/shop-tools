const priceFormat = (price: string) => {
  return parseFloat(price.split('.')[0]).toLocaleString();
};

export { priceFormat };
