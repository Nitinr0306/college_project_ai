import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, X, Bot } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const defaultResponses = [
  "Optimizing image sizes can reduce your website's carbon footprint by up to 30%. Try using WebP format instead of JPEG or PNG.",
  "Green hosting providers that use renewable energy can significantly reduce your website's environmental impact.",
  "Implementing efficient caching strategies can reduce server requests and save energy.",
  "Minimizing JavaScript bundle sizes with code splitting can improve load times and reduce energy consumption.",
  "Server-side rendering can be more energy-efficient for content-heavy websites compared to client-side rendering.",
  "Consider using a CDN to reduce the distance data travels, which can lower energy consumption.",
  "Dark mode interfaces can reduce energy consumption on OLED screens by up to 60%.",
  "Regular website audits can help identify and eliminate unused code and resources that waste energy.",
  "Using system fonts instead of custom fonts reduces HTTP requests and page size.",
  "Implementing lazy loading for images and videos can significantly reduce initial page load and save energy."
];

const greetings = [
  "Hello! I'm your sustainability assistant. How can I help you make your web projects more eco-friendly today?",
  "Hi there! I'm here to help you create more sustainable websites. What would you like to know?",
  "Welcome to GreenWeb! I'm your AI sustainability assistant. Ask me anything about eco-friendly web development."
];

export default function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Initialize with greeting when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      setMessages([
        {
          text: randomGreeting,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI thinking with a delay
    setTimeout(() => {
      // Generate a response based on keywords or choose a random one
      let response = '';
      const inputLower = input.toLowerCase();

      if (inputLower.includes('image') || inputLower.includes('picture')) {
        response = defaultResponses[0];
      } else if (inputLower.includes('hosting') || inputLower.includes('server')) {
        response = defaultResponses[1];
      } else if (inputLower.includes('cache') || inputLower.includes('speed')) {
        response = defaultResponses[2];
      } else if (inputLower.includes('javascript') || inputLower.includes('js')) {
        response = defaultResponses[3];
      } else if (inputLower.includes('render')) {
        response = defaultResponses[4];
      } else if (inputLower.includes('cdn')) {
        response = defaultResponses[5];
      } else if (inputLower.includes('dark') || inputLower.includes('light') || inputLower.includes('mode')) {
        response = defaultResponses[6];
      } else if (inputLower.includes('audit') || inputLower.includes('test')) {
        response = defaultResponses[7];
      } else if (inputLower.includes('font')) {
        response = defaultResponses[8];
      } else if (inputLower.includes('lazy') || inputLower.includes('loading')) {
        response = defaultResponses[9];
      } else {
        // Choose a random response if no keywords match
        response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }

      const botMessage: Message = {
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat button with animation */}
      {!isOpen && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary-400 opacity-30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-primary-500 opacity-20 animate-pulse"></div>
            <Button
              onClick={toggleChat}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-xl flex items-center justify-center hover:from-green-600 hover:to-teal-700 transition-all transform hover:scale-105 border-4 border-white relative z-10"
              aria-label="Chat with sustainability assistant"
            >
              <Bot size={26} className="animate-bounce" />
            </Button>
          </div>
          <div className="mt-2 text-center text-sm font-medium text-primary-700 bg-white px-2 py-1 rounded-md shadow-md opacity-80">
            Chat with us
          </div>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="w-80 md:w-96 h-[500px] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <h3 className="font-semibold">Sustainability Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleChat} 
              className="text-white hover:bg-white/20"
            >
              <X size={18} />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.isUser 
                      ? 'bg-primary-500 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-primary-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-2 border-t">
            <div className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about sustainable web dev..."
                className="flex-1"
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim()} 
                size="icon"
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                <Send size={18} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}