import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { wishlistItemTable, wishlistTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		return redirect(302, '/');
	}
	let slug = params.slug;
	const list = await getList(slug, locals.user.id);
	if (!list) {
		return redirect(401, '/lists');
	}
	return { list: list };
};

async function getList(listName: string, userId: string) {
	try {
		const list = await db.query.wishlistTable.findFirst({
			where: and(eq(wishlistTable.name, listName), eq(wishlistTable.ownerId, userId)),
			with: {
				items: true
			}
		});
		console.log(list);
		return list;
	} catch (e: any) {
		console.log(e);
		return null;
	}
}

function getFormData(form: FormData, key: string) {
	if (form.get(key)) {
		return form.get(key);
	}
	return null;
}

export const actions: Actions = {
	newItem: async (event) => {
		const form = await event.request.formData();
		console.log(form);
		const name = getFormData(form, 'name');
		if (!name) {
			return fail(400, { message: 'Name field is required' });
		}
		const url = getFormData(form, 'link');
		const price = getFormData(form, 'price');
		const description = getFormData(form, 'description');
		const autoDelete = form.get('autoDelete') !== null && form.get('autoDelete') === 'on';
		const listId = event.params.slug;
		if (!listId) {
			return fail(400, { message: 'List Id is missing' });
		}
		try {
			await db.insert(wishlistItemTable).values({
				name: name,
				description: description,
				url: url,
				price: price,
				wishlistId: listId,
				autoDelete: autoDelete
			});
		} catch (e: any) {
			let message = 'Failed to create new list item';
			if (e.message) {
				message = e.message;
			}
			return fail(500, { message: message });
		}
	},
	deleteItem: async (event) => {},
	updateList: async (event) => {}
};
