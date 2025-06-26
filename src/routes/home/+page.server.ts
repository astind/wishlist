import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { asc, eq } from 'drizzle-orm';
import { wishlistTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	const wishlists = await getWishlists(event.locals.user.id);
	return { user: event.locals.user, wishlists: wishlists };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
};


async function getWishlists(userId: string) {
	let wishlists: any[] = []; // TODO: Change to a type
	try {
		const results = await db.query.wishlistTable.findMany({
			columns: {
				id: true,
				name: true,
				description: true
			},
			where: eq(wishlistTable.ownerId, userId),
			orderBy: [asc(wishlistTable.rank)]
		});
		if (results.length) {
			wishlists = results;
		}
	}	catch(e) {
		// TODO: Fail and a message?
		console.log(e);		
	}
	return wishlists;
}
