import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { asc, desc, eq } from 'drizzle-orm';
import { wishlistTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	const wishlists = await getWishlists(event.locals.user.id);
	return { user: event.locals.user, wishlists: wishlists };
};

export const actions: Actions = {
	new: async (event) => {
		const form = await event.request.formData();
		const name = form.get('name');
		const description = form.get('description');
		const checkPrivate = form.get('private');
		const isPrivate = checkPrivate !== null && checkPrivate === 'on';
		try {
			await db.insert(wishlistTable).values({
				name: name,
				description: description,
				private: isPrivate,
				ownerId: event.locals.user?.id
			});
		} catch (e: any) {
			console.log(e);
			let message = 'Failed to create new wishlist';
			if (e.message) {
				message = e.message;
			}
			console.log(message);
			return fail(500, { message: message });
		}
	},
	delete: async (event) => {
		const form = await event.request.formData();
		const formId = form.get('id');
		if (formId) {
			const listId = +formId;
			console.log(formId);
			try {
				await db.delete(wishlistTable).where(eq(wishlistTable.id, listId));
			} catch (e: any) {
				console.log(e);
				let message = 'Failed to delete wishlist';
				if (e.message) {
					message = e.message;
				}
				return fail(500, { message: message });
			}
		} else {
			return fail(404, { message: 'Missing wishlist ID' });
		}
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
			orderBy: [asc(wishlistTable.rank), desc(wishlistTable.dateCreated)]
		});
		if (results.length) {
			wishlists = results;
		}
	} catch (e) {
		// TODO: Fail and a message?
		console.log(e);
	}
	return wishlists;
}
