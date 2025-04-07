import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, Recycle } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-sm py-4 fixed w-full z-20">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Recycle className="text-primary-600" />
          <span className="font-semibold text-xl text-neutral-800">GreenWeb</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/#features" className="text-neutral-600 hover:text-primary-600 transition-colors">
            Features
          </Link>
          <Link href="/#estimator" className="text-neutral-600 hover:text-primary-600 transition-colors">
            Carbon Estimator
          </Link>
          <Link href="/#gamification" className="text-neutral-600 hover:text-primary-600 transition-colors">
            Gamification
          </Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="text-neutral-600 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button className="px-5 py-2 bg-primary-500 text-white rounded-lg shadow-md hover:bg-primary-600 transform hover:translate-y-[-1px] transition-all">
                Login
              </Button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          type="button" 
          className="md:hidden text-neutral-500 hover:text-neutral-700"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4">
          <div className="flex flex-col space-y-4">
            <Link href="/#features" 
              className="text-neutral-600 hover:text-primary-600 transition-colors p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link href="/#estimator" 
              className="text-neutral-600 hover:text-primary-600 transition-colors p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Carbon Estimator
            </Link>
            <Link href="/#gamification" 
              className="text-neutral-600 hover:text-primary-600 transition-colors p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gamification
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" 
                  className="text-neutral-600 hover:text-primary-600 transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }} 
                  variant="outline"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full px-5 py-2 bg-primary-500 text-white rounded-lg shadow-md hover:bg-primary-600 transition-all">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
