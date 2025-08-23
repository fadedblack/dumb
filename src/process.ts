import { enrichUserPrompt, generateEnvConfig } from "./enrichUserPrompt.ts";

export const process = (args: string[]): void => {
  try {
    const argString = checkArgs(args);
    console.log("Arguments:", argString);

    const config = generateEnvConfig();
    enrichUserPrompt(argString, config);
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
