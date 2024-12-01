import { FunctionDefinition } from '../llm/types';
import { OrderLookupResult } from './types';

export const orderLookupFunction: FunctionDefinition = {
  name: 'lookupOrder',
  description: 'Look up order details using order ID or customer information',
  parameters: {
    type: 'object',
    properties: {
      orderId: {
        type: 'string',
        description: 'Order ID to look up'
      },
      customerEmail: {
        type: 'string',
        description: 'Customer email to look up orders'
      }
    },
    required: ['orderId']
  }
};

export async function lookupOrder(args: { orderId: string }): Promise<OrderLookupResult> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    });

    if (!response.ok) {
      throw new Error('Failed to lookup order');
    }

    return await response.json();
  } catch (error) {
    console.error('Order Lookup Error:', error);
    throw new Error('Failed to lookup order');
  }
} 