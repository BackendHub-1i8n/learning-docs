import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    dialect: "postgresql",
    schema: "./src/drizzle/schemas/*",
    driver: "pglite",
    dbCredentials: {
        url: "./.env.local",
    },
    migrations: {
        table: "__drizzle_migrations__",
        schema: "public",
    },
    verbose: true, // Muestra más logs para depuración
});
