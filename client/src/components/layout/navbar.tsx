import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, Recycle, Leaf, BarChart, Trophy, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav 
      className={`fixed w-full z-20 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-lg py-3" 
          : "bg-gradient-to-r from-primary-500/90 to-primary-600/90 shadow-md py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full shadow-md">
              <Recycle className="text-primary-600 h-6 w-6" />
            </div>
            <span className={`font-bold text-xl ${scrolled ? 'text-primary-700' : 'text-white'}`}>
              GreenWeb
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className={`
              bg-${scrolled ? 'white/70' : 'white/20'} 
              backdrop-blur-md 
              rounded-full 
              px-6 py-2 
              flex items-center 
              space-x-1
              shadow-lg
            `}>
              <NavLink 
                href="/#features" 
                icon={<Leaf size={16} />}
                label="Features"
                isScrolled={scrolled}
              />
              <NavLink 
                href="/#estimator" 
                icon={<BarChart size={16} />}
                label="Carbon Estimator"
                isScrolled={scrolled}
              />
              <NavLink 
                href="/#gamification" 
                icon={<Trophy size={16} />}
                label="Gamification"
                isScrolled={scrolled}
              />
              
              {user && (
                <NavLink 
                  href="/dashboard" 
                  icon={<User size={16} />}
                  label="Dashboard"
                  isScrolled={scrolled}
                />
              )}
            </div>
            
            {user ? (
              <Button 
                onClick={handleLogout} 
                variant={scrolled ? "outline" : "secondary"}
                className="ml-4 rounded-full font-medium shadow-md"
              >
                Logout
              </Button>
            ) : (
              <Link href="/auth">
                <Button 
                  className={`
                    ml-4 
                    px-6 
                    py-2 
                    rounded-full 
                    font-medium 
                    ${scrolled 
                      ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                      : 'bg-white hover:bg-white/90 text-primary-700'}
                    shadow-md 
                    hover:shadow-lg 
                    transform 
                    hover:-translate-y-0.5 
                    transition-all
                  `}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            type="button" 
            className={`md:hidden ${scrolled ? 'text-primary-600' : 'text-white'} hover:opacity-80`}
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg p-4 border-t border-gray-100 rounded-b-3xl">
          <div className="flex flex-col space-y-3">
            <MobileNavLink 
              href="/#features" 
              icon={<Leaf size={18} />}
              label="Features"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink 
              href="/#estimator" 
              icon={<BarChart size={18} />}
              label="Carbon Estimator"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink 
              href="/#gamification" 
              icon={<Trophy size={18} />}
              label="Gamification"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {user ? (
              <>
                <MobileNavLink 
                  href="/dashboard" 
                  icon={<User size={18} />}
                  label="Dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <Button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }} 
                  variant="outline"
                  className="mt-2 rounded-full w-full font-medium flex justify-center items-center"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button className="w-full mt-2 py-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 font-medium">
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

function NavLink({ href, icon, label, isScrolled }: { href: string; icon: React.ReactNode; label: string; isScrolled: boolean }) {
  const [location] = useLocation();
  const isActive = location === href || location.startsWith(href.split('#')[0]);
  
  return (
    <Link 
      href={href} 
      className={`
        px-4 
        py-2 
        rounded-full 
        flex 
        items-center 
        space-x-1.5
        transition-all
        ${isActive 
          ? isScrolled 
            ? 'bg-primary-100 text-primary-700 font-medium' 
            : 'bg-white/30 text-white font-medium' 
          : isScrolled 
            ? 'text-neutral-600 hover:bg-neutral-100' 
            : 'text-white/80 hover:text-white hover:bg-white/20'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  const [location] = useLocation();
  const isActive = location === href || location.startsWith(href.split('#')[0]);
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`
        p-3 
        rounded-xl
        flex 
        items-center 
        space-x-3
        transition-all
        ${isActive 
          ? 'bg-primary-50 text-primary-700 font-medium' 
          : 'text-neutral-600 hover:bg-neutral-50'
        }
      `}
    >
      <div className={`${isActive ? 'bg-primary-100' : 'bg-neutral-100'} p-2 rounded-full`}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}
