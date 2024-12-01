"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CircleDot, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createLLMProvider } from '@/lib/llm/providers/factory'
import { useChat } from '@/lib/hooks/useChat'
import { functionRegistry } from '@/lib/functions/registry'
import { ragFunction, queryKnowledgeBase } from '@/lib/functions/rag'
import { orderLookupFunction, lookupOrder } from '@/lib/functions/order'
import { scheduleCallFunction, schedulePhoneCall } from '@/lib/functions/phone'
import { Message } from '@/lib/llm/types'

// Initialize function registry
functionRegistry.register('queryKnowledgeBase', queryKnowledgeBase, ragFunction);
functionRegistry.register('lookupOrder', lookupOrder, orderLookupFunction);
functionRegistry.register('schedulePhoneCall', schedulePhoneCall, scheduleCallFunction);

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'system',
    content: `You are a friendly customer service agent for Rivertown Ball Company. 
    We specialize in high-end exotic designer wooden craft balls. 
    You should be helpful, precise, and knowledgeable while maintaining a warm and approachable demeanor. 
    Remember that we do not make sports balls - we create artistic and decorative wooden spheres.`
  },
  {
    role: 'assistant',
    content: "Hello! Welcome to Rivertown Ball Company. I'm here to help you with any questions about our designer wooden craft balls. How can I assist you today?"
  }
];

interface UIMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(intervalId);
    }, 20);

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <span className="whitespace-pre-wrap">
      {displayedText.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const RollingBallAnimation = () => (
  <div className="flex items-center w-full">
    <motion.div
      className="w-6 h-6 bg-gradient-to-br from-amber-400 to-red-600 rounded-full shadow-lg"
      animate={{
        x: ["0%", "100%", "0%"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    <span className="ml-2 font-medium whitespace-nowrap text-white/80">Rolling up a response...</span>
  </div>
);

// Initialize the provider based on environment variable
const provider = createLLMProvider();

export function CustomerServiceChatbotComponent() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [uiMessages, setUIMessages] = useState<UIMessage[]>([
    { id: 1, text: INITIAL_MESSAGES[1].content, sender: 'bot' }
  ]);

  const { messages, isLoading, error, streamMessage } = useChat(provider, {
    initialMessages: INITIAL_MESSAGES,
    config: {
      temperature: 0.7,
      maxTokens: 1000,
      functions: functionRegistry.getDefinitions()
    }
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [uiMessages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: UIMessage = { 
        id: uiMessages.length + 1, 
        text: input, 
        sender: 'user' 
      };
      setUIMessages(prev => [...prev, userMessage]);
      setInput('');

      try {
        let responseText = '';
        for await (const chunk of streamMessage(input)) {
          responseText += chunk;
          setUIMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.sender === 'bot' && lastMessage.id === userMessage.id + 1) {
              return [...prev.slice(0, -1), { ...lastMessage, text: responseText }];
            } else {
              return [...prev, { id: userMessage.id + 1, text: responseText, sender: 'bot' }];
            }
          });
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setUIMessages(prev => [...prev, { 
          id: prev.length + 1, 
          text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.", 
          sender: 'bot' 
        }]);
      }
    }
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* Background Layer */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 transition-transform duration-1000 ease-in-out transform scale-105"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1683308743789-4910c3d16dae?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
          }}
        />
        
        {/* Animated Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-orange-500/40 to-yellow-500/40"
          style={{
            animation: 'gradientShift 10s ease infinite',
          }}
        />
      </div>

      {/* Content Container with Glassmorphism */}
      <div className="relative min-h-screen flex flex-col">
        <header className="relative z-10 bg-black/10 backdrop-blur-md p-4 border-b border-white/20">
          <div className="container mx-auto flex items-center">
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-red-600 p-2 rounded-full mr-3 shadow-md"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <CircleDot className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Rivertown Ball Company</h1>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col max-w-3xl h-[calc(100vh-8rem)] overflow-hidden">
          <ScrollArea className="flex-grow mb-4 bg-black/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl h-full">
            <div ref={scrollAreaRef} className="space-y-4 min-h-full">
              <AnimatePresence>
                {uiMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <motion.div
                      className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white'
                          : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TypewriterText text={message.text} />
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center mt-4"
              >
                <RollingBallAnimation />
              </motion.div>
            )}
          </ScrollArea>
          
          <div className="flex space-x-2 bg-black/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-grow bg-white/10 border-white/20 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-white/50 rounded-xl"
            />
            <Button 
              onClick={handleSend} 
              className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white transition-all duration-300 rounded-xl px-6"
              disabled={isLoading}
            >
              <Send className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

<style jsx global>{`
  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, 30px) rotate(120deg); }
    66% { transform: translate(-30px, 50px) rotate(240deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`}</style>