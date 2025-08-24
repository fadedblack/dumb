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
  const mockGetConfig = () => ({
    api_key: "fake-key",
    model: "gemini-pro",
    model_name: "Gemini Pro",
  });

  it("should return the Gemini API response text using config", async () => {
    const result = await interpretPrompt(
      "world",
      MockGoogleGenerativeAI as unknown as typeof GoogleGenerativeAI,
      mockGetConfig,
    );

    expect(result).toEqual("Echo: world");
  });
});
