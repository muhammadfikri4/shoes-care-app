/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly HIMTI_APP_NAME: string;
  readonly HIMTI_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
