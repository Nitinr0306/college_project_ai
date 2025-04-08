import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

type ChatbotButtonProps = {
  toggleChatbot: () => void;
};

export default function ChatbotButton({ toggleChatbot }: ChatbotButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="animate-bounce-slow mb-2 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium text-center">
        Ask me about sustainability!
      </div>
      <div className="relative">
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
        
        <Button
          onClick={toggleChatbot}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl flex items-center justify-center hover:bg-green-700 transition-all transform hover:scale-105 border-4 border-white relative z-10"
          aria-label="Open sustainability chatbot"
        >
          <Bot size={28} className="animate-bounce-slow" />
        </Button>
      </div>
    </div>
  );
}
