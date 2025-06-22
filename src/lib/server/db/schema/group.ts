import { boolean, integer, pgTable, primaryKey, serial, text } from "drizzle-orm/pg-core";
import { userTable } from './user';
import { relations } from "drizzle-orm";
import { wishlistTable } from "./wishlist";

export const groupTable = pgTable('group', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: integer('owner_id').notNull().references(() => userTable.id),
  description: text('description'),
  private: boolean('private').notNull().default(true),
});

export const groupTableRelations = relations(groupTable, ({one, many}) => ({
  owner: one(userTable, {
    fields: [groupTable.ownerId],
    references: [userTable.id]
  }),
  members: many(groupMembersTable),
  lists: many(groupListsTable),
}));

export const groupMembersTable = pgTable('group_members', {
    groupId: integer('group_id').notNull().references(() => groupTable.id),
    memberId: integer('member_id').notNull().references(() => userTable.id),
  }, (t) => [
    primaryKey({columns: [t.groupId, t.memberId] })
  ]
);

export const groupListsTable = pgTable('group_lists', {
    groupId: integer('group_id').notNull().references(() => groupTable.id),
    listId: integer('list_id').notNull().references(() => wishlistTable.id),
  }, (t) => [
    primaryKey({columns: [t.groupId, t.listId] })
  ]
);
