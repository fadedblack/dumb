import { afterEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect/expect";
import {
  detectOS,
  detectPackageManager,
  detectShell,
  enrichUserPrompt,
} from "../src/enrichUserPrompt.ts";
import os from "node:os";
import { beforeEach } from "@std/testing/bdd";

describe("detectOs", () => {
  const originalPlatform = os.platform;
  const originalRelease = os.release;

  const mockOs = {
    platform: () => "linux",
    release: () => "5.4.0",
  };

  beforeEach(() => {
    (os.platform as unknown) = mockOs.platform;
    (os.release as unknown) = mockOs.release;
  });

  afterEach(() => {
    os.platform = originalPlatform;
    os.release = originalRelease;
  });

  it("should return OS platform and release", () => {
    const result = detectOS();
    expect(result).toContain(mockOs.release());
    expect(result).toContain("Linux");
  });
});

describe("detectShell", () => {
  it("should return zsh for macOS", () => {
    const result = detectShell("macOS");
    expect(result).toBe("zsh");
  });

  it("should return bash for other OS", () => {
    const result = detectShell("Linux");
    expect(result).toBe("bash");
  });
});

describe("detectPackageManager", () => {
  it("should return dnf for Fedora", () => {
    const result = detectPackageManager("Fedora");
    expect(result).toBe("dnf");
  });

  it("should return pacman for Arch", () => {
    const result = detectPackageManager("Arch");
    expect(result).toBe("pacman");
  });

  it("should return apk for Alpine", () => {
    const result = detectPackageManager("Alpine");
    expect(result).toBe("apk");
  });

  it("should return brew for macOS", () => {
    const result = detectPackageManager("macOS");
    expect(result).toBe("brew");
  });

  it("should return choco for Windows", () => {
    const result = detectPackageManager("Windows");
    expect(result).toBe("choco");
  });

  it("should return apt for other OS", () => {
    const result = detectPackageManager("Linux");
    expect(result).toBe("apt");
  });
});

describe("generateSystemPrompt", () => {
  it("should generate a system prompt with OS and shell info", () => {
    const fakeEnv = {
      os: "Linux 5.4.0",
      shell: "bash",
      packageManager: "apt",
    };

    const result = enrichUserPrompt("something", fakeEnv);

    expect(result).toContain("You are a shell code generator");
    expect(result).toContain("OS: Linux 5.4.0");
    expect(result).toContain("Shell: bash");
    expect(result).toContain("Package Manager: apt");
    expect(result).toContain("something");
  });
});
