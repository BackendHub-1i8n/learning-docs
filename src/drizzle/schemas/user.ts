import { pgTable, text } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: text()
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  name: text().notNull(),
  lastName: text('last_name').notNull(),
  email: text().notNull(),
  password: text().notNull(),
  createdAt: text('created_at')
    .notNull()
    .$default(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$default(() => new Date().toISOString()),
});
