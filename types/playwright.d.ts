declare module '@playwright/test' {
  export function defineConfig<T>(config: T): T;
  export const devices: { readonly [name: string]: object };
  export function test(name: string, fn: (args: { page: Page }) => Promise<void> | void): void;
  export const expect: any;
  export interface Page {
    goto(url: string): Promise<unknown>;
    keyboard: { press(key: string): Promise<void> };
    waitForTimeout(ms: number): Promise<void>;
    locator(sel: string): {
      evaluate<T>(fn: (el: HTMLCanvasElement) => T): Promise<T>;
      boundingBox(): Promise<{ width: number; height: number } | null>;
    };
  }
  export const chromium: {
    launch(opts?: { headless?: boolean; args?: string[] }): Promise<{
      newPage(opts?: { viewport?: { width: number; height: number } }): Promise<{
        goto(url: string): Promise<unknown>;
        waitForSelector(sel: string, opts?: { state?: string }): Promise<unknown>;
        locator(sel: string): { evaluate<T>(fn: (el: HTMLCanvasElement) => T): Promise<T> };
      }>;
      close(): Promise<void>;
    }>;
  };
}
