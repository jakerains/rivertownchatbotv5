import { FunctionDefinition } from '../llm/types';

class FunctionRegistry {
  private functions: Map<string, Function> = new Map();
  private definitions: Map<string, FunctionDefinition> = new Map();

  register(name: string, fn: Function, definition: FunctionDefinition) {
    this.functions.set(name, fn);
    this.definitions.set(name, definition);
  }

  async execute(name: string, args: any): Promise<any> {
    const fn = this.functions.get(name);
    if (!fn) throw new Error(`Function ${name} not found`);
    return await fn(args);
  }

  getDefinitions(): FunctionDefinition[] {
    return Array.from(this.definitions.values());
  }

  getFunctionDefinition(name: string): FunctionDefinition | undefined {
    return this.definitions.get(name);
  }

  clear() {
    this.functions.clear();
    this.definitions.clear();
  }
}

export const functionRegistry = new FunctionRegistry(); 