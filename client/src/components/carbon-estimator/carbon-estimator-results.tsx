import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CarbonAnalysisResult } from "@/hooks/use-carbonapi";
import { useGamification } from "@/hooks/use-gamification";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type CarbonEstimatorResultsProps = {
  result: CarbonAnalysisResult;
  onReset: () => void;
};

export default function CarbonEstimatorResults({ result, onReset }: CarbonEstimatorResultsProps) {
  const { checkBadges, isCheckingBadges } = useGamification();
  const [showBadgeEarned, setShowBadgeEarned] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);
  
  // Check if the user earned any badges for this analysis
  useEffect(() => {
    async function checkUserBadges() {
      try {
        checkBadges({ projectId: result.projectId });
        // The toast notification will be shown automatically by the hook
        // when badges are earned
      } catch (error) {
        console.error("Failed to check badges:", error);
      }
    }
    
    checkUserBadges();
  }, [result.projectId, checkBadges]);
  
  // Get color for score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Get label for score
  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
  };

  // Calculate stroke dash offset for carbon gauge
  const calculateStrokeDashOffset = (value: number) => {
    const circumference = 2 * Math.PI * 54; // circle radius is 54
    const percentFilled = Math.min(100, Math.max(0, value)) / 100;
    return circumference - (circumference * percentFilled);
  };

  // Format carbon footprint for display
  const formatCarbonFootprint = (value: number) => {
    return `${value}kg`;
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Estimated Carbon Footprint</h3>
        
        {/* Badge Earned Alert */}
        {showBadgeEarned && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircle className="text-green-600 mr-3 mt-1 h-5 w-5 flex-shrink-0" />
            <div>
              <h4 className="text-green-800 font-medium">Badge Earned!</h4>
              <p className="text-green-700 text-sm">
                {earnedBadges.length > 0
                  ? `You've earned ${earnedBadges.map(b => b.name).join(", ")}`
                  : "You've earned a new sustainability badge"}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="54" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="12" 
                  strokeDasharray={2 * Math.PI * 54} 
                  strokeDashoffset={calculateStrokeDashOffset(result.sustainabilityScore)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-neutral-800">
                  {formatCarbonFootprint(result.carbonFootprint)}
                </span>
                <span className="text-sm text-neutral-600">CO2/month</span>
              </div>
            </div>
            
            <Badge className="mt-4 bg-primary-100 text-primary-800 hover:bg-primary-200 border-0">
              Score: {result.sustainabilityScore}/100
            </Badge>
          </div>
          
          <div className="flex-1 md:pl-6 w-full">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-600">Server Efficiency</span>
                <span className={`text-sm font-medium ${getScoreColor(result.serverEfficiency)}`}>
                  {getScoreLabel(result.serverEfficiency)}
                </span>
              </div>
              <Progress value={result.serverEfficiency} className="h-2" />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-600">Asset Optimization</span>
                <span className={`text-sm font-medium ${getScoreColor(result.assetOptimization)}`}>
                  {getScoreLabel(result.assetOptimization)}
                </span>
              </div>
              <Progress value={result.assetOptimization} className="h-2" />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-600">Green Hosting</span>
                <span className={`text-sm font-medium ${getScoreColor(result.greenHosting)}`}>
                  {getScoreLabel(result.greenHosting)}
                </span>
              </div>
              <Progress value={result.greenHosting} className="h-2" />
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-600 mr-2 h-5 w-5 flex-shrink-0" />
                <div>
                  <span className="text-green-800 font-medium">Potential Carbon Savings</span>
                  <p className="text-green-700 text-sm mt-1">
                    {result.carbonSaved}kg CO₂ per month with our recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {/* Recommendations */}
      <div className="mb-6">
        <h4 className="font-medium text-neutral-800 mb-3">Optimization Recommendations</h4>
        <ul className="space-y-2 mb-6">
          {result.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <AlertCircle className="text-primary-600 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
              <span className="text-neutral-700 text-sm">{recommendation}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button 
            onClick={onReset}
            variant="outline"
            className="flex-1"
          >
            Analyze Another Website
          </Button>
          <Button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white">
            View Detailed Report
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
