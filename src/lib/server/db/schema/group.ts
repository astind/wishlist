import { integer, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { userTable } from './user';
import { relations } from "drizzle-orm";
import { listTable } from "./list";

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

export const groupMembersRelations = relations(groupMembersTable, ({one}) => ({
  group: one(groupTable, {
    fields: [groupMembersTable.groupId],
    references: [groupTable.id]
  }),
  user: one(userTable, {
    fields: [groupMembersTable.memberId],
    references: [userTable.id]
  })
}));

export const groupListsTable = pgTable('group_lists', {
    groupId: uuid('group_id').notNull().references(() => groupTable.id),
    listId: uuid('list_id').notNull().references(() => listTable.id),
  }, (t) => [
    primaryKey({columns: [t.groupId, t.listId] })
  ]
);

export const groupListsRelations = relations(groupListsTable, ({one}) => ({
  group: one(groupTable, {
    fields: [groupListsTable.groupId],
    references: [groupTable.id]
  }),
  list: one(listTable, {
    fields: [groupListsTable.listId],
    references: [listTable.id]
  })
}));

