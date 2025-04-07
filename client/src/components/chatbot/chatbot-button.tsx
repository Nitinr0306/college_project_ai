import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

type ChatbotButtonProps = {
  toggleChatbot: () => void;
};

export default function ChatbotButton({ toggleChatbot }: ChatbotButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={toggleChatbot}
        className="w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
        aria-label="Open sustainability chatbot"
      >
        <Bot size={24} />
      </Button>
    </div>
  );
}
