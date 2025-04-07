import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section id="hero" className="bg-gradient-to-b from-green-50 to-teal-50 pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 leading-tight mb-4">
              Sustainable <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-teal-500">Web Development</span> Platform
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-xl">
              Empower your development process with AI-driven tools that reduce your website's carbon footprint while enhancing performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#estimator">
                <Button className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transform hover:translate-y-[-2px] transition-all text-center">
                  Try Carbon Estimator
                </Button>
              </Link>
              <Link href="/#features">
                <Button variant="outline" className="px-8 py-3 text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-all text-center">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-primary-100 animate-bounce opacity-70" style={{ animationDuration: '3s' }}></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-teal-100 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
              <div className="rounded-xl shadow-2xl z-10 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544396821-4dd40b938ad3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Sustainable Web Development Illustration" 
                  className="rounded-xl object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
