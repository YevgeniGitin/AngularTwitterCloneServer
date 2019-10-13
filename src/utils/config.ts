import dotenv from 'dotenv';

export const keys={
  secret:"jwt-sign-secret",
  dbUrl:"mongodb://localhost:27017/local"
};

export function initConfig() {
  dotenv.config();
}

export function getConfig(key: string, fallback?: any) {
  return process.env[key] || fallback;
}
