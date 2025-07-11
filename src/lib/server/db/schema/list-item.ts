import {
	decimal,
	pgTable,
	text,
	smallint,
	boolean,
	date,
	timestamp,
  uuid,
  serial,
  unique
} from 'drizzle-orm/pg-core';
import { listTable } from './list';
import { relations } from 'drizzle-orm';
import { userTable } from './user';

export const listItemTable = pgTable(
	'list_item',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		rank: smallint('rank').notNull().default(0),
		url: text('url'),
		iconLink: text('icon_link'),
		price: decimal('price'),
		description: text('description'),
		listId: uuid('list_id').references(() => listTable.id),
		done: boolean('done').notNull().default(false),
		//hideWhenBought: boolean('hide_on_buy').notNull().default(true),
		showDate: date('show_date'),
		autoDelete: boolean('auto_delete').notNull().default(false),
		dateAdded: timestamp().defaultNow(),
		doneBy: uuid("done_by").references(() => userTable.id),
		dateDone: timestamp('date_done')
	},
	(t) => [unique('item_name').on(t.listId, t.name)]
);

export const listItemRelation = relations(listItemTable, ({ one }) => ({
	list: one(listTable, {
		fields: [listItemTable.listId],
		references: [listTable.id]
	})
}));

export type ListItem = typeof listItemTable.$inferSelect;
