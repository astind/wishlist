import { decimal, pgTable, serial, text, integer, smallint, boolean, date } from "drizzle-orm/pg-core";
import { wishlistTable } from "./wishlist";
import { relations } from "drizzle-orm";

export const wishlistItemTable = pgTable('wishlist_item', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rank: smallint('rank').notNull().default(0),
  url: text('url'),
  iconLink: text('icon_link'),
  price: decimal('price'),
  description: text('description'),
  wishlistId: integer('wishlist_id').references(() => wishlistTable.id),
  bought: boolean('bought').notNull().default(false),
  hideWhenBought: boolean('hide_on_buy').notNull().default(true),
  showDate: date('show_date'),
  autoDelete: boolean('auto_delete').notNull().default(false)
});

export const wishlistItemRelation = relations(wishlistItemTable, ({one}) => ({
  wishlist: one(wishlistTable, {
    fields: [wishlistItemTable.wishlistId],
    references: [wishlistTable.id]
  }),
}));

export type WishlistItem = typeof wishlistItem.$inferSelect;
