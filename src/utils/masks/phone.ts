const telephoneMask = (value: string) => {
  return value
    .replace(/[^0-9.-]/g, '')
    .replace(/\D/g, '')
    .replace(/(\d{0})(\d)/, '$1($2')
    .replace(/(\d{2})(\d)/, '$1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
};

export default telephoneMask;
