import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import CarbonEstimatorForm from "@/components/carbon-estimator/carbon-estimator-form";
import CarbonEstimatorResults from "@/components/carbon-estimator/carbon-estimator-results";
import { useCarbonAnalysis, CarbonAnalysisResult } from "@/hooks/use-carbonapi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTable from "@/components/dashboard/projects-table";

export default function CarbonEstimatorPage() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CarbonAnalysisResult | null>(null);
  
  const { analyzeWebsiteMutation } = useCarbonAnalysis();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAnalyze = async (formData: { 
    url: string; 
    hostingProvider: string; 
    monthlyTraffic: string;
  }) => {
    try {
      const result = await analyzeWebsiteMutation.mutateAsync({
        url: formData.url,
        hostingProvider: formData.hostingProvider,
        monthlyTraffic: formData.monthlyTraffic,
      });
      
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
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
            <h1 className="text-2xl font-bold text-neutral-800">Carbon Footprint Estimator</h1>
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
        
        {/* Carbon Estimator content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="estimator" className="mb-8">
              <TabsList>
                <TabsTrigger value="estimator">Carbon Estimator</TabsTrigger>
                <TabsTrigger value="projects">My Projects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="estimator" className="mt-6">
                <div className="bg-white p-8 rounded-xl shadow-md">
                  {analysisResult ? (
                    <CarbonEstimatorResults result={analysisResult} onReset={resetAnalysis} />
                  ) : (
                    <CarbonEstimatorForm onAnalyze={handleAnalyze} isLoading={analyzeWebsiteMutation.isPending} />
                  )}
                </div>
                
                <div className="mt-8 bg-primary-50 border border-primary-100 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-neutral-800 mb-4">How It Works</h3>
                  <p className="text-neutral-700 mb-4">
                    Our Carbon Footprint Estimator analyzes your website based on three key factors:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-primary-100 rounded-full p-1 mr-3 mt-1">
                        <div className="h-4 w-4 text-primary-600 flex items-center justify-center">1</div>
                      </div>
                      <span className="text-neutral-700">
                        <strong>Hosting Provider:</strong> The environmental impact of your hosting service
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-100 rounded-full p-1 mr-3 mt-1">
                        <div className="h-4 w-4 text-primary-600 flex items-center justify-center">2</div>
                      </div>
                      <span className="text-neutral-700">
                        <strong>Monthly Traffic:</strong> The number of visitors and resulting energy consumption
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-100 rounded-full p-1 mr-3 mt-1">
                        <div className="h-4 w-4 text-primary-600 flex items-center justify-center">3</div>
                      </div>
                      <span className="text-neutral-700">
                        <strong>Resource Efficiency:</strong> How optimized your website's assets are
                      </span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="mt-6">
                <ProjectsTable />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
