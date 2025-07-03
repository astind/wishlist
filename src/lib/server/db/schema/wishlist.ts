import {
	boolean,
	pgTable,
	primaryKey,
	smallint,
	text,
	timestamp,
	unique,
    uuid
} from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { relations } from 'drizzle-orm';
import { wishlistItemTable } from './wishlist-item';
import { groupListsTable } from './group';

export const wishlistTable = pgTable(
	'wishlist',
	{
		id: uuid().defaultRandom().primaryKey(),
		name: text('name').notNull(),
		rank: smallint('rank').notNull().default(0),
		ownerId: uuid('owner_id').references(() => userTable.id),
		private: boolean('private').notNull().default(true),
		description: text('description'),
		dateCreated: timestamp('date_created').defaultNow(),
		lastUpdated: timestamp('last_updated'),
		listPassword: text('list_password')
	},
	(t) => [unique('list_name').on(t.ownerId, t.name)]
);

export const wishlistTableRelations = relations(wishlistTable, ({ one, many }) => ({
	owner: one(userTable, {
		fields: [wishlistTable.ownerId],
		references: [userTable.id]
	}),
	items: many(wishlistItemTable),
	groups: many(groupListsTable),
	shared: many(sharedListsTable)
}));

export const sharedListsTable = pgTable('shared_lists',{
	wishlistId: uuid('wishlist_id')
		.notNull()
		.references(() => wishlistTable.id),
	userId: uuid('user_id')
		.notNull()
		.references(() => userTable.id)
},(t) => [
		primaryKey({ columns: [t.userId, t.wishlistId] })
	]
);
