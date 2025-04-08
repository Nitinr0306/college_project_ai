import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type ChatMessage = {
  id: number;
  userId: number;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
};

export function useChatbot() {
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chatbot/messages", { content: message });
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate chat history to refresh with new messages
      queryClient.invalidateQueries({ queryKey: ["/api/chatbot/messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Message Failed",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const useChatHistory = () => {
    return useQuery<ChatMessage[], Error>({
      queryKey: ["/api/chatbot/messages"],
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        // If unauthorized (401), return empty array instead of throwing error
        if (res.status === 401) {
          return [];
        }
        
        if (!res.ok) {
          throw new Error("Failed to fetch chat history");
        }
        
        return await res.json();
      },
      retry: 1, // Only retry once to avoid too many requests
    });
  };

  const useRandomTip = () => {
    return useQuery<{ tip: string }, Error>({
      queryKey: ["/api/chatbot/tip"],
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch sustainability tip");
        }
        return await res.json();
      },
      refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
    });
  };

  return {
    sendMessageMutation,
    useChatHistory,
    useRandomTip,
  };
}
