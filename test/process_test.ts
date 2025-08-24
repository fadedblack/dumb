import { checkArgs, process } from "../src/process.ts";
import { assertEquals, assertThrows } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

describe("checkArgs", () => {
  beforeEach(() => {
    (globalThis as any).fetch = () => ({
      ok: true,
      status: 200,
      json: () => ({}),
      text: () => "",
      body: null,
      headers: new Headers(),
      clone: () => ({}),
    });
  });

  it("should return joined string for valid args", () => {
    const args = ["foo", "bar", "baz"];
    const result = checkArgs(args);
    assertEquals(result, "foo bar baz");
  });

  it("should throw error for empty args", () => {
    assertThrows(
      () => {
        checkArgs([]);
      },
      Error,
      "No command description given",
    );
  });

  it("should throw error for undefined args", () => {
    assertThrows(
      () => {
        checkArgs([""]);
      },
      Error,
      "No command description given",
    );
  });
});

describe("process", () => {
  beforeEach(() => {
    (globalThis as any).fetch = () => ({
      ok: true,
      status: 200,
      json: () => ({}),
      text: () => "",
      body: null,
      headers: new Headers(),
      clone: () => ({}),
    });
  });

  it("should print arguments when valid args are provided", () => {
    let logOutput = "";
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logOutput = args.join(" ");
    };

    process(["foo", "bar"]);
    expect(logOutput.includes("Arguments:")).toBeTruthy();
    expect(logOutput.includes("foo bar")).toBeTruthy();
    console.log = originalLog;
  });

  it("should print error when no args are provided", () => {
    let errorOutput = "";
    const originalError = console.error;
    console.error = (msg: string) => {
      errorOutput += msg;
    };
    process([]);
    expect(errorOutput.includes("No command description given")).toBeTruthy();
    console.error = originalError;
  });

  it("should print error when blank string is provided", () => {
    let errorOutput = "";
    const originalError = console.error;
    console.error = (msg: string) => {
      errorOutput += msg;
    };
    process([""]);
    expect(errorOutput.includes("No command description given")).toBeTruthy();
    console.error = originalError;
  });
});
