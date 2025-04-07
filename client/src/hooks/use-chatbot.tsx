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
      const res = await apiRequest("POST", "/api/chatbot/send", { message });
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate chat history to refresh with new messages
      queryClient.invalidateQueries({ queryKey: ["/api/chatbot/history"] });
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
      queryKey: ["/api/chatbot/history"],
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch chat history");
        }
        return await res.json();
      },
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
