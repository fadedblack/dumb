import { GoogleGenerativeAI } from "@google/generative-ai";
import { enrichUserPrompt, generateEnvConfig } from "./enrichUserPrompt.ts";
import { interpretPrompt } from "./interpretPrompt.ts";
import { getConfig } from "./config.ts";

export const process = (args: string[]): void => {
  try {
    const argString = checkArgs(args);
    const prompt = enrichUserPrompt(argString, generateEnvConfig());
    interpretPrompt(prompt, GoogleGenerativeAI, getConfig).then(console.log);
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
