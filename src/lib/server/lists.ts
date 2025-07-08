import { db } from '$lib/server/db';
import { and, asc, desc, eq } from 'drizzle-orm';
import { listItemTable, listTable } from '$lib/server/db/schema';

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

async function updateListTimestamp(ownerId: string, listId: string) {
  try {
    await db.update(listTable).set({lastUpdated: new Date()}).where(
      and(
        eq(listTable.id, listId),
        eq(listTable.ownerId, ownerId)
      )
    )
  }
  catch(e: any) {
    console.error(e);
    console.error("Last updated date not updated");
  }
}

async function verifyListOwner(ownerId: string, listId: string) {
  console.log(ownerId);
  console.log(listId);
  try {
    const list = await db.query.listTable.findFirst({
      columns: { ownerId: true, id: true},
      where: eq(listTable.id, listId)
    });
    console.log(list);
    if (list?.ownerId !== ownerId) {
      throw "wrong owner"
    }
  }
  catch(e: any) {
    console.error(e);
    throw "Cannot verify list owner";
  }
}

export async function newListItem(listItem: ListItemFields, ownerId: string, listId: string) {
  
  try { 
    await verifyListOwner(ownerId, listId);
    const item = {...listItem, listId: listId}
    await db.insert(listItemTable).values(item as any);
  }
  catch(e: any) {
    console.error(e);
    throw "Failed to add item(s) to list";
  }
  updateListTimestamp(ownerId, listId);
  
}

export async function editListItem(listItem: ListItemFields, ownerId: string, listId: string, ogName: string) {
  try{
    await verifyListOwner(ownerId, listId);    
    await db.update(listItemTable).set(listItem as any).where(and(
      eq(listItemTable.listId, listId),
      eq(listItemTable.name, ogName)
    ));
  }
  catch(e: any) {
    console.error(e);
    throw "Failed to update list item";
  }
  updateListTimestamp(ownerId, listId); 
}

export async function deleteListItem(ownerId: string, listId: string, itemName: string) {
  try {
    await verifyListOwner(ownerId, listId);
    await db.delete(listItemTable).where(and(
      eq(listItemTable.name, itemName),
      eq(listItemTable.listId, listId)
    ));
  }
  catch(e: any) {
    console.error(e);
    throw "Failed to delete list item";
  }
  updateListTimestamp(ownerId, listId);
}

export async function toggleDone(listId: string, itemName: string, by: string, done: boolean = true) {
  try {
    await db.update(listItemTable).set({
      done: done,
      doneBy: by,
      dateDone: new Date()
    }).where(
      and(
        eq(listItemTable.name, itemName),
        eq(listItemTable.listId, listId)
      )
    )
  }
  catch(e: any) {
    console.error(e);
    throw "Failed to mark as complete/bought"
  }
}

