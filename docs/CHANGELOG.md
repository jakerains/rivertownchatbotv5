# Changelog

## [Unreleased]

### Added
- LLM Integration Architecture
  - Created core types for messages, functions, and LLM providers
  - Implemented base LLM provider class with function handling
  - Added function registry system for extensible function calling
  - Created useChat hook for state management and streaming support
- OpenAI Integration
  - Implemented Azure OpenAI endpoint integration with direct fetch calls
  - Added proper SSE handling for streaming responses
  - Added configuration system for LLM settings
  - Environment variable validation with NEXT_PUBLIC_ prefix support
  - Improved error handling with detailed error messages
  - Added proper error response parsing
- Azure OpenAI Integration
  - Added Azure OpenAI provider with native API support
  - Implemented provider factory for easy switching
  - Added environment-based provider selection
  - Maintained full feature parity with OpenAI provider
- Chat Interface Integration
  - Updated CustomerServiceChatbotComponent with LLM support
  - Added real-time streaming responses
  - Improved error handling and loading states
  - Added system message for consistent bot personality
  - Fixed chat container height and scrolling behavior
  - Added automatic scroll to latest message
- Bland AI Integration
  - Added Bland AI service for phone calls
  - Implemented immediate customer service callbacks
  - Added call status tracking
  - Improved error handling for call initiation
  - Added user-friendly call status messages

### Changed
- Updated project structure to support LLM integration
- Enhanced project documentation with detailed architecture map
- Improved chat interface with real-time updates
- Updated environment variables to use NEXT_PUBLIC_ prefix for client-side access
- Enhanced streaming support in useChat hook and OpenAI provider
- Added proper TypeScript types for streaming responses
- Improved error handling for streaming operations
- Removed OpenAI client dependency in favor of direct fetch calls
- Added proper SSE parsing for streaming responses
- Added environment variable validation
- Fixed chat container to use fixed height with scrolling
- Enhanced phone call function to use Bland AI
- Added environment-based LLM provider selection

### Technical Details
- Added type-safe interfaces for LLM integration
- Implemented streaming support for real-time responses
- Created extensible function registry system
- Added error handling and loading states
- Improved state management with React hooks
- Added Azure OpenAI endpoint integration with proper SSE handling
- Enhanced message handling with TypeScript interfaces
- Added proper AsyncGenerator types for streaming
- Implemented robust error handling with detailed error messages
- Added environment variable validation with NEXT_PUBLIC_ prefix support
- Cached model configuration in provider instance
- Added Bland AI service with proper error handling
- Implemented fixed height chat container with ScrollArea
- Added provider factory with environment-based selection