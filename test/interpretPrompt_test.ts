import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect/expect";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { callGeminiAPI, interpretPrompt } from "../src/interpretPrompt.ts";
import { Config } from "../src/model.ts";

class MockModel {
  generateContent(prompt: string) {
    return {
      response: {
        text: () => `Echo: ${prompt}`,
      },
    };
  }
}

class MockGoogleGenerativeAI {
  constructor(_: string) {}
  getGenerativeModel(_: Config) {
    return new MockModel();
  }
}

describe("callGeminiAPI", () => {
  it("should return the Gemini API response text", async () => {
    const config: Config = {
      api_key: "fake-key",
      model: "gemini-pro",
      model_name: "Gemini Pro",
    };
    const result = await callGeminiAPI(
      "hello",
      config,
      MockGoogleGenerativeAI as unknown as typeof GoogleGenerativeAI,
    );

    expect(result).toEqual("Echo: hello");
  });

  it("should return empty string if response is missing", async () => {
    const originalGenerateContent = MockModel.prototype.generateContent;
    (MockModel.prototype as any).generateContent = () => {};

    const config: Config = {
      api_key: "fake-key",
      model: "gemini-pro",
      model_name: "Gemini Pro",
    };

    const result = await callGeminiAPI(
      "hello",
      config,
      MockGoogleGenerativeAI as unknown as typeof GoogleGenerativeAI,
    );
    expect(result).toEqual("");

    (MockModel.prototype as any).generateContent = originalGenerateContent;
  });
});

describe("interpretPrompt", () => {
  const mockGetConfigGemini = () => ({
    api_key: "fake-key",
    model: "gemini-pro",
    model_name: "gemini",
  });

  const mockGetConfigOpenAI = () => ({
    api_key: "fake-key",
    model: "openai-pro",
    model_name: "openai",
  });

  const supportedModels = {
    gemini: async (prompt: string, config: Config) => `mocked gemini: ${prompt}`,
    openai: async (prompt: string, config: Config) => `mocked openai: ${prompt}`,
  };

  it("should return the Gemini API response text using config", async () => {
    const result = await interpretPrompt(
      "world",
      mockGetConfigGemini,
      supportedModels,
    );
    expect(result).toEqual("mocked gemini: world");
  });

  it("should return 'mocked openai: world' for OpenAI model", async () => {
    const result = await interpretPrompt(
      "world",
      mockGetConfigOpenAI,
      supportedModels,
    );
    expect(result).toEqual("mocked openai: world");
  });

  it("should throw error for unsupported model", async () => {
    const mockGetConfigUnknown = () => ({
      api_key: "fake-key",
      model: "unknown-pro",
      model_name: "unknown",
    });
    await expect(
      interpretPrompt("test", mockGetConfigUnknown, supportedModels),
    ).rejects.toThrow("Model 'unknown' is not supported.");
  });
});
