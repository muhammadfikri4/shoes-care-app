/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DSC_APP_NAME: string;
  readonly DSC_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
