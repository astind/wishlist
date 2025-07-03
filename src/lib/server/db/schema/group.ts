import { integer, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { userTable } from './user';
import { relations } from "drizzle-orm";
import { wishlistTable } from "./wishlist";

export const groupTable = pgTable('group', {
  id: uuid().defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  ownerId: uuid('owner_id').notNull().references(() => userTable.id),
  description: text('description'),
  groupPassword: text('group_password')
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
    groupId: uuid('group_id').notNull().references(() => groupTable.id),
    memberId: uuid('member_id').notNull().references(() => userTable.id),
  }, (t) => [
    primaryKey({columns: [t.groupId, t.memberId] })
  ]
);

export const groupListsTable = pgTable('group_lists', {
    groupId: uuid('group_id').notNull().references(() => groupTable.id),
    listId: uuid('list_id').notNull().references(() => wishlistTable.id),
  }, (t) => [
    primaryKey({columns: [t.groupId, t.listId] })
  ]
);
