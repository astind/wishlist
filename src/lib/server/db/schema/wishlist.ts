import { boolean, integer, pgTable, primaryKey, serial, smallint, text, timestamp, unique } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { relations } from "drizzle-orm";
import { wishlistItemTable } from "./wishlist-item";
import { groupListsTable } from "./group";

export const wishlistTable = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rank: smallint('rank').notNull().default(0),
  ownerId: text('owner_id').references(() => userTable.id),
  private: boolean('private').notNull().default(true),
  description: text('description'),
  dateCreated: timestamp().defaultNow()
}, (t) => [
    unique('list_name').on(t.id, t.name)
  ]);

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
    userId: text('user_id').notNull().references(() => userTable.id),
  }, (t) => [
      primaryKey({ columns: [t.userId, t.wishlistId ] })
   ]
);
