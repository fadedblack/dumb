import { describe, it } from "@std/testing/bdd";
import { getConfig } from "../src/config.ts";
import { Config } from "../src/model.ts";
import { expect } from "@std/expect/expect";

// Save original Deno.env.get and Deno.readTextFileSync
const originalEnvGet = Deno.env.get;
const originalReadTextFileSync = Deno.readTextFileSync;

describe("getConfig", () => {
  it("should return the config object from the config file", () => {
    // Mock Deno.env.get to return a fake HOME path
    Deno.env.get = (key: string) => {
      if (key === "HOME") return "/mock/home";
      return originalEnvGet(key);
    };
    // Mock Deno.readTextFileSync to return a fake config JSON
    Deno.readTextFileSync = (path: string | URL) => {
      const filePath = typeof path === "string" ? path : path.toString();
      expect(filePath).toEqual("/mock/home/.config/dumb/config.json");
      return JSON.stringify({
        api_key: "fake-key",
        model: "gemini-pro",
        model_name: "Gemini Pro",
      });
    };
    const config: Config = getConfig();
    expect(config.api_key).toEqual("fake-key");
    expect(config.model).toEqual("gemini-pro");
    expect(config.model_name).toEqual("Gemini Pro");
    // Restore mocks
    Deno.env.get = originalEnvGet;
    Deno.readTextFileSync = originalReadTextFileSync;
  });

  it("should throw if config file is missing", () => {
    Deno.env.get = (key: string) => {
      if (key === "HOME") return "/mock/home";
      return originalEnvGet(key);
    };
    Deno.readTextFileSync = (_: string | URL) => {
      throw new Error("File not found");
    };
    expect(() => getConfig()).toThrow("File not found");
    Deno.env.get = originalEnvGet;
    Deno.readTextFileSync = originalReadTextFileSync;
  });

  it("should throw if config file is invalid JSON", () => {
    Deno.env.get = (key: string) => {
      if (key === "HOME") return "/mock/home";
      return originalEnvGet(key);
    };
    Deno.readTextFileSync = (_: string | URL) => {
      return "not a json";
    };
    expect(() => getConfig()).toThrow();
    Deno.env.get = originalEnvGet;
    Deno.readTextFileSync = originalReadTextFileSync;
  });
});
