export const formatPrice = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, "");
  const parts = numericValue.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas for thousands

  return parts.join(".");
};

export const parsePrice = (formattedPrice: string) => {
  const cleaned = formattedPrice.replace(/[^0-9.-]+/g, ""); // Removes everything except numbers, dots, and dashes
  return parseFloat(cleaned); // Converts the cleaned string to a number
};
