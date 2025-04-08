import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

type ChatbotButtonProps = {
  toggleChatbot: () => void;
};

export default function ChatbotButton({ toggleChatbot }: ChatbotButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Enhanced pulsing animation */}
        <div className="absolute inset-0 rounded-full bg-primary-400 opacity-30 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-primary-500 opacity-20 animate-pulse"></div>
        
        <Button
          onClick={toggleChatbot}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-2xl flex items-center justify-center hover:from-green-600 hover:to-teal-700 transition-all transform hover:scale-105 border-4 border-white relative z-10"
          aria-label="Chat with our sustainability assistant"
        >
          <MessageCircle size={28} className="animate-bounce" />
        </Button>
      </div>
      <div className="mt-2 text-center text-sm font-medium text-primary-700 bg-white px-2 py-1 rounded-md shadow-md opacity-80">
        Chat with us
      </div>
    </div>
  );
}
