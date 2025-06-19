import { relations } from 'drizzle-orm';
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { wishlist } from './wishlist';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const userRelations = relations(user, ({many}) => ({
	wishlists: many(wishlist),
}));

export type User = typeof user.$inferSelect;
