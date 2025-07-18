import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { INewsArticle, INewsAnalysis } from '../types';

export class AIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = config.apiKeys.gemini;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeNewsArticles(articles: INewsArticle[], stockSymbol: string): Promise<INewsAnalysis> {
    try {
      // Use a more advanced model and explicitly request JSON output
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const articlesText = articles.map(article =>
        `Title: ${article.title}\nDescription: ${article.description || 'No description'}\nSource: ${article.source}`
      ).join('\n---\n');

      const prompt = `
        Please analyze the following news articles for the stock symbol "${stockSymbol}".
        Provide a concise summary, the overall sentiment, key points that could impact the stock, and the potential impact.

        **News Articles:**
        ${articlesText}

        **Instructions:**
        Respond with a single JSON object that strictly follows this format:
        {
          "summary": "A brief summary of the key news and events.",
          "sentiment": "positive" | "negative" | "neutral",
          "keyPoints": [
            "Key takeaway or finding 1",
            "Key takeaway or finding 2"
          ],
          "potentialImpact": "A brief assessment of the potential impact on the stock's price."
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // The response should be a valid JSON string now
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error analyzing news articles with AI:', error);
      throw new Error('Failed to analyze news articles with AI');
    }
  }
}
