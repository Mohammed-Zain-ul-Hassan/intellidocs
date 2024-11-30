'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
}

interface ChatPageProps {
  pdfContext: string | null;
}

export default function ChatPage({ pdfContext }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm ready to help you understand your document. What would you like to know?", sender: 'ai' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    try {
      // Add user message
      const userMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: 'user'
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: pdfContext
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setIsTyping(false);

      // Add AI response
      const aiMessage: Message = {
        id: messages.length + 2,
        text: data.message,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'ai'
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem-50px)] max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-700">CHAT</h2>
        <div className="mt-2 border-t border-gray-200"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.sender === 'ai'
                    ? 'message-ai bg-gray-100 text-gray-900'
                    : 'message-user text-white'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="bg-gray-50 rounded-lg px-4 py-2">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-white tech-border relative">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 chat-input bg-white border-blue-100 focus:border-blue-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="send-button bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); }
          100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
        }

        .message-ai {
          background: #f3f4f6 !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .message-user {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
        }

        .chat-container {
          background-color: #ffffff;
          position: relative;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          float: left;
          margin: 0 1px;
          background-color: #60a5fa;
          display: block;
          border-radius: 50%;
          opacity: 0.4;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          50% { opacity: 1; }
        }

        .tech-border::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #60a5fa, transparent);
          opacity: 0.5;
        }

        .chat-input {
          transition: all 0.2s ease;
          border-radius: 0.5rem;
        }

        .chat-input:focus {
          box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.1);
        }

        .send-button {
          transition: all 0.2s ease;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  )
}