import { error, fail, redirect, type Actions, type RequestEvent } from '@sveltejs/kit';
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
	console.log(list)
	if (!list) {
		return error(404, {message: "List not found"});
	}
	return { list: list };
};

async function getList(listName: string, userId: string) {
	try {
		const list = await db.query.wishlistTable.findFirst({
			where: and(eq(wishlistTable.name, listName), eq(wishlistTable.ownerId, userId)),
			with: {
				items: true,
				shared: true,
				groups: true
			}
		});
		return list;
	} catch (e: any) {
		console.error(e);
		return null;
	}
}

function getFormData(form: FormData, key: string) {
	if (form.get(key)) {
		return form.get(key);
	}
	return null;
}

async function updateItem(event: RequestEvent, newItem: boolean = true) {
	const form = await event.request.formData();
	const name = getFormData(form, 'name');
	if (!name) {
		return fail(400, { message: 'Name field is required' });
	}
	const url = getFormData(form, 'link');
	const price = getFormData(form, 'price');
	const description = getFormData(form, 'description');
	const autoDelete = form.get('autoDelete') !== null && form.get('autoDelete') === 'on';
	const listId = getFormData(form, 'wishlistId');
	if (!listId) {
		return fail(400, { message: 'List Id is missing' });
	}
	const ogName = getFormData(form, 'ogName');
	try {
		if (newItem) {
			await db.insert(wishlistItemTable).values({
				name: name,
				description: description,
				url: url,
				price: price,
				wishlistId: listId,
				autoDelete: autoDelete
			});	
		} else {
			await db.update(wishlistItemTable).set({
				name: name,
				description: description,
				url: url,
				price: price,
				autoDelete: autoDelete
			}).where(
				and(
					eq(wishlistItemTable.name, ogName), 
					eq(wishlistItemTable.wishlistId, listId)
				)
			)
		}
	} catch (e: any) {
		let message = 'Failed to create new list item';
		if (e.message) {
			message = e.message;
		}
		return fail(500, { message: message });
	}
}

async function deleteItem(event: RequestEvent) {
	const form = await event.request.formData();
	const name = getFormData(form, 'name');
	const listId = getFormData(form, 'wishlistId');
	if (!name || !listId) {
		fail(400, {message: "Missing name and list ID"});
	}
	try {
		await db.delete(wishlistItemTable).where(
			and(
				eq(wishlistItemTable.name, name),
				eq(wishlistItemTable.wishlistId, listId)
			)
		);
	} catch (e: any) {
		let message = "Failed to delete list item";
		if (e.message) {
			message = e.message;
		}
		return fail(500, {message: message});
	}
}

export const actions: Actions = {
	newItem: updateItem,
	deleteItem: deleteItem,
	updateList: async (event) => {},
	editItem: async (event) => {
		return updateItem(event, false);
	}
};
