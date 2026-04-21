// ============================================
// FEE CALCULATION UTILITY
// ============================================
// Calculates platform fees and host fees for ticket bookings
// Used by payment processing system to determine final transaction amounts

/**
 * Calculates booking fees based on ticket price
 * 
 * @param {number} price - Base ticket price
 * @returns {object} Object containing hostFee and platformFee
 * 
 * Fee Structure:
 * - Host Fee: 1.5% of ticket price (goes to event organizer)
 * - Platform Fee: 1.5% of ticket price (goes to ChalChitra)
 */
export const calculateFees = (price) => {
  // Calculate host fee (1.5% of price)
  const hostFee = parseFloat((price * 0.015).toFixed(2));
  
  // Calculate platform fee (1.5% of price)
  const platformFee = parseFloat((price * 0.015).toFixed(2));
  
  // Return fee breakdown
  return { hostFee, platformFee };
};
