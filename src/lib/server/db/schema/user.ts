import { relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { sharedListsTable, listTable } from './list';
import { groupMembersTable } from './group';

export const userTable = pgTable('user', {
	id: uuid().defaultRandom().primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const userTableRelations = relations(userTable , ({many}) => ({
	lists: many(listTable),
	groups: many(groupMembersTable),
	shared: many(sharedListsTable)
}));

export type User = typeof userTable.$inferSelect;
