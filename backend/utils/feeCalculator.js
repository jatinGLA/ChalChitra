export const calculateFees = (price) => {
  const hostFee = parseFloat((price * 0.015).toFixed(2));
  const platformFee = parseFloat((price * 0.015).toFixed(2));
  return { hostFee, platformFee };
};
