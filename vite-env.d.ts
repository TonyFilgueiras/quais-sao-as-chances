interface ImportMetaEnv {
  readonly VITE_TEST_API_KEY: string;
  readonly VITE_API_KEY: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}