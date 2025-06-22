import { relations } from 'drizzle-orm';
import { pgTable, text, integer, primaryKey } from 'drizzle-orm/pg-core';
import { wishlistTable } from './wishlist';

export const userTable = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

// add: groups, sharedwishlists

export const userTableRelations = relations(userTable , ({many}) => ({
	wishlists: many(wishlistTable),
	friends: many(friendsTable)
}));

export const friendsTable = pgTable('friends', {
	userId: integer('user_id').notNull().references(() => userTable.id),
	friendId: integer('friend_id').notNull().references(() => userTable.id),	
	},
	(t) => [
		primaryKey({ columns: [t.userId, t.friendId] })
	],
);

export type User = typeof userTable.$inferSelect;
