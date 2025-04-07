import { useState } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Leaf, LineChart, BarChart3 } from "lucide-react";

export default function AuthPage() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const { user, isLoading } = useAuth();

  const toggleForm = () => {
    setIsLoginForm((prev) => !prev);
  };

  // Redirect to home if user is already logged in
  if (!isLoading && user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="mb-8">
            <div className="h-12 w-12 bg-primary-100 flex items-center justify-center rounded-xl mb-4">
              <Leaf className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-primary-600">GreenWeb</h1>
          </div>

          {isLoginForm ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegisterForm onToggleForm={toggleForm} />
          )}
        </div>

        <div className="hidden lg:block w-1/2 bg-primary-700 p-12 relative">
          <div className="absolute inset-0 bg-[url('/patterns.svg')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">
              Build sustainable websites that make a difference
            </h2>

            <p className="text-primary-100 mb-8">
              GreenWeb helps you create eco-friendly websites by analyzing your carbon footprint, providing optimization recommendations, and tracking your sustainability progress over time.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-800 p-2 rounded-lg mt-1">
                  <BarChart3 className="h-5 w-5 text-primary-200" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Carbon Footprint Estimation</h3>
                  <p className="text-primary-200 text-sm">
                    Analyze your website's carbon impact with our AI-powered estimator
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-800 p-2 rounded-lg mt-1">
                  <LineChart className="h-5 w-5 text-primary-200" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Performance Tracking</h3>
                  <p className="text-primary-200 text-sm">
                    Monitor your progress and see how your optimizations improve sustainability
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-800 p-2 rounded-lg mt-1">
                  <Leaf className="h-5 w-5 text-primary-200" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Sustainability Badges</h3>
                  <p className="text-primary-200 text-sm">
                    Earn badges and showcase your commitment to sustainable web development
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}