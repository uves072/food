// Currency formatter for Indian Rupees
export const formatPrice = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const formatPriceWithoutDecimals = (amount: number): string => {
  return `₹${Math.round(amount)}`;
};
