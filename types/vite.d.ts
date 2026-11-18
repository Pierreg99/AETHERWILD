export function defineConfig<T>(config: T): T;
export function createServer(config?: unknown): Promise<{
  listen(): Promise<void>;
  close(): Promise<void>;
}>;
