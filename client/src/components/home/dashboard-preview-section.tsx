import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Recycle,
  LineChart,
  Trophy,
  Globe,
  Settings,
  TrendingUp,
  ArrowDown,
  MoreVertical,
  PlusCircle,
  Download
} from "lucide-react";

export default function DashboardPreviewSection() {
  const { user } = useAuth();

  return (
    <section id="dashboard" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Powerful Dashboard Experience</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">Track your sustainability progress, manage your projects, and access all your tools in one place.</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Dashboard Sidebar */}
            <div className="lg:w-64 bg-neutral-800 text-white p-6">
              <div className="flex items-center space-x-2 mb-8">
                <Recycle />
                <span className="font-semibold text-xl">GreenWeb</span>
              </div>
              
              <nav className="space-y-1">
                <div className="flex items-center space-x-2 bg-primary-600 text-white rounded-lg px-4 py-3">
                  <LineChart className="text-sm h-4 w-4" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300 hover:bg-neutral-700 rounded-lg px-4 py-3 transition-colors">
                  <LineChart className="text-sm h-4 w-4" />
                  <span>Carbon Analytics</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300 hover:bg-neutral-700 rounded-lg px-4 py-3 transition-colors">
                  <Trophy className="text-sm h-4 w-4" />
                  <span>Achievements</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300 hover:bg-neutral-700 rounded-lg px-4 py-3 transition-colors">
                  <Globe className="text-sm h-4 w-4" />
                  <span>My Projects</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300 hover:bg-neutral-700 rounded-lg px-4 py-3 transition-colors">
                  <Settings className="text-sm h-4 w-4" />
                  <span>Settings</span>
                </div>
              </nav>
              
              <div className="mt-auto pt-8">
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="text-yellow-400">💡</div>
                    <span className="font-medium">Sustainability Tip</span>
                  </div>
                  <p className="text-sm text-neutral-300">Switch to a green hosting provider to reduce your carbon footprint by up to 40%.</p>
                </div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="flex-1 p-6 lg:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <h3 className="text-2xl font-bold text-neutral-800 mb-4 md:mb-0">Dashboard Overview</h3>
                <div className="flex space-x-3">
                  <Button variant="outline" className="bg-primary-50 text-primary-600 border-primary-200 hover:bg-primary-100">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    New Project
                  </Button>
                  <Button variant="outline" className="bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-neutral-500 font-medium">Carbon Saved</h4>
                    <Recycle className="text-primary-500" />
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-3xl font-bold text-neutral-800">142.5</span>
                    <span className="text-neutral-600 mb-1">kg CO2e</span>
                  </div>
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    12% increase from last month
                  </div>
                </div>
                
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-neutral-500 font-medium">Active Projects</h4>
                    <Globe className="text-teal-500" />
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-3xl font-bold text-neutral-800">7</span>
                    <span className="text-neutral-600 mb-1">websites</span>
                  </div>
                  <div className="mt-2 text-sm text-neutral-600 flex items-center">
                    <span className="mr-1">🕒</span>
                    Last added 2 days ago
                  </div>
                </div>
                
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-neutral-500 font-medium">Sustainability Score</h4>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-3xl font-bold text-neutral-800">86</span>
                    <span className="text-neutral-600 mb-1">/ 100</span>
                  </div>
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    4 points increase from last check
                  </div>
                </div>
              </div>
              
              {/* Sample Chart */}
              <div className="mb-8 bg-white border border-neutral-200 rounded-xl p-6">
                <h4 className="text-lg font-medium text-neutral-800 mb-4">Carbon Footprint Trend</h4>
                <div className="h-64 flex items-end space-x-2">
                  <div className="h-20 w-full bg-primary-100 rounded-t-md"></div>
                  <div className="h-32 w-full bg-primary-200 rounded-t-md"></div>
                  <div className="h-24 w-full bg-primary-300 rounded-t-md"></div>
                  <div className="h-40 w-full bg-primary-400 rounded-t-md"></div>
                  <div className="h-28 w-full bg-primary-500 rounded-t-md"></div>
                  <div className="h-16 w-full bg-primary-600 rounded-t-md"></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-neutral-500">
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center mt-8">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3">
                      Go to My Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3">
                      Sign In to Access Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
