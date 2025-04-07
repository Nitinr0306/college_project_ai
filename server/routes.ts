import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { carbonEstimatorRouter } from "./api/carbon-estimator";
import { gamificationRouter } from "./api/gamification";
import { chatbotRouter } from "./api/chatbot";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API Routes
  app.use("/api/carbon", carbonEstimatorRouter);
  app.use("/api/gamification", gamificationRouter);
  app.use("/api/chatbot", chatbotRouter);
  
  // User profile update
  app.patch("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { name, email, profilePicture } = req.body;
      
      // Only allow updating certain fields
      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (profilePicture) updates.profilePicture = profilePicture;
      
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      const updatedUser = await storage.updateUser(req.user.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create a sanitized user object without the password
      const userWithoutPassword = {
        ...updatedUser,
        password: undefined
      };
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
