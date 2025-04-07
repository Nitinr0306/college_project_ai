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
import { useState } from "react";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
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

  return (
    <AuthProvider>
      <Router />
      <ChatbotButton toggleChatbot={toggleChatbot} />
      <ChatbotModal isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />
    </AuthProvider>
  );
}

export default App;
