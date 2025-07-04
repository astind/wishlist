import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { deleteWishlist, getWishlists, newWishlist } from '$lib/server/lists';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	let lists = [];
	try{
		lists = await getWishlists(event.locals.user.id);
	}
	catch (e: any) {
		return error(404, {message: e});
	}
	return { user: event.locals.user, wishlists: lists };
};

export const actions: Actions = {
	new: async (event) => {
		const form = await event.request.formData();
		const name = form.get('name') as string | null;
		if (!name) {
			return fail(404, {message: "Missing name field"})
		}
		const description = form.get('description') as string | null;
		const checkPrivate = form.get('private');
		const isPrivate = checkPrivate !== null && checkPrivate === 'on';
		if (!event.locals.user) {
			return fail(404, {message: "Missing User"});
		}
		try {
			newWishlist(name as string, event.locals.user.id, description || undefined, isPrivate);
		} catch (e: any) {
			return fail(500, { message: e });
		}
	},
	delete: async (event) => {
		const form = await event.request.formData();
		const formId = form.get('id');
		if (!event.locals.user) {
			return fail(404, {message: "Missing User"});
		}
		if (formId) {
			try {
				deleteWishlist(formId as string, event.locals.user.id);
			} catch (e: any) {
				return fail(500, { message: e });
			}
		} else {
			return fail(404, { message: 'Missing wishlist ID' });
		}
	}
};

