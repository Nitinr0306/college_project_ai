import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/hooks/use-chatbot";
import { 
  Recycle, 
  LayoutDashboard, 
  LineChart, 
  Trophy, 
  Globe, 
  Settings, 
  LogOut 
} from "lucide-react";

interface DashboardSidebarProps {
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

export default function DashboardSidebar({ isMobile, closeMobileMenu }: DashboardSidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { useRandomTip } = useChatbot();
  const { data: tipData } = useRandomTip();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleLinkClick = () => {
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: <LayoutDashboard className="h-4 w-4" /> 
    },
    { 
      path: '/carbon-estimator', 
      name: 'Carbon Analytics', 
      icon: <LineChart className="h-4 w-4" /> 
    },
    { 
      path: '/gamification', 
      name: 'Achievements', 
      icon: <Trophy className="h-4 w-4" /> 
    },
    { 
      path: '/settings', 
      name: 'Settings', 
      icon: <Settings className="h-4 w-4" /> 
    }
  ];

  return (
    <div className="h-full w-full bg-neutral-800 text-white p-6 flex flex-col">
      <Link href="/" className="flex items-center space-x-2 mb-8">
        <Recycle size={24} />
        <span className="font-semibold text-xl">GreenWeb</span>
      </Link>
      
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            onClick={handleLinkClick}
          >
            <div className={`flex items-center space-x-2 rounded-lg px-4 py-3 transition-colors ${
              isActive(item.path) 
                ? 'bg-primary-600 text-white' 
                : 'text-neutral-300 hover:bg-neutral-700'
            }`}>
              {item.icon}
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
      
      {tipData?.tip && (
        <div className="mt-auto pt-8 mb-6">
          <div className="bg-neutral-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="text-yellow-400">💡</div>
              <span className="font-medium">Sustainability Tip</span>
            </div>
            <p className="text-sm text-neutral-300">{tipData.tip}</p>
          </div>
        </div>
      )}
      
      {user && (
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-neutral-300 hover:text-white hover:bg-neutral-700"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      )}
    </div>
  );
}
