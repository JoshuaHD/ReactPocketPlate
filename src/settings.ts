import PocketBase from 'pocketbase';
const pbPath = import.meta.env.VITE_PB_PATH || "/"
export const pb = new PocketBase(pbPath);
export const otpAuthEnabled = (import.meta.env.VITE_PB_AUTH_OTP_ENABLED?.toLowerCase() == "true") || false;
export const azureAuthEnabled = (import.meta.env.VITE_PB_AUTH_AZURE_ENABLED?.toLowerCase() == "true")|| false;