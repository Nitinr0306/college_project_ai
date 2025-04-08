import { useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Add TypeScript declaration for Botpress
declare global {
  interface Window {
    botpressWebChat: {
      sendEvent: (event: { type: string }) => void;
    };
  }
}

type ChatbotModalProps = {
  isOpen: boolean;
  toggleChatbot: () => void;
};

export default function ChatbotModal({ isOpen, toggleChatbot }: ChatbotModalProps) {
  useEffect(() => {
    // Toggle Botpress
    if (isOpen) {
      // Check if Botpress exists and initialize it
      if (window.botpressWebChat) {
        window.botpressWebChat.sendEvent({ type: 'show' });
      }
    } else {
      // Hide the widget when our modal is closed
      if (window.botpressWebChat) {
        window.botpressWebChat.sendEvent({ type: 'hide' });
      }
    }
  }, [isOpen]);

  // Our custom modal is no longer needed, as we'll use the native Botpress widget
  return null;
}
