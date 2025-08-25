import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "@openai/openai";
import { Config, SupportedModels } from "./model.ts";

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

export const callOpenAIAPI = async (
  prompt: string,
  config: Config,
    OpenAIClient: typeof OpenAI,
): Promise<string> => {
  return Promise.resolve("true");
};

export const interpretPrompt = async (
  prompt: string,
  getConfig: () => Config,
  supportedModels: SupportedModels
): Promise<string> => {
  const config = getConfig();
  const modelName = config.model_name;
  const modelFn = supportedModels[modelName];

  if (!modelFn) {
    throw new Error(`Model '${modelName}' is not supported.`);
  }

  return modelFn(prompt, config);
};
