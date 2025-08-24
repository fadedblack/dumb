import { GoogleGenerativeAI } from "@google/generative-ai";
import { Config } from "./model.ts";

export const callGeminiAPI = async (
  prompt: string,
  config: Config,
  GeminiClient: typeof GoogleGenerativeAI,
): Promise<string> => {
  const genAI = new GeminiClient(config.api_key);
  const model = genAI.getGenerativeModel(config);
  const result = await model.generateContent(prompt);
  return result?.response?.text() ?? "";
};

export const interpretPrompt = async (
  prompt: string,
  GeminiClient: typeof GoogleGenerativeAI,
  getConfig: () => Config,
): Promise<string> => {
  return await callGeminiAPI(prompt, getConfig(), GeminiClient);
};
