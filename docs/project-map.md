# Project Map <!-- markmap: fold -->

## Components
### Customer Service Chatbot
- Location: components/customer-service-chatbot.tsx
- Main chat interface component
- Features:
  - Typewriter text effect
  - Rolling ball animation
  - Message history
  - Real-time chat interface

## LLM Integration <!-- markmap: fold -->
### Core Types
- Location: lib/llm/types.ts
- Message Interface
- Function Definition Interface
- LLM Configuration
- Provider Interface

### Providers
- Location: lib/llm/providers/
- Base Provider Class
- OpenAI Provider Implementation
  - Azure endpoint support
  - Streaming capabilities
  - Function calling support
- Extensible for multiple LLM services
- Function call handling
- Configuration validation

### Function System
- Location: lib/functions/registry.ts
- Function Registration
- Function Execution
- Type-safe definitions
- Runtime validation

### Configuration
- Location: lib/config/llm.ts
- Environment variables
- Default settings
- Type-safe config

## State Management <!-- markmap: fold -->
### Chat Hook
- Location: lib/hooks/useChat.ts
- Message state management
- Loading states
- Error handling
- Streaming support
- Message history

## Pages
### Main Page
- Location: app/page.tsx
- Renders CustomerServiceChatbotComponent

## UI Components
### Base Components
- Button
- Input
- ScrollArea

## Styling
- TailwindCSS
- Custom animations
- Glassmorphism effects 