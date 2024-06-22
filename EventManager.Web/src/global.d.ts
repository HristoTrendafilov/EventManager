export {};

declare global {
  interface Window {
    userToken: string | undefined;
  }
}
