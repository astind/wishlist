import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { deleteList, getLists, newList } from '$lib/server/lists';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	let lists = [];
	try{
		lists = await getLists(event.locals.user.id);
	}
	catch (e: any) {
		return error(404, {message: e});
	}
	return { user: event.locals.user, lists: lists };
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
			newList(name as string, event.locals.user.id, description || undefined, isPrivate);
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
				deleteList(formId as string, event.locals.user.id);
			} catch (e: any) {
				return fail(500, { message: e });
			}
		} else {
			return fail(404, { message: 'Missing list ID' });
		}
	}
};

