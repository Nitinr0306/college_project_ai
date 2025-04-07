import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";

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

  // Get user statistics
  const {
    data: userStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery<UserStats>({
    queryKey: ["/api/gamification/user-stats"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: true,
  });

  // Get leaderboard
  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
  } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/gamification/leaderboard"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: true,
  });

  // Get all badges
  const {
    data: badges,
    isLoading: isLoadingBadges,
    error: badgesError,
  } = useQuery<Badge[]>({
    queryKey: ["/api/gamification/badges"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: true,
  });

  // Check for new badges after a project analysis
  const checkBadgesMutation = useMutation({
    mutationFn: async ({ projectId }: { projectId: number }) => {
      const res = await apiRequest("POST", "/api/gamification/check-badges", { projectId });
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.newBadges && data.newBadges.length > 0) {
        const badgeNames = data.newBadges.map((badge: Badge) => badge.name).join(", ");
        toast({
          title: "New Badges Earned!",
          description: `You've earned: ${badgeNames}`,
          variant: "default",
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/gamification/user-stats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/gamification/leaderboard"] });
      }
    },
    onError: (error: Error) => {
      console.error("Failed to check for badges:", error);
    },
  });

  return {
    userStats,
    leaderboard,
    badges,
    isLoadingStats,
    isLoadingLeaderboard,
    isLoadingBadges,
    statsError,
    leaderboardError,
    badgesError,
    checkBadges: checkBadgesMutation.mutate,
    isCheckingBadges: checkBadgesMutation.isPending,
  };
}