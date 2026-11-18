declare const process: {
  argv: string[];
  exit(code?: number): never;
  cwd(): string;
  env: Record<string, string | undefined>;
  stdout: { write(chunk: string): void };
};
