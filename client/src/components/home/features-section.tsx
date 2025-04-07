import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Award, Bot, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Recycle className="text-2xl text-primary-600" />,
    title: "Carbon Footprint Estimator",
    description: "Analyze your website's environmental impact based on hosting provider, traffic, and resource usage.",
    link: "#estimator"
  },
  {
    icon: <Award className="text-2xl text-teal-600" />,
    title: "Gamification System",
    description: "Earn badges and compete on leaderboards as you achieve sustainability milestones in your projects.",
    link: "#gamification"
  },
  {
    icon: <Bot className="text-2xl text-primary-600" />,
    title: "AI Sustainability Chatbot",
    description: "Get instant answers about sustainable practices with our conversational assistant.",
    link: "#chatbot"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Smart Features for Green Development</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">Our AI-powered platform helps you build eco-friendly websites while maintaining exceptional performance.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 mb-4">{feature.description}</p>
                <Link href={feature.link} className="text-primary-600 font-medium flex items-center hover:text-primary-700 transition-colors">
                  Learn more
                  <ArrowRight className="text-sm ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
