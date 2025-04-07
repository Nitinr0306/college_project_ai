import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";
import CarbonEstimatorForm from "../carbon-estimator/carbon-estimator-form";
import CarbonEstimatorResults from "../carbon-estimator/carbon-estimator-results";
import { useCarbonAnalysis, CarbonAnalysisResult } from "@/hooks/use-carbonapi";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function CarbonEstimatorSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { analyzeWebsiteMutation } = useCarbonAnalysis();
  const [analysisResult, setAnalysisResult] = useState<CarbonAnalysisResult | null>(null);

  const handleAnalyze = async (formData: { 
    url: string; 
    hostingProvider: string; 
    monthlyTraffic: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the Carbon Estimator",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await analyzeWebsiteMutation.mutateAsync({
        url: formData.url,
        hostingProvider: formData.hostingProvider,
        monthlyTraffic: formData.monthlyTraffic,
      });
      
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  return (
    <section id="estimator" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">Carbon Footprint Estimator</h2>
            <p className="text-lg text-neutral-600 mb-6">
              Our advanced AI algorithm analyzes your website's infrastructure and provides actionable insights to reduce your carbon emissions.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <CheckCircle className="text-primary-600 mr-3 mt-1 h-5 w-5" />
                <span className="text-neutral-700">Hosting impact analysis based on provider's green credentials</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-primary-600 mr-3 mt-1 h-5 w-5" />
                <span className="text-neutral-700">Resource optimization recommendations for CSS, JS, and images</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-primary-600 mr-3 mt-1 h-5 w-5" />
                <span className="text-neutral-700">Traffic-based emissions calculations with optimization strategies</span>
              </li>
            </ul>
            {user ? (
              <Link href="/carbon-estimator">
                <Button className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transform hover:translate-y-[-2px] transition-all">
                  Try It Now
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transform hover:translate-y-[-2px] transition-all">
                  Sign In to Try
                </Button>
              </Link>
            )}
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white p-8 rounded-xl shadow-md">
              {analysisResult ? (
                <CarbonEstimatorResults result={analysisResult} onReset={() => setAnalysisResult(null)} />
              ) : (
                <CarbonEstimatorForm onAnalyze={handleAnalyze} isLoading={analyzeWebsiteMutation.isPending} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
