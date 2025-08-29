import { describe, it } from "@std/testing/bdd";
import * as something from "../src/process.ts";
import { expect } from "@std/expect/expect";
import { checkArgs } from "../src/process.ts";

describe("hasOptions", () => {
  it("should return true if first arg starts with '-'", () => {
    expect(something.hasOptions(["-h"])).toBeTruthy();
    expect(something.hasOptions(["--help"])).toBeTruthy();
    expect(something.hasOptions(["-x"])).toBeTruthy();
  });

  it("should return false if first arg does not start with '-'", () => {
    expect(something.hasOptions(["foo"])).toBeFalsy();
    expect(something.hasOptions([])).toBeFalsy();
    expect(something.hasOptions(["find", "-h"])).toBeFalsy();
  });
});

describe("checkArgs", () => {
  it("should join arguments with space", () => {
    expect(checkArgs(["foo", "bar"])).toBe("foo bar");
    expect(checkArgs(["one"])).toBe("one");
    expect(checkArgs(["a", "b", "c"])).toBe("a b c");
  });

  it("should throw error if args is empty array", () => {
    expect(() => checkArgs([])).toThrow("No command description given");
  });

  it("should throw error if args is undefined", () => {
    expect(() => checkArgs(undefined as unknown as string[])).toThrow("No command description given");
  });

  it("should throw error if args is array of empty string", () => {
    expect(() => checkArgs([""])).toThrow("No command description given");
  });

  it("should throw error if args is array of whitespace only", () => {
    expect(() => checkArgs(["   "])).toThrow("No command description given");
  });
});



