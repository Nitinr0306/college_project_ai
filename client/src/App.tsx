import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import CarbonEstimatorPage from "@/pages/carbon-estimator-page";
import GamificationPage from "@/pages/gamification-page";
import SettingsPage from "@/pages/settings-page";
import { ProtectedRoute } from "./lib/protected-route";
import { useEffect } from "react";
import { AuthProvider } from "./hooks/use-auth";
import SimpleChatbot from "./components/chatbot/simple-chatbot";

function Router() {
  // This useEffect handles direct navigation to hash links and smooth scrolling
  useEffect(() => {
    // Function to handle hash changes and direct hash access
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        // Give the DOM time to render
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            window.scrollTo({
              top: element.getBoundingClientRect().top + window.scrollY - 80, // Adjust for header
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    // Handle hash on initial load
    handleHash();
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHash);
    
    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/carbon-estimator" component={CarbonEstimatorPage} />
      <ProtectedRoute path="/gamification" component={GamificationPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <SimpleChatbot />
    </AuthProvider>
  );
}

export default App;
