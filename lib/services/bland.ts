import { formatPhoneNumber } from '../utils/phone';

interface BlandCallParams {
  phone: string;
}

const BLAND_CONFIG = {
  headers: {
    'Authorization': process.env.NEXT_PUBLIC_BLAND_API_KEY,
    'Content-Type': 'application/json'
  },
  base_url: 'https://us.api.bland.ai/v1'
};

export class BlandAIService {
  private config: typeof BLAND_CONFIG;

  constructor() {
    if (!process.env.NEXT_PUBLIC_BLAND_API_KEY) {
      throw new Error('NEXT_PUBLIC_BLAND_API_KEY environment variable is missing');
    }
    this.config = {
      headers: {
        'Authorization': process.env.NEXT_PUBLIC_BLAND_API_KEY,
        'Content-Type': 'application/json'
      },
      base_url: 'https://us.api.bland.ai/v1'
    };
  }

  private formatPhoneNumber(phone: string): string | null {
    // Clean the input string of any whitespace and common separators
    const cleaned = phone.replace(/\D/g, '');
    
    // If we have exactly 10 digits, assume it's a valid US phone number
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    
    // If we have 11 digits and it starts with 1, also valid
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }

    // If we have more than 10 digits, take the last 10
    if (cleaned.length > 10) {
      return `+1${cleaned.slice(-10)}`;
    }
    
    return null;
  }

  async initiateCall(phone: string): Promise<{ callId: string; formattedPhone: string }> {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      if (!formattedPhone) {
        throw new Error('Invalid phone number format');
      }

      const data = {
        phone_number: formattedPhone,
        task: `You are Sara from Rivertown Ball Company following up on a chat conversation they were just having, looking to ask them if they have any questions you can help with. 
        Start the call with: "Hi, this is Sara from Rivertown Ball Company!"
        Be warm, friendly and helpful while assisting with their questions about our artisanal wooden balls.
        Make them feel valued and excited about our products!`,
        model: 'turbo',
        voice: 'Alexa',
        max_duration: 12,
        wait_for_greeting: true,
        temperature: 0.8
      };

      const response = await fetch(`${this.config.base_url}/calls`, {
        method: 'POST',
        headers: this.config.headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bland AI request failed: ${errorText}`);
      }

      const responseData = await response.json();
      return { 
        callId: responseData.call_id,
        formattedPhone: `${formattedPhone.slice(-10, -7)}-${formattedPhone.slice(-7, -4)}-${formattedPhone.slice(-4)}`
      };
    } catch (error) {
      console.error('Error initiating Bland AI call:', error);
      throw error;
    }
  }

  async getCallStatus(callId: string): Promise<{
    status: string;
    transcript?: string;
    recording_url?: string;
  }> {
    try {
      const response = await fetch(`${this.config.base_url}/calls/${callId}`, {
        headers: this.config.headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get call status: ${errorText}`);
      }

      const data = await response.json();
      return {
        status: data.status,
        transcript: data.transcript,
        recording_url: data.recording_url
      };
    } catch (error) {
      console.error('Error getting call status:', error);
      throw error;
    }
  }
} 