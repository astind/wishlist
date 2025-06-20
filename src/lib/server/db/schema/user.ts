import { relations } from 'drizzle-orm';
import { pgTable, text, integer, primaryKey } from 'drizzle-orm/pg-core';
import { wishlist } from './wishlist';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

// add: groups, sharedwishlists

export const userRelations = relations(user, ({many}) => ({
	wishlists: many(wishlist),
	friends: many(friends)
}));

export const friends = pgTable('friends', {
	userId: integer('user_id').notNull().references(() => user.id),
	friendId: integer('friend_id').notNull().references(() => user.id),	
	},
	(t) => [
		primaryKey({ columns: [t.userId, t.friendId] })
	],
);

export type User = typeof user.$inferSelect;
