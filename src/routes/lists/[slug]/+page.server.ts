
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'; 
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { wishlistTable } from '$lib/server/db/schema';

export const load: PagerServerLoad = async ({params, locals}) => {
  if (!locals.user) {
    return redirect(302, '/');  
  }
  let slug = params.slug;
  const list = getList(+slug, locals.user.id);
  if (!list) {
    return redirect(401, '/lists');
  }
  return { list: list }
};


async function getList(listId: number, userId: string) {
  try {
    const list = await db.query.wishlistTable.findFirst({
      where: and(eq(wishlistTable.id, listId), eq(wishlistTable.ownerId, userId)),
      with: {
        items: true
      }
    });
    console.log(list);
    return list;
  }
  catch (e: any) {
    console.log(e);
    return null;    
  }
}

