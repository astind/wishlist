import {
	decimal,
	pgTable,
	text,
	smallint,
	boolean,
	date,
	timestamp,
	primaryKey,
    uuid
} from 'drizzle-orm/pg-core';
import { listTable } from './list';
import { relations } from 'drizzle-orm';

export const listItemTable = pgTable(
	'list_item',
	{
		name: text('name').notNull(),
		rank: smallint('rank').notNull().default(0),
		url: text('url'),
		iconLink: text('icon_link'),
		price: decimal('price'),
		description: text('description'),
		listId: uuid('list_id').references(() => listTable.id),
		bought: boolean('bought').notNull().default(false),
		hideWhenBought: boolean('hide_on_buy').notNull().default(true),
		showDate: date('show_date'),
		autoDelete: boolean('auto_delete').notNull().default(false),
		dateAdded: timestamp().defaultNow()
	},
	(t) => [primaryKey({ name: 'item_name', columns: [t.name, t.listId] })]
);

export const listItemRelation = relations(listItemTable, ({ one }) => ({
	list: one(listTable, {
		fields: [listItemTable.listId],
		references: [listTable.id]
	})
}));

export type ListItem = typeof listItemTable.$inferSelect;
