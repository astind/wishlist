import { integer, pgTable, serial, smallint, text } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { wishlistItemRelation, wishlistItem } from "./wishlist-item";

export const wishlist = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rank: smallint('rank').notNull().default(0),
  userId: integer('user_id').references(() => user.id)
});

export const wishlistRelations = relations(wishlist,({one, many}) => ({
  user: one(user, {
    fields: [wishlist.userId],
    references: [user.id],
  }),
  items: many(wishlistItem) 
}));
