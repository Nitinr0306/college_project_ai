import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type Badge = {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  createdAt: string;
};

export type LeaderboardEntry = {
  userId: number;
  username: string;
  name?: string;
  badgeCount: number;
  points: number;
  projectCount: number;
  sustainabilityScore: number;
};

export type UserStats = {
  userId: number;
  badgeCount: number;
  projectCount: number;
  totalCarbonSaved: number;
  totalPoints: number;
  sustainabilityScore: number;
  badges: Badge[];
  recentProjects: any[];
};

export function useGamification() {
  const { toast } = useToast();

  const checkBadgesMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const res = await apiRequest("POST", "/api/gamification/check-badges", { projectId });
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.hasNewBadges) {
        const badgeNames = data.newBadges.map((badge: Badge) => badge.name).join(", ");
        toast({
          title: "New Badge Earned!",
          description: `You've earned: ${badgeNames}`,
        });
      }
      // Invalidate badges and stats to refresh
      queryClient.invalidateQueries({ queryKey: ["/api/gamification/badges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gamification/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Check Badges",
        description: error.message || "An error occurred while checking for new badges.",
        variant: "destructive",
      });
    },
  });

  const useUserBadges = () => {
    return useQuery<Badge[], Error>({
      queryKey: ["/api/gamification/badges"],
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch badges");
        }
        return await res.json();
      },
    });
  };

  const useAllBadges = () => {
    return useQuery<Badge[], Error>({
      queryKey: ["/api/gamification/badges/all"],
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch all badges");
        }
        return await res.json();
      },
    });
  };

  const useLeaderboard = () => {
    return useQuery<LeaderboardEntry[], Error>({
      queryKey: ["/api/gamification/leaderboard"],
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        return await res.json();
      },
    });
  };

  const useUserStats = () => {
    return useQuery<UserStats, Error>({
      queryKey: ["/api/gamification/stats"],
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user stats");
        }
        return await res.json();
      },
    });
  };

  return {
    checkBadgesMutation,
    useUserBadges,
    useAllBadges,
    useLeaderboard,
    useUserStats,
  };
}
