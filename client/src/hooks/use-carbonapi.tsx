import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type CarbonAnalysisParams = {
  url: string;
  hostingProvider: string;
  monthlyTraffic: string;
  pageSize?: number;
};

export type CarbonAnalysisResult = {
  projectId: number;
  carbonFootprint: number;
  sustainabilityScore: number;
  serverEfficiency: number;
  assetOptimization: number;
  greenHosting: number;
  recommendations: string[];
};

export type Project = {
  id: number;
  name: string;
  url: string;
  hostingProvider: string;
  monthlyTraffic: string;
  description?: string;
  carbonFootprint?: number;
  sustainabilityScore?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function useCarbonAnalysis() {
  const { toast } = useToast();

  const analyzeWebsiteMutation = useMutation({
    mutationFn: async (params: CarbonAnalysisParams) => {
      const res = await apiRequest("POST", "/api/carbon/analyze", params);
      return await res.json() as CarbonAnalysisResult;
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Your website's carbon footprint has been analyzed successfully.",
      });
      // Invalidate project list cache
      queryClient.invalidateQueries({ queryKey: ["/api/carbon/projects"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze website. Please try again.",
        variant: "destructive",
      });
    },
  });

  const useProjects = () => {
    return useQuery<Project[], Error>({
      queryKey: ["/api/carbon/projects"],
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        return await res.json();
      },
    });
  };

  const useProjectDetails = (projectId: number | null) => {
    return useQuery<any, Error>({
      queryKey: ["/api/carbon/project", projectId],
      queryFn: async ({ queryKey }) => {
        if (!projectId) return null;
        const res = await fetch(`${queryKey[0]}/${projectId}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch project details");
        }
        return await res.json();
      },
      enabled: !!projectId,
    });
  };

  return {
    analyzeWebsiteMutation,
    useProjects,
    useProjectDetails,
  };
}
