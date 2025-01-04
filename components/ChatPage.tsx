'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  isStreaming?: boolean;
}

interface ChatPageProps {
  pdfContext: string | null;
}

const LoadingDot = () => (
  <div className="inline-block">
    <span className="loading-dot">•</span>
  </div>
);

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
      const userMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: 'user'
      };

      const aiMessage: Message = {
        id: messages.length + 2,
        text: '',
        sender: 'ai',
        isStreaming: true
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      setInput('');
      setIsTyping(true);

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

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, text: accumulatedText, isStreaming: false }
              : msg
          ));
          break;
        }

        const chunk = decoder.decode(value);
        accumulatedText += chunk;
        
        setMessages(prev => prev.map(msg =>
          msg.id === aiMessage.id ? { ...msg, text: accumulatedText } : msg
        ));
      }

      setIsTyping(false);

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
        <AnimatePresence mode="sync">
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
                {message.sender === 'ai' ? (
                  <div className="markdown-content">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                    {message.isStreaming  && <LoadingDot />}
                  </div>
                ) : (
                  <p className="text-sm">{message.text}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
        .loading-dot {
          display: inline-block;
          animation: blink 1s infinite;
          font-size: 2.5rem;  /* Increased from 1.5rem */
          line-height: 0;
          color: #3b82f6;
          vertical-align: middle;  /* Added to better align with text */
          margin-left: 0.25rem;   /* Added some spacing */
        }

        @keyframes blink {
          0% { opacity: 0.2; }
          50% { opacity: 1; }
          100% { opacity: 0.2; }
        }

        .markdown-content {
          font-size: 0.875rem;
        }
        
        .markdown-content h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
        }
        
        .markdown-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0;
        }
        
        .markdown-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        
        .markdown-content p {
          margin: 0.5rem 0;
        }
        
        .markdown-content ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .markdown-content ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .markdown-content strong {
          font-weight: 600;
        }
        
        .markdown-content em {
          font-style: italic;
        }
        
        .markdown-content code {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }

        .message-ai {
          background: #f3f4f6 !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .message-user {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
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