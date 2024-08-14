/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_NEW_API_KEY: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}