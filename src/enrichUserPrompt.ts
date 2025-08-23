import os from "node:os";

interface EnvConfig {
  os: string;
  shell: string;
  packageManager: string;
}

export function detectOS(): string {
  const platform = os.platform();
  const release = os.release();
  const type = os.type();

  if (platform === "linux") return `Linux (${type} ${release})`;

  if (platform === "darwin") return `macOS (${release})`;

  return `${type} (${release})`;
}

export function detectShell(os: string): string {
  return os.includes("macOS") ? "zsh" : "bash";
}

export function detectPackageManager(osName: string): string {
  if (osName.includes("Fedora") || osName.includes("Red Hat")) return "dnf";
  if (osName.includes("Arch")) return "pacman";
  if (osName.includes("Alpine")) return "apk";
  if (osName.includes("macOS")) return "brew";
  if (osName.includes("Windows")) return "choco";

  return "apt";
}

export function generateEnvConfig(): EnvConfig {
  const os = detectOS();
  const shell = detectShell(os);
  const packageManager = detectPackageManager(os);

  return {
    os,
    shell,
    packageManager,
  };
}

export function enrichUserPrompt(
  userPrompt: string,
  config: EnvConfig,
): string {
  const systemPrompt = `
You are a shell code generator.
Environment details:
- OS: ${config.os}
- Shell: ${config.shell}
- Package Manager: ${config.packageManager}

Rules:
- Output ONLY valid ${config.shell} code.
- Do NOT include markdown, comments, or explanations.
- Use ${config.packageManager} for package installations.
- If multiple steps are needed, output them as separate lines or chained with &&.
- Never output destructive commands (like rm -rf /) unless explicitly requested.
- Prefer safe defaults when ambiguity exists.
  `;

  return `${systemPrompt.trim()}

User Request: ${userPrompt}
`;
}
