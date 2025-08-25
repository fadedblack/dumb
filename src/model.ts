export type Config = {
  api_key: string;
  model: string;
  model_name: string;
};

export type SupportedModels = Record<
  string,
  (...args: any[]) => Promise<string>
>;
