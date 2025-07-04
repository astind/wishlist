import { db } from '$lib/server/db';
import { and, asc, desc, eq } from 'drizzle-orm';
import { wishlistTable } from '$lib/server/db/schema';


export async function getWishlists(ownerId: string, limit?: number, orderByRecent: boolean = false) {
  let wishlists: any[] = [];
	try {
	  let orderBy = [asc(wishlistTable.rank), desc(wishlistTable.dateCreated)];
	  if (orderByRecent) {
	    orderBy = [desc(wishlistTable.lastUpdated), desc(wishlistTable.dateCreated)];
	  }
		const results = await db.query.wishlistTable.findMany({
			columns: {
				id: true,
				name: true,
				description: true
			},
			where: eq(wishlistTable.ownerId, ownerId),
			orderBy: orderBy,
			limit: limit
		});
		if (results.length) {
			wishlists = results;
		}
	} catch (e) {
    console.error(e);
	  let message = "Failed to get lists"
		throw message;
	}
	return wishlists;
}

export async function newWishlist(name: string, ownerId: string, description?: string, isPrivate: boolean = false) {
  try {
    await db.insert(wishlistTable).values({
      name: name,
      ownerId: ownerId,
      description: description,
      private: isPrivate
    });
  } catch(e: any) {
    console.error(e);
    throw "Failed to create new list"
  }
}

export async function updateWishlist(listId: string, name: string, ownerId: string, description?: string, isPrivate: boolean = false) {
  try {
    await db.update(wishlistTable).set({
      name: name, 
      description: description,
      private: isPrivate
    }).where(
      and(
        eq(wishlistTable.ownerId, ownerId),  
        eq(wishlistTable.id, listId)
      )
    )
  }
  catch(e: any) {
    throw "Failed to update list";
  }
}

export async function deleteWishlist(listId: string, ownerId: string) {
  try {
    await db.delete(wishlistTable).where(
      and(
        eq(wishlistTable.id, listId),
        eq(wishlistTable.ownerId, ownerId)
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
    const list = await db.query.wishlistTable.findFirst({
      where: and(eq(wishlistTable.name, listName), eq(wishlistTable.ownerId, ownerId)),
      with: {
        items: true,
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

export async function newListItem() {
  
}

export async function editListItem() {
  
}

export async function deleteListItem() {
  
}

