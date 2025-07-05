import * as auth from '$lib/server/auth';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getLists } from '$lib/server/lists';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	let lists = [];
	try{
		lists = await getLists(event.locals.user.id, 5, true);
	} 
	catch (e: any) {
		return error(404, {message: e})
	}
	return { user: event.locals.user, lists: lists };
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
