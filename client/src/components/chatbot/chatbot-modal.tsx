import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useChatbot, ChatMessage } from "@/hooks/use-chatbot";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

type ChatbotModalProps = {
  isOpen: boolean;
  toggleChatbot: () => void;
};

export default function ChatbotModal({ isOpen, toggleChatbot }: ChatbotModalProps) {
  const { user } = useAuth();
  const { sendMessageMutation, useChatHistory, useRandomTip } = useChatbot();
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { data: chatHistory, isLoading: isHistoryLoading } = useChatHistory();
  const { data: tipData } = useRandomTip();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    // Optimistically add the message to UI
    const tempUserMsg = {
      id: Date.now(),
      userId: user.id,
      content: message,
      role: "user" as const,
      createdAt: new Date().toISOString()
    };

    try {
      await sendMessageMutation.mutateAsync(message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-24 right-8 w-80 md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden z-50">
      <CardHeader className="bg-primary-600 text-white p-4 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Bot className="mr-2" size={20} />
          <span className="font-medium">Sustainability Assistant</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleChatbot} className="text-white hover:text-neutral-200 transition-colors">
          <X size={20} />
        </Button>
      </CardHeader>
      
      <CardContent className="h-80 p-0 overflow-hidden flex flex-col">
        <div 
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto"
        >
          {isHistoryLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : chatHistory && chatHistory.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {chatHistory.map((msg: ChatMessage) => (
                <div 
                  key={msg.id}
                  className={`flex items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div 
                    className={`w-8 h-8 ${
                      msg.role === 'user' ? 'bg-neutral-200 ml-2' : 'bg-primary-100 mr-2'
                    } rounded-full flex items-center justify-center`}
                  >
                    {msg.role === 'user' ? (
                      <User className="text-neutral-600 text-sm" size={16} />
                    ) : (
                      <Bot className="text-primary-600 text-sm" size={16} />
                    )}
                  </div>
                  <div 
                    className={`${
                      msg.role === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-neutral-100 text-neutral-800'
                    } rounded-lg p-3 max-w-[80%]`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                  <Bot className="text-primary-600 text-sm" size={16} />
                </div>
                <div className="bg-neutral-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-neutral-800">
                    Hi there! I'm your sustainability assistant. Ask me anything about green web development.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {tipData?.tip && (
          <div className="p-3 bg-primary-50 border-t border-primary-100">
            <div className="text-xs font-medium text-primary-700 mb-1">Sustainability Tip</div>
            <div className="text-sm text-primary-900">{tipData.tip}</div>
          </div>
        )}
      </CardContent>
      
      <Separator />
      
      <CardFooter className="p-3">
        <form onSubmit={handleSubmit} className="flex items-center w-full">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about sustainability..."
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={!user || sendMessageMutation.isPending}
          />
          <Button 
            type="submit"
            disabled={!user || sendMessageMutation.isPending} 
            className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700 transition-colors"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
