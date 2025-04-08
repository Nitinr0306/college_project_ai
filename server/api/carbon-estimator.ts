import { Router } from "express";
import { storage } from "../storage";
import { analyzeWebsiteSustainability } from "../utils/openai";
import { z } from "zod";

export const carbonEstimatorRouter = Router();

// Analyze website and estimate carbon footprint
carbonEstimatorRouter.post("/api/carbon-estimator/analyze", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in to use this feature" });
  }

  // Validate request body
  const schema = z.object({
    url: z.string().url(),
    hostingProvider: z.string(),
    monthlyTraffic: z.string(),
    pageSize: z.number().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
  });

  try {
    const validatedData = schema.parse(req.body);
    
    try {
      // Use OpenAI to analyze the website
      const analysis = await analyzeWebsiteSustainability(
        validatedData.url,
        validatedData.hostingProvider,
        validatedData.monthlyTraffic
      );
      
      // Create a project record with the analysis results
      const project = await storage.createProject({
        userId: req.user.id,
        name: validatedData.name || `Analysis of ${validatedData.url}`,
        url: validatedData.url,
        hostingProvider: validatedData.hostingProvider,
        monthlyTraffic: validatedData.monthlyTraffic,
        description: validatedData.description || "",
        carbonFootprint: analysis.carbonFootprint || 0,
        sustainabilityScore: analysis.sustainabilityScore || 0,
        serverEfficiency: analysis.serverEfficiency || 0,
        assetOptimization: analysis.assetOptimization || 0,
        carbonSaved: analysis.carbonSaved || 0,
        status: "completed",
      });
      
      // Store optimization recommendations
      if (analysis.recommendations && Array.isArray(analysis.recommendations)) {
        for (const recommendation of analysis.recommendations) {
          await storage.createOptimization({
            projectId: project.id,
            title: typeof recommendation === 'string' ? recommendation : 'Optimization suggestion',
            description: typeof recommendation === 'string' ? recommendation : JSON.stringify(recommendation),
            impact: "medium",
            status: "pending",
          });
        }
      }
      
      // Check for badges
      await checkForBadges(req.user.id, project.id, analysis);
      
      // Return the results
      res.json({
        projectId: project.id,
        carbonFootprint: analysis.carbonFootprint || 0,
        sustainabilityScore: analysis.sustainabilityScore || 0,
        serverEfficiency: analysis.serverEfficiency || 0,
        assetOptimization: analysis.assetOptimization || 0,
        greenHosting: analysis.greenHosting || 0,
        carbonSaved: analysis.carbonSaved || 0,
        recommendations: analysis.recommendations || [],
      });
    } catch (error) {
      console.error("Error analyzing website:", error);
      res.status(500).json({ error: "Failed to analyze website" });
    }
  } catch (error) {
    console.error("Invalid request data:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

// Get projects for the current user
carbonEstimatorRouter.get("/api/carbon-estimator/projects", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in to view your projects" });
  }

  try {
    const projects = await storage.getProjectsByUserId(req.user.id);
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Get a specific project with optimizations
carbonEstimatorRouter.get("/api/carbon-estimator/projects/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in to view project details" });
  }

  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await storage.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: "You do not have permission to view this project" });
    }

    const optimizations = await storage.getOptimizationsByProjectId(projectId);
    
    res.json({
      project,
      optimizations,
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "Failed to fetch project details" });
  }
});

// Helper function to check and assign badges based on analysis results
async function checkForBadges(userId: number, projectId: number, analysis: any) {
  try {
    // List of badge criteria to check
    const badgeCriteria = [
      {
        name: "Carbon Conscious",
        condition: analysis.carbonFootprint < 1.0,
        description: "Achieved a carbon footprint less than 1.0g CO2e per page view",
      },
      {
        name: "Sustainability Star",
        condition: analysis.sustainabilityScore >= 80,
        description: "Achieved a sustainability score of 80 or higher",
      },
      {
        name: "Green Hosting Champion",
        condition: analysis.greenHosting >= 90,
        description: "Uses eco-friendly hosting with a score of 90 or higher",
      },
      {
        name: "Asset Optimization Expert",
        condition: analysis.assetOptimization >= 85,
        description: "Achieved an asset optimization score of 85 or higher",
      },
    ];
    
    // Check each badge criterion
    for (const criterion of badgeCriteria) {
      if (criterion.condition) {
        // Check if badge exists
        const allBadges = await storage.getAllBadges();
        let badge = allBadges.find(b => b.name === criterion.name);
        
        // Create badge if it doesn't exist
        if (!badge) {
          badge = await storage.createBadge({
            name: criterion.name,
            description: criterion.description,
            icon: criterion.name.toLowerCase().replace(/\s+/g, "-"),
            category: "sustainability",
            points: 100,
          });
        }
        
        // Assign badge to user
        await storage.assignBadgeToUser({
          userId,
          badgeId: badge.id,
          achievedAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error checking for badges:", error);
  }
}