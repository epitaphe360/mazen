import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "3001", 10),
  SUPABASE_URL: process.env.SUPABASE_URL ?? "https://wfoiqwymzyzhtapvuqbg.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmb2lxd3ltenl6aHRhcHZ1cWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk0MDg3NywiZXhwIjoyMDkyNTE2ODc3fQ.PmTOc9dONZkIxQbiIxGEQdqrolJbDVLdJ3aVrjZ27iM",
  JWT_SECRET: process.env.JWT_SECRET ?? "hcPbJCvOptiNXnF1au6Bjoy0lEHLRUK28Yg3qwS4TVIQ9GAM",
  OWNER_EMAIL: process.env.OWNER_EMAIL ?? "admin@mazen-govtech.com",
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
};
