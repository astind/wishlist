import {
	decimal,
	pgTable,
	text,
	integer,
	smallint,
	boolean,
	date,
	timestamp,
	primaryKey,
    uuid
} from 'drizzle-orm/pg-core';
import { wishlistTable } from './wishlist';
import { relations } from 'drizzle-orm';

export const wishlistItemTable = pgTable(
	'wishlist_item',
	{
		name: text('name').notNull(),
		rank: smallint('rank').notNull().default(0),
		url: text('url'),
		iconLink: text('icon_link'),
		price: decimal('price'),
		description: text('description'),
		wishlistId: uuid('wishlist_id').references(() => wishlistTable.id),
		bought: boolean('bought').notNull().default(false),
		hideWhenBought: boolean('hide_on_buy').notNull().default(true),
		showDate: date('show_date'),
		autoDelete: boolean('auto_delete').notNull().default(false),
		dateAdded: timestamp().defaultNow()
	},
	(t) => [primaryKey({ name: 'item_name', columns: [t.name, t.wishlistId] })]
);

export const wishlistItemRelation = relations(wishlistItemTable, ({ one }) => ({
	wishlist: one(wishlistTable, {
		fields: [wishlistItemTable.wishlistId],
		references: [wishlistTable.id]
	})
}));

export type WishlistItem = typeof wishlistItemTable.$inferSelect;
