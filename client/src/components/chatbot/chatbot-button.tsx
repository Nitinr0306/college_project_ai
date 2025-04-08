import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

type ChatbotButtonProps = {
  toggleChatbot: () => void;
};

export default function ChatbotButton({ toggleChatbot }: ChatbotButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full bg-primary-400 opacity-30 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-primary-500 opacity-20 animate-pulse"></div>
        
        <Button
          onClick={toggleChatbot}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl flex items-center justify-center hover:bg-primary-700 transition-all transform hover:scale-105 border-4 border-white relative z-10"
          aria-label="Open sustainability chatbot"
        >
          <Bot size={28} className="animate-pulse" />
        </Button>
      </div>
    </div>
  );
}
