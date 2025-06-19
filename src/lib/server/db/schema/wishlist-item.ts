import { decimal, pgTable, serial, text, integer, smallint } from "drizzle-orm/pg-core";
import { wishlist } from "./wishlist";
import { relations } from "drizzle-orm";

export const wishlistItem = pgTable('wishlist_item', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rank: smallint('rank').notNull().default(0),
  url: text('url'),
  iconLink: text('icon_link'),
  price: decimal('price'),
  description: text('description'),
  wishlistId: integer('wishlist_id').references(() => wishlist.id),
});

export const wishlistItemRelation = relations(wishlistItem, ({one}) => ({
  wishlist: one(wishlist, {
    fields: [wishlistItem.wishlistId],
    references: [wishlist.id]
  }),
}));

export type WishlistItem = typeof wishlistItem.$inferSelect;
