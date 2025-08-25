import { enrichUserPrompt, generateEnvConfig } from "./enrichUserPrompt.ts";
import {
  callGeminiAPI,
  callOpenAIAPI,
  interpretPrompt,
} from "./interpretPrompt.ts";
import { getConfig } from "./config.ts";
import { SupportedModels } from "./model.ts";

export const process = (args: string[]): void => {
  try {
    const argString = checkArgs(args);
    const prompt = enrichUserPrompt(argString, generateEnvConfig());
    interpretPrompt(prompt, getConfig, supportedModels).then(console.log);
  } catch (error) {
    console.error(error);
  }
};

export const checkArgs = (args: string[]): string => {
  if (!args || args.join("").length === 0) {
    throw new Error("No command description given");
  }
  return args.join(" ");
};

export const supportedModels: SupportedModels = {
  "gemini": callGeminiAPI,
  "openai": callOpenAIAPI,
};
