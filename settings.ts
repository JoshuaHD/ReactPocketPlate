import PocketBase from 'pocketbase';
const pbPath = "/_"
export const pb = new PocketBase(pbPath);
export const pbProxy = "http://127.0.0.1:4191"
export const allowedHosts = ["tasks.tdu.cc"]