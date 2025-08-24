import { Config } from "./model.ts";

export function getConfig(): Config {
  const configPath = `${Deno.env.get("HOME")}/.config/dumb/config.json`;
  const configText = Deno.readTextFileSync(configPath);
  return JSON.parse(configText) as Config;
}
