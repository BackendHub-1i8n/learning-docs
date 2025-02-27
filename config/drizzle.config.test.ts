import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    dialect: "postgresql",
    schema: "./src/drizzle/schemas/*",
    driver: "pglite",
    dbCredentials: {
        url: "./.env.test",
    },
    migrations: {
        table: "__drizzle_migrations_test__",
        schema: "public",
    },
    verbose: true,
});
