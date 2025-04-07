import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Recycle } from "lucide-react";

export default function AuthPage() {
  const { user } = useAuth();
  const [isLoginForm, setIsLoginForm] = useState(true);

  // Toggle between login and register forms
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 bg-gradient-to-b from-green-50 to-teal-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-stretch">
            {/* Auth form */}
            <div className="lg:w-1/2">
              <Card className="max-w-md mx-auto p-8 shadow-xl">
                {isLoginForm ? (
                  <LoginForm onToggleForm={toggleForm} />
                ) : (
                  <RegisterForm onToggleForm={toggleForm} />
                )}
              </Card>
            </div>

            {/* Hero section */}
            <div className="lg:w-1/2">
              <div className="max-w-lg mx-auto">
                <div className="flex items-center mb-6">
                  <Recycle className="text-primary-600 mr-2" size={32} />
                  <h2 className="text-3xl font-bold text-neutral-800">GreenWeb</h2>
                </div>
                <h1 className="text-4xl font-bold text-neutral-800 mb-6">
                  Build Sustainable Websites that Make a Difference
                </h1>
                <p className="text-xl text-neutral-600 mb-8">
                  Join our platform and use AI-powered tools to reduce your website's carbon footprint while improving performance.
                </p>

                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">Why Choose GreenWeb?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-primary-100 rounded-full p-1 mr-3 mt-1">
                        <Recycle className="text-primary-600 h-4 w-4" />
                      </div>
                      <span className="text-neutral-700">Reduce your website's carbon footprint</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-100 rounded-full p-1 mr-3 mt-1">
                        <Recycle className="text-primary-600 h-4 w-4" />
                      </div>
                      <span className="text-neutral-700">Earn badges for sustainable achievements</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-100 rounded-full p-1 mr-3 mt-1">
                        <Recycle className="text-primary-600 h-4 w-4" />
                      </div>
                      <span className="text-neutral-700">Get AI-powered optimization suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-100 rounded-full p-1 mr-3 mt-1">
                        <Recycle className="text-primary-600 h-4 w-4" />
                      </div>
                      <span className="text-neutral-700">Track your sustainability progress over time</span>
                    </li>
                  </ul>
                </div>

                <div className="text-neutral-600">
                  By joining GreenWeb, you're contributing to a more sustainable web ecosystem and helping fight climate change.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
