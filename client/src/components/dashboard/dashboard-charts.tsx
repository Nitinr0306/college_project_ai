import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/use-gamification";
import { useCarbonAnalysis } from "@/hooks/use-carbonapi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend, ReferenceLine } from "recharts";
import { BarChart2, ThumbsUp, Upload, Wind, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Trend visualization component
export default function DashboardCharts() {
  const [chartTab, setChartTab] = useState("monthly");
  const { userStats: stats, isLoadingStats } = useGamification();
  const { useProjects } = useCarbonAnalysis();
  
  const { data: projects, isLoading: isProjectsLoading } = useProjects();

  // Generate monthly trend data
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Use last 6 months
    const recentMonths = [...months.slice(currentMonth - 5, currentMonth + 1)];
    
    return recentMonths.map((month, index) => {
      let carbonFootprint = 0;
      let carbonSaved = 0;
      
      if (stats?.totalCarbonSaved) {
        // Create a descending trend for carbon footprint (improving over time)
        const baseFootprint = 100 - (index * 8) + (Math.random() * 10);
        carbonFootprint = Math.max(30, Math.round(baseFootprint));
        
        // Create an ascending trend for carbon saved (more savings over time)
        const baseSaved = 10 + (index * 6) + (Math.random() * 5);
        carbonSaved = Math.round(baseSaved);
      } else {
        // Fallback data if no stats
        carbonFootprint = 90 - (index * 7) + (Math.random() * 10);
        carbonSaved = 10 + (index * 5) + (Math.random() * 5);
      }
      
      return {
        name: month,
        carbonFootprint: carbonFootprint,
        carbonSaved: carbonSaved,
        total: carbonFootprint + carbonSaved
      };
    });
  };

  // Generate weekly trend data (more granular)
  const generateWeeklyData = () => {
    return Array.from({ length: 8 }, (_, i) => {
      const weekNum = i + 1;
      const weekDate = new Date();
      weekDate.setDate(weekDate.getDate() - ((8 - weekNum) * 7));
      const weekLabel = `Week ${weekNum}`;
      
      let carbonFootprint = 0;
      let carbonSaved = 0;
      
      // Create more dramatic improvements for weekly view
      if (stats?.totalCarbonSaved) {
        const baseFootprint = 90 - (i * 9) + (Math.random() * 8);
        carbonFootprint = Math.max(20, Math.round(baseFootprint));
        
        const baseSaved = 15 + (i * 8) + (Math.random() * 4);
        carbonSaved = Math.round(baseSaved);
      } else {
        carbonFootprint = 85 - (i * 8) + (Math.random() * 8);
        carbonSaved = 15 + (i * 7) + (Math.random() * 5);
      }
      
      return {
        name: weekLabel,
        date: `${weekDate.getMonth() + 1}/${weekDate.getDate()}`,
        carbonFootprint: carbonFootprint,
        carbonSaved: carbonSaved,
        total: carbonFootprint + carbonSaved
      };
    });
  };

  // Generate optimization data for each category
  const generateOptimizationData = () => {
    // These categories would typically come from API data
    return [
      { 
        name: "Image Compression", 
        score: 85, 
        description: "Optimizing image size and format",
        impact: "High"
      },
      { 
        name: "CSS Minification", 
        score: 92, 
        description: "Reducing CSS file size",
        impact: "Medium" 
      },
      { 
        name: "JS Optimization", 
        score: 64, 
        description: "Improving JavaScript efficiency",
        impact: "High"
      },
      { 
        name: "Server Efficiency", 
        score: 78, 
        description: "Optimizing server response time",
        impact: "High"
      },
      { 
        name: "Font Loading", 
        score: 89, 
        description: "Optimizing font delivery",
        impact: "Low"
      }
    ];
  };

  const monthlyData = generateMonthlyData();
  const weeklyData = generateWeeklyData();
  const optimizationData = generateOptimizationData();

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <div className="flex flex-col space-y-1 mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-neutral-700 text-sm">
                Carbon Footprint: <span className="font-medium">{payload[0].value} kg</span>
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-neutral-700 text-sm">
                Carbon Saved: <span className="font-medium">{payload[1].value} kg</span>
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoadingStats || isProjectsLoading) {
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold text-neutral-800">Carbon Footprint Trend</CardTitle>
                <CardDescription className="text-neutral-500">
                  Visualizing your carbon footprint over time
                </CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <div className="p-1.5 bg-neutral-100 rounded-full cursor-help">
                      <Info className="h-4 w-4 text-neutral-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">This chart shows your website's carbon footprint trend and the carbon you've saved through optimizations.</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            
            <Tabs defaultValue="monthly" className="mt-4" onValueChange={setChartTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {chartTab === "monthly" ? (
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorFootprint" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                      </linearGradient>
                      <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} unit=" kg" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="carbonFootprint" 
                      name="Carbon Footprint"
                      stroke="#ef4444" 
                      fillOpacity={1} 
                      fill="url(#colorFootprint)" 
                      activeDot={{ r: 6 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="carbonSaved" 
                      name="Carbon Saved"
                      stroke="#22c55e" 
                      fillOpacity={1} 
                      fill="url(#colorSaved)" 
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                ) : (
                  <LineChart
                    data={weeklyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} unit=" kg" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="carbonFootprint" 
                      name="Carbon Footprint"
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="carbonSaved" 
                      name="Carbon Saved"
                      stroke="#22c55e" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-neutral-600">Carbon Footprint</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-neutral-600">Carbon Saved</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold text-neutral-800">Optimization Scores</CardTitle>
                <CardDescription className="text-neutral-500">
                  Performance metrics across key categories
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal px-2 py-1 bg-green-50 text-green-700 border-green-200">
                Good
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {optimizationData.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-neutral-700">{category.name}</span>
                      {category.impact === "High" && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-600 border-amber-200">
                          High Impact
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-neutral-800">{category.score}%</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={category.score} 
                      className={`h-2.5 rounded-full ${
                        category.score >= 80 ? "bg-green-500/20" : 
                        category.score >= 60 ? "bg-amber-500/20" : 
                        "bg-red-500/20"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{category.description}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-3 mt-6 border border-neutral-200">
              <div className="flex items-start space-x-3">
                <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-neutral-800">Overall Score: 82/100</p>
                  <p className="text-xs text-neutral-600 mt-1">Your website performs better than 68% of similar sites</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-neutral-800">Carbon Impact Breakdown</CardTitle>
          <CardDescription className="text-neutral-500">
            Analysis of carbon usage by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Images', current: 32, baseline: 55 },
                  { name: 'JavaScript', current: 25, baseline: 40 },
                  { name: 'CSS', current: 12, baseline: 18 },
                  { name: 'HTML', current: 8, baseline: 12 },
                  { name: 'Fonts', current: 15, baseline: 22 },
                  { name: 'Server', current: 22, baseline: 38 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} unit=" kg" />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="baseline" name="Industry Average" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="current" name="Your Website" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 mt-4 border border-green-200">
            <div className="flex items-start space-x-3">
              <Wind className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Your carbon footprint is 42% lower than the industry average</p>
                <p className="text-xs text-green-700 mt-1">Keep optimizing your website to further reduce your environmental impact!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
