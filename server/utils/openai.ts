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
  } catch (error) {
    console.error("Error generating sustainability insights:", error);
    throw new Error("Failed to generate insights. Please try again later.");
  }
}

export async function analyzeWebsiteSustainability(
  url: string, 
  hostingProvider: string, 
  monthlyTraffic: string
): Promise<any> {
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
  } catch (error) {
    console.error("Error analyzing website sustainability:", error);
    throw new Error("Failed to analyze website. Please try again later.");
  }
}