import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "@openai/openai";
import { Config, SupportedModels } from "./model.ts";

export const callGeminiAPI = async (
  prompt: string,
  config: Config,
  GeminiClient: typeof GoogleGenerativeAI = GoogleGenerativeAI,
): Promise<void> => {
  const genAI = new GeminiClient(config.api_key);
  const model = genAI.getGenerativeModel(config);
  const result = await model.generateContentStream(prompt);

  let streamedText = "";

  for await (const chunk of result.stream) {
    const text = chunk.text();
    console.log(text);
    streamedText += text;
  }

  if (streamedText) {
    return;
  }

  throw new Error("No response received from Gemini API.");
};

export const callOpenAIAPI = async (
  prompt: string,
  config: Config,
  OpenAIClient: typeof OpenAI = OpenAI,
): Promise<void> => {
  const client = new OpenAIClient({
    apiKey: config.api_key,
  });
  const response = await client.responses.create({
    model: config.model,
    input: prompt,
    stream: true,
  }) as unknown;
  if (
    response && typeof response === "object" && Symbol.asyncIterator in response
  ) {
    let hasText = false;
    for await (
      const event of response as AsyncIterable<Record<string, unknown>>
    ) {
      const text = (typeof event.delta === "string" && event.delta) ||
        (typeof event.text === "string" && event.text) ||
        (typeof event.output_text === "string" && event.output_text) ||
        "";
      if (text) {
        hasText = true;
        console.log(text);
      }
    }
    if (!hasText) {
      throw new Error("No response received from OpenAI API.");
    }
    return;
  }
  if (response && typeof response === "object" && "output_text" in response) {
    const outputText = (response as { output_text?: string }).output_text ?? "";
    if (!outputText) {
      throw new Error("No response received from OpenAI API.");
    }
    console.log(outputText);
    return;
  }
  throw new Error("No response received from OpenAI API.");
};

export const interpretPrompt = (
  prompt: string,
  getConfig: () => Config,
  supportedModels: SupportedModels,
): Promise<void> => {
  const config = getConfig();
  const modelName = config.model_name.toLowerCase();
  const modelFn = supportedModels[modelName];

  if (!modelFn) {
    throw new Error(`Model '${modelName}' is not supported.`);
  }

  modelFn(prompt, config);
  return Promise.resolve();
};
