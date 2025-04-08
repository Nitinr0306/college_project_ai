import { useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type ChatbotModalProps = {
  isOpen: boolean;
  toggleChatbot: () => void;
};

export default function ChatbotModal({ isOpen, toggleChatbot }: ChatbotModalProps) {
  useEffect(() => {
    // Toggle the Botpress widget visibility based on our own UI state
    const toggleBotpressWidget = () => {
      const botpressWidget = document.querySelector('iframe[id^="bp-widget"]');
      const botpressContainer = document.getElementById('bp-web-widget-container');
      
      if (botpressWidget && botpressContainer) {
        // We hide Botpress's built-in widget container
        botpressContainer.style.display = 'none';
        
        // Move the iframe into our container when our modal is open
        const ourContainer = document.getElementById('custom-botpress-container');
        if (ourContainer && isOpen) {
          ourContainer.appendChild(botpressWidget);
          botpressWidget.style.display = 'block';
          botpressWidget.style.width = '100%';
          botpressWidget.style.height = '100%';
          botpressWidget.style.border = 'none';
        }
      }
    };

    // Try multiple times to find and move the Botpress iframe
    // since it might not be immediately available
    if (isOpen) {
      const checkInterval = setInterval(() => {
        toggleBotpressWidget();
      }, 300);
      
      return () => {
        clearInterval(checkInterval);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-24 right-8 w-80 md:w-96 h-[520px] bg-white rounded-xl shadow-2xl overflow-hidden z-50">
      <CardHeader className="bg-primary-600 text-white p-4 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium">Sustainability Assistant</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleChatbot} 
          className="text-white hover:text-neutral-200 transition-colors"
        >
          <X size={20} />
        </Button>
      </CardHeader>
      
      <div id="custom-botpress-container" className="w-full h-[calc(100%-60px)] overflow-hidden">
        {/* Botpress iframe will be moved here */}
      </div>
    </Card>
  );
}
