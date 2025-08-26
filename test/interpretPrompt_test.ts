import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect/expect";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  callGeminiAPI,
  callOpenAIAPI,
  interpretPrompt,
} from "../src/interpretPrompt.ts";
import { Config, SupportedModels } from "../src/model.ts";
import { OpenAI } from "@openai/openai";

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

class MockOpenAIClient {
  constructor(_: { apiKey: string }) {}
  responses = {
    create: (_: any) => ({
      output_text: "OpenAI response for Is this a test? with model gpt-4o",
    }),
  };
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

describe("callOpenAIAPI", () => {
  it("should return OpenAI response for valid input", async () => {
    const config: Config = {
      api_key: "fake-key",
      model: "gpt-4o",
      model_name: "openai",
    };

    const result = await callOpenAIAPI(
      "hello",
      config,
      MockOpenAIClient as unknown as typeof OpenAI,
    );

    expect(result).toEqual(
      "OpenAI response for Is this a test? with model gpt-4o",
    );
  });

  it("should return empty string if output_text is missing", async () => {
    class MockOpenAIClientNoOutput {
      constructor(_: { apiKey: string }) {}
      responses = {
        create: () => ({}),
      };
    }
    const config: Config = {
      api_key: "fake-key",
      model: "gpt-4o",
      model_name: "openai",
    };
    const result = await callOpenAIAPI(
      "hello",
      config,
      MockOpenAIClientNoOutput as unknown as typeof OpenAI,
    );
    expect(result).toEqual("");
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

  const supportedModels: SupportedModels = {
    "gemini": (prompt: string, _: Config) =>
      Promise.resolve(`mocked gemini: ${prompt}`),
    "openai": (prompt: string, _: Config) =>
      Promise.resolve(`mocked openai: ${prompt}`),
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
      Promise.resolve().then(() =>
        interpretPrompt("test", mockGetConfigUnknown, supportedModels)
      ),
    ).rejects.toThrow("Model 'unknown' is not supported.");
  });
});
