import { boolean, integer, pgTable, primaryKey, serial, text } from "drizzle-orm/pg-core";
import { user } from './user';
import { relations } from "drizzle-orm";
import { wishlist } from "./wishlist";

export const group = pgTable('group', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: integer('owner_id').notNull().references(() => user.id),
  description: text('description'),
  private: boolean('private').notNull().default(true),
});

export const groupRelations = relations(group, ({one, many}) => ({
  owner: one(user, {
    fields: [group.ownerId],
    references: [user.id]
  }),
  members: many(groupMembers),
  lists: many(groupLists),
}));

export const groupMembers = pgTable('group_members', {
    groupId: integer('group_id').notNull().references(() => group.id),
    memberId: integer('member_id').notNull().references(() => user.id),
  }, (t) => [
    primaryKey({columns: [t.groupId, t.memberId] })
  ]
);

export const groupLists = pgTable('group_lists', {
    groupId: integer('group_id').notNull().references(() => group.id),
    listId: integer('list_id').notNull().references(() => wishlist.id),
  }, (t) => [
    primaryKey({columns: [t.groupId, t.listId] })
  ]
);
