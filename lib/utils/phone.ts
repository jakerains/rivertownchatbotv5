/**
 * Clean and format a phone number string
 */
export function formatPhoneNumber(input: string): string | null {
  // Clean the input string of any non-digit characters
  const cleaned = input.replace(/\D/g, '');
  
  // Handle different cases
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  return null;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumberForDisplay(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '').slice(-10);
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

/**
 * Check if text contains customer service request keywords
 */
export function isCustomerServiceRequest(text: string): boolean {
  const keywords = [
    'speak to someone',
    'talk to a person',
    'customer service',
    'representative',
    'speak to a human',
    'talk to someone',
    'call me',
    'contact me'
  ];
  
  return keywords.some(keyword => text.toLowerCase().includes(keyword));
}

/**
 * Check if text is primarily a phone number
 */
export function isPrimaryPhoneNumber(text: string): boolean {
  const digitCount = (text.match(/\d/g) || []).length;
  return digitCount >= 10;
} 