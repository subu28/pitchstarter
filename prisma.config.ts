import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://admin:pass123@postgres:5432/pitchstarter",
  },
});
