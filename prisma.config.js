import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use process.env with a fallback so prisma generate won't crash 
    // if the environment variable isn't fully loaded yet during build
    url: process.env.DATABASE_URL || "", 
  },
});