import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "3001", 10),
  SUPABASE_URL: process.env.SUPABASE_URL ?? "https://iscmnnbvctavtjgnplvh.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzY21ubmJ2Y3RhdnRqZ25wbHZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQyNDMxNywiZXhwIjoyMDkwMDAwMzE3fQ.g7fOCyq5lZXRu0_EoB-zW-R8uOR8G2N93hlNgxtOsq0",
  JWT_SECRET: process.env.JWT_SECRET ?? "hcPbJCvOptiNXnF1au6Bjoy0lEHLRUK28Yg3qwS4TVIQ9GAM",
  OWNER_EMAIL: process.env.OWNER_EMAIL ?? "admin@mazen-govtech.com",
};
