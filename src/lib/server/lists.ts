import { db } from '$lib/server/db';
import { and, asc, desc, eq } from 'drizzle-orm';
import { listItemTable, listTable } from '$lib/server/db/schema';
import { check } from 'drizzle-orm/mysql-core';

export async function getLists(ownerId: string, limit?: number, orderByRecent: boolean = false) {
  let lists: any[] = [];
	try {
	  let orderBy = [asc(listTable.rank), desc(listTable.dateCreated)];
	  if (orderByRecent) {
	    orderBy = [desc(listTable.lastUpdated), desc(listTable.dateCreated)];
	  }
		const results = await db.query.listTable.findMany({
			columns: {
				id: true,
				name: true,
				description: true
			},
			where: eq(listTable.ownerId, ownerId),
			orderBy: orderBy,
			limit: limit
		});
		if (results.length) {
			lists = results;
		}
	} catch (e) {
    console.error(e);
	  let message = "Failed to get lists"
		throw message;
	}
	return lists;
}

export async function newList(name: string, ownerId: string, description?: string, isPrivate: boolean = false, listType: "wishlist" | "checklist" = "wishlist") {
  try {
    await db.insert(listTable).values({
      name: name,
      ownerId: ownerId,
      description: description,
      listType: listType,
      private: isPrivate
    });
  } catch(e: any) {
    console.error(e);
    throw "Failed to create new list"
  }
}

export async function updateList(listId: string, name: string, ownerId: string, description?: string, isPrivate: boolean = false, listType: "wishlist" | "checklist" = "wishlist", listPassword?: string) {
  try {
    await db.update(listTable).set({
      name: name, 
      description: description,
      private: isPrivate,
      lastUpdated: new Date(),
      listType: listType,
      listPassword: listPassword
    }).where(
      and(
        eq(listTable.ownerId, ownerId),  
        eq(listTable.id, listId)
      )
    )
  }
  catch(e: any) {
    throw "Failed to update list";
  }
}

export async function deleteList(listId: string, ownerId: string) {
  try {
    await db.delete(listTable).where(
      and(
        eq(listTable.id, listId),
        eq(listTable.ownerId, ownerId)
      )
    );
  }
  catch(e: any) {
    console.error(e);
    throw "Failed to delete list";
  }
}

export async function getList(listName: string, ownerId: string) {
  try{
    const list = await db.query.listTable.findFirst({
      where: and(eq(listTable.name, listName), eq(listTable.ownerId, ownerId)),
      with: {
        items: {
          orderBy: [desc(listItemTable.dateAdded)]
        },
        shared: true,
        groups: true
      }
    })
    return list;
  }
  catch(e: any) {
    console.error(e);
    throw "Failed to get list";    
  }
}

export type ListItemFields = {
  name: string;
  description?: string;
  url?: string;
  price?: number | string;
  autoDelete: boolean;
}

async function updateListTimestamp(listId: string) {
  try {
    await db.update(listTable).set({lastUpdated: new Date()}).where(
      eq(listTable.id, listId)
    )
  }
  catch(e: any) {
    console.error(e);
    console.error("Last updated date not updated");
  }
}

async function verifyListOwner(ownerId: string, listId: string) {
  try {
    const list = await db.query.listTable.findFirst({
      columns: { ownerId: true, id: true},
      where: eq(listTable.id, listId)
    });
    if (list?.ownerId !== ownerId) {
      throw "wrong owner"
    }
  }
  catch(e: any) {
    console.error(e);
    throw "Cannot verify list owner";
  }
}

export async function newListItem(listItem: ListItemFields, userId: string, listId: string, owner: boolean = true) {
  try { 
    if (owner) {
      await verifyListOwner(userId, listId);
    } else {
      // check for shared list
    }
    const item = {...listItem, listId: listId}
    await db.insert(listItemTable).values(item as any);
  }
  catch(e: any) {
    console.error(e);
    throw "Failed to add item(s) to list";
  }
  updateListTimestamp(listId);
}

export async function editListItem(itemId: number, listItem: ListItemFields, userId: string, listId: string, owner: boolean = true) {
  try {
    if (owner) {
      await verifyListOwner(userId, listId);  
    }
    await db.update(listItemTable).set(listItem as any).where(eq(listItemTable.id, itemId));
  }
  catch(e: any) {
    console.error(e);
    throw "Failed to update list item";
  }
  updateListTimestamp(listId); 
}

export async function deleteListItem(itemId: number, userId: string, listId: string, owner: boolean = true) {
  try {
    if (owner) {
      await verifyListOwner(userId, listId);
    }
    await db.delete(listItemTable).where(
      eq(listItemTable.id, itemId),
    );
  }
  catch(e: any) {
    console.error(e);
    throw "Failed to delete list item";
  }
  updateListTimestamp(listId);
}

export async function toggleDone(itemId: number, by: string) {
  try {
    const item = await db.query.listItemTable.findFirst({
      where: eq(listItemTable.id, itemId),
      columns: {
        done: true,
        listId: true,
        doneBy: true,
      },
      with: {
        list: {
          columns: {
            private: true,
            listType: true
          }
        }
      }
    });
    if (!item) {
      throw "Item not found";
    }
    if (item.list?.private) {
      // check for shared list
      // check for groups  
    }
    let update: boolean = !item.done;
    let date = null;
    let byUser = null;
    if (item.done) {
      // unchecking
      if (item.list?.listType === 'wishlist' && item.doneBy !== by) {
        throw "Invalid User";
      }
    } else {
      date = new Date();
      byUser = by;
    }
    await db.update(listItemTable).set({
      done: update,
      doneBy: byUser,
      dateDone: date
    }).where(
      eq(listItemTable.id, itemId)
    );
  }
  catch(e: any) {
    console.error(e);
    if (typeof e === "string") {
      throw e;
    } else {
      throw "Failed to mark as complete/bought"
    }
  }
}

export async function deleteAllDone(listId: string, userId: string, owner: boolean = true) {
  try {
    if (owner) {
      await verifyListOwner(userId, listId);
    } else {
      //check for shared list
    }
    await db.delete(listItemTable).where(
      and(
        eq(listItemTable.listId, listId),
        eq(listItemTable.done, true)
      )
    );
  } catch (e: any) {
    console.error(e);
    throw "Failed to remove group";
  }
  updateListTimestamp(listId)
}

