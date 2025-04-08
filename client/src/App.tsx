import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import CarbonEstimatorPage from "@/pages/carbon-estimator-page";
import GamificationPage from "@/pages/gamification-page";
import SettingsPage from "@/pages/settings-page";
import { ProtectedRoute } from "./lib/protected-route";
import ChatbotButton from "./components/chatbot/chatbot-button";
import ChatbotModal from "./components/chatbot/chatbot-modal";
import { useState, useEffect } from "react";
import { AuthProvider } from "./hooks/use-auth";

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
    setIsChatbotOpen(prev => !prev);
  };

  // Add Botpress scripts
  useEffect(() => {
    // Load the Botpress scripts when the app mounts
    const injectScript = document.createElement('script');
    injectScript.id = 'botpress-script-inject';
    injectScript.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
    
    const configScript = document.createElement('script');
    configScript.id = 'botpress-script-config';
    configScript.src = "https://files.bpcontent.cloud/2025/04/08/06/20250408061211-X4ZIFSVN.js";
    
    // Only add scripts if they don't already exist
    if (!document.getElementById('botpress-script-inject')) {
      document.head.appendChild(injectScript);
    }
    
    if (!document.getElementById('botpress-script-config')) {
      document.head.appendChild(configScript);
    }
    
    return () => {
      // Clean up if needed
      const scriptToRemove = document.getElementById('botpress-script-inject');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      
      const configToRemove = document.getElementById('botpress-script-config');
      if (configToRemove) {
        configToRemove.remove();
      }
    };
  }, []);

  return (
    <AuthProvider>
      <Router />
      <ChatbotButton toggleChatbot={toggleChatbot} />
      <ChatbotModal isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />
    </AuthProvider>
  );
}

export default App;
