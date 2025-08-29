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
    if (hasOptions(args)) {
      return executeOption(args); //will have to change later
    }
    const argString = checkArgs(args);
    const prompt = enrichUserPrompt(argString, generateEnvConfig());
    interpretPrompt(prompt, getConfig, supportedModels).then(console.log);
  } catch (error) {
    console.error(error);
  }
};

export const checkArgs = (args: string[]): string => {
  if (!args || args.join("").length === 0 || args.every(arg => arg.trim().length === 0)) {
    throw new Error("No command description given");
  }
  return args.join(" ");
};

export const supportedModels: SupportedModels = {
  "gemini": callGeminiAPI,
  "openai": callOpenAIAPI,
};

export const hasOptions = (args: string[]): boolean => {
  return args.length > 0 && args[0].startsWith("-");
};

export const executeOption = (args: string[]): void => {
  switch (args[0]) {
    case "-h":
    case "--help":
      return showHelp();
    default:
      throw new Error("Invalid option. Valid options are -h or --help.");
  }
};

export const showHelp = (): void => {
  console.log("Help: Usage instructions...");
};
