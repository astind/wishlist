import { boolean, integer, pgTable, primaryKey, serial, smallint, text } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { relations } from "drizzle-orm";
import { wishlistItemTable } from "./wishlist-item";
import { groupListsTable } from "./group";

export const wishlistTable = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rank: smallint('rank').notNull().default(0),
  ownerId: integer('owner_id').references(() => userTable.id),
  private: boolean('private').notNull().default(true),
  description: text('description'),
});

export const wishlistTableRelations = relations(wishlistTable,({one, many}) => ({
  owner: one(userTable, {
    fields: [wishlistTable.ownerId],
    references: [userTable.id],
  }),
  items: many(wishlistItemTable),
  groups: many(groupListsTable),
  shared: many(sharedListsTable),
}));

export const sharedListsTable = pgTable('shared_lists', {
    wishlistId: integer('wishlist_id').notNull().references(() => wishlistTable.id),
    userId: integer('user_id').notNull().references(() => userTable.id),
  }, (t) => [
      primaryKey({ columns: [t.userId, t.wishlistId ] })
   ]
);
