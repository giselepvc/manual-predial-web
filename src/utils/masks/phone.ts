const telephoneMask = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');
  let formattedValue = '';

  if (cleanedValue.length <= 10) {
    formattedValue = cleanedValue
      .replace(/(\d{0})(\d)/, '$1($2')
      .replace(/(\d{2})(\d)/, '$1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    formattedValue = cleanedValue
      .replace(/(\d{0})(\d)/, '$1($2')
      .replace(/(\d{2})(\d)/, '$1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  return formattedValue.slice(0, 15);
};

export default telephoneMask;
