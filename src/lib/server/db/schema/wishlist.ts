import { boolean, integer, pgTable, primaryKey, serial, smallint, text } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { wishlistItemRelation, wishlistItem } from "./wishlist-item";
import { groupLists } from "./group";

export const wishlist = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rank: smallint('rank').notNull().default(0),
  ownerId: integer('owner_id').references(() => user.id),
  private: boolean('private').notNull().default(true),
  description: text('description'),
});

export const wishlistRelations = relations(wishlist,({one, many}) => ({
  owner: one(user, {
    fields: [wishlist.ownerId],
    references: [user.id],
  }),
  items: many(wishlistItem),
  groups: many(groupLists),
  shared: many(sharedLists),
}));

export const sharedLists = pgTable('shared_lists', {
    wishlistId: integer('wishlist_id').notNull().references(() => wishlist.id),
    userId: integer('user_id').notNull().references(() => user.id),
  }, (t) => [
      primaryKey({ columns: [t.userId, t.wishlistId ] })
   ]
);
