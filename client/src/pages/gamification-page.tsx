import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGamification } from "@/hooks/use-gamification";
import { Badge as BadgeType, LeaderboardEntry, UserStats } from "@/hooks/use-gamification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GamificationPage() {
  const { user } = useAuth();
  const { 
    userStats, 
    leaderboard, 
    badges,
    isLoadingStats,
    isLoadingLeaderboard,
    isLoadingBadges
  } = useGamification();
  
  const [activeTab, setActiveTab] = useState("achievements");
  
  const getBadgeIcon = (badge: BadgeType) => {
    const iconMap: { [key: string]: string } = {
      "carbon-reducer": "🌿",
      "sustainability-pioneer": "🌱",
      "eco-friendly-developer": "🌍",
      "green-host-pioneer": "🌳",
      "speed-optimizer": "⚡",
      "compression-master": "📦",
      "image-optimizer": "🖼️",
      "clean-code-hero": "💻",
      "carbon-conscious": "🌎",
      "sustainability-star": "⭐",
      "green-hosting-champion": "🏆",
      "asset-optimization-expert": "📊"
    };
    
    const icon = badge.icon?.toLowerCase();
    return iconMap[icon] || "🏅";
  };
  
  const getBadgeBackground = (badge: BadgeType) => {
    const categoryColors: { [key: string]: string } = {
      "sustainability": "bg-green-100 dark:bg-green-900",
      "performance": "bg-blue-100 dark:bg-blue-900",
      "optimization": "bg-purple-100 dark:bg-purple-900",
      "hosting": "bg-yellow-100 dark:bg-yellow-900",
      "code": "bg-pink-100 dark:bg-pink-900",
      "carbon": "bg-emerald-100 dark:bg-emerald-900"
    };
    
    return categoryColors[badge.category] || "bg-gray-100 dark:bg-gray-800";
  };

  if (isLoadingStats || isLoadingLeaderboard || isLoadingBadges) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Gamification &amp; Achievements</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="achievements">My Achievements</TabsTrigger>
          <TabsTrigger value="badges">Available Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        {/* My Achievements Tab */}
        <TabsContent value="achievements">
          {userStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-3">
                <CardHeader>
                  <CardTitle>Your Sustainability Impact</CardTitle>
                  <CardDescription>
                    Your contribution to a more sustainable web
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Total Points</CardDescription>
                        <CardTitle className="text-2xl">{userStats.totalPoints}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Badges Earned</CardDescription>
                        <CardTitle className="text-2xl">{userStats.badgeCount}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Projects Analyzed</CardDescription>
                        <CardTitle className="text-2xl">{userStats.projectCount}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Carbon Saved (g CO2e)</CardDescription>
                        <CardTitle className="text-2xl">{userStats.totalCarbonSaved.toFixed(2)}</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span>Sustainability Score</span>
                      <span>{userStats.sustainabilityScore.toFixed(1)}/100</span>
                    </div>
                    <Progress 
                      value={userStats.sustainabilityScore} 
                      className="h-2 bg-gray-200 dark:bg-gray-700" 
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* User's Badges */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                  <CardDescription>
                    Achievements you've unlocked
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userStats.badges.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {userStats.badges.map((badge) => (
                        <div 
                          key={badge.id} 
                          className={`flex items-center p-4 rounded-lg ${getBadgeBackground(badge)}`}
                        >
                          <div className="text-3xl mr-4">
                            {getBadgeIcon(badge)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{badge.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{badge.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">You haven't earned any badges yet</p>
                      <Button 
                        onClick={() => setActiveTab("badges")}
                        variant="outline"
                      >
                        View Available Badges
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Projects */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Your latest sustainability analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userStats.recentProjects && userStats.recentProjects.length > 0 ? (
                    <div className="space-y-4">
                      {userStats.recentProjects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <h3 className="font-semibold truncate">{project.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">{project.url}</p>
                          <div className="flex justify-between text-sm">
                            <span>Score: {project.sustainabilityScore || 0}/100</span>
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p>No projects analyzed yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="mb-4">Failed to load your achievements</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          )}
        </TabsContent>
        
        {/* Available Badges Tab */}
        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Available Badges</CardTitle>
              <CardDescription>
                Complete these achievements to earn badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {badges && badges.map((badge) => {
                  const earned = userStats?.badges.some(b => b.id === badge.id);
                  
                  return (
                    <div 
                      key={badge.id} 
                      className={`border rounded-lg p-4 ${earned ? getBadgeBackground(badge) : 'bg-white dark:bg-gray-800'}`}
                    >
                      <div className="flex items-center mb-2">
                        <div className="text-3xl mr-3">
                          {getBadgeIcon(badge)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{badge.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{badge.category}</p>
                        </div>
                      </div>
                      <p className="text-sm">{badge.description}</p>
                      {earned ? (
                        <div className="mt-3 text-xs text-green-600 dark:text-green-400 font-semibold">
                          ✓ Earned
                        </div>
                      ) : (
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                          {badge.points} points
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Leaderboard</CardTitle>
              <CardDescription>
                See how you compare to other sustainable developers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard && leaderboard.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Rank</th>
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-right py-3 px-4">Points</th>
                        <th className="text-right py-3 px-4">Badges</th>
                        <th className="text-right py-3 px-4">Projects</th>
                        <th className="text-right py-3 px-4">Sustainability Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => {
                        const isCurrentUser = entry.userId === user?.id;
                        
                        return (
                          <tr 
                            key={entry.userId} 
                            className={`border-b ${isCurrentUser ? 'bg-primary/10' : ''}`}
                          >
                            <td className="py-3 px-4">#{index + 1}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback>
                                    {entry.name?.charAt(0) || entry.username.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{entry.name || entry.username}</div>
                                  {entry.name && (
                                    <div className="text-xs text-gray-500">@{entry.username}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">{entry.points}</td>
                            <td className="text-right py-3 px-4">{entry.badgeCount}</td>
                            <td className="text-right py-3 px-4">{entry.projectCount}</td>
                            <td className="text-right py-3 px-4">{entry.sustainabilityScore.toFixed(1)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No leaderboard data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}