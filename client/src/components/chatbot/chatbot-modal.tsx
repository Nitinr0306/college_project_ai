import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

type ChatbotModalProps = {
  isOpen: boolean;
  toggleChatbot: () => void;
};

export default function ChatbotModal({ isOpen, toggleChatbot }: ChatbotModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const botpressUrl = "https://cdn.botpress.cloud/webchat/v2.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/04/08/06/20250408061211-F1GR806Y.json";

  useEffect(() => {
    // Initialize the Botpress chat when the component mounts or when isOpen changes
    if (isOpen && iframeRef.current) {
      // Force a reload of the iframe when opened to ensure it's fresh
      const iframe = iframeRef.current;
      const src = iframe.src;
      iframe.src = "";
      setTimeout(() => {
        iframe.src = src;
      }, 50);
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
      
      <div className="w-full h-[calc(100%-60px)] overflow-hidden">
        <iframe
          ref={iframeRef}
          src={botpressUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          className="border-none"
          allow="microphone; geolocation"
          title="Sustainability Chatbot"
        ></iframe>
      </div>
    </Card>
  );
}
