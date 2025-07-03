import { relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { sharedListsTable, wishlistTable } from './wishlist';
import { groupMembersTable } from './group';

export const userTable = pgTable('user', {
	id: uuid().defaultRandom().primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const userTableRelations = relations(userTable , ({many}) => ({
	wishlists: many(wishlistTable),
	groups: many(groupMembersTable),
	shared: many(sharedListsTable)
}));

export type User = typeof userTable.$inferSelect;
