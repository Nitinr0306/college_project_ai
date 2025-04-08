import { Router } from "express";
import { storage } from "../storage";
import { generateSustainabilityInsights } from "../utils/openai";

export const chatbotRouter = Router();

// Get chat history for a user
chatbotRouter.get("/messages", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in to access chat history" });
  }

  try {
    const messages = await storage.getChatMessagesByUserId(req.user.id);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

// Send a message and get a response
chatbotRouter.post("/messages", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in to use the chatbot" });
  }

  const { content } = req.body;
  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    // Store user message
    const userMessage = await storage.createChatMessage({
      userId: req.user.id,
      content,
      role: "user",
    });

    // Generate AI response
    let aiResponse;
    try {
      const sustainabilityInsights = await generateSustainabilityInsights(content);
      
      // Format the response for storage and display
      const formattedResponse = formatChatbotResponse(sustainabilityInsights);
      
      // Store AI response
      aiResponse = await storage.createChatMessage({
        userId: req.user.id,
        content: formattedResponse,
        role: "assistant",
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Fallback response if OpenAI fails
      const fallbackContent = "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
      
      aiResponse = await storage.createChatMessage({
        userId: req.user.id,
        content: fallbackContent,
        role: "assistant",
      });
    }

    res.json({
      userMessage,
      aiResponse,
    });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    res.status(500).json({ error: "An error occurred processing your message" });
  }
});

// Get a random sustainability tip
chatbotRouter.get("/tip", async (req, res) => {
  try {
    // Array of sustainability tips
    const tips = [
      "Use system fonts instead of custom web fonts to reduce page weight and carbon emissions.",
      "Optimize your images before uploading them to reduce file size and bandwidth usage.",
      "Consider using dark mode to reduce energy consumption on OLED displays.",
      "Implement lazy loading for images and videos to reduce initial page load size.",
      "Choose a green web hosting provider that uses renewable energy for their data centers.",
      "Use CSS instead of JavaScript for animations when possible to reduce CPU usage.",
      "Minify your CSS, JavaScript, and HTML files to reduce file sizes.",
      "Implement proper caching strategies to reduce repeat downloads and server requests.",
      "Consider a static site if your content doesn't need to be dynamic.",
      "Regularly audit your website's performance and make optimizations."
    ];
    
    // Return a random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    res.json({ tip: randomTip });
  } catch (error) {
    console.error("Error getting sustainability tip:", error);
    res.status(500).json({ error: "Failed to get sustainability tip" });
  }
});

// Helper function to format the chatbot response
function formatChatbotResponse(response: any): string {
  let formattedResponse = response.insights + "\n\n";
  
  if (response.recommendations && response.recommendations.length > 0) {
    formattedResponse += "Recommendations:\n";
    response.recommendations.forEach((rec: string, index: number) => {
      formattedResponse += `${index + 1}. ${rec}\n`;
    });
    formattedResponse += "\n";
  }
  
  if (response.additional_resources && response.additional_resources.length > 0) {
    formattedResponse += "Additional Resources:\n";
    response.additional_resources.forEach((resource: { title: string; url: string }) => {
      formattedResponse += `- ${resource.title}: ${resource.url}\n`;
    });
  }
  
  return formattedResponse;
}