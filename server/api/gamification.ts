import { Router } from "express";
import { storage } from "../storage";

export const gamificationRouter = Router();

// Helper function to check if a user should earn a badge
async function checkAndAssignBadges(userId: number, projectId: number) {
  try {
    // Get user's projects
    const projects = await storage.getProjectsByUserId(userId);
    if (projects.length === 0) return [];
    
    // Get all badges
    const allBadges = await storage.getAllBadges();
    // Get user's existing badges
    const userBadges = await storage.getUserBadges(userId);
    const userBadgeIds = userBadges.map(badge => badge.id);
    
    // Get the project that was just analyzed/updated
    const currentProject = projects.find(p => p.id === projectId);
    if (!currentProject) return [];
    
    const earnedBadges = [];

    // Check for Green Host Pioneer badge
    const greenHostBadge = allBadges.find(b => b.name === "Green Host Pioneer");
    if (greenHostBadge && !userBadgeIds.includes(greenHostBadge.id)) {
      if (currentProject.hostingProvider === "Green Hosting Co.") {
        await storage.assignBadgeToUser({
          userId,
          badgeId: greenHostBadge.id
        });
        earnedBadges.push(greenHostBadge);
      }
    }
    
    // Check for Carbon Reducer badge
    const carbonReducerBadge = allBadges.find(b => b.name === "Carbon Reducer");
    if (carbonReducerBadge && !userBadgeIds.includes(carbonReducerBadge.id)) {
      // Check if any project has a sustainability score >= 80
      if (currentProject.sustainabilityScore >= 80) {
        await storage.assignBadgeToUser({
          userId,
          badgeId: carbonReducerBadge.id
        });
        earnedBadges.push(carbonReducerBadge);
      }
    }
    
    // Get project optimizations
    const optimizations = await storage.getOptimizationsByProjectId(projectId);
    if (optimizations.length > 0) {
      // Find the latest optimization
      const latestOptimization = optimizations.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      )[0];
      
      // Check for Speed Optimizer badge
      const speedBadge = allBadges.find(b => b.name === "Speed Optimizer");
      if (speedBadge && !userBadgeIds.includes(speedBadge.id)) {
        if (latestOptimization.recommendations && 
            latestOptimization.score >= 75) {
          await storage.assignBadgeToUser({
            userId,
            badgeId: speedBadge.id
          });
          earnedBadges.push(speedBadge);
        }
      }
      
      // Check for other badges based on specific optimizations
      // This would typically involve analyzing the optimization recommendations
      // and assigning badges based on specific improvements
    }
    
    return earnedBadges;
  } catch (error) {
    console.error("Error checking badges:", error);
    return [];
  }
}

// Get user badges (protected route)
gamificationRouter.get("/badges", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const badges = await storage.getUserBadges(req.user.id);
    res.json(badges);
  } catch (error) {
    console.error("Badges retrieval error:", error);
    res.status(500).json({ message: "Failed to retrieve badges" });
  }
});

// Get all available badges (protected route)
gamificationRouter.get("/badges/all", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const badges = await storage.getAllBadges();
    res.json(badges);
  } catch (error) {
    console.error("Badges retrieval error:", error);
    res.status(500).json({ message: "Failed to retrieve badges" });
  }
});

// Check for badges after project analysis (protected route)
gamificationRouter.post("/check-badges", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    
    const project = await storage.getProject(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Ensure user owns the project
    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: "You don't have access to this project" });
    }
    
    // Check for new badges
    const newBadges = await checkAndAssignBadges(req.user.id, projectId);
    
    // Get all user badges
    const allUserBadges = await storage.getUserBadges(req.user.id);
    
    res.json({
      badges: allUserBadges,
      newBadges: newBadges.length > 0 ? newBadges : [],
      hasNewBadges: newBadges.length > 0
    });
  } catch (error) {
    console.error("Badge check error:", error);
    res.status(500).json({ message: "Failed to check for badges" });
  }
});

// Get leaderboard (protected route)
gamificationRouter.get("/leaderboard", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    // In a real implementation, this would query the database to get users
    // with the most badges or highest total points
    // For now, we'll create a mock leaderboard
    
    // Get all users (for a real implementation, limit this and add pagination)
    const allUsers = Array.from((storage as any).users.values());
    
    const leaderboard = await Promise.all(
      allUsers.map(async (user) => {
        const userBadges = await storage.getUserBadges(user.id);
        
        // Calculate total points from badges
        let totalPoints = 0;
        for (const badge of userBadges) {
          totalPoints += badge.points || 0;
        }
        
        // Get user's projects
        const projects = await storage.getProjectsByUserId(user.id);
        
        // Calculate average sustainability score
        const totalSustainabilityScore = projects.reduce(
          (sum, project) => sum + (project.sustainabilityScore || 0), 0
        );
        const avgSustainabilityScore = projects.length > 0 
          ? Math.round(totalSustainabilityScore / projects.length) 
          : 0;
        
        return {
          userId: user.id,
          username: user.username,
          name: user.name,
          badgeCount: userBadges.length,
          points: totalPoints,
          projectCount: projects.length,
          sustainabilityScore: avgSustainabilityScore
        };
      })
    );
    
    // Sort by points (descending)
    leaderboard.sort((a, b) => b.points - a.points);
    
    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard retrieval error:", error);
    res.status(500).json({ message: "Failed to retrieve leaderboard" });
  }
});

// Get user stats (protected route)
gamificationRouter.get("/stats", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    const userId = req.user.id;
    
    // Get user's badges
    const badges = await storage.getUserBadges(userId);
    
    // Get user's projects
    const projects = await storage.getProjectsByUserId(userId);
    
    // Calculate total carbon saved
    const totalCarbonSaved = projects.reduce((sum, project) => {
      // Estimate carbon saved based on sustainability score
      // Higher score = more carbon saved
      const carbonSaved = project.sustainabilityScore
        ? (project.sustainabilityScore / 100) * 20 // 20kg is max possible savings per project
        : 0;
      return sum + carbonSaved;
    }, 0);
    
    // Calculate total points from badges
    const totalPoints = badges.reduce((sum, badge) => sum + (badge.points || 0), 0);
    
    // Calculate average sustainability score
    const totalSustainabilityScore = projects.reduce(
      (sum, project) => sum + (project.sustainabilityScore || 0), 0
    );
    const avgSustainabilityScore = projects.length > 0 
      ? Math.round(totalSustainabilityScore / projects.length) 
      : 0;
    
    res.json({
      userId,
      badgeCount: badges.length,
      projectCount: projects.length,
      totalCarbonSaved: Math.round(totalCarbonSaved * 10) / 10, // Round to 1 decimal place
      totalPoints,
      sustainabilityScore: avgSustainabilityScore,
      badges,
      recentProjects: projects
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 3) // Get 3 most recent projects
    });
  } catch (error) {
    console.error("Stats retrieval error:", error);
    res.status(500).json({ message: "Failed to retrieve user stats" });
  }
});
