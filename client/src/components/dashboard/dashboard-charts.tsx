import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/use-gamification";
import { useCarbonAnalysis } from "@/hooks/use-carbonapi";

export default function DashboardCharts() {
  const [chartData, setChartData] = useState<{ month: string; value: number }[]>([]);
  const { useUserStats } = useGamification();
  const { useProjects } = useCarbonAnalysis();
  
  const { data: stats, isLoading: isStatsLoading } = useUserStats();
  const { data: projects, isLoading: isProjectsLoading } = useProjects();

  // Generate chart data based on months
  useEffect(() => {
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    const newChartData = months.map((month, index) => {
      // This would ideally use real data from the API, but for demo
      // we're generating somewhat reasonable values
      let value: number;
      if (stats?.totalCarbonSaved && stats.totalCarbonSaved > 0) {
        // Distribute the total carbon saved across months with some randomness
        const base = stats.totalCarbonSaved / months.length;
        value = base * (0.5 + Math.random());
      } else {
        // Fallback values if no stats
        value = 10 + Math.floor(Math.random() * 40);
      }
      return { month, value: Math.round(value) };
    });

    setChartData(newChartData);
  }, [stats]);

  // Sample optimization categories - in a real app, these would come from API data
  const optimizationCategories = [
    { name: "Image Compression", score: 85 },
    { name: "CSS Minification", score: 92 },
    { name: "JS Optimization", score: 64 },
    { name: "Server Efficiency", score: 78 }
  ];

  if (isStatsLoading || isProjectsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <Card className="bg-white border border-neutral-200 rounded-xl">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium text-neutral-800">Carbon Footprint Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end space-x-2">
            {chartData.map((item, index) => {
              const maxHeight = 40; // max height in the chart is 40 units
              const heightPercentage = (item.value / Math.max(...chartData.map(d => d.value))) * 100;
              const height = (heightPercentage * maxHeight) / 100;
              
              // Color gets darker as the index increases
              const colorIntensity = 100 + ((index + 1) * 100);
              
              return (
                <div 
                  key={index} 
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  <div 
                    className={`w-full bg-primary-${Math.min(colorIntensity, 600)} rounded-t-md`} 
                    style={{ height: `${height}vh`, maxHeight: `${height}vh` }}
                  ></div>
                  <div className="text-xs text-neutral-500 mt-2">{item.month}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-neutral-200 rounded-xl">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium text-neutral-800">Top Optimizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationCategories.map((category, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-neutral-600">{category.name}</span>
                  <span className="text-sm font-medium text-neutral-800">{category.score}%</span>
                </div>
                <Progress value={category.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
