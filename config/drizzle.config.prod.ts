import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    dialect: "postgresql",
    schema: "./src/drizzle/schemas/*",
    driver: "pglite",
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    },
    migrations: {
        table: "__drizzle_migrations__",
        schema: "public",
    },
    strict: true, // Aplica reglas estrictas en producción
    verbose: false, // Reduce logs en producción
});
