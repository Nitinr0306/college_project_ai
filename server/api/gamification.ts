import { Router } from "express";
import { storage } from "../storage";
import { insertUserBadgeSchema, Project, User } from "@shared/schema";

export const gamificationRouter = Router();

// Get all badges
gamificationRouter.get("/badges", async (req, res) => {
  try {
    const badges = await storage.getAllBadges();
    res.json(badges);
  } catch (error) {
    console.error("Error retrieving badges:", error);
    res.status(500).json({ message: "Failed to retrieve badges" });
  }
});

// Get user badges
gamificationRouter.get("/user-badges", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const badges = await storage.getUserBadges(req.user.id);
    res.json(badges);
  } catch (error) {
    console.error("Error retrieving user badges:", error);
    res.status(500).json({ message: "Failed to retrieve user badges" });
  }
});

// Get user stats (badges, points, etc.)
gamificationRouter.get("/user-stats", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Get user badges
    const badges = await storage.getUserBadges(req.user.id);
    
    // Get user projects
    const projects = await storage.getProjectsByUserId(req.user.id);
    
    // Calculate total points (sum of badge points)
    const totalPoints = badges.reduce((sum, badge) => sum + badge.points, 0);
    
    // Calculate sustainability score (average of project scores)
    let sustainabilityScore = 0;
    if (projects.length > 0) {
      const totalScore = projects.reduce((sum, project) => {
        return sum + (project.sustainabilityScore || 0);
      }, 0);
      sustainabilityScore = totalScore / projects.length;
    }
    
    // Calculate total carbon saved
    const totalCarbonSaved = projects.reduce((sum, project) => {
      // If project has a carbon footprint reduction recorded
      return sum + (project.carbonSaved || 0);
    }, 0);
    
    // Get the most recent projects (up to 5)
    const recentProjects = projects
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    res.json({
      userId: req.user.id,
      badgeCount: badges.length,
      projectCount: projects.length,
      totalCarbonSaved,
      totalPoints,
      sustainabilityScore,
      badges,
      recentProjects
    });
  } catch (error) {
    console.error("Error retrieving user stats:", error);
    res.status(500).json({ message: "Failed to retrieve user statistics" });
  }
});

// Get leaderboard
gamificationRouter.get("/leaderboard", async (req, res) => {
  try {
    // This is a simplified implementation
    // In a real app, you'd need a more efficient query that joins tables
    
    // Get all users
    const users = await storage.getAllUsers();
    
    // For each user, get their stats
    const leaderboardPromises = users.map(async (user: User) => {
      // Get user badges
      const badges = await storage.getUserBadges(user.id);
      
      // Get user projects
      const projects = await storage.getProjectsByUserId(user.id);
      
      // Calculate total points
      const totalPoints = badges.reduce((sum, badge) => sum + badge.points, 0);
      
      // Calculate average sustainability score
      let sustainabilityScore = 0;
      if (projects.length > 0) {
        const totalScore = projects.reduce((sum, project) => {
          return sum + (project.sustainabilityScore || 0);
        }, 0);
        sustainabilityScore = totalScore / projects.length;
      }
      
      return {
        userId: user.id,
        username: user.username,
        name: user.name,
        badgeCount: badges.length,
        points: totalPoints,
        projectCount: projects.length,
        sustainabilityScore
      };
    });
    
    const leaderboard = await Promise.all(leaderboardPromises);
    
    // Sort by points (descending)
    leaderboard.sort((a: any, b: any) => b.points - a.points);
    
    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard retrieval error:", error);
    res.status(500).json({ message: "Failed to retrieve leaderboard" });
  }
});

// Check and assign badges for a project
gamificationRouter.post("/check-badges", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const { projectId } = req.body;
  
  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }
  
  try {
    // Get the project
    const project = await storage.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Check if the project belongs to the current user
    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: "You don't have permission to access this project" });
    }
    
    // Check and assign badges
    const newBadges = await checkAndAssignBadges(req.user.id, project);
    
    res.json({
      success: true,
      newBadges,
      message: newBadges.length > 0 
        ? `You've earned ${newBadges.length} new badges!` 
        : "No new badges earned"
    });
  } catch (error) {
    console.error("Error checking badges:", error);
    res.status(500).json({ message: "Failed to check for badges" });
  }
});

// Helper function to check and assign badges
async function checkAndAssignBadges(userId: number, project: Project) {
  // Get existing user badges
  const existingBadges = await storage.getUserBadges(userId);
  const existingBadgeIds = existingBadges.map(badge => badge.id);
  
  // Get all available badges
  const allBadges = await storage.getAllBadges();
  
  // Get user projects
  const userProjects = await storage.getProjectsByUserId(userId);
  
  const newBadges = [];
  
  // Check each badge criteria
  for (const badge of allBadges) {
    // Skip if user already has this badge
    if (existingBadgeIds.includes(badge.id)) {
      continue;
    }
    
    let shouldAward = false;
    
    // Check badge criteria based on category
    switch (badge.name.toLowerCase()) {
      case "carbon-reducer":
        // Award if project has good carbon score
        shouldAward = project.sustainabilityScore >= 70;
        break;
        
      case "sustainability-pioneer":
        // First project analyzed
        shouldAward = userProjects.length === 1;
        break;
        
      case "eco-friendly-developer":
        // At least 3 projects analyzed
        shouldAward = userProjects.length >= 3;
        break;
        
      case "green-host-pioneer":
        // Project using green hosting
        shouldAward = project.hostingProvider?.toLowerCase().includes("green");
        break;
        
      case "speed-optimizer":
        // High server efficiency
        shouldAward = project.serverEfficiency >= 85;
        break;
        
      case "asset-optimization-expert":
        // High asset optimization
        shouldAward = project.assetOptimization >= 80;
        break;
        
      case "carbon-conscious":
        // 5 or more projects analyzed
        shouldAward = userProjects.length >= 5;
        break;
        
      case "sustainability-star":
        // Average sustainability score across all projects >= 75
        const avgScore = userProjects.reduce((sum, p) => 
          sum + (p.sustainabilityScore || 0), 0) / userProjects.length;
        shouldAward = avgScore >= 75 && userProjects.length >= 3;
        break;
        
      default:
        // No specific criteria, don't award
        shouldAward = false;
    }
    
    if (shouldAward) {
      // Create user badge
      const userBadge = {
        userId,
        badgeId: badge.id,
      };
      
      // Validate and assign badge
      try {
        const validatedUserBadge = insertUserBadgeSchema.parse(userBadge);
        await storage.assignBadgeToUser(validatedUserBadge);
        newBadges.push(badge);
      } catch (error) {
        console.error(`Failed to assign badge ${badge.id} to user ${userId}:`, error);
      }
    }
  }
  
  return newBadges;
}