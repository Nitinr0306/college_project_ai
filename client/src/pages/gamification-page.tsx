import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeft, Trophy, Medal, CheckCircle, User, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useGamification, Badge as BadgeType } from "@/hooks/use-gamification";

export default function GamificationPage() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { useUserStats, useUserBadges, useAllBadges, useLeaderboard } = useGamification();
  
  const { data: stats, isLoading: isStatsLoading } = useUserStats();
  const { data: userBadges, isLoading: isUserBadgesLoading } = useUserBadges();
  const { data: allBadges, isLoading: isAllBadgesLoading } = useAllBadges();
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useLeaderboard();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Find user's position in leaderboard
  const getUserRank = () => {
    if (!leaderboard || !user) return null;
    const rank = leaderboard.findIndex(entry => entry.userId === user.id);
    return rank !== -1 ? rank + 1 : null;
  };

  const userRank = getUserRank();

  // Get badge icon based on category
  const getBadgeIcon = (badge: BadgeType) => {
    switch (badge.icon.toLowerCase()) {
      case 'eco':
        return <Trophy className="text-primary-600" size={24} />;
      case 'speed':
        return <ArrowUpRight className="text-teal-600" size={24} />;
      case 'compress':
        return <CheckCircle className="text-yellow-600" size={24} />;
      case 'image':
        return <CheckCircle className="text-red-600" size={24} />;
      case 'code':
        return <CheckCircle className="text-purple-600" size={24} />;
      case 'public':
        return <CheckCircle className="text-blue-600" size={24} />;
      default:
        return <Trophy className="text-primary-600" size={24} />;
    }
  };

  // Get badge background color based on category
  const getBadgeBackground = (badge: BadgeType) => {
    switch (badge.icon.toLowerCase()) {
      case 'eco':
        return 'bg-primary-100';
      case 'speed':
        return 'bg-teal-100';
      case 'compress':
        return 'bg-yellow-100';
      case 'image':
        return 'bg-red-100';
      case 'code':
        return 'bg-purple-100';
      case 'public':
        return 'bg-blue-100';
      default:
        return 'bg-primary-100';
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block lg:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu}></div>
          <div className="absolute left-0 top-0 h-full w-64 bg-neutral-800">
            <DashboardSidebar isMobile={true} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-neutral-200 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden mr-4" 
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-neutral-800">Gamification</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-neutral-900">{user?.name || user?.username}</div>
              <div className="text-xs text-neutral-500">{user?.email}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
              {user?.name ? user.name.charAt(0).toUpperCase() : (user?.username?.charAt(0).toUpperCase() || 'U')}
            </div>
          </div>
        </header>
        
        {/* Gamification content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-neutral-500 font-medium">Total Points</h3>
                    <Trophy className="text-yellow-500" />
                  </div>
                  {isStatsLoading ? (
                    <Skeleton className="h-10 w-20" />
                  ) : (
                    <div className="text-3xl font-bold text-neutral-800">
                      {stats?.totalPoints || 0}
                    </div>
                  )}
                  {userRank && (
                    <div className="mt-2 text-sm text-green-600">
                      Ranked #{userRank} on the leaderboard
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-neutral-500 font-medium">Badges Earned</h3>
                    <Medal className="text-primary-500" />
                  </div>
                  {isUserBadgesLoading ? (
                    <Skeleton className="h-10 w-20" />
                  ) : (
                    <div className="text-3xl font-bold text-neutral-800">
                      {userBadges?.length || 0} / {allBadges?.length || 0}
                    </div>
                  )}
                  <div className="mt-2 text-sm text-neutral-600">
                    Keep analyzing to earn more badges
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-neutral-500 font-medium">Carbon Saved</h3>
                    <span className="text-green-500">🌱</span>
                  </div>
                  {isStatsLoading ? (
                    <Skeleton className="h-10 w-20" />
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-neutral-800">
                        {stats?.totalCarbonSaved || 0}
                      </span>
                      <span className="ml-1 text-neutral-600">kg CO2e</span>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-neutral-600">
                    That's equivalent to planting {Math.round((stats?.totalCarbonSaved || 0) / 10)} trees!
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="badges" className="mb-8">
              <TabsList>
                <TabsTrigger value="badges">My Badges</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="badges" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sustainability Badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isUserBadgesLoading || isAllBadgesLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <Skeleton key={i} className="h-32 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {allBadges?.map((badge) => {
                          const isEarned = userBadges?.some(userBadge => userBadge.id === badge.id);
                          return (
                            <div 
                              key={badge.id} 
                              className={`rounded-xl p-4 flex flex-col items-center text-center transition-all duration-300 transform ${
                                isEarned 
                                  ? 'bg-white shadow-md hover:shadow-lg hover:-translate-y-1' 
                                  : 'bg-neutral-100 opacity-70'
                              }`}
                            >
                              <div className={`w-16 h-16 ${isEarned ? getBadgeBackground(badge) : 'bg-neutral-200'} rounded-full flex items-center justify-center mb-3`}>
                                {isEarned ? (
                                  getBadgeIcon(badge)
                                ) : (
                                  <Lock className="text-neutral-400" size={24} />
                                )}
                              </div>
                              <h4 className="text-sm font-medium text-neutral-800">{badge.name}</h4>
                              <p className="text-xs text-neutral-500 mt-1">{badge.description}</p>
                              <Badge className="mt-2 bg-primary-100 text-primary-800 hover:bg-primary-200">
                                {badge.points} points
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="leaderboard" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sustainability Leaderboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLeaderboardLoading ? (
                      <Skeleton className="h-80 w-full" />
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Badges</TableHead>
                            <TableHead>Projects</TableHead>
                            <TableHead className="text-right">Sustainability Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leaderboard?.map((entry, index) => (
                            <TableRow key={entry.userId} className={entry.userId === user?.id ? 'bg-primary-50' : ''}>
                              <TableCell className="font-medium">
                                {index === 0 && <span className="text-yellow-500">🥇</span>}
                                {index === 1 && <span className="text-neutral-400">🥈</span>}
                                {index === 2 && <span className="text-amber-700">🥉</span>}
                                {index > 2 && `#${index + 1}`}
                              </TableCell>
                              <TableCell className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                  <User className="h-4 w-4 text-neutral-500" />
                                </div>
                                <div>
                                  <div className="font-medium">{entry.name || entry.username}</div>
                                  {entry.userId === user?.id && (
                                    <div className="text-xs text-primary-600">You</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{entry.points}</TableCell>
                              <TableCell>{entry.badgeCount}</TableCell>
                              <TableCell>{entry.projectCount}</TableCell>
                              <TableCell className="text-right">{entry.sustainabilityScore}/100</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
