import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

type ChatbotButtonProps = {
  toggleChatbot: () => void;
};

export default function ChatbotButton({ toggleChatbot }: ChatbotButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="animate-bounce-slow mb-2 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium">
        Ask me about sustainability!
      </div>
      <Button
        onClick={toggleChatbot}
        className="w-16 h-16 rounded-full bg-green-600 text-white shadow-xl flex items-center justify-center hover:bg-green-700 transition-all transform hover:scale-105 border-4 border-white"
        aria-label="Open sustainability chatbot"
      >
        <Bot size={28} className="animate-pulse" />
      </Button>
    </div>
  );
}
