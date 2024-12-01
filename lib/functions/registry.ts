import { FunctionDefinition } from '../llm/types';

export class FunctionRegistry {
  private static instance: FunctionRegistry;
  private functions: Map<string, Function> = new Map();
  private definitions: Map<string, FunctionDefinition> = new Map();

  private constructor() {} // Private constructor for singleton

  public static getInstance(): FunctionRegistry {
    if (!FunctionRegistry.instance) {
      FunctionRegistry.instance = new FunctionRegistry();
    }
    return FunctionRegistry.instance;
  }

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
}

export const functionRegistry = FunctionRegistry.getInstance(); 