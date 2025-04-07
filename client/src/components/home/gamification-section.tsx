import { Badge } from "@/components/ui/badge";
import { Recycle, FastForward, FileArchive, Image, Code, Globe } from "lucide-react";

const badges = [
  { 
    icon: <Recycle className="text-primary-600" size={24} />, 
    background: "bg-primary-100", 
    name: "Green Host Pioneer" 
  },
  { 
    icon: <FastForward className="text-teal-600" size={24} />, 
    background: "bg-teal-100", 
    name: "FastForward Optimizer" 
  },
  { 
    icon: <FileArchive className="text-yellow-600" size={24} />, 
    background: "bg-yellow-100", 
    name: "Compression Master" 
  },
  { 
    icon: <Image className="text-red-600" size={24} />, 
    background: "bg-red-100", 
    name: "Image Optimizer" 
  },
  { 
    icon: <Code className="text-purple-600" size={24} />, 
    background: "bg-purple-100", 
    name: "Clean Code Hero" 
  },
  { 
    icon: <Globe className="text-blue-600" size={24} />, 
    background: "bg-blue-100", 
    name: "Carbon Reducer",
    isNew: true 
  }
];

export default function GamificationSection() {
  return (
    <section id="gamification" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Gamify Your Sustainability Journey</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">Turn sustainable web development into an engaging experience with our points-based system and achievement badges.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 relative">
                  {badge.isNew && (
                    <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
                  )}
                  <div className={`relative w-16 h-16 ${badge.background} rounded-full flex items-center justify-center mb-3 overflow-hidden`}>
                    {badge.icon}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-75 animation-delay-shine" style={{ transform: 'rotate(25deg)', transition: 'all 0.5s' }}></div>
                  </div>
                  <h4 className="text-sm font-medium text-neutral-800">{badge.name}</h4>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">How Our Gamification Works</h3>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-neutral-800 mb-2">Complete Sustainability Tasks</h4>
                  <p className="text-neutral-600">Optimize your websites based on our AI-powered recommendations.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-neutral-800 mb-2">Earn Points & Badges</h4>
                  <p className="text-neutral-600">Get rewarded with points and achievement badges for your progress.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-neutral-800 mb-2">Compete on Leaderboards</h4>
                  <p className="text-neutral-600">Compare your sustainability achievements with other developers.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-neutral-800 mb-2">Track Your Progress</h4>
                  <p className="text-neutral-600">Monitor your sustainability metrics over time and set new goals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
