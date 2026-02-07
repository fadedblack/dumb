import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "@openai/openai";
import { Config, SupportedModels } from "./model.ts";

export const callGeminiAPI = async (
  prompt: string,
  config: Config,
  GeminiClient: typeof GoogleGenerativeAI = GoogleGenerativeAI,
): Promise<string> => {
  const genAI = new GeminiClient(config.api_key);
  const model = genAI.getGenerativeModel(config);
  const result = await model.generateContentStream(prompt);

  let streamedText = "";

  for await (const chunk of result.stream) {
    const text = chunk.text();
    streamedText += text;
  }

  if (streamedText) {
    return streamedText;
  }

  const response = await result.response;
  return response?.text() ?? "";
};

export const callOpenAIAPI = async (
  prompt: string,
  config: Config,
  OpenAIClient: typeof OpenAI = OpenAI,
): Promise<string> => {
  const client = new OpenAIClient({
    apiKey: config.api_key,
  });
  const response = await client.responses.create({
    model: config.model,
    input: prompt,
  });
  return response?.output_text ?? "";
};

export const interpretPrompt = (
  prompt: string,
  getConfig: () => Config,
  supportedModels: SupportedModels,
): Promise<string> => {
  const config = getConfig();
  const modelName = config.model_name.toLowerCase();
  const modelFn = supportedModels[modelName];

  if (!modelFn) {
    throw new Error(`Model '${modelName}' is not supported.`);
  }

  return modelFn(prompt, config);
};
