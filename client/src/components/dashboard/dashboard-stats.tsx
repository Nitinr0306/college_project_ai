import { TrendingUp, Recycle, Globe, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification, UserStats } from "@/hooks/use-gamification";

export default function DashboardStats() {
  const { userStats: stats, isLoadingStats: isLoading, statsError: error } = useGamification();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-white border border-neutral-200 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-red-500 mb-8 p-4 bg-red-50 rounded-lg">
        Error loading stats: {error?.message || "Failed to load statistics"}
      </div>
    );
  }

  const statCards = [
    {
      title: "Carbon Saved",
      value: stats.totalCarbonSaved,
      unit: "kg CO2e",
      icon: <Recycle className="text-primary-500" />,
      trend: {
        positive: true,
        text: "increase from last month",
        value: 12
      }
    },
    {
      title: "Active Projects",
      value: stats.projectCount,
      unit: "websites",
      icon: <Globe className="text-teal-500" />,
      lastAdded: "Last added 2 days ago"
    },
    {
      title: "Sustainability Score",
      value: stats.sustainabilityScore,
      unit: "/ 100",
      icon: <span className="text-yellow-500">⭐</span>,
      trend: {
        positive: stats.sustainabilityScore >= 50,
        text: stats.sustainabilityScore >= 50 ? "points increase from last check" : "points decrease from last check",
        value: 4
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statCards.map((card, index) => (
        <Card key={index} className="bg-white border border-neutral-200 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-neutral-500 font-medium">{card.title}</h4>
              {card.icon}
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-neutral-800">{card.value}</span>
              <span className="text-neutral-600 mb-1">{card.unit}</span>
            </div>
            {card.trend && (
              <div className={`mt-2 text-sm ${card.trend.positive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {card.trend.positive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {card.trend.value}% {card.trend.text}
              </div>
            )}
            {card.lastAdded && (
              <div className="mt-2 text-sm text-neutral-600 flex items-center">
                <span className="mr-1">🕒</span>
                {card.lastAdded}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
