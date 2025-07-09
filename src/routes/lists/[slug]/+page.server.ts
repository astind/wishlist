import { error, fail, redirect, type Actions, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteAllDone, deleteListItem, editListItem, getList, newListItem, toggleDone } from '$lib/server/lists';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		return redirect(302, '/');
	}
	let listname = params.slug;
	try {
		const list = await getList(listname, locals.user.id);
		if (!list) {
			error(404, "List Not Found");
		}
		return { list };
	}
	catch (e: any) {
		error(404, e);
	}
};

function getFormData(form: FormData, key: string) {
	if (form.get(key)) {
		return form.get(key);
	}
	return null;
}

async function updateItem(event: RequestEvent, newItem: boolean = true) {
	const form = await event.request.formData();
	const name = getFormData(form, 'name') as string;
	if (!name) {
		return fail(400, { message: 'Name field is required' });
	}
	const url = getFormData(form, 'link') as string | null;
	const price = getFormData(form, 'price') as string | null;
	const description = getFormData(form, 'description') as string | null;
	const autoDelete = form.get('autoDelete') !== null && form.get('autoDelete') === 'on';
	const listId = getFormData(form, 'listId') as string;
	if (!listId) {
		return fail(400, { message: 'List Id is missing' });
	}
	if (!event.locals.user) {
		return fail(400, {message: "missing user"});
	}
	const ogName = getFormData(form, 'ogName') as string;
	if (!newItem && !ogName) {
		return fail(400, {message: "Missing original name value"});
	}
	try {
		if (newItem) {
			await newListItem({
				name: name,
				description: description || undefined,
				url: url || undefined,
				price: price || undefined,
				autoDelete: autoDelete
				 
			}, event.locals.user.id, listId)	
		} else {
			const itemId = getFormData(form, 'itemId') as string;
			if (!itemId) {
				return fail(400, {message: "Missing item ID"});
			}
			await editListItem(+itemId, {
				name: name,
				description: description || undefined,
				url: url || undefined,
				price: price || undefined,
				autoDelete: autoDelete
			}, event.locals.user.id, listId); 
		}
	} catch (e: any) {
		return fail(500, { message: e });
	}
}

async function deleteItem(event: RequestEvent) {
	const form = await event.request.formData();
	const itemId = getFormData(form, 'itemId') as string;
	const listId = getFormData(form, "listId") as string;
	if (!itemId || !listId) {
		return fail(400, {message: "Missing item IDs"});
	}
	if (!event.locals.user) {
		return fail(400, {message: "Missing User"})
	}
	try {
		await deleteListItem(+itemId, event.locals.user.id, listId);
	} catch (e: any) {		
		return fail(500, {message: e});
	}
}

async function markComplete(event: RequestEvent) {
	const form = await event.request.formData();
	const itemId = getFormData(form, "itemId") as string;
	if (!itemId) {
		return fail(400, {message: "Missing item ID"})
	}
	if (!event.locals.user) {
		return fail(400, {message: "Missing user"});
	}
	try {
		await toggleDone(+itemId, event.locals.user.id);
	}
	catch (e: any) {
		return fail(500, {message: e});
	}
}

async function newTask(event: RequestEvent) {
	const form = await event.request.formData();
	const name = getFormData(form, "name") as string;
	const listId = getFormData(form, 'listId') as string;
	if (!name || !listId) {
		return fail(400, {message: "Missing name or id"});
	}
	if (!event.locals.user) {
		return fail(400, {message: "Missing user"});
	}
	try {
		await newListItem({name: name, autoDelete: false}, event.locals.user.id, listId);
	} catch (e: any) {
		return fail(500, {message: e});
	}
}

async function deleteDone(event: RequestEvent) {
	const form = await event.request.formData();
	const listId = getFormData(form, "listId") as string;
	if (!listId || !event.locals.user) {
		return fail(400, {message: "Missing required data"});
	}
	try {
		await deleteAllDone(listId, event.locals.user.id);
	}
	catch(e: any) {
		return fail(500, {message: e});
	}
}

export const actions: Actions = {
	newItem: updateItem,
	deleteItem: deleteItem,
	updateList: async (event) => {},
	editItem: async (event) => {
		return updateItem(event, false);
	},
	complete: markComplete,
	newTask: newTask,
	deleteDone: deleteDone
};
