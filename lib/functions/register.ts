import { functionRegistry } from './registry';
import { ragFunction, queryKnowledgeBase } from './rag';
import { orderLookupFunction, lookupOrder } from './order';
import { scheduleCallFunction, schedulePhoneCall } from './phone';

export function registerFunctions() {
  // Register RAG function
  functionRegistry.register(
    ragFunction.name,
    queryKnowledgeBase,
    ragFunction
  );

  // Register Order Lookup function
  functionRegistry.register(
    orderLookupFunction.name,
    lookupOrder,
    orderLookupFunction
  );

  // Register Phone Call function
  functionRegistry.register(
    scheduleCallFunction.name,
    schedulePhoneCall,
    scheduleCallFunction
  );
}

// Register functions on import
registerFunctions(); 