import { Router } from "express";
import { storage } from "../storage";

export const carbonEstimatorRouter = Router();

// Map of hosting providers to their carbon efficiency scores (0-100)
const HOSTING_PROVIDERS_SCORES = {
  "Green Hosting Co.": 95,
  "AWS": 70,
  "Google Cloud": 75,
  "Azure": 65,
  "Digital Ocean": 60,
  "Linode": 55,
  "GoDaddy": 40,
  "Other": 50
};

// Map of traffic levels to estimated carbon impact multipliers
const TRAFFIC_MULTIPLIERS = {
  "1-1,000 visitors": 1,
  "1,001-10,000 visitors": 2.5,
  "10,001-100,000 visitors": 5,
  "100,001+ visitors": 10
};

// Calculate carbon footprint
function calculateCarbonFootprint(hostingProvider: string, traffic: string, pageSize: number): number {
  const hostingScore = HOSTING_PROVIDERS_SCORES[hostingProvider] || HOSTING_PROVIDERS_SCORES.Other;
  const trafficMultiplier = TRAFFIC_MULTIPLIERS[traffic] || TRAFFIC_MULTIPLIERS["1-1,000 visitors"];
  
  // Basic formula: higher hosting score = lower carbon footprint
  // We calculate a base footprint from page size, then adjust by hosting and traffic
  const baseCarbonPerMB = 0.2; // kg CO2 per MB for an average webpage
  const hostingFactor = (100 - hostingScore) / 100; // Better hosting = lower factor
  
  return Math.round(pageSize * baseCarbonPerMB * hostingFactor * trafficMultiplier * 10) / 10;
}

// Calculate asset optimization scores and generate recommendations
function generateOptimizationScores(url: string, pageSize: number): { 
  serverEfficiency: number;
  assetOptimization: number;
  greenHosting: number;
  recommendations: string[];
} {
  // These would typically be calculated based on actual website analysis
  // For this implementation, we'll generate reasonable scores based on the URL and page size
  
  const urlHash = Array.from(url).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate somewhat random but deterministic scores based on URL
  const serverEfficiency = Math.min(100, Math.max(30, 60 + (urlHash % 40)));
  const assetOptimization = Math.min(100, Math.max(20, 50 + ((urlHash * 2) % 50)));
  const greenHosting = Math.min(100, Math.max(40, 70 + ((urlHash * 3) % 30)));
  
  // Generate appropriate recommendations based on scores
  const recommendations: string[] = [];
  
  if (serverEfficiency < 70) {
    recommendations.push("Enable HTTP/2 to reduce connection overhead");
    recommendations.push("Implement proper browser caching for static resources");
  }
  
  if (assetOptimization < 60) {
    recommendations.push("Compress and optimize images using WebP format");
    recommendations.push("Minify and bundle CSS and JavaScript files");
    recommendations.push("Remove unused CSS and JavaScript code");
  }
  
  if (greenHosting < 80) {
    recommendations.push("Consider switching to a green hosting provider that uses renewable energy");
    recommendations.push("Choose a data center location closer to your primary audience");
  }
  
  return {
    serverEfficiency,
    assetOptimization,
    greenHosting,
    recommendations
  };
}

// Analyze website (protected route)
carbonEstimatorRouter.post("/analyze", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const { url, hostingProvider, monthlyTraffic, pageSize = 2.5 } = req.body;
    
    if (!url || !hostingProvider || !monthlyTraffic) {
      return res.status(400).json({ message: "URL, hosting provider, and monthly traffic are required" });
    }
    
    // Calculate carbon footprint and generate recommendations
    const carbonFootprint = calculateCarbonFootprint(hostingProvider, monthlyTraffic, pageSize);
    const {
      serverEfficiency,
      assetOptimization,
      greenHosting,
      recommendations
    } = generateOptimizationScores(url, pageSize);
    
    // Calculate overall sustainability score (0-100)
    const sustainabilityScore = Math.round(
      (serverEfficiency * 0.3) + (assetOptimization * 0.4) + (greenHosting * 0.3)
    );
    
    // Check for existing project or create a new one
    let project = (await storage.getProjectsByUserId(req.user.id))
      .find(p => p.url.toLowerCase() === url.toLowerCase());
    
    if (project) {
      // Update existing project
      project = await storage.updateProject(project.id, {
        hostingProvider,
        monthlyTraffic,
        carbonFootprint,
        sustainabilityScore,
        status: "analyzed",
        updatedAt: new Date()
      });
    } else {
      // Create new project
      project = await storage.createProject({
        userId: req.user.id,
        name: new URL(url).hostname,
        url,
        hostingProvider,
        monthlyTraffic,
        description: `Website at ${url}`,
        carbonFootprint,
        sustainabilityScore,
        status: "analyzed"
      });
    }
    
    // Store optimizations
    const optimization = await storage.createOptimization({
      projectId: project.id,
      category: "analysis",
      score: sustainabilityScore,
      recommendations
    });
    
    // Return analysis results
    res.json({
      projectId: project.id,
      carbonFootprint,
      sustainabilityScore,
      serverEfficiency,
      assetOptimization,
      greenHosting,
      recommendations
    });
  } catch (error) {
    console.error("Carbon estimation error:", error);
    res.status(500).json({ message: "Failed to analyze website" });
  }
});

// Get project analysis (protected route)
carbonEstimatorRouter.get("/project/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const project = await storage.getProject(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Ensure user owns the project
    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: "You don't have access to this project" });
    }
    
    const optimizations = await storage.getOptimizationsByProjectId(projectId);
    const latestOptimization = optimizations.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
    
    res.json({
      project,
      optimizations: optimizations.length > 0 ? optimizations : null,
      latestOptimization: latestOptimization || null
    });
  } catch (error) {
    console.error("Project retrieval error:", error);
    res.status(500).json({ message: "Failed to retrieve project analysis" });
  }
});

// Get user projects (protected route)
carbonEstimatorRouter.get("/projects", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const projects = await storage.getProjectsByUserId(req.user.id);
    res.json(projects);
  } catch (error) {
    console.error("Projects retrieval error:", error);
    res.status(500).json({ message: "Failed to retrieve projects" });
  }
});
