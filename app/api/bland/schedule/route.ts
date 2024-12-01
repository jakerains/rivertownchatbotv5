import { NextResponse } from 'next/server';
import { CustomerInfo } from '@/lib/functions/types';
import { BlandService } from '@/lib/services/bland';
import { formatPhoneNumberForDisplay } from '@/lib/utils/phone';

const blandService = new BlandService();

export async function POST(req: Request) {
  try {
    const customerInfo: CustomerInfo = await req.json();
    
    // Initiate the call using our service
    await blandService.initiateCustomerServiceCall(
      customerInfo.phone,
      customerInfo.reason
    );

    // Format phone number for display
    const displayNumber = formatPhoneNumberForDisplay(customerInfo.phone);

    return NextResponse.json({
      scheduledTime: 'right now',
      message: `Perfect! Sara will be calling you right now at ${displayNumber}. She's looking forward to helping you with any questions you have about our artisanal wooden balls!`
    });
  } catch (error) {
    console.error('Bland API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to schedule call',
        message: "I apologize, but I'm having trouble connecting with Sara at the moment. Please try again in a few minutes or call us directly at (719) 266-2837"
      },
      { status: 500 }
    );
  }
} 