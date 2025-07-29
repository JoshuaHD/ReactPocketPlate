/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ViteTypeOptions {
    // By adding this line, you can make the type of ImportMetaEnv strict
    // to disallow unknown keys.
    strictImportMetaEnv: unknown
  }
interface ImportMetaEnv {
    readonly VITE_PORT: string;
    readonly VITE_ALLOWED_HOSTS: string;

    readonly VITE_APP_NAME;
    readonly VITE_APP_SHORT_NAME;
    readonly VITE_APP_DESCRIPTION;
    
    readonly VITE_PB_PATH: string;
    readonly VITE_PB_PROXY_URL: string;
    readonly VITE_PB_AUTH_OTP_ENABLED: string;
    readonly VITE_PB_AUTH_AZURE_ENABLED: string;
    // Add all your VITE_ variables here

    readonly VITE_PREVIEW_PORT: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }