export interface RAGFunction {
  query: string;
}

export interface OrderLookupFunction {
  orderId: string;
  customerEmail?: string;
}

export interface ScheduleCallFunction {
  name: string;
  phone: string;
  email?: string;
  preferredCallTime?: string;
  reason: string;
}

export type FunctionType = RAGFunction | OrderLookupFunction | ScheduleCallFunction;

export interface OrderLookupResult {
  orderId: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  orderDate: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  preferredCallTime?: string;
  reason?: string;
}

export interface RAGResponse {
  answer: string;
  confidence: number;
  sources?: string[];
} 