import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import CarbonEstimatorPage from "@/pages/carbon-estimator-page";
import GamificationPage from "@/pages/gamification-page";
import SettingsPage from "@/pages/settings-page";
import { ProtectedRoute } from "./lib/protected-route";
import { useState, useEffect } from "react";
import { AuthProvider } from "./hooks/use-auth";
import ChatbotButton from "./components/chatbot/chatbot-button";

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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    // Open a popup window to Botpress
    window.open('https://cdn.botpress.cloud/webchat/v2.3/index.html?options=%7B%22config%22%3A%7B%22botId%22%3A%22F1GR806Y%22%2C%22hostUrl%22%3A%22https%3A%2F%2Fcdn.botpress.cloud%2Fwebchat%2Fv2.3%22%2C%22messagingUrl%22%3A%22https%3A%2F%2Fmessaging.botpress.cloud%22%2C%22clientId%22%3A%22F1GR806Y%22%2C%22lazySocket%22%3Atrue%2C%22themeName%22%3A%22modern%22%2C%22botName%22%3A%22GreenWeb%20Assistant%22%2C%22stylesheet%22%3A%22https%3A%2F%2Fcdn.botpress.cloud%2Fwebchat%2Fv2.3%2Fstyles%2Fwebchat.css%22%2C%22frontendVersion%22%3A%22v2.3%22%2C%22showPoweredBy%22%3Afalse%2C%22theme%22%3A%22light%22%2C%22themeColor%22%3A%22%2318b18f%22%7D%7D', 'GreenWebChatbot', 'width=450,height=600,resizable=yes');
  };

  return (
    <AuthProvider>
      <Router />
      <ChatbotButton toggleChatbot={toggleChatbot} />
    </AuthProvider>
  );
}

export default App;
