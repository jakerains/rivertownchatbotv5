import { BlandAIService } from '../services/bland';

export const scheduleCallFunction = {
  name: 'schedulePhoneCall',
  description: 'Schedule a phone call with a customer service representative. Used when someone wants to talk to customer service or says "call me".',
  parameters: {
    type: 'object',
    properties: {
      input: {
        type: 'string',
        description: 'The user input to check for phone numbers or call requests'
      }
    },
    required: ['input']
  }
};

function isCustomerServiceRequest(input: string): boolean {
  const keywords = [
    'speak to someone', 'talk to a person', 'customer service',
    'representative', 'speak to a human', 'talk to someone',
    'call me', 'contact me'
  ];
  return keywords.some(keyword => input.toLowerCase().includes(keyword));
}

function extractPhoneNumber(input: string): string | null {
  // Count digits in the input
  const digitCount = (input.match(/\d/g) || []).length;
  if (digitCount < 10) return null;

  // Clean the input string of any whitespace and common separators
  const cleaned = input.replace(/\D/g, '');
  
  // If we have exactly 10 digits, assume it's a valid US phone number
  if (cleaned.length === 10) {
    return cleaned;
  }
  
  // If we have 11 digits and it starts with 1, also valid
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.slice(1);
  }

  // If we have more than 10 digits, take the last 10
  if (cleaned.length > 10) {
    return cleaned.slice(-10);
  }
  
  return null;
}

function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '').slice(-10);
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

export async function schedulePhoneCall(params: { input: string }): Promise<{ success: boolean; message: string }> {
  const { input } = params;

  // Check if this is a customer service request
  if (isCustomerServiceRequest(input)) {
    return {
      success: false,
      message: "I'd be happy to have Sara, our customer service specialist, give you a call! " +
               "What's the best phone number to reach you at? You can share it in any format " +
               "like: 123-456-7890 or (123) 456-7890"
    };
  }

  // Check if this input contains a phone number
  const phoneNumber = extractPhoneNumber(input);
  if (!phoneNumber) {
    return {
      success: false,
      message: "I couldn't quite understand that phone number format. Could you please provide it " +
               "in a standard format like: 123-456-7890 or (123) 456-7890?"
    };
  }

  // Format the phone number for display
  const formattedPhone = formatPhoneForDisplay(phoneNumber);

  try {
    // First, acknowledge the phone number and inform about the upcoming call
    const message = `Perfect! Sara will be calling you right now at ${formattedPhone}. ` +
                   "She's looking forward to helping you with any questions you have about our " +
                   "artisanal wooden balls!";

    // Initialize Bland service and make the call asynchronously
    const blandService = new BlandAIService();
    blandService.initiateCall(phoneNumber).catch(error => {
      console.error('Error initiating Bland AI call:', error);
    });

    // Return the acknowledgment message immediately
    return {
      success: true,
      message
    };
  } catch (error) {
    console.error('Error scheduling phone call:', error);
    return {
      success: false,
      message: "I apologize, but I'm having trouble connecting with Sara at the moment. " +
               "Please try again in a few minutes or call us directly at (719) 266-2837"
    };
  }
} 