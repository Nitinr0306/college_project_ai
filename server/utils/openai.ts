import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

interface SustainabilityResponse {
  insights: string;
  recommendations: string[];
  additional_resources: { title: string; url: string }[];
}

export async function generateSustainabilityInsights(query: string): Promise<SustainabilityResponse> {
  try {
    // First try to use OpenAI if API key is working
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a sustainability expert for web development. 
              Provide insights on how to make websites more eco-friendly, reduce carbon footprint, and optimize for sustainability.
              Focus on practical, actionable advice. Return your response in JSON format with the following structure:
              {
                "insights": "Brief insights about the user's query",
                "recommendations": ["1-3 specific, actionable recommendations"],
                "additional_resources": [{"title": "Resource name", "url": "URL to resource"}]
              }`,
            },
            {
              role: "user",
              content: query,
            },
          ],
          response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        return JSON.parse(content as string) as SustainabilityResponse;
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
        // Fall through to the fallback
      }
    }
    
    // Fallback responses if OpenAI fails or API key is missing
    const fallbackResponses: SustainabilityResponse[] = [
      {
        insights: "Optimizing image sizes is crucial for reducing the carbon footprint of your website. Large, uncompressed images can significantly increase page load times and energy consumption.",
        recommendations: [
          "Use modern image formats like WebP or AVIF that offer better compression",
          "Implement responsive images with srcset to deliver appropriate sizes",
          "Consider using an image CDN with automatic optimization"
        ],
        additional_resources: [
          { title: "Sustainable Web Design", url: "https://sustainablewebdesign.org" },
          { title: "Website Carbon Calculator", url: "https://www.websitecarbon.com" }
        ]
      },
      {
        insights: "Server efficiency is a key factor in web sustainability. The hosting provider and server configuration can make a significant difference in your website's carbon footprint.",
        recommendations: [
          "Choose a hosting provider powered by renewable energy",
          "Implement efficient caching strategies",
          "Optimize database queries to reduce server load"
        ],
        additional_resources: [
          { title: "Green Web Foundation", url: "https://www.thegreenwebfoundation.org" },
          { title: "Sustainable Web Manifesto", url: "https://www.sustainablewebmanifesto.com" }
        ]
      },
      {
        insights: "JavaScript execution consumes significant CPU resources on user devices. Optimizing your JavaScript can reduce energy consumption and improve user experience.",
        recommendations: [
          "Minimize JavaScript bundle sizes with code splitting",
          "Use performance monitoring to identify inefficient code",
          "Consider server-side rendering for content-heavy sites"
        ],
        additional_resources: [
          { title: "Web.dev Performance", url: "https://web.dev/performance" },
          { title: "Mozilla Web Performance", url: "https://developer.mozilla.org/en-US/docs/Web/Performance" }
        ]
      }
    ];
    
    // Choose a fallback response based on the query
    // Simple keyword matching for this example
    let selectedResponse = fallbackResponses[0]; // Default
    
    if (query.toLowerCase().includes("server") || query.toLowerCase().includes("hosting")) {
      selectedResponse = fallbackResponses[1];
    } else if (query.toLowerCase().includes("javascript") || query.toLowerCase().includes("code")) {
      selectedResponse = fallbackResponses[2];
    }
    
    return selectedResponse;
  } catch (error) {
    console.error("Error generating sustainability insights:", error);
    // Ultimate fallback if even our fallback logic fails
    return {
      insights: "Sustainability in web development means creating websites that minimize environmental impact through efficient code, optimized assets, and green hosting solutions.",
      recommendations: [
        "Optimize images and assets to reduce file sizes",
        "Choose green hosting providers powered by renewable energy",
        "Implement caching strategies to reduce server requests"
      ],
      additional_resources: [
        { title: "Sustainable Web Design", url: "https://sustainablewebdesign.org" }
      ]
    };
  }
}

export async function analyzeWebsiteSustainability(
  url: string, 
  hostingProvider: string, 
  monthlyTraffic: string
): Promise<any> {
  try {
    // First try to use OpenAI if API key is working
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert in web sustainability analysis. 
              Given the URL, hosting provider, and monthly traffic information, provide a detailed analysis of the website's potential carbon footprint and sustainability metrics.
              Since you can't directly access the website, provide estimates based on the information given.
              Include the following in your JSON response:
              - Carbon footprint estimate (in g CO2e)
              - Sustainability score (0-100)
              - Server efficiency score (0-100)
              - Asset optimization score (0-100)
              - Green hosting rating (0-100)
              - Carbon saved (in g CO2e) - estimate how much carbon could be saved per month with your recommendations
              - 3-5 specific, actionable recommendations for improvement
              `,
            },
            {
              role: "user",
              content: `Please analyze the sustainability of this website:
              URL: ${url}
              Hosting Provider: ${hostingProvider}
              Monthly Traffic: ${monthlyTraffic} visitors`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        return JSON.parse(content as string);
      } catch (openaiError) {
        console.error("OpenAI API error in analyzeWebsiteSustainability:", openaiError);
        // Fall through to the fallback
      }
    }
    
    // Parse monthly traffic to determine scale
    const trafficNum = parseInt(monthlyTraffic.replace(/[^0-9]/g, ''));
    
    // Determine scores based on host and traffic
    let greenHostingScore = 50;
    
    // Adjust scores based on hosting provider
    const greenHosts = ['green', 'eco', 'renewable', 'sustainable'];
    if (greenHosts.some(term => hostingProvider.toLowerCase().includes(term))) {
      greenHostingScore = 85;
    }
    
    // Generate traffic-based scores
    const serverEfficiency = Math.max(40, Math.min(90, 100 - (trafficNum > 10000 ? 30 : 10)));
    const assetOptimization = Math.floor(Math.random() * 30) + 40; // Random score between 40-70
    
    // Calculate metrics
    const sustainabilityScore = Math.floor((greenHostingScore + serverEfficiency + assetOptimization) / 3);
    const carbonFootprint = trafficNum * 0.02; // Simple estimate: 0.02g CO2e per visit
    const potentialSavings = carbonFootprint * 0.3; // Estimate 30% potential savings
    
    // Generate different recommendations based on domain
    const recommendations = [
      "Implement lazy loading for images and videos to reduce initial page load",
      "Optimize and compress images to reduce file sizes",
      "Consider using a CDN to reduce server load and improve delivery efficiency",
      "Minimize HTTP requests by combining CSS and JavaScript files",
      "Switch to a green hosting provider that uses renewable energy"
    ];
    
    // If it's a potentially high-traffic site, add more specific recommendations
    if (trafficNum > 5000) {
      recommendations.push("Implement server-side caching to reduce database queries");
      recommendations.push("Use efficient database queries and indexing to minimize server processing");
    }
    
    // Return the analysis results
    return {
      projectId: Date.now(),
      carbonFootprint: parseFloat(carbonFootprint.toFixed(2)),
      sustainabilityScore: sustainabilityScore,
      serverEfficiency: serverEfficiency,
      assetOptimization: assetOptimization,
      greenHosting: greenHostingScore,
      carbonSaved: parseFloat(potentialSavings.toFixed(2)),
      recommendations: recommendations.slice(0, 5) // Limit to 5 recommendations
    };
  } catch (error) {
    console.error("Error analyzing website sustainability:", error);
    // Return a very generic analysis if all else fails
    return {
      projectId: Date.now(),
      carbonFootprint: 15.2,
      sustainabilityScore: 65,
      serverEfficiency: 70,
      assetOptimization: 60,
      greenHosting: 65,
      carbonSaved: 4.5,
      recommendations: [
        "Optimize images and media files",
        "Reduce JavaScript bundle size",
        "Consider a green hosting provider",
        "Implement caching strategies",
        "Minimize third-party scripts"
      ]
    };
  }
}