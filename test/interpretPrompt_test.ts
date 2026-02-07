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
  generateContentStream(prompt: string) {
    return {
      stream: (async function* () {
        yield {
          text: () => `Echo: ${prompt}`,
        };
      })(),
      response: Promise.resolve({
        text: () => `Echo: ${prompt}`,
      }),
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
    create: (_: any) =>
      (async function* () {
        yield {
          output_text: "OpenAI response for Is this a test? with model gpt-4o",
        };
      })(),
  };
}

describe("callGeminiAPI", () => {
  it("should return the Gemini API response text", async () => {
    const config: Config = {
      api_key: "fake-key",
      model: "gemini-pro",
      model_name: "Gemini Pro",
    };
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.join(" "));
    };
    try {
      await callGeminiAPI(
        "hello",
        config,
        MockGoogleGenerativeAI as unknown as typeof GoogleGenerativeAI,
      );
    } finally {
      console.log = originalLog;
    }

    expect(logs.join("")).toEqual("Echo: hello");
  });

  it("should return empty string if response is missing", async () => {
    const originalGenerateContentStream = MockModel.prototype
      .generateContentStream;
    (MockModel.prototype as any).generateContentStream = () => ({
      stream: (async function* () {})(),
      response: Promise.resolve(undefined),
    });

    const config: Config = {
      api_key: "fake-key",
      model: "gemini-pro",
      model_name: "Gemini Pro",
    };

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.join(" "));
    };
    let error: Error | null = null;
    try {
      await callGeminiAPI(
        "hello",
        config,
        MockGoogleGenerativeAI as unknown as typeof GoogleGenerativeAI,
      );
    } catch (err) {
      error = err as Error;
    } finally {
      console.log = originalLog;
    }
    expect(error?.message).toEqual("No response received from Gemini API.");
    expect(logs.length).toEqual(0);

    (MockModel.prototype as any).generateContentStream =
      originalGenerateContentStream;
  });
});

describe("callOpenAIAPI", () => {
  it("should return OpenAI response for valid input", async () => {
    const config: Config = {
      api_key: "fake-key",
      model: "gpt-4o",
      model_name: "openai",
    };

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.join(" "));
    };
    try {
      await callOpenAIAPI(
        "hello",
        config,
        MockOpenAIClient as unknown as typeof OpenAI,
      );
    } finally {
      console.log = originalLog;
    }
    expect(logs.join("")).toEqual(
      "OpenAI response for Is this a test? with model gpt-4o",
    );
  });

  it("should throw if output_text is missing", async () => {
    class MockOpenAIClientNoOutput {
      constructor(_: { apiKey: string }) {}
      responses = {
        create: () =>
          (async function* () {
            yield {};
          })(),
      };
    }
    const config: Config = {
      api_key: "fake-key",
      model: "gpt-4o",
      model_name: "openai",
    };
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.join(" "));
    };
    let error: Error | null = null;
    try {
      await callOpenAIAPI(
        "hello",
        config,
        MockOpenAIClientNoOutput as unknown as typeof OpenAI,
      );
    } catch (err) {
      error = err as Error;
    } finally {
      console.log = originalLog;
    }
    expect(error?.message).toEqual("No response received from OpenAI API.");
    expect(logs.length).toEqual(0);
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

  it("should call the Gemini model using config", async () => {
    let calledWith: string | null = null;
    const localModels: SupportedModels = {
      "gemini": (prompt: string, _: Config) => {
        calledWith = prompt;
        return Promise.resolve();
      },
    };
    await interpretPrompt("world", mockGetConfigGemini, localModels);
    expect(calledWith).toEqual("world");
  });

  it("should call the OpenAI model", async () => {
    let calledWith: string | null = null;
    const localModels: SupportedModels = {
      "openai": (prompt: string, _: Config) => {
        calledWith = prompt;
        return Promise.resolve();
      },
    };
    await interpretPrompt("world", mockGetConfigOpenAI, localModels);
    expect(calledWith).toEqual("world");
  });

  it("should throw error for unsupported model", async () => {
    const mockGetConfigUnknown = () => ({
      api_key: "fake-key",
      model: "unknown-pro",
      model_name: "unknown",
    });
    const localModels: SupportedModels = {
      "gemini": () => Promise.resolve(),
      "openai": () => Promise.resolve(),
    };
    await expect(
      Promise.resolve().then(() =>
        interpretPrompt("test", mockGetConfigUnknown, localModels)
      ),
    ).rejects.toThrow("Model 'unknown' is not supported.");
  });
});
