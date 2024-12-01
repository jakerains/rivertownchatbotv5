import { NextResponse } from 'next/server';
import { OrderLookupResult } from '@/lib/functions/types';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    // TODO: Implement actual order lookup logic here
    // This is a placeholder implementation
    const response: OrderLookupResult = {
      orderId,
      status: 'processing',
      items: [
        {
          name: 'Exotic Wooden Ball - Dragon Design',
          quantity: 1,
          price: 299.99
        }
      ],
      totalPrice: 299.99,
      orderDate: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Order API Error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup order' },
      { status: 500 }
    );
  }
} 