import {
	boolean,
	pgEnum,
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
import { listItemTable } from './list-item';
import { groupListsTable } from './group';

export const listTypeEnum = pgEnum("list_type", ["wishlist", "checklist"])

export const listTable = pgTable(
	'list',
	{
		id: uuid().defaultRandom().primaryKey(),
		name: text('name').notNull(),
		rank: smallint('rank').notNull().default(0),
		ownerId: uuid('owner_id').references(() => userTable.id),
		private: boolean('private').notNull().default(true),
		description: text('description'),
		dateCreated: timestamp('date_created').defaultNow(),
		lastUpdated: timestamp('last_updated'),
		listPassword: text('list_password'),
		listType: listTypeEnum("list_type").notNull().default("wishlist")
	},
	(t) => [unique('unique_name').on(t.ownerId, t.name)]
);

export const listTableRelations = relations(listTable, ({ one, many }) => ({
	owner: one(userTable, {
		fields: [listTable.ownerId],
		references: [userTable.id]
	}),
	items: many(listItemTable),
	groups: many(groupListsTable),
	shared: many(sharedListsTable)
}));

export const sharedListsTable = pgTable('shared_lists',{
	listId: uuid('list_id')
		.notNull()
		.references(() => listTable.id),
	userId: uuid('user_id')
		.notNull()
		.references(() => userTable.id)
},(t) => [
		primaryKey({ columns: [t.userId, t.listId] })
	]
);

export const sharedListRelations = relations(sharedListsTable, ({one}) => ({
	user: one(userTable, {
		fields: [sharedListsTable.userId],
		references: [userTable.id]
	}),
	list: one(listTable, {
		fields: [sharedListsTable.listId],
		references: [listTable.id]
	})
}));
