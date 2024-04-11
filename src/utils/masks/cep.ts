const zipcodeMask = (value: string) => {
  return value
    .replace(/[^0-9]/g, '')
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
};

export default zipcodeMask;
