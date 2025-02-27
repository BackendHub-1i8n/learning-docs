import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

export const enumState = pgEnum('state', [
  'created',
  'in_progress',
  'completed',
]);

export const tasks = pgTable('task', {
  id: text()
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  title: text().notNull(),
  description: text().notNull(),
  state: enumState()
    .notNull()
    .$default(() => 'created'),
  createdAt: text()
    .notNull()
    .$default(() => new Date().toISOString()),
  updatedAt: text()
    .notNull()
    .$default(() => new Date().toISOString()),
  userId: text().notNull(),
});
