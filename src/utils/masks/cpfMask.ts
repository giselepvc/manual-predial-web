const cpfMask = (value: string) => {
  return value
    .replace(/[^0-9.-]/g, '')
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2');
};

export default cpfMask;
